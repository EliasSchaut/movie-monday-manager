import { ElectionInputType } from '@/types/election/election_input.type';

export interface Election {
  election(input: ElectionInputType): string[];
}
