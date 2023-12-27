export class VotingBallot {
  user_id!: string;

  weight: number = 1;

  // ids of candidates. First index is preference (0 = best)
  preferences!: string[][];

  constructor(voting_bollot: {
    user_id: string;
    weight?: number;
    preferences: string[][];
  }) {
    this.user_id = voting_bollot.user_id;
    this.preferences = voting_bollot.preferences;
    this.weight = voting_bollot.weight ?? this.weight;
  }

  public get_partial_weight(): number {
    return this.weight / this.preferences[0].length;
  }

  // deletes first preference
  public delete_candidates(candidates: string[]): void {
    while (this.preferences.length !== 0) {
      this.preferences[0] = this.preferences[0].filter(
        (candidate) => !candidates.includes(candidate),
      );
      if (this.preferences[0].length !== 0) return;
      this.preferences.shift();
    }
  }

  public is_empty(): boolean {
    return this.preferences.length === 0;
  }
}
