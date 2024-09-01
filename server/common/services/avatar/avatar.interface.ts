import { UserId } from '@/types/common/ids.type';

export interface Avatar {
  get_avatar(user_id: UserId): Promise<string | null>;

  upload_avatar(file: any, user_id: UserId): Promise<string | null>;

  delete_avatar(user_id: UserId): Promise<string | null>;
}
