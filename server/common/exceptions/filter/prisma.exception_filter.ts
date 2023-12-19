import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { I18nContext } from 'nestjs-i18n';
import { DangerException } from '@/common/exceptions/danger.exception';
import { PrismaError } from 'prisma-error-enum';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements GqlExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): DangerException {
    const exceptionMessage = this.get_exception_msg(exception.code);
    return new DangerException(exceptionMessage, exception.message);
  }

  private get_exception_msg(code: string): string {
    const i18n = I18nContext.current()!;
    if (code.startsWith('P1')) {
      return i18n.t('common.exception.db_not_reached');
    } else if (code === PrismaError.RecordDoesNotExist) {
      return i18n.t('common:exception.db.record_not_found');
    } else if (code === PrismaError.UniqueConstraintViolation) {
      return i18n.t('common:exception.db.duplication');
    } else {
      return i18n.t('common:exception.db.internal');
    }
  }
}
