import { Injectable } from '@nestjs/common';
import { Avatar } from '@/common/services/avatar/avatar.interface';
import { UserId } from '@/types/common/ids.type';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export abstract class AvatarService implements Avatar {
  constructor(protected readonly prisma: PrismaService) {}

  public abstract get_avatar(user_id: UserId): Promise<string | null>;

  public abstract upload_avatar(
    file: any,
    user_id: UserId,
  ): Promise<string | null>;

  public abstract delete_avatar(user_id: UserId): Promise<string | null>;
}
