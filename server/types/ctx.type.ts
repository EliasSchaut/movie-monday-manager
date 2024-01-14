import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';
import { ServerModel } from '@/types/models/server.model';

export class CtxType {
  server_id!: number;
  i18n!: I18nContext<I18nTranslations>;
  user_id?: string;
  server?: ServerModel
}
