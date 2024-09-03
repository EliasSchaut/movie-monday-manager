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
    this.avatar_url = user.avatar_url ?? undefined;
    this.bio = user.bio ?? undefined;
    this.profile_public = user.profile_public;
    this.email_opt_in = user.email_opt_in;
    this.is_admin = user.is_admin;
    this.challenge = user.challenge;
    this.verified = user.verified;
    this.request_pw_reset = user.request_pw_reset;
    this.request_email_update = user.request_email_update;
    this.request_target_email = user.request_target_email ?? undefined;
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
    description: 'Hashed password of user used for login',
    nullable: true,
  })
  password?: string;

  @Field(() => String, {
    description:
      'Unique private email of user used to login and receive emails',
    nullable: true,
  })
  email?: string;

  @Field(() => String, {
    description:
      'Challenge string used for password reset and account verification',
    nullable: true,
  })
  challenge?: string;

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
  avatar_url?: string;

  @Field(() => String, {
    description: 'Short bio of user. Only public if profile is public',
    nullable: true,
  })
  bio?: string;

  @Field(() => Boolean, {
    description: 'Indicates whether the user is an admin',
    nullable: true,
  })
  is_admin?: boolean;

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
    description: 'Indicates whether the user account is verified',
    nullable: true,
  })
  verified?: boolean;

  @Field(() => Boolean, {
    description: 'Indicates whether a password reset was requested',
    nullable: true,
  })
  request_pw_reset?: boolean;

  @Field(() => Boolean, {
    description: 'Indicates whether an email change was requested',
    nullable: true,
  })
  request_email_update?: boolean;

  @Field(() => String, {
    description: 'Indicates the email the user wants to change to',
    nullable: true,
  })
  request_target_email?: string;

  @Field(() => [VoteModel], {
    nullable: true,
  })
  votes?: VoteModel[];

  // clears all user fields that are not meant to be seen by the public
  public convert_to_public(): this {
    if (!this.profile_public) {
      this.clear_user_profile();
    }
    this.clear_system_info();
    return this;
  }

  public clear_user_profile(): this {
    delete this.first_name;
    delete this.last_name;
    delete this.avatar_url;
    delete this.bio;
    return this;
  }

  public clear_system_info(): this {
    delete this.email;
    delete this.password;
    delete this.challenge;
    delete this.email_opt_in;
    delete this.is_admin;
    delete this.verified;
    delete this.request_pw_reset;
    delete this.request_email_update;
    delete this.request_target_email;
    return this;
  }
}
