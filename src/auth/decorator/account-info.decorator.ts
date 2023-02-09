import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const JwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
