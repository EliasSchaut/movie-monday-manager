import { applyDecorators, createParamDecorator } from '@nestjs/common';
import { ServerID } from '@/common/decorators/server.decorator';
import { UserID } from '@/common/decorators/user.decorator';
import { I18n } from 'nestjs-i18n';

export const Ctx = createParamDecorator((data: unknown, ctx: any) => {});
