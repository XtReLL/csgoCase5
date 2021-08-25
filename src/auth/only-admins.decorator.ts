import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ForbiddenError } from 'apollo-server-errors';
import { getUser as getUserBase } from './authorized.decorator';
import { AuthorizedModel } from './model/authorized.model';
import { isAdminRole } from './is-admin-role';

const getUser = async (
  data: string,
  context: ExecutionContext,
): Promise<AuthorizedModel> => {
  const res = await getUserBase(data, context);
  if (!isAdminRole(res.role)) {
    throw new ForbiddenError('should be admin');
  }
  return res;
};

export const OnlyAdmins = createParamDecorator(getUser);
