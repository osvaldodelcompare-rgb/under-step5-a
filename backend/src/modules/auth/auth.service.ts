import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface OAuthProfile {
  email: string;
  name: string;
  googleId?: string;
  facebookId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.usersService.create(dto);
    const tokens = this.issueTokens(user);
    return { user, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.issueTokens(user);
    return { user, tokens };
  }

  async validateOAuthLogin(
    provider: 'google' | 'facebook',
    profile: OAuthProfile,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const lookup =
      provider === 'google'
        ? this.usersService.findByGoogleId(profile.googleId!)
        : this.usersService.findByFacebookId(profile.facebookId!);

    let user = await lookup;

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);
    }

    if (!user) {
      user = await this.usersService.create({
        name: profile.name || profile.email,
        email: profile.email,
      });
    }

    if (provider === 'google' && !user.googleId) {
      user.googleId = profile.googleId!;
      user = await this.usersService.save(user);
    }
    if (provider === 'facebook' && !user.facebookId) {
      user.facebookId = profile.facebookId!;
      user = await this.usersService.save(user);
    }

    const tokens = this.issueTokens(user);
    return { user, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
      const user = await this.usersService.findOne(payload.sub);
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private issueTokens(user: User): AuthTokens {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }
}
