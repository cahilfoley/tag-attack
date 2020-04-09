/// <reference path="../actors/BossEnemy.ts"/>
/// <reference path="../actors/PowerBIEnemy.ts"/>
/// <reference path="../actors/SSRSEnemy.ts"/>
/// <reference path="../actors/SQLEnemy.ts"/>
/// <reference path="../actors/SpotfireEnemy.ts"/>

const yahavaCoffees = [
  'Caffe Americano',
  'Cafe Latte ',
  'Cappuccino',
  'Espresso',
  'Flat White',
  'Long Black',
]

const neroCoffees = [
  'Macchiato',
  'Piccolo Latte',
  'Mochaccino',
  'Vienna',
  'Affogato',
]

const dhCoffees = [
  'Cafe Latte ',
  'Cappuccino',
  'Espresso',
  'Vienna',
  'Fancy Pants Drip Coffee',
]

const mugCoffees = ['OC', 'LVL 17', 'Instant ']

const levels: RoundSettings[] = [
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 3 },
        { enemy: PowerBIEnemy, count: 2 },
      ],
    ],
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 7 },
        { enemy: PowerBIEnemy, count: 2 },
      ],
    ],
  },
  {
    waves: [[{ enemy: BossEnemy, count: 1 }]],
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 3 },
        { enemy: PowerBIEnemy, count: 2 },
        { enemy: SSRSEnemy, count: 4 },
      ],
      [
        { enemy: SSRSEnemy, count: 6 },
        { enemy: SpotfireEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [[{ enemy: BossEnemy, count: 2 }]],
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 },
      ],
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 },
      ],
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [[{ enemy: BossEnemy, count: 10 }]],
  },
]

const messagePrefix = [
  'Loud Sipper',
  'Chief Sipper',
  'Coffee Snob',
  'Barista Wannabe',
]

const chrisList = ['Just', 'Plain', 'Blend 43',]

const bossName = ['Tin Foil Kid']
