/// <reference path="../actors/enemies/ChrisBoss.ts"/>
/// <reference path="../actors/enemies/SteveBoss.ts"/>
/// <reference path="../actors/enemies/Nero.ts"/>
/// <reference path="../actors/enemies/Mug.ts"/>
/// <reference path="../actors/enemies/Yahava.ts"/>
/// <reference path="../actors/enemies/DH.ts"/>

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
        { enemy: YahavaEnemy, count: 3 },
        { enemy: NeroEnemy, count: 2 },
      ],
    ],
  },
  {
    waves: [
      [
        { enemy: YahavaEnemy, count: 7 },
        { enemy: NeroEnemy, count: 2 },
      ],
    ],
  },
  {
    waves: [[{ enemy: ChrisBossEnemy, count: 2 }]],
  },
  {
    waves: [
      [
        { enemy: YahavaEnemy, count: 3 },
        { enemy: NeroEnemy, count: 2 },
        { enemy: MugEnemy, count: 4 },
      ],
      [
        { enemy: MugEnemy, count: 6 },
        { enemy: DHEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [[{ enemy: SteveBossEnemy, count: 2 }]],
  },
  {
    waves: [
      [
        { enemy: YahavaEnemy, count: 6 },
        { enemy: NeroEnemy, count: 9 },
        { enemy: MugEnemy, count: 5 },
        { enemy: DHEnemy, count: 4 },
      ],
      [
        { enemy: YahavaEnemy, count: 6 },
        { enemy: NeroEnemy, count: 9 },
        { enemy: MugEnemy, count: 5 },
        { enemy: DHEnemy, count: 4 },
      ],
      [
        { enemy: YahavaEnemy, count: 6 },
        { enemy: NeroEnemy, count: 9 },
        { enemy: MugEnemy, count: 5 },
        { enemy: DHEnemy, count: 4 },
      ],
    ],
  },
  {
    waves: [
      [
        { enemy: SteveBossEnemy, count: 4 },
        { enemy: ChrisBossEnemy, count: 6 },
      ],
    ],
  },
]

const messagePrefix = [
  'Loud Sipper',
  'Chief Sipper',
  'Coffee Snob',
  'Barista Wannabe',
]

const chrisList = ['Just', 'Plain', 'Blend 43', 'Captain Scrum Overlord']

const bossName = ['Tin Foil Kid']
