export class ElectionInputType {
  constructor(election_input: ElectionInputType) {
    Object.assign(this, election_input);
  }

  seats_to_fill!: number;
  candidates?: string[];
  votes!: {
    weight: number;
    preferences: string[][];
    user_id: string;
  }[];
}
