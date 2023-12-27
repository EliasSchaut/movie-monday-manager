export class CountingResult {
  candidate!: string;
  weight!: number;

  constructor(counting_result: { candidate: string; weight: number }) {
    this.candidate = counting_result.candidate;
    this.weight = counting_result.weight;
  }

  public add_weight(weight: number) {
    this.weight += weight;
  }

  public is_candidate(candidate: string): boolean {
    return candidate === this.candidate;
  }
}
