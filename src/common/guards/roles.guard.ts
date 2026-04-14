import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user) return false;
    return req.user.role?.name === 'admin' || req.user.role?.name === 'editor';
  }
}
