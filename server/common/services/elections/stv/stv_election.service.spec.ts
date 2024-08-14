import { StvElectionService } from '@/common/elections/stv/stv_election.service';
import { VotingBallotArray } from '@/common/elections/stv/util/voting_ballot_array.util';
import { VotingBallot } from '@/common/elections/stv/util/voting_ballot.util';

describe('ElectionService', () => {
  let election_service: StvElectionService;

  beforeEach(() => {
    election_service = new StvElectionService();
  });

  it('one candidate, one vote', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'valle',
        weight: 1,
        preferences: [['293']],
      },
    ] as VotingBallot[]);
    const elected_candidates = election_service.election(1, voting_ballots);
    expect(elected_candidates).toEqual(['293']);
  });

  it('5 of 9 hate 3', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'one0',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'one1',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'one2',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'two0',
        weight: 1,
        preferences: [['2'], ['1']],
      },
      {
        user_id: 'two1',
        weight: 1,
        preferences: [['2'], ['1']],
      },
      {
        user_id: 'three0',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three1',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three2',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three3',
        weight: 1,
        preferences: [['3']],
      },
    ]);
    const elected_candidates = election_service.election(1, voting_ballots);

    /*
    expect: kick 2, kick 3, elect 1
     */
    expect(elected_candidates).toEqual(['1']);
  });

  it('4 of 9 like 3', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'one0',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'one1',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'one2',
        weight: 1,
        preferences: [['1'], ['2']],
      },
      {
        user_id: 'two0',
        weight: 1,
        preferences: [['2'], ['1']],
      },
      {
        user_id: 'two1',
        weight: 1,
        preferences: [['2'], ['1']],
      },
      {
        user_id: 'three0',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three1',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three2',
        weight: 1,
        preferences: [['3']],
      },
      {
        user_id: 'three3',
        weight: 1,
        preferences: [['3']],
      },
    ]);
    const elected_candidates = election_service.election(2, voting_ballots);
    expect(elected_candidates).toEqual(['1', '3']);
  });

  it('7 candidates', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: '1',
        weight: 3,
        preferences: [['1'], ['2']],
      },
      {
        user_id: '2',
        weight: 8,
        preferences: [['2'], ['3'], ['4']],
      },
      {
        user_id: '3',
        weight: 1,
        preferences: [['3'], ['1'], ['2']],
      },
      {
        user_id: '4',
        weight: 3,
        preferences: [['4'], ['5']],
      },
      {
        user_id: '5',
        weight: 1,
        preferences: [['5'], ['4'], ['6']],
      },
      {
        user_id: '6',
        weight: 4,
        preferences: [['6'], ['7']],
      },
      {
        user_id: '7',
        weight: 3,
        preferences: [['7'], ['5'], ['6']],
      },
    ]);
    const elected_candidates = election_service.election(3, voting_ballots);
    //expected:
    /*
      elect2(8, 7.66 quota),
      kick5(1),
      [kick3, kick7](3),
      kick1(4),
      elect6(7, 5.66 quota),
      elect4(4.33, 4.33 quota)
    */

    //note that different stv behaviour is possible for different implementation:
    //wikipedia quota: votes/(seats-1) + 1
    //my quota: votes/seats
    //3 and 7 are kicked in random order.
    expect(elected_candidates).toEqual(['2', '6', '4']);
  });

  it('same priority', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'mighty_user',
        weight: 60,
        preferences: [
          ['1', '2'],
          ['3', '4'],
          ['4', '5'],
        ],
      },
      {
        user_id: 'weak_user',
        weight: 40,
        preferences: [
          ['1', '7'],
          ['1', '2', '8', '9'],
          ['3', '10', '11'],
        ],
      },
    ]);
    const elected_candidates = election_service.election(4, voting_ballots);
    /*
      expected:
      elect1(50, 25 quota), (mighty weight now 45, weak weight now 30)
      elect2(45, 25 quota), (mighty weight now 20, weak weight now 30)
      elect7(30, 25 quota), (mighty weight now 20, weak weight now 5)
      kick[8,9,10,11]
      elect3(25, 25 quota).
      */
    expect(elected_candidates).toEqual(['1', '2', '7', '3']);
  });

  it('split but majority', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'mighty_user',
        weight: 99,
        preferences: [['1', '2', '3', '4', '5']],
      },
      {
        user_id: 'weak_user',
        weight: 1,
        preferences: [['3'], ['1', '2', '8', '9'], ['5', '10', '11']],
      },
    ]);
    const elected_candidates = election_service.election(1, voting_ballots);
    /*
      expected:
      kick[8,9,10,11]
      kick[1,2,4,5]
      elect3(100, 100 quota)
      */
    expect(elected_candidates).toEqual(['3']);
  });

  it('ignored_consensus_candidate', () => {
    const voting_ballots = new VotingBallotArray([
      {
        user_id: 'near_consensus1',
        weight: 2,
        preferences: [['1'], ['12']],
      },
      {
        user_id: 'near_consensus2',
        weight: 2,
        preferences: [['2'], ['12']],
      },
      {
        user_id: 'near_consensus3',
        weight: 1,
        preferences: [['12']],
      },
      {
        user_id: 'opposite_party',
        weight: 3,
        preferences: [['3']],
      },
    ]);
    const elected_candidates = election_service.election(1, voting_ballots);
    /*
      expected:
      12 is kicked early.
      would be nice if 12 would still be elected as clearly first three users support him. But not possible with current voting system.
      */
    expect(elected_candidates).toEqual(['3']);
  });
});
