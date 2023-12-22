import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServerSettings } from '@prisma/client';

@ObjectType()
export class ServerSettingsModel {
  constructor(server_settings: ServerSettings) {
    this.max_votes = server_settings.max_votes;
    this.max_proposals = server_settings.max_proposals;
    this.max_movies = server_settings.max_movies;
    this.watchlist_auto = server_settings.watchlist_auto;
    this.watchlist_num_of_movies = server_settings.watchlist_num_of_movies;
    this.watchlist_schedule_creation =
      server_settings.watchlist_schedule_creation;
    this.watchlist_schedule_start = server_settings.watchlist_schedule_start;
    this.movie_gap_mins = server_settings.movie_gap_mins;
    this.round_to_5mins = server_settings.round_to_5mins;
    this.discord_auto = server_settings.discord_auto;
    this.discord_webhook = server_settings.discord_webhook;
    this.discord_msg = server_settings.discord_msg;
  }

  @Field(() => Int, {
    description: 'Maximal votes a user can give',
  })
  max_votes!: number;

  @Field(() => Int, {
    description: 'Maximal number of movies a user can propose',
  })
  max_proposals!: number;

  @Field(() => Int, {
    description: 'Maximal numbers of movies that can be proposed',
  })
  max_movies!: number;

  @Field(() => Boolean, {
    description: 'Enables or disables the automatic creation of the watchlist',
  })
  watchlist_auto!: boolean;

  @Field(() => Int, {
    description:
      'Number of movies that will be added to watchlist, if watchlist is on auto mode',
  })
  watchlist_num_of_movies!: number;

  @Field(() => String, {
    description:
      'Cron string that specifies the interval, when the watchlist creation is triggered',
  })
  watchlist_schedule_creation!: string;

  @Field(() => String, {
    description:
      'Cron string that specifies the start time of the first movie added',
  })
  watchlist_schedule_start!: string;

  @Field(() => Int, {
    description:
      'Gap time in minutes between movies added to the watchlist in a auto creation round',
  })
  movie_gap_mins!: number;

  @Field(() => Boolean, {
    description:
      'Indicates if the end time of a movie will be rounded to the next five mins',
  })
  round_to_5mins!: boolean;

  @Field(() => Boolean, {
    description:
      'Enables or disables whether a message should send via a discord webhook on watchlist creation',
  })
  discord_auto!: boolean;

  @Field(() => String, {
    description: 'Discord Webhook Link',
    nullable: true,
  })
  discord_webhook?: string | null;

  @Field(() => String, {
    description:
      'The message, the webhook should send. Term <watchlist> will be replaced by actual watchlist',
    nullable: true,
  })
  discord_msg?: string | null;
}
