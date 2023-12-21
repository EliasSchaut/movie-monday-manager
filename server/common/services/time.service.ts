import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class TimeService {
  public static add_minutes(date: Date, minutes_to_add: number): Date {
    return dayjs(date).add(minutes_to_add, 'minute').toDate();
  }

  public static add_minutes_rounded_to_5(
    date: Date,
    minuest_to_add: number,
  ): Date {
    return this.round_to_next_5_mins(this.add_minutes(date, minuest_to_add));
  }

  public static round_to_next_5_mins(date: Date): Date {
    const date_rounded_to_next_minute = this.round_to_next_min(date);
    const minutes = dayjs(date_rounded_to_next_minute).minute();
    const minutes_to_add = 5 - (minutes % 5);
    return this.add_minutes(date_rounded_to_next_minute, minutes_to_add);
  }

  private static round_to_next_min(date: Date): Date {
    return this.add_minutes(this.clear_seconds_and_lower(date), 1);
  }

  private static clear_seconds_and_lower(date: Date): Date {
    return dayjs(date).second(0).millisecond(0).toDate();
  }
}
