import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Account } from '../entities/auth.entity';

export const GetAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
