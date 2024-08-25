import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';
import { IsPassword } from '@/common/validation/decorators/IsPassword.validation';
import { IsName } from '@/common/validation/decorators/IsName.validation';
import { IsUsername } from '@/common/validation/decorators/IsUsername.validation';

@InputType()
export class UserInputModel {
  @IsUsername()
  @Field(() => String, {})
  username!: string;

  @IsEmail()
  @Field(() => String, {})
  email!: string;

  @IsPassword()
  @Field(() => String, {})
  password!: string;

  @IsName()
  @Field(() => String, {})
  first_name!: string;

  @IsName()
  @Field(() => String, {})
  last_name!: string;

  @IsOptional()
  @IsUrl()
  @Field(() => String, { nullable: true })
  avatar?: string | null;

  @IsOptional()
  @Length(1, 4000)
  @Field(() => String, { nullable: true })
  bio?: string | null;

  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  profile_public?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  email_opt_in?: boolean;
}
