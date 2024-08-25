import { Field, InputType } from '@nestjs/graphql';
import { IsPassword } from '@/common/validation/decorators/IsPassword.validation';
import { IsUUID, Length } from 'class-validator';
import { PasswordService } from '@/common/services/password.service';

@InputType()
export class UserPwResetInputModel {
  @IsUUID()
  @Field(() => String, { description: 'ID of user to reset password' })
  user_id!: string;

  @Length(PasswordService.CHALLENGE_LENGTH)
  @Field(() => String, {
    description:
      'Challenge string used for password reset and account verification',
  })
  challenge!: string;

  @IsPassword()
  @Field(() => String, { description: 'New password of user used for login' })
  password!: string;
}
