export interface Election {
  election(num_candidates_to_elect: number, ...args: any[]): string[];
}
