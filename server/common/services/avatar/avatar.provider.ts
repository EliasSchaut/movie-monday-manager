import { Provider } from '@nestjs/common';
import { DangerException } from '@/common/exceptions/danger.exception';
import { AvatarService } from '@/common/services/avatar/avatar.service';
import { AvatarTypeEnum } from '@/types/avatar/avatar_type.enum';
import { GravatarService } from '@/common/services/avatar/gravatar.service';

export const AvatarServiceProvider: Provider = {
  provide: AvatarService,
  useClass: (() => {
    switch (process.env.AVATAR_TYPE) {
      case AvatarTypeEnum.GRAVATAR:
        return GravatarService;
      default:
        throw new DangerException('Unsupported AVATAR_TYPE');
    }
  })(),
};
