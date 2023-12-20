import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { VoteModel } from '@/types/models/vote.model';

@ObjectType()
export class UserModel {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.avatar = user.avatar ?? undefined;
    this.bio = user.bio ?? undefined;
    this.profile_public = user.profile_public;
    this.email_opt_in = user.email_opt_in;
    this.is_admin = user.is_admin;
    this.challenge = user.challenge;
    this.server_id = user.server_id;
    this.verified = user.verified;
    this.pw_reset = user.pw_reset;
  }

  @Field(() => ID, {
    description: 'Unique id number of user used for comparison',
  })
  id!: string;

  @Field(() => String, {
    description: 'Unique public username of user used to display to others',
  })
  username!: string;

  @Field(() => String, {
    description:
      'Unique private email of user used to login and receive emails',
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    description: 'Hashed password of user used for login',
    nullable: true,
  })
  password?: string;

  @Field(() => String, {
    description: 'First name of user. Only public if profile is public',
    nullable: true,
  })
  first_name?: string;

  @Field(() => String, {
    description: 'Last name of user. Only public if profile is public',
    nullable: true,
  })
  last_name?: string;

  @Field(() => String, {
    description:
      'Link to profile picture of user. Only public if profile is public',
    nullable: true,
  })
  avatar?: string;

  @Field(() => String, {
    description: 'Short bio of user. Only public if profile is public',
    nullable: true,
  })
  bio?: string;

  @Field(() => Boolean, {
    description: 'Indicates whether the user wants their profile to be public',
    nullable: true,
  })
  profile_public?: boolean;

  @Field(() => Boolean, {
    description:
      'Indicates whether the user wants to receive non essential emails',
    nullable: true,
  })
  email_opt_in?: boolean;

  @Field(() => Boolean, {
    description: 'Indicates whether the user is an admin',
    nullable: true,
  })
  is_admin?: boolean;

  @Field(() => String, {
    description:
      'Challenge string used for password reset and account verification',
    nullable: true,
  })
  challenge?: string;

  @Field(() => Number, {
    description: 'Unique id number of server on which the user is registered',
    nullable: true,
  })
  server_id?: number;

  @Field(() => Boolean, {
    description: 'Indicates whether the user account is verified',
    nullable: true,
  })
  verified?: boolean;

  @Field(() => Boolean, {
    description: 'Indicates whether a password reset was requested',
    nullable: true,
  })
  pw_reset?: boolean;

  @Field(() => [VoteModel], {
    nullable: true,
  })
  votes?: VoteModel[];

  // clears all user fields that are not meant to be seen by public
  public convert_to_public(): this {
    if (!this.profile_public) {
      this.clear_user_profile();
    }
    this.clear_system_info();
    return this;
  }

  private clear_user_profile() {
    this.first_name = undefined;
    this.last_name = undefined;
    this.avatar = undefined;
    this.bio = undefined;
  }

  private clear_system_info() {
    this.email = undefined;
    this.password = undefined;
    this.email_opt_in = undefined;
    this.is_admin = undefined;
    this.challenge = undefined;
    this.server_id = undefined;
    this.verified = undefined;
    this.pw_reset = undefined;
  }
}
