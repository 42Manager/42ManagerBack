import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();
    if (data === 'uid') {
      return req.user[data];
    }
    return req.user;
  },
);
