import { Injectable } from '@nestjs/common';
import { CtxType } from '@/types/ctx.type';


type VotingBallot = {
  user_id: string,
  weight: number,
  preferences: number[][] //ids of movies. First index is preference (0 = best)
};

type CountingResults = {movie_id:number, weight:number}[]

@Injectable()
export class ElectionService {
  constructor(
  ) {}

  //example voting ballot (voting 4 stars for movie 12 and movie 13, 3 stars for movie 1):
  /*
    [{weight: 0, preferences: [12,13],[1]}]
  */

  //returns all candidate ids that are elected.
  public elect(count: number, voting_ballots: VotingBallot[]) {
    var elected: number[] = []
    var voted_out: number[] = []

    while(elected.length < count) {
      //1. clean ballots, remove empty ballots, check conditions
      voting_ballots.forEach(ballot => cleanBallot(ballot,voted_out.concat(elected)))
      voting_ballots = voting_ballots.filter(ballot => isEmptyBallot(ballot))
      if (voting_ballots.length == 0) return elected //TODO throw exception.

      var totalVotes = voting_ballots.reduce((a,b) => a + b.weight, 0)
      var votesNeededForAnElection = totalVotes / (count - elected.length)
      //2. collect votes
      var results : CountingResults = countVotes(voting_ballots)
      var votesOfBestCandidate = Math.max(...results.map(x => x.weight))
      //3. elect candidate with majority or throw out weakest candidate
      if (votesOfBestCandidate > votesNeededForAnElection) {
        var bestCandidateId = getCandidateWithWeight(votesOfBestCandidate, results)
        elected.push(bestCandidateId)
        //how much of the maxResult voting power is consumed by electing the candidate
        let votePercentageConsumedByElection = votesNeededForAnElection / votesOfBestCandidate
        //remove voting power from ballots that voted for elected candidate
        voting_ballots.forEach(ballot => {
          if (bestCandidateId in ballot.preferences[0]) {
            let voted_with_power = ballot.weight / ballot.preferences[0].length
            let votesConsumedByElection = voted_with_power * votePercentageConsumedByElection
            ballot.weight -= votesConsumedByElection
            //TODO throw some exception if now ballot.weight < 0
          }
        })
        console.log(`[election-service] elected ${bestCandidateId} having ${votesOfBestCandidate} votes (quota: ${votesNeededForAnElection}).`)
      }
      else {
        var votesOfWorstCandidate = Math.min(...results.map(x => x.weight))
        var worstCandidate = getCandidateWithWeight(votesOfWorstCandidate, results).movie_id
        voted_out.push(worstCandidate)
        console.log(`[election-service] voted out candidate ${worstCandidate} having only ${votesOfWorstCandidate} votes.`)
      }
    }
    return elected;
  }
}

function cleanBallot(ballot: VotingBallot, illegal_candidates: number[]) {
  //cleans first preference
  while (ballot.preferences.length != 0){
    ballot.preferences[0] = ballot.preferences[0].filter(id => !illegal_candidates.includes(id))
    if (ballot.preferences[0].length != 0) return 
    ballot.preferences.shift()
  }  
}

function countVotes(voting_ballots: VotingBallot[]): CountingResults {
  let results: CountingResults = [];
  voting_ballots.forEach(b => {
    let partial_vote_weight = b.weight / b.preferences[0].length
    b.preferences[0].forEach(e => {
      castVote(e, partial_vote_weight, results);
    })
  })
  return results
}   
function isEmptyBallot(ballot: VotingBallot): boolean {
  return ballot.preferences.length === 0;
}
function castVote(chosen_candidate: number, vote_weight: number, results: CountingResults) {
  let possible_entry = results.filter(v => v.movie_id == chosen_candidate);
  //should exist exactly once.
  if (possible_entry.length == 1){
    possible_entry[0].weight += vote_weight
  }
  else {
    //TODO throw error if possible_entry.length > 1
    results.push({
      movie_id: chosen_candidate,
      weight: vote_weight
    })
  }
}

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

function getCandidateWithWeight(votesOfBestCandidate: number, results: CountingResults) {
  let possibleCandidates = results.filter(x => x.weight === votesOfBestCandidate)
  if (possibleCandidates.length == 1) return possibleCandidates[0].movie_id
  if (possibleCandidates.length == 0) throw new Error("No candidate found with weight " + votesOfBestCandidate)
  
  return getRandomElement(possibleCandidates).movie_id
}
