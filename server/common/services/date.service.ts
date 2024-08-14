import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class DateService {
  private date: Date;

  constructor(date: Date) {
    this.date = date;
  }

  public to_date(): Date {
    return this.date;
  }

  public add_minutes(minutes_to_add: number): this {
    this.date = dayjs(this.date).add(minutes_to_add, 'minute').toDate();
    return this;
  }

  public add_minutes_rounded_to_5(minuest_to_add: number): this {
    this.add_minutes(minuest_to_add);
    this.round_to_next_5_mins();
    return this;
  }

  public round_to_next_5_mins(): this {
    this.round_to_next_min();
    const minutes = dayjs(this.date).minute();
    const minutes_to_add = 5 - (minutes % 5);
    return this.add_minutes(minutes_to_add);
  }

  private round_to_next_min(): this {
    this.clear_seconds_and_lower();
    this.add_minutes(1);
    return this;
  }

  private clear_seconds_and_lower(): this {
    this.date = dayjs(this.date).second(0).millisecond(0).toDate();
    return this;
  }
}
