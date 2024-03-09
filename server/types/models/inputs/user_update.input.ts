import { Field, InputType } from '@nestjs/graphql';
import { IsName } from '@/common/validation/decorators/IsName.validation';
import { IsEmail, IsOptional, IsUrl } from 'class-validator';
import { IsUsername } from '@/common/validation/decorators/IsUsername.validation';
import { IsPassword } from '@/common/validation/decorators/IsPassword.validation';

@InputType()
export class UserUpdateInputModel {
  @IsUsername()
  @Field(() => String, { nullable: true })
  username?: string;

  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsPassword()
  @Field(() => String, { nullable: true })
  password?: string;

  @IsName()
  @Field(() => String, { nullable: true })
  first_name?: string;

  @IsName()
  @Field(() => String, { nullable: true })
  last_name?: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => Boolean, { nullable: true })
  profile_public?: boolean;

  @Field(() => Boolean, { nullable: true })
  email_opt_in?: boolean;
}
