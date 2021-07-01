import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ForbiddenError } from 'apollo-server-errors';
import { Request } from 'express';
import { getManager } from 'typeorm';
import { User } from 'user/entity/user.entity';
import { AuthorizedFactory } from './factory/authorized.factory';
import { AuthorizedModel } from './model/authorized.model';

export const getUser = async (
  data: string,
  context: ExecutionContext,
): Promise<AuthorizedModel> => {
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext().req as Request & { user?: AuthorizedModel };
  if (data && !req.headers.role?.includes(data)) {
    throw new ForbiddenError('access denied');
  }
  if (req.user) {
    return req.user;
  }

  if (!req.headers.login) {
    throw new ForbiddenError('has no login');
  }

  const id = req.headers.login as string;
  const model = await getManager().getRepository(User).findOne({where: {id: parseInt(id) }  });
  if (!model) {
    throw new ForbiddenError('auth not found');
  }

  const res = AuthorizedFactory(model, req.headers.role as any);
  req.user = res;
  return res;
};


export const Authorized = createParamDecorator(getUser);
