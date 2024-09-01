import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ServerService } from './server.service';
import { WarningException } from '@/common/exceptions/warning.exception';
import { PrismaException } from '@/common/exceptions/prisma.exception';
import { ServerModel } from '@/types/models/server.model';
import { ServerSettingsModel } from '@/types/models/server_settings.model';
import { CtxType } from '@/types/common/ctx.type';
import { I18nContext } from 'nestjs-i18n';

describe('ServerService', () => {
  let service: ServerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService, PrismaService],
    }).compile();

    service = module.get<ServerService>(ServerService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.spyOn(I18nContext, 'current').mockReturnValue({
      t: jest.fn().mockReturnValue('test'),
    } as any);
  });

  it('find_by_id returns server model if server exists', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const server = {
      id: '1',
      name: 'Test Server',
      origin: 'http://localhost:3000',
    };
    prisma.server.findUnique = jest.fn().mockResolvedValue(server);

    const result = await service.find_by_id(ctx);

    expect(result).toBeInstanceOf(ServerModel);
    expect(result.id).toBe(server.id);
  });

  it('find_by_id throws WarningException if server does not exist', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    prisma.server.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.find_by_id(ctx)).rejects.toThrow(WarningException);
  });

  it('update returns updated server settings model', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const server_input = { title: 'Test Server' };
    const server_settings = { server_id: 1, title: 'Test Server' };
    prisma.serverSettings.update = jest.fn().mockResolvedValue(server_settings);

    const result = await service.update(server_input, ctx);

    expect(result).toBeInstanceOf(ServerSettingsModel);
    expect(result.title).toBe(server_input.title);
  });

  it('update throws PrismaException if update fails', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const server_input = { title: 'Test Server' };
    prisma.serverSettings.update = jest
      .fn()
      .mockRejectedValue(new Error('Update failed'));

    await expect(service.update(server_input, ctx)).rejects.toThrow(
      PrismaException,
    );
  });

  it('resolve_settings returns server settings model if settings exist', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const server_settings = { server_id: 1, title: 'Test Server' };
    prisma.serverSettings.findUnique = jest
      .fn()
      .mockResolvedValue(server_settings);

    const result = await service.resolve_settings(ctx);

    expect(result).toBeInstanceOf(ServerSettingsModel);
    expect(result.title).toBe(server_settings.title);
  });

  it('resolve_settings throws WarningException if settings do not exist', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    prisma.serverSettings.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.resolve_settings(ctx)).rejects.toThrow(
      WarningException,
    );
  });

  it('resolve_oauth returns oauth models', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const oauths = [
      {
        server_id: 1,
        name: 'oauth',
        client_id: 'id',
        client_secret: 'secret',
      },
    ];
    prisma.serverOAuth.findMany = jest.fn().mockResolvedValue(oauths);

    const result = await service.resolve_oauth(ctx);

    expect(result).toHaveLength(1);
    expect(result[0].client_secret).toBe('secret');
  });

  it('find_oauth_by_name oauth models if oauth does exist', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    const oauths = [
      {
        server_id: 1,
        name: 'oauth',
        client_id: 'id',
        client_secret: 'secret',
      },
    ];
    prisma.serverOAuth.findFirst = jest.fn().mockResolvedValue(oauths);

    const result = await service.find_oauth_by_name('oauth', ctx);

    expect(result).toBe(oauths);
  });

  it('find_oauth_by_name returns null if oauth does not exist', async () => {
    const ctx: CtxType = { server_id: 1, i18n: I18nContext.current()! };
    prisma.serverOAuth.findFirst = jest.fn().mockResolvedValue(null);

    const result = await service.find_oauth_by_name('oauth', ctx);

    expect(result).toBeNull();
  });
});
