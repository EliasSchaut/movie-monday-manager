import { Prisma } from '@prisma/client';
import { ResCodeEnum } from '@/types/common/res_code.enum';
import { I18nContext } from 'nestjs-i18n';
import { PrismaError } from 'prisma-error-enum';
import { Exception } from '@/common/exceptions/exception';

export class PrismaException extends Exception {
  constructor(
    e: any,
    err_msg_on?: {
      record_does_not_exist?: string;
      unique_constraint_violation?: string;
      no_matches?: string;
    },
  ) {
    const i18n = I18nContext.current()!;
    let err_msg: string;
    let res_code: ResCodeEnum = ResCodeEnum.DANGER;
    let cause: any;
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      cause = e.message;
      switch (e.code) {
        case PrismaError.RecordDoesNotExist: {
          err_msg =
            err_msg_on?.record_does_not_exist ??
            i18n.t('common.exception.db.record_not_found');
          res_code = ResCodeEnum.WARNING;
          break;
        }
        case PrismaError.UniqueConstraintViolation: {
          err_msg =
            err_msg_on?.unique_constraint_violation ??
            i18n.t('common.exception.db.duplication');
          res_code = ResCodeEnum.WARNING;
          break;
        }
        default: {
          err_msg =
            err_msg_on?.no_matches ?? i18n.t('common.exception.db.internal');
        }
      }
    } else {
      err_msg = i18n.t('common.exception.db.internal');
      cause = e;
    }
    super(err_msg, res_code, cause);
  }
}
