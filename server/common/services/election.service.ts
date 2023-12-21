import { Injectable, Logger } from '@nestjs/common';
import { RandomService } from '@/common/services/random.service';

type VotingBallot = {
  user_id: string;
  weight: number;
  preferences: number[][]; //ids of movies. First index is preference (0 = best)
};

type CountingResults = { movie_id: number; weight: number }[];

@Injectable()
export class ElectionService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /*
    example voting ballot (voting 4 stars for movie 12 and movie 13, 3 stars for movie 1):
    [{weight: 0, preferences: [12,13],[1]}]
  */

  // returns all candidate ids that are elected.
  public elect(count: number, voting_ballots: VotingBallot[]): number[] {
    const elected: number[] = [];
    const voted_out: number[] = [];
    // dummy to ensure that candidates that get no first-prio votes are kicked before any other are kicked.
    voting_ballots.push({
      user_id: 'dummy__collection_of_all_possible_candidates',
      weight: 0,
      preferences: [
        [...new Set(voting_ballots.map((x) => x.preferences.flat()).flat())],
      ],
    });
    while (elected.length < count) {
      // 1. clean ballots, remove empty ballots, check conditions
      voting_ballots.forEach((ballot) =>
        this.clean_ballot(ballot, voted_out.concat(elected)),
      );
      voting_ballots = voting_ballots.filter((ballot) =>
        this.is_empty_ballot(ballot),
      );
      if (voting_ballots.length == 0) return elected; //TODO throw exception.

      const total_votes = voting_ballots.reduce((a, b) => a + b.weight, 0);
      const votes_needed_for_an_election =
        total_votes / (count - elected.length);

      // 2. collect votes
      const results: CountingResults = this.count_votes(voting_ballots);
      const votes_of_best_candidate = Math.max(...results.map((x) => x.weight));

      // 3. elect candidate with majority or throw out weakest candidate
      if (votes_of_best_candidate > votes_needed_for_an_election) {
        const best_candidate_id = this.get_candidate_with_weight(
          votes_of_best_candidate,
          results,
        );
        elected.push(best_candidate_id);
        // how much of the maxResult voting power is consumed by electing the candidate
        let vote_percentage_consumed_by_election =
          votes_needed_for_an_election / votes_of_best_candidate;
        // remove voting power from ballots that voted for elected candidate
        voting_ballots.forEach((ballot) => {
          if (best_candidate_id in ballot.preferences[0]) {
            let voted_with_power = ballot.weight / ballot.preferences[0].length;
            let votesConsumedByElection =
              voted_with_power * vote_percentage_consumed_by_election;
            ballot.weight -= votesConsumedByElection;
            //TODO throw some exception if now ballot.weight < 0
          }
        });
        this.logger.log(
          `[election-service] elected ${best_candidate_id} having ${votes_of_best_candidate} votes (quota: ${votes_needed_for_an_election}).`,
        );
      } else {
        const votes_of_worst_candidate = Math.min(
          ...results.map((x) => x.weight),
        );
        const worst_candidate = this.get_candidate_with_weight(
          votes_of_worst_candidate,
          results,
        ).movie_id;
        voted_out.push(worst_candidate);
        this.logger.log(
          `[election-service] voted out candidate ${worst_candidate} having only ${votes_of_worst_candidate} votes.`,
        );
      }
    }
    return elected;
  }

  // cleans first preference
  private clean_ballot(ballot: VotingBallot, illegal_candidates: number[]) {
    while (ballot.preferences.length != 0) {
      ballot.preferences[0] = ballot.preferences[0].filter(
        (id) => !illegal_candidates.includes(id),
      );
      if (ballot.preferences[0].length != 0) return;
      ballot.preferences.shift();
    }
  }

  private count_votes(voting_ballots: VotingBallot[]): CountingResults {
    let results: CountingResults = [];
    voting_ballots.forEach((b) => {
      let partial_vote_weight = b.weight / b.preferences[0].length;
      b.preferences[0].forEach((e) => {
        this.cast_vote(e, partial_vote_weight, results);
      });
    });
    return results;
  }

  private is_empty_ballot(ballot: VotingBallot): boolean {
    return ballot.preferences.length === 0;
  }

  private cast_vote(
    chosen_candidate: number,
    vote_weight: number,
    results: CountingResults,
  ) {
    let possible_entry = results.filter((v) => v.movie_id == chosen_candidate);

    //should exist exactly once.
    if (possible_entry.length == 1) {
      possible_entry[0].weight += vote_weight;
    } else {
      // TODO throw error if possible_entry.length > 1
      results.push({
        movie_id: chosen_candidate,
        weight: vote_weight,
      });
    }
  }

  private get_candidate_with_weight(
    votes_of_best_candidate: number,
    results: CountingResults,
  ) {
    let possible_candidates = results.filter(
      (x) => x.weight === votes_of_best_candidate,
    );
    if (possible_candidates.length == 1) return possible_candidates[0].movie_id;
    if (possible_candidates.length == 0)
      throw new Error(
        'No candidate found with weight ' + votes_of_best_candidate,
      );

    return RandomService.arr_random_element(possible_candidates).movie_id;
  }
}
