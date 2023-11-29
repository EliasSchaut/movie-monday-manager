import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => ID, {
    description: 'Unique id number of user used for comparison',
    nullable: true,
  })
  id?: string;

  @Field(() => String, {
    description: 'Unique public username of user used to display to others',
    nullable: true,
  })
  username?: string;

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
}
