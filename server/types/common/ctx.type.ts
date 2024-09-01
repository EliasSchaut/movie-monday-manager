import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ServerModel } from '@/types/models/server.model';
import { ServerId, UserId } from '@/types/common/ids.type';

export class CtxType {
  server_id!: ServerId;
  i18n!: I18nContext<I18nTranslations>;
  user_id?: UserId;
  server?: ServerModel;
}
