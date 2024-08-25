import { VotingBallot } from '@/common/services/elections/stv/util/voting_ballot.util';

export class VotingBallotArray {
  private items: VotingBallot[] = [];

  constructor(
    voting_ballots:
      | Array<VotingBallot>
      | {
          user_id: string;
          weight?: number;
          preferences: string[][];
        }[],
  ) {
    this.items = voting_ballots.map((ballot) => new VotingBallot(ballot));
  }

  public remove_weight_power(
    candidate: string,
    weight_percentage_consumed: number,
  ) {
    this.items.forEach((voting_ballot: VotingBallot) => {
      if (voting_ballot.preferences[0].includes(candidate)) {
        const voted_with_power =
          voting_ballot.weight / voting_ballot.preferences[0].length;
        const votesConsumedByElection =
          voted_with_power * weight_percentage_consumed;
        voting_ballot.weight -= votesConsumedByElection;
        //TODO throw some exception if now ballot.weight < 0
      }
    });
  }

  public delete_candidates(candidates: string[]): void {
    this.items.forEach((ballot: VotingBallot) =>
      ballot.delete_candidates(candidates),
    );
  }

  public delete_empty(): void {
    this.items = this.items.filter(
      (ballot: VotingBallot) => !ballot.is_empty(),
    );
  }

  public is_empty(): boolean {
    return this.items.length === 0;
  }

  public get_total_weight(): number {
    return this.items.reduce(
      (acc, voting_ballot) => acc + voting_ballot.weight,
      0,
    );
  }

  public get_items(): VotingBallot[] {
    return this.items;
  }

  public add_dummy(
    user_id: string = 'dummy__collection_of_all_possible_candidates',
  ): void {
    this.items.push(
      new VotingBallot({
        user_id: user_id,
        weight: 0,
        preferences: [
          [...new Set(this.items.map((x) => x.preferences.flat()).flat())],
        ],
      }),
    );
  }
}
