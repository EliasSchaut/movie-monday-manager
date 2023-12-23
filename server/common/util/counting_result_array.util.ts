import { CountingResult } from '@/common/util/counting_result.util';
import { VotingBallotArray } from '@/common/util/voting_ballot_array.util';
import { VotingBallot } from '@/common/util/voting_ballot.util';
import { RandomService } from '@/common/services/random.service';

export class CountingResultArray {
  private items: CountingResult[] = [];

  constructor(voting_ballots: VotingBallotArray) {
    voting_ballots.get_items().forEach((voting_ballot: VotingBallot) => {
      const partial_weight = voting_ballot.get_partial_weight();
      voting_ballot.preferences[0].forEach((chosen_candidate) => {
        this.cast_vote(chosen_candidate, partial_weight);
      });
    });
  }

  public get_candidate_with_weight(weight_of_best_candidate: number): string {
    let possible_candidates = this.items.filter(
      (x) => x.weight === weight_of_best_candidate,
    );
    if (possible_candidates.length == 1)
      return possible_candidates[0].candidate;

    if (possible_candidates.length == 0)
      throw new Error(
        'No candidate found with weight ' + weight_of_best_candidate,
      );

    return RandomService.arr_random_element(possible_candidates).candidate;
  }

  public get_weight_of_best_candidate(): number {
    return Math.max(...this.items.map((x) => x.weight));
  }

  public get_weight_of_worst_candidate(): number {
    return Math.min(...this.items.map((x) => x.weight));
  }

  public get_items(): CountingResult[] {
    return this.items;
  }

  private cast_vote(candidate: string, partial_weight: number) {
    const possible_entrys = this.items.filter((v) => v.is_candidate(candidate));

    // should exist exactly once.
    if (possible_entrys.length === 1) {
      possible_entrys[0].add_weight(partial_weight);
    } else {
      // TODO throw error if possible_entry.length > 1
      this.items.push(
        new CountingResult({
          candidate: candidate,
          weight: partial_weight,
        }),
      );
    }
  }
}
