import { Injectable } from '@nestjs/common';
import { AvatarService } from '@/common/services/avatar/avatar.service';
import { Avatar } from '@/common/services/avatar/avatar.interface';
import { DangerException } from '@/common/exceptions/danger.exception';
import { PasswordService } from '@/common/services/password.service';
import { UserId } from '@/types/common/ids.type';

@Injectable()
export class GravatarService extends AvatarService implements Avatar {
  private readonly GRAVATAR_BASE = 'https://www.gravatar.com/avatar/';

  public async get_avatar(user_id: UserId): Promise<string | null> {
    const user_mail = await this.find_email(user_id);
    if (!user_mail) {
      return null;
    }
    const user_hash = await this.hash_email(user_mail);
    return this.get_gravatar_url(user_hash);
  }

  public upload_avatar(): Promise<string> {
    return Promise.reject(
      new DangerException('Upload avatar is not supported for Gravatar'),
    );
  }

  public delete_avatar(): Promise<string> {
    return Promise.reject(
      new DangerException('Delete avatar is not supported for Gravatar'),
    );
  }

  private async find_email(user_id: UserId): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      select: { email: true },
    });

    return user?.email ?? null;
  }

  private async hash_email(email: string): Promise<string> {
    return PasswordService.hash_md5(email);
  }

  private get_gravatar_url(hash: string): string {
    return `${this.GRAVATAR_BASE}${hash}`;
  }
}
