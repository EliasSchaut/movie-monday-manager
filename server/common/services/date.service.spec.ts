import { DateService } from '@/common/services/date.service';

describe('DateService', () => {
  let dateService: DateService;

  beforeEach(() => {
    dateService = new DateService(new Date('2024-01-01T00:02:30Z'));
  });

  it('returns the correct date', () => {
    const result = dateService.to_date();
    expect(result).toEqual(new Date('2024-01-01T00:02:30Z'));
  });

  it('adds minutes correctly', () => {
    dateService.add_minutes(10);
    const result = dateService.to_date();
    expect(result).toEqual(new Date('2024-01-01T00:12:30Z'));
  });

  it('adds minutes and rounds to next 5 minutes correctly', () => {
    dateService.add_minutes_rounded_to_5(3);
    const result = dateService.to_date();
    expect(result).toEqual(new Date('2024-01-01T00:10:00Z'));
  });

  it('rounds to next 5 minutes correctly', () => {
    dateService.round_to_next_5_mins();
    const result = dateService.to_date();
    expect(result).toEqual(new Date('2024-01-01T00:05:00Z'));
  });
});
