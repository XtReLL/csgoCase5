import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { EventEmitter2 } from 'eventemitter2';
import { GameCaseService } from 'game/game/game-case.service';
import { InventoryService } from 'inventory/inventory.service';
import { Item } from 'item/entity/item.entity';
import { defaultPagination, Pagination } from 'list/pagination.input';
import { paramsToBuilder } from 'list/params';
import { LiveDropService } from 'live-drop/live-drop.service';
import { CasePaybackSystemService } from 'payback-system/case/casePaybackSystem.service';
import { RedisCacheModule } from 'redisCache/redisCache.module';
import { RedisCacheService } from 'redisCache/redisCache.service';
import { Brackets, Connection, In, Repository } from 'typeorm';
import { CaseStatusType, LiveDropType } from 'typings/graphql';
import { UserService } from 'user/user/user.service';
import { AddItemsInCaseInput } from './dto/addItemsInCase.input';
import { CaseSearchInput } from './dto/caseSearch.input';
import { CreateCaseInput } from './dto/createCase.input';
import { OpenCaseInput } from './dto/openCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';
import { Category } from './entity/category.entity';
import { CategoryCase } from './entity/category_case.entity';
import { CaseOpenEvent } from './events/case.event';

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
    private eventEmitter: EventEmitter2,
  ) {}

  async findOne(caseId: string): Promise<Case> {
    return this.caseRepository.findOneOrFail({
      where: { id: parseInt(caseId, 10) },
    });
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
    } catch (error: any) {
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
  ): Promise<Item[]> {
    if (
      (await this.redisCacheService.get(`open_case_${author.model.id}`)) !==
      null
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
        throw 'Insufficient user balance';
      }

      const [winItems, price] = await this.casePaybackService.openCase(
        box,
        openCaseInput,
      );

      if (!winItems) {
        throw "Couldn't get a win";
      }

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
            type: LiveDropType.CASE,
          });
        }),
      ]);

      author.model.balance =
        author.model.balance - openCaseInput.count * box.price;

      author.model.profit =
        author.model.profit + price - box.price * openCaseInput.count;

      author.model.opened = author.model.opened + openCaseInput.count;
      await this.userService.update(author.model);

      box.opened += openCaseInput.count;
      box.profit += openCaseInput.count * box.price - price;
      await this.caseRepository.save(box);

      setTimeout(async () => {
        await this.liveDropService.updateLiveDrop();
      }, 4000);

      await queryRunner.commitTransaction();

      this.eventEmitter.emit('case.open', new CaseOpenEvent(box, author.model));
      return winItems;
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();
      throw error;
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
      .where(`caseId = ${boxId} AND item.price <= ${price}`)
      .orderBy('item.price', 'DESC')
      .getOneOrFail();
  }

  async list(
    pagination: Pagination = defaultPagination,
    search?: CaseSearchInput,
  ): Promise<[Case[], number]> {
    const query = await paramsToBuilder<Case>(
      this.caseRepository.createQueryBuilder(),
      pagination,
    );

    if (search?.status) {
      query.andWhere('status >= :status', {
        status:
          search.status === CaseStatusType.ACTIVE
            ? CaseStatusType.ACTIVE
            : CaseStatusType.HIDE,
      });
    }

    if (search?.casePriceEnd && search?.casePriceStart) {
      query.andWhere('price >= :casePriceStart AND price <= :casePriceEnd', {
        casePriceStart: search.casePriceStart,
        casePriceEnd: search?.casePriceEnd,
      });
    }

    const result = await query.getManyAndCount();

    return result;
  }

  async getCaseCategories(box: Case): Promise<Category[]> {
    let result: Category[] = [];
    const caseCategories = await this.categoryCaseRepository.find({
      where: { caseId: box.id },
    });

    await Promise.all(
      caseCategories.map(async (caseCategory) => {
        const res = await caseCategory.category;

        result.push(res);
      }),
    );

    return result;
  }

  async getCaseItems(box: Case): Promise<Item[]> {
    let result: Item[] = [];
    await Promise.all(
      (
        await this.caseItemsRepository.find({
          where: { caseId: box.id },
        })
      ).map(async (caseItem) => result.push(await caseItem.item)),
    );
    return result;
  }

  async addItemsInCase(
    addItemsInCaseInput: AddItemsInCaseInput,
  ): Promise<CaseItems[]> {
    const entities: CaseItems[] = [];

    await Promise.all(
      addItemsInCaseInput.itemsId.map((itemId) => {
        entities.push(
          this.caseItemsRepository.create({
            caseId: parseInt(addItemsInCaseInput.caseId),
            itemId: parseInt(itemId),
          }),
        );
      }),
    );
    return await this.caseItemsRepository.save(entities);
  }
}
