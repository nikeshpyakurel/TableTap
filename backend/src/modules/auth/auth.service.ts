import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, MailDto, passwordDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import { authEntity } from 'src/model/auth.entity';
import { JwtPayload, roleType } from 'src/helper/types/index.type';
import { staffEntity } from 'src/model/staff.entity';
import { sendMail } from 'src/config/mail.config';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { superAdminEntity } from 'src/model/superAdmin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,

    @InjectRepository(staffEntity)
    private readonly staffRepository: Repository<staffEntity>,

    @InjectRepository(restaurantEntity)
    private readonly restaurentRepository: Repository<restaurantEntity>,

    @InjectRepository(superAdminEntity)
    private readonly superAdminRepository: Repository<superAdminEntity>,

    private token: Token,
    private hash: hash,

  ) { }

  private roleUser = {
    admin: 'restaurant',
    superAdmin: 'superAdmin',
    customer: 'customer',
    staff: 'staff',
  };

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const authUser = await this.authRepository.findOne({
      where: { email },
      relations: ['restaurant', 'superAdmin']
    });
    if (!authUser || authUser.role === roleType.staff) {
      throw new ForbiddenException('Invalid email or password');
    } else {
      const status = await this.hash.verifyHashing(authUser.password, password);
      if (!status) {
        throw new UnauthorizedException('Invalid email or password');
      }
      const userRole = this.roleUser[authUser.role];
      const roleEntityId = authUser[userRole]?.id;
      const tokens = {
        accessToken: await this.token.generateAcessToken({
          sub: roleEntityId ? roleEntityId : authUser.id,
          role: authUser.role,
        }),
        refreshToken: await this.token.generateRefreshToken({
          sub: roleEntityId ? roleEntityId : authUser.id,
          role: authUser.role,
        }),
        role: authUser.role,
      };
      authUser.rToken = await this.hash.value(tokens.refreshToken);
      await this.authRepository.save(authUser);
      return tokens;
    }
  }

  async forgetPasswordAdmin(body: MailDto): Promise<boolean> {
    const existingUser = await this.authRepository.findOne({
      where: { email: body.email },
    });
    if (!existingUser) {
      throw new NotFoundException("Email doesn't exist.");
    }
    const token = await this.token.generateUtilToken({
      sub: existingUser.id,
      role: existingUser.role,
    });
    const frontURL = `${process.env.Scanmenu_Admin}?token=${token}`;
    try {
      sendMail(body.email, 'Password Reset', this.passwordTemplate(frontURL));
    } catch (error) {
      throw error;

    }
    return true;
  }

  async loginStaff(body: CreateAuthDto) {
    const authUser = await this.authRepository.findOne({
      where: { email: body.email },
      relations: ['staff', 'staff.staffType.permission', 'staff.restaurant']
    });
    if (!authUser) {
      throw new ForbiddenException("User Not found")
    }
    const status = await this.hash.verifyHashing(authUser.password, body.password)
    if (!status) {
      throw new UnauthorizedException("Credential doesn't match");

    }
    const permissionarray = authUser?.staff?.staffType?.permission?.map(permission => permission.name);
    const tokens = {
      accessToken: await this.token.generateAcessToken({ sub: authUser.staff.id, role: authUser.role, permissions: permissionarray, rId: authUser.staff.restaurant.id }),
      refreshToken: await this.token.generateRefreshToken({ sub: authUser.staff.id, role: authUser.role, permissions: permissionarray, rId: authUser.staff.restaurant.id }),
      role: authUser.role,
      permission: permissionarray
    }
    return tokens
  }

  async getCombinedUserInfo(user: JwtPayload) {
    const userRole = this.roleUser[user.role];
    if (userRole === this.roleUser.admin||userRole === this.roleUser.superAdmin) {
      const userRole = this.roleUser[user.role];
      const userInfo = await this.authRepository.findOne({
        where: { [userRole]: { id: user.sub } },
        relations: [userRole],
        select: {
          id: true
        }
      });
      return { userInfo, role: 'admin' }
    } else if (userRole === this.roleUser.staff) {
      const authUser = await this.staffRepository.findOne({
        where: { id: user.sub },
        relations: ['staffType.permission'],
      });
      const permissionarray = authUser?.staffType?.permission?.map(permission => permission.name);
      return { permissionarray, userInfo: authUser, role: 'staff', rId: user.rId }
    } else {
      throw new UnauthorizedException("Something unexpected error occured")
    }
  }


  async refreshTokenAdmin(user: JwtPayload) {
    return await this.token.generateAcessToken({ sub: user.sub, role: user.role, permissions: user?.permissions, rId: user?.rId })
  }

  async updatePassword(user: JwtPayload, passwordDto: passwordDto) {
    const { oldPassword, newPassword } = passwordDto;
    const authUser = (user.role == roleType.staff)
      ? await this.staffRepository.findOne({ where: { id: user.sub }, relations: ['auth'] })
      : await this.restaurentRepository.findOne({ where: { id: user.sub }, relations: ['auth'] })

    const isValid = await this.hash.verifyHashing(authUser.auth.password, oldPassword);
    if (!isValid) {
      throw new ForbiddenException('Invalid old password');
    }
    const hash = await this.hash.value(newPassword);
    await this.authRepository.update({ id: authUser.auth.id }, { password: hash });
    return true;
  }


  async resetPassword(id: string, passwordDto: passwordDto) {
    const { newPassword } = passwordDto;
    const hash = await this.hash.value(newPassword);
    await this.authRepository.update({ id }, { password: hash });
    return true;
  }

  passwordTemplate(resetUrl: any) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            width: 80%;
            padding: 12px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello, User</p>
        <p>You've requested to reset your password for your tabletap account. Click the link below to set a new password:</p>
        <a href="${resetUrl}" class="button" style="color: white; text-decoration: none;">Reset My Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p class="footer">© 2025 tabletap. All rights reserved.</p>
    </div>
</body>
</html>
  `;
  }
}
