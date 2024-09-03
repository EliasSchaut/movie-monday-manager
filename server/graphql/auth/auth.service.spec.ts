import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@/common/services/email.service';
import { PasswordService } from '@/common/services/password.service';
import { WarningException } from '@/common/exceptions/warning.exception';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { User } from '@prisma/client';
import { I18nContext } from 'nestjs-i18n';
import { CtxType } from '@/types/common/ctx.type';
import { UserInputModel } from '@/types/models/inputs/user.input';
import { UserModel } from '@/types/models/user.model';

describe('AuthService', () => {
  let prismaService: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let emailService: EmailService;
  let user_data: User;
  let ctx: CtxType;

  beforeEach(async () => {
    jest.spyOn(I18nContext, 'current').mockReturnValue({
      t: jest.fn().mockReturnValue('test'),
    } as any);
    ctx = {
      server_id: 1,
      i18n: I18nContext.current()!,
      server: {
        id: 1,
        name: 'Test Server',
        origin: 'http://localhost',
        settings: { title: 'Test' },
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            send_verify: jest.fn(),
            generate_verify_url: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
    user_data = {
      id: '1',
      server_id: 1,
      username: 'test',
      password: 'hashed',
      email: 'test@example.com',
      challenge: 'challenge',

      created_at: new Date(),
      first_name: 'Test',
      last_name: 'User',
      avatar_url: null,
      bio: null,

      is_admin: false,
      profile_public: true,
      email_opt_in: false,
      verified: true,
      request_pw_reset: false,
      request_email_update: false,
      request_target_email: null,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('sign_in with valid credentials returns SignInModel', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user_data);
    jest.spyOn(PasswordService, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

    const result = await authService.sign_in(
      {
        email: 'test@example.com',
        password: 'password',
      },
      ctx,
    );

    expect(result).toEqual({ barrier_token: 'token', is_admin: false });
  });

  it('sign_in with invalid email throws WarningException', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(
      authService.sign_in(
        {
          email: 'test@example.com',
          password: 'password',
        },
        ctx,
      ),
    ).rejects.toThrow(WarningException);
  });

  it('sign_in with invalid password throws WarningException', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user_data);
    jest.spyOn(PasswordService, 'compare').mockResolvedValue(false);

    await expect(
      authService.sign_in(
        {
          email: 'test@example.com',
          password: 'password',
        },
        ctx,
      ),
    ).rejects.toThrow(WarningException);
  });

  it('register with valid data returns UserModel', async () => {
    const user_input_data: UserInputModel = {
      username: 'test',
      password: 'password',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
    };
    jest.spyOn(PasswordService, 'hash').mockResolvedValue('hashed');
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(user_data);
    jest
      .spyOn(emailService, 'generate_verify_url')
      .mockReturnValue('http://localhost/verify');
    jest.spyOn(emailService, 'send_verify').mockResolvedValue();

    const result = await authService.register(user_input_data, ctx);

    expect(result).toEqual({
      id: '1',
      username: 'test',
      first_name: 'Test',
      last_name: 'User',
      avatar_url: undefined,
      bio: undefined,
      profile_public: true,
    });
  });

  it('register with duplicate username throws PrismaException', async () => {
    const user_input_data: UserInputModel = {
      username: 'test',
      password: 'password',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
    };
    jest.spyOn(PasswordService, 'hash').mockResolvedValue('hashed');
    jest
      .spyOn(prismaService.user, 'create')
      .mockRejectedValue(new Error('Unique constraint failed'));

    await expect(authService.register(user_input_data, ctx)).rejects.toThrow(
      PrismaException,
    );
  });

  it('verify with valid challenge returns UserModel', async () => {
    user_data.verified = false;
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user_data);
    jest
      .spyOn(prismaService.user, 'update')
      .mockResolvedValue({ ...user_data, verified: true });

    const result = await authService.verify(user_data.challenge, ctx);

    expect(result).toEqual(
      new UserModel({
        ...user_data,
        verified: true,
      }),
    );
  });

  it('verify with invalid challenge throws WarningException', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(authService.verify('challenge', ctx)).rejects.toThrow(
      WarningException,
    );
  });
});
