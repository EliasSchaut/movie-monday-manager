import { Field, InputType, Int } from '@nestjs/graphql';
import { IsCron } from '@/common/validation/decorators/IsCron.validation';
import { Length, Max, Min } from 'class-validator';
import { IsDiscordWebhook } from '@/common/validation/decorators/discord_webhook.validation';

@InputType()
export class ServerSettingsInputModel {
  @Min(0)
  @Max(1000)
  @Field(() => Int, {
    description: 'Maximal votes a user can give',
    nullable: true,
  })
  max_votes?: number;

  @Min(0)
  @Max(1000)
  @Field(() => Int, {
    description: 'Maximal number of movies a user can propose',
    nullable: true,
  })
  max_proposals?: number;

  @Min(0)
  @Max(1000)
  @Field(() => Int, {
    description: 'Maximal numbers of movies that can be proposed',
    nullable: true,
  })
  max_movies?: number;

  @Field(() => Boolean, {
    description: 'Enables or disables the automatic creation of the watchlist',
    nullable: true,
  })
  watchlist_auto?: boolean;

  @Min(0)
  @Max(100)
  @Field(() => Int, {
    description:
      'Number of movies that will be added to watchlist, if watchlist is on auto mode',
    nullable: true,
  })
  watchlist_num_of_movies?: number;

  @IsCron()
  @Field(() => String, {
    description:
      'Cron string that specifies the interval, when the watchlist creation is triggered',
    nullable: true,
  })
  watchlist_schedule_creation?: string;

  @IsCron()
  @Field(() => String, {
    description:
      'Cron string that specifies the start time of the first movie added',
    nullable: true,
  })
  watchlist_schedule_start?: string;

  @Min(0)
  @Max(10000)
  @Field(() => Int, {
    description:
      'Gap time in minutes between movies added to the watchlist in a auto creation round',
    nullable: true,
  })
  movie_gap_mins?: number;

  @Field(() => Boolean, {
    description:
      'Indicates if the end time of a movie will be rounded to the next five mins',
    nullable: true,
  })
  round_to_5mins?: boolean;

  @Field(() => Boolean, {
    description:
      'Enables or disables whether a message should send via a discord webhook on watchlist creation',
    nullable: true,
  })
  discord_auto?: boolean;

  @IsDiscordWebhook()
  @Field(() => String, {
    description: 'Discord Webhook Link',
    nullable: true,
  })
  discord_webhook?: string | null;

  @Length(0, 1500)
  @Field(() => String, {
    description:
      'The message, the webhook should send. Term <watchlist> will be replaced by actual watchlist',
    nullable: true,
  })
  discord_msg?: string | null;
}
