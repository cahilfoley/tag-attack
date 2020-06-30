/// <reference path="../actors/enemies/basics.ts"/>
/// <reference path="../actors/enemies/bosses.ts"/>

const levels: RoundSettings[] = [
  {
    waves: [
      [
        { enemy: EssendonEnemy, count: 6 },
        { enemy: PortEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [
      [
        { enemy: EssendonEnemy, count: 14 },
        { enemy: PortEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [[{ enemy: ChrisBossEnemy, count: 4 }]],
  },
  {
    waves: [
      [
        { enemy: EssendonEnemy, count: 6 },
        { enemy: PortEnemy, count: 4 },
        { enemy: DockersEnemy, count: 8 },
      ],
      [
        { enemy: DockersEnemy, count: 12 },
        { enemy: CollingwoodEnemy, count: 8 },
      ],
    ],
  },
  {
    waves: [[{ enemy: SteveBossEnemy, count: 4 }]],
  },
  {
    waves: [
      [
        { enemy: EssendonEnemy, count: 12 },
        { enemy: PortEnemy, count: 16 },
        { enemy: DockersEnemy, count: 10 },
        { enemy: CollingwoodEnemy, count: 8 },
      ],
      [
        { enemy: EssendonEnemy, count: 12 },
        { enemy: PortEnemy, count: 16 },
        { enemy: DockersEnemy, count: 10 },
        { enemy: CollingwoodEnemy, count: 8 },
      ],
      [
        { enemy: EssendonEnemy, count: 12 },
        { enemy: PortEnemy, count: 16 },
        { enemy: DockersEnemy, count: 10 },
        { enemy: CollingwoodEnemy, count: 8 },
      ],
    ],
  },
  {
    waves: [
      [
        { enemy: SteveBossEnemy, count: 6 },
        { enemy: ChrisBossEnemy, count: 8 },
      ],
    ],
  },
]

const messageActions = [
  'jump on a Teams call with you',
  'go a round of Fortnite with you',
  'throw things at Collingwood supporters with you',
  'discuss bruce with you',
]

const messagePrefix = [
  'Adhoc Leech',
  'Dockers Fan',
  'Passport Enthusiast',
  'Simpsons Lover',
]

const chrisList = ['Just', 'Plain', 'Captain Scrum Overlord']

const bossName = ['Tin Foil Kid']
