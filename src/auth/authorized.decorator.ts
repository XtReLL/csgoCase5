import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenError } from 'apollo-server-errors';
import { mode } from 'crypto-js';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { getManager } from 'typeorm';
import { User } from 'user/user/entity/user.entity';
import { AuthorizedFactory } from './factory/authorized.factory';
import { AuthorizedModel } from './model/authorized.model';

export const getUser = async (
  data: string,
  context: ExecutionContext,
): Promise<AuthorizedModel> => {
  const jwtService = new JwtService({
    secret: process.env.JWT_KEY,
  });
  const ctx = GqlExecutionContext.create(context);
  const req = ctx.getContext().req as Request & { user?: AuthorizedModel };
  if (data && !req.headers.role?.includes(data)) {
    throw new ForbiddenError('access denied');
  }

  if (req.user) {
    return req.user;
  }

  if (!req.headers.authorization) {
    throw new ForbiddenError('has no authorization');
  }

  const jwtData = jwtService.verify(req.headers.authorization as string);

  const model = await getManager()
    .getRepository(User)
    .findOne({ where: { id: parseInt(jwtData.id) } });
  if (!model) {
    throw new ForbiddenError('auth not found');
  }

  const t = await model.userRole;

  const res = AuthorizedFactory(model);
  req.user = res;
  return res;
};

export const Authorized = createParamDecorator(getUser);
