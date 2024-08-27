import { Prisma } from '@prisma/client';
import { ResCodeEnum } from '@/types/enums/res_code.enum';
import { I18nContext } from 'nestjs-i18n';
import { PrismaError } from 'prisma-error-enum';
import { Exception } from '@/common/exceptions/exception';

export class PrismaException extends Exception {
  constructor(
    e: any,
    err_msg_on?: {
      record_does_not_exist?: string;
      unique_constraint_violation?: string;
    },
  ) {
    const i18n = I18nContext.current()!;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case PrismaError.RecordDoesNotExist: {
          super(
            err_msg_on?.record_does_not_exist ??
              i18n.t('common.exception.db.record_not_found'),
            ResCodeEnum.WARNING,
            e.message,
          );
          break;
        }
        case PrismaError.UniqueConstraintViolation: {
          super(
            err_msg_on?.unique_constraint_violation ??
              i18n.t('common.exception.db.duplication'),
            ResCodeEnum.WARNING,
            e.message,
          );
          break;
        }
        default: {
          super(
            i18n.t('common.exception.db.internal'),
            ResCodeEnum.DANGER,
            e.message,
          );
        }
      }
    }
    super(i18n.t('common.exception.internal'), ResCodeEnum.DANGER, e);
  }
}
