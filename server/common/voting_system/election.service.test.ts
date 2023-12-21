const ElectionService = require('./election.service');

test('one candidate, one vote', () => {
  var voting_ballots = [
    {
      user_id: 'valle',
      weight: 1,
      preferences: [[293]],
    },
  ];
  let elected = new ElectionService().elect(1, voting_ballots);
  expect(elected).toBe([293]);
});

test('5 of 9 hate 3', () => {
  var voting_ballots = [
    {
      user_id: 'one0',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'one1',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'one2',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'two0',
      weight: 1,
      preferences: [[2], [1]],
    },
    {
      user_id: 'two1',
      weight: 1,
      preferences: [[2], [1]],
    },
    {
      user_id: 'three0',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three1',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three2',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three3',
      weight: 1,
      preferences: [[3]],
    },
  ];
  let elected = new ElectionService().elect(1, voting_ballots);
  expect(elected).toBe([1]);
});

test('5 of 9 hate 3', () => {
  var voting_ballots = [
    {
      user_id: 'one0',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'one1',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'one2',
      weight: 1,
      preferences: [[1], [2]],
    },
    {
      user_id: 'two0',
      weight: 1,
      preferences: [[2], [1]],
    },
    {
      user_id: 'two1',
      weight: 1,
      preferences: [[2], [1]],
    },
    {
      user_id: 'three0',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three1',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three2',
      weight: 1,
      preferences: [[3]],
    },
    {
      user_id: 'three3',
      weight: 1,
      preferences: [[3]],
    },
  ];
  let elected = new ElectionService().elect(2, voting_ballots);
  expect(elected).toBe([1, 2]);
});

test('7 candidates', () => {
  var voting_ballots = [
    {
      user_id: '1',
      weight: 3,
      preferences: [[1], [2]],
    },
    {
      user_id: '2',
      weight: 8,
      preferences: [[2], [3], [4]],
    },
    {
      user_id: '3',
      weight: 1,
      preferences: [[3], [1], [2]],
    },
    {
      user_id: '4',
      weight: 3,
      preferences: [[4], [5]],
    },
    {
      user_id: '5',
      weight: 1,
      preferences: [[5], [4], [6]],
    },
    {
      user_id: '6',
      weight: 4,
      preferences: [[6], [7]],
    },
    {
      user_id: '7',
      weight: 3,
      preferences: [[7], [5], [6]],
    },
  ];
  let elected = new ElectionService().elect(1, voting_ballots);
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
  expect(elected).toBe([2, 6, 4]);
});

test('same priority', () => {
    var voting_ballots = [
        {
            user_id: 'mighty_user',
            weight: 60,
            preferences: [[1,2], [3,4], [4,5]]
        },
        {
            user_id: 'weak_user',
            weight: 40,
            preferences: [[1,7], [1,2,8,9], [3,10,11]]
        }
    ];
    let elected = new ElectionService().elect(4, voting_ballots);
    /*
    expected: 
    elect1(50, 25 quota), (mighty weight now 45, weak weight now 30)
    elect2(45, 25 quota), (mighty weight now 20, weak weight now 30)
    elect7(30, 25 quota), (mighty weight now 20, weak weight now 5)
    kick[8,9,10,11]
    elect3(25, 25 quota).
    */
    expect(elected).toBe([1,2,7,3])
});


test('splitted_but_majority', () => {
    var voting_ballots = [
        {
            user_id: 'mighty_user',
            weight: 99,
            preferences: [[1,2,3,4,5]]
        },
        {
            user_id: 'weak_user',
            weight: 1,
            preferences: [[3], [1,2,8,9], [5,10,11]]
        }
    ];
    let elected = new ElectionService().elect(4, voting_ballots);
    /*
    expected: 
    kick[8,9,10,11]
    kick[1,2,4,5]
    elect3(100, 100 quota)
    */
    expect(elected).toBe([3])
});
