import { Injectable } from '@nestjs/common';
import { Election } from '@/common/services/elections/election.interface';
import { ElectionInputType } from '@/types/election/election_input.type';

@Injectable()
export abstract class ElectionService implements Election {
  public abstract election(input: ElectionInputType): string[];
}
