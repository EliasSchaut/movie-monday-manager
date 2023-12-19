import { ResCodeEnum } from '@/types/enums/res_code.enum';
import { Exception } from '@/common/exceptions/exception';

export class WarningException extends Exception {
  constructor(message: string, cause?: any) {
    super(message, ResCodeEnum.WARNING, cause);
  }
}
