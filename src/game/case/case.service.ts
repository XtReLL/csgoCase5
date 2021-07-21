import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { GameCaseService } from 'game/game/game-case.service';
import { Connection, In, Repository } from 'typeorm';
import { UserService } from 'user/user.service';
import { CreateCaseInput } from './dto/createCase.input';
import { OpenCaseInput } from './dto/openCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';
import { CaseItems } from './entity/caseItems.entity';

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
  ) {}

  async create(
    createCaseInput: CreateCaseInput,
    author: AuthorizedModel,
  ): Promise<Case> {
    return await this.caseRepository.save(
      this.caseRepository.create({
        name: createCaseInput.name,
        discount: createCaseInput.discount,
        status: createCaseInput.status,
        price: createCaseInput.price,
        rarirty: createCaseInput.rarirty,
        category: createCaseInput.category,
        icon: createCaseInput.icon,
      }),
    );
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

    return result;
  }

  async remove(id: string, author: AuthorizedModel): Promise<string> {
    // TODO:: Check rights
    const entity = await this.caseRepository.findOneOrFail(parseInt(id, 10));
    await this.caseRepository.softRemove(entity);
    return id;
  }

  async open(
    openCaseInput: OpenCaseInput,
    author: AuthorizedModel,
  ): Promise<any> {
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

      const items = await this.caseItemsRepository.find({
        where: { caseId: box.id },
      });

      author.model.balance -= openCaseInput.count * box.price;
      await this.userService.update(author.model);
      //...profitSystem

      await this.gameCaseService.createGameCase({
        userId: author.model.id,
        itemId: 1, //temp, result from profitSystem
        caseId: box.id,
      });
      // ...more
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
