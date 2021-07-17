import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedModel } from 'auth/model/authorized.model';
import { Repository } from 'typeorm';
import { CreateCaseInput } from './dto/createCase.input';
import { UpdateCaseInput } from './dto/updateCase.input';
import { Case } from './entity/case.entity';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepository: Repository<Case>,
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
}
