import { ResCodeEnum } from '@/types/common/res_code.enum';
import { Exception } from '@/common/exceptions/exception';

export class DangerException extends Exception {
  constructor(message: string, cause?: any) {
    super(message, ResCodeEnum.DANGER, cause);
  }
}
