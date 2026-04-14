import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('账号或密码错误');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    const payload = { sub: user.id, role: user.role?.name };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, role: user.role?.name, displayName: user.displayName },
    };
  }
}
