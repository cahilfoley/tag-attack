/// <reference path="../actors/BossEnemy.ts"/>
/// <reference path="../actors/PowerBIEnemy.ts"/>
/// <reference path="../actors/SSRSEnemy.ts"/>
/// <reference path="../actors/SQLEnemy.ts"/>
/// <reference path="../actors/SpotfireEnemy.ts"/>

const dbNames = [
  'AMES.ODS',
  'AMES_Conifg',
  'UTIL_Alerts',
  'UTIL_Baselines',
  'UTIL_DownBoards',
  'UTIL_Drills_Reporting',
  'UTIL_Dumper_Analytics',
  'UTIL_LiveReporting',
  'UTIL_Mappings',
  'UTIL_Misc',
  'UTIL_Parameters',
  'UTIL_Passport',
  'UTIL_Plant_Reporting',
  'UTIL_ProcessKeyedTables',
  'UTIL_RAC',
  'UTIL_Reclaimer_Analytics',
  'UTIL_Reporting',
  'UTIL_Reporting_Output',
  'UTIL_SAP',
  'UTIL_SiteInfo',
  'UTIL_Targets',
  'UTIL_Tyre_Metrics',
  'RDEV'
]

const powerBIReports = ['Speed Dashboard', 'RAC', 'CU']

const spotfireReports = ['Spotfire Tetris', 'Ports & TLO', 'Info Links']

const ssrsReports = ['HTT', 'Maximus', 'Truck Health']

const enemyBullets = ['SELECT *', 'LOCK ON']

const playerBullets = ['truncate', 'drop', 'restart', 'ssis']

const levels: RoundSettings[] = [
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 3 },
        { enemy: PowerBIEnemy, count: 2 }
      ]
    ]
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 7 },
        { enemy: PowerBIEnemy, count: 2 }
      ]
    ]
  },
  {
    waves: [[{ enemy: BossEnemy, count: 1 }]]
  },
  {
    waves: [[{ enemy: BossEnemy, count: 10 }]]
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 3 },
        { enemy: PowerBIEnemy, count: 2 },
        { enemy: SSRSEnemy, count: 4 }
      ],
      [
        { enemy: SSRSEnemy, count: 6 },
        { enemy: SpotfireEnemy, count: 4 }
      ]
    ]
  },
  {
    waves: [[{ enemy: BossEnemy, count: 2 }]]
  },
  {
    waves: [
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 }
      ],
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 }
      ],
      ,
      [
        { enemy: SQLEnemy, count: 6 },
        { enemy: PowerBIEnemy, count: 9 },
        { enemy: SSRSEnemy, count: 5 },
        { enemy: SpotfireEnemy, count: 4 }
      ]
    ]
  }
]

const messagePrefix = [
  'Captain',
  'Officer',
  'Weapons Specalist',
  'Major Sergeant General',
  'Ultimate Mega Badass',
  'Supreme Commander'
]

const chrisList = ['Just', 'Plain', 'Space Cadet', 'Noob', 'Very Naughty Boy']

const bossName = ['Tin Foil Kid']
