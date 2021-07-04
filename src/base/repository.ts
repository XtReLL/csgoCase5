import { DeepPartial, FindConditions, Repository } from 'typeorm';

export async function findOrCreate<T>(
  repo: Repository<T>,
  data: DeepPartial<T>,
): Promise<T> {
  const result = await repo.findOne(data);

  if (result) {
    return result;
  }

  return repo.save(repo.create(data));
}

export async function isExists<T>(
  repo: Repository<T>,
  data: FindConditions<T>,
): Promise<boolean> {
  const result = await repo.count(data);
  return result > 0;
}
