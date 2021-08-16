import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { GameCaseService } from 'game/game/game-case.service';
import { InventoryService } from 'inventory/inventory.service';
import { Item } from 'item/entity/item.entity';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { LiveDropService } from 'live-drop/live-drop.service';
import { CasePaybackSystemService } from 'payback-system/case/casePaybackSystem.service';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Connection, In, Repository } from 'typeorm';
import { UserService } from 'user/user.service';
import { CreateCaseInput } from './dto/createCase.input';
import { OpenCaseInput } from './dto/openCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { Category } from './entity/category.entity';
import { CategoryCase } from './entity/category_case.entity';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
    @InjectRepository(CaseItems)
    private readonly caseItemsRepository: Repository<CaseItems>,
    private readonly userService: UserService,
    private connection: Connection,
    private readonly gameCaseService: GameCaseService,
    private readonly redisCacheService: RedisCacheService,
    @Inject(forwardRef(() => CasePaybackSystemService))
    private casePaybackService: CasePaybackSystemService,
    // private readonly casePaybackService: CasePaybackSystemService,
    private readonly liveDropService: LiveDropService,
    private readonly inventoryService: InventoryService,
    @InjectRepository(CategoryCase)
    private readonly categoryCaseRepository: Repository<CategoryCase>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findOne(author: AuthorizedModel, caseId: string): Promise<Case> {
    return this.caseRepository.findOneOrFail(parseInt(caseId, 10));
  }
  async create(
    createCaseInput: CreateCaseInput,
    author: AuthorizedModel,
  ): Promise<Case> {
    return await this.createManyEntities(createCaseInput, author);
  }
  async createManyEntities(
    createCaseInput: CreateCaseInput,
    author: AuthorizedModel,
  ): Promise<Case> {
    const caseCategoryEntities: CategoryCase[] = [];
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const box = await this.caseRepository.save(
        this.caseRepository.create({
          name: createCaseInput.name,
          discount: createCaseInput.discount,
          status: createCaseInput.status,
          price: createCaseInput.price,
          rarirty: createCaseInput.rarirty,
          icon: createCaseInput.icon,
        }),
      );

      for (const categoryId of createCaseInput.categories) {
        const category = await this.categoryRepository.findOneOrFail(
          parseInt(categoryId),
        );
        caseCategoryEntities.push(
          this.categoryCaseRepository.create({
            caseId: box.id,
            categoryId: category.id,
          }),
        );
      }
      await this.categoryCaseRepository.save(caseCategoryEntities);

      await queryRunner.commitTransaction();

      return box;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    updateCaseInput: UpdateCaseInput,
    author: AuthorizedModel,
  ): Promise<Case> {
    const id = parseInt(updateCaseInput.id);
    const entity = await this.caseRepository.findOneOrFail(id);

    const result = await this.caseRepository.save(
      this.caseRepository.merge(entity, { ...updateCaseInput, id }),
    );
    await this.categoriesReplace(
      parseInt(updateCaseInput.id),
      updateCaseInput.categories,
    );

    return result;
  }

  async categoriesReplace(
    caseId: number,
    categories: string[] = [],
  ): Promise<void> {
    await this.categoryCaseRepository.delete({
      caseId: caseId,
    });
    for (const categoryId of categories) {
      await this.categoryCaseRepository.save(
        this.categoryCaseRepository.create({
          categoryId: (
            await this.categoryRepository.findOneOrFail({
              where: { id: parseInt(categoryId) },
            })
          ).id,
          caseId: caseId,
        }),
      );
    }
  }

  async remove(id: string, author: AuthorizedModel): Promise<boolean> {
    // TODO:: Check rights
    const entity = await this.caseRepository.findOneOrFail(parseInt(id, 10));
    await this.caseRepository.softRemove(entity);
    return true;
  }

  async open(
    openCaseInput: OpenCaseInput,
    author: AuthorizedModel,
  ): Promise<void> {
    if (
      typeof (await this.redisCacheService.get(
        `open_case_${author.model.id}`,
      )) !== 'undefined'
    ) {
      throw 'Please, wait a bit and try again';
    }

    await this.redisCacheService.set(`open_case_${author.model.id}`, 1, {
      ttl: 5,
    });

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const box = await this.caseRepository.findOneOrFail(
        parseInt(openCaseInput.id, 10),
      );

      if (author.model.balance < box.price * openCaseInput.count) {
        throw new Error('Insufficient user balance');
      }

      const [winItems, price] = await this.casePaybackService.openCase(
        box,
        openCaseInput,
      );

      await Promise.all([
        winItems.map(async (item) => {
          await this.gameCaseService.createGameCase({
            userId: author.model.id,
            itemId: item.id,
            caseId: box.id,
          });

          await this.inventoryService.addItems({
            userId: author.model.id,
            itemId: item.id,
            price: item.price,
          });

          await this.liveDropService.create({
            userId: String(author.model.id),
            caseId: String(box.id),
            itemId: String(item.id),
            price: item.price,
          });
        }),
      ]);

      author.model.balance -= openCaseInput.count * box.price;
      author.model.profit += price - box.price * openCaseInput.count;
      author.model.opened += openCaseInput.count;
      await this.userService.update(author.model);

      box.opened += openCaseInput.count;
      box.profit += openCaseInput.count * box.price - price;
      await this.caseRepository.save(box);

      // setTimeout(async () => {
      //   this.liveDropService.updateLiveDrop();
      // }, 5000);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getMinItemInCase(boxId: number): Promise<CaseItems> {
    return await this.caseItemsRepository
      .createQueryBuilder('caseItem')
      .innerJoinAndSelect('caseItem.item', 'item')
      .where(`caseItem.caseId = ${boxId}`)
      .orderBy('item.price', 'ASC')
      .getOneOrFail();
  }

  async getItemByPrice(price: number, boxId: number): Promise<CaseItems> {
    return await this.caseItemsRepository
      .createQueryBuilder('caseItem')
      .innerJoinAndSelect('caseItem.item', 'item')
      .where(`case_id = ${boxId} AND item.price <= ${price}`)
      .orderBy('item.price', 'DESC')
      .getOneOrFail();
  }

  async list(
    model: AuthorizedModel,
    pagination: Pagination = defaultPagination,
  ): Promise<[Case[], number]> {
    const query = await paramsToBuilder<Case>(
      this.caseRepository.createQueryBuilder(),
      pagination,
    );

    const result = await query.getManyAndCount();

    return result;
  }
}
