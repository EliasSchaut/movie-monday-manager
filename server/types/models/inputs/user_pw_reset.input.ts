import { Field, InputType } from '@nestjs/graphql';
import { IsPassword } from '@/common/validation/decorators/IsPassword.validation';

@InputType()
export class UserPwResetInputModel {
  @Field(() => String, {
    description:
      'Challenge string used for password reset and account verification',
  })
  challenge!: string;

  @IsPassword()
  @Field(() => String, { description: 'New password of user used for login' })
  password!: string;
}
