import { Test, TestingModule } from '@nestjs/testing';
import { GravatarService } from './gravatar.service';
import { PrismaService } from 'nestjs-prisma';
import { DangerException } from '@/common/exceptions/danger.exception';

describe('GravatarService', () => {
  let service: GravatarService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GravatarService, PrismaService],
    }).compile();

    service = module.get<GravatarService>(GravatarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('get_avatar returns gravatar URL if email exists', async () => {
    const user_id = '1';
    const email = 'test@example.com';
    const hash = '55502f40dc8b7c769880b10874abc9d0';
    prisma.user.findUnique = jest.fn().mockResolvedValue({ email });

    const result = await service.get_avatar(user_id);

    expect(result).toBe(`https://www.gravatar.com/avatar/${hash}`);
  });

  it('get_avatar returns null if email does not exist', async () => {
    const user_id = '1';
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    const result = await service.get_avatar(user_id);

    expect(result).toBeNull();
  });

  it('upload_avatar throws DangerException', async () => {
    await expect(service.upload_avatar()).rejects.toThrow(DangerException);
  });

  it('delete_avatar throws DangerException', async () => {
    await expect(service.delete_avatar()).rejects.toThrow(DangerException);
  });
});
