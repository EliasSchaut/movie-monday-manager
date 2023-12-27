import { Injectable, Logger } from '@nestjs/common';
import { CountingResultArray } from '@/common/elections/stv/util/counting_result_array.util';
import { VotingBallotArray } from '@/common/elections/stv/util/voting_ballot_array.util';
import { DangerException } from '@/common/exceptions/danger.exception';
import { I18nContext } from 'nestjs-i18n';

/**
 * Class representing a stv-election.
 *
 *   example voting ballot (voting 4 stars for movie 12 and movie 13, 3 stars for movie 1):
 *   [{weight: 0, preferences: [12,13],[1]}]
 *
 */
@Injectable()
export class StvElectionService implements ElectionInterface {
  private num_candidates_to_elect!: number;
  private ballots!: VotingBallotArray;
  private elected_candidates: string[] = [];
  private voted_out_candidates: string[] = [];

  // returns all candidates that are elected.
  public election(num_candidates_to_elect: number,
                  voting_ballots: VotingBallotArray): string[] {
    this.num_candidates_to_elect = num_candidates_to_elect;
    this.ballots = voting_ballots;
    this.reset_election_fields();

    // dummy to ensure that candidates that get no first-prio votes are kicked before any other are kicked.
    this.ballots.add_dummy();

    while (this.elected_candidates.length < this.num_candidates_to_elect) {
      this.clean_ballots();
      if (this.ballots.is_empty()) {
        throw new DangerException(
          I18nContext.current()!.t('vote.exception.to_less_votes'),
        );
      }

      const weight_total: number = this.ballots.get_total_weight();
      const weight_needed: number =
        this.get_weight_needed_to_be_elected(weight_total);

      // 2. collect votes
      const results: CountingResultArray = new CountingResultArray(
        this.ballots,
      );
      const weight_best_candidate = results.get_weight_of_best_candidate();

      // 3. elect candidate with majority or throw out weakest candidate
      if (weight_best_candidate >= weight_needed) {
        const best_candidate: string = results.get_candidate_with_weight(
          weight_best_candidate,
        );
        this.elect(best_candidate);
        // how much of the maxResult voting power is consumed by electing the candidate
        const weight_percentage_consumed: number =
          this.get_weight_percentage_consumed_by_election(
            weight_needed,
            weight_best_candidate,
          );
        // remove voting power from ballots that voted for elected candidate
        this.ballots.remove_weight_power(
          best_candidate,
          weight_percentage_consumed,
        );
        Logger.debug(
          `[election-service] elected ${best_candidate} having ${weight_best_candidate} votes (quota: ${weight_needed}).`,
        );
      } else {
        const weight_worst_candidate = results.get_weight_of_worst_candidate();
        const worst_candidate = results.get_candidate_with_weight(
          weight_worst_candidate,
        );
        this.vote_out(worst_candidate);
        Logger.debug(
          `[election-service] voted out candidate ${worst_candidate} having only ${weight_worst_candidate} votes.`,
        );
      }
    }

    return this.elected_candidates
  }

  private elect(candidate: string): void {
    this.elected_candidates.push(candidate);
  }

  private vote_out(candidate: string): void {
    this.voted_out_candidates.push(candidate);
  }

  // clean ballots, remove empty ballots, check conditions
  private clean_ballots() {
    this.ballots.delete_candidates(this.get_illegal_candidates());
    this.ballots.delete_empty();
  }

  private get_weight_needed_to_be_elected(weight_total: number): number {
    return (
      weight_total /
      (this.num_candidates_to_elect - this.elected_candidates.length)
    );
  }

  private get_illegal_candidates(): string[] {
    return this.voted_out_candidates.concat(this.elected_candidates);
  }

  private get_weight_percentage_consumed_by_election(
    weight_needed_to_be_elected: number,
    weight_best_candidate: number,
  ): number {
    return weight_needed_to_be_elected / weight_best_candidate;
  }

  private reset_election_fields() {
    this.elected_candidates = [];
    this.voted_out_candidates = [];
  }
}
