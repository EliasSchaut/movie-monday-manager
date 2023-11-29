import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '@/types/generated/i18n.generated';

export class CtxType {
  server_id!: number;
  i18n!: I18nContext<I18nTranslations>;
  user_id?: string;
}
