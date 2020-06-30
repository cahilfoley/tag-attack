/// <reference path="Enemy.ts"/>

class CollingwoodEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: random([
        'Scott Pendlebury',
        'Steele Sidebottom',
        'Jeremy Howe',
        'Taylor Adams',
        'Ben Reid',
      ]),
      pos,
      vel,
      sprite: enemyImage.collingwood,
      hitPoints: 2,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 150,
      height: 50,
      width: 50,
    })
  }
}

class DockersEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: random([
        'Nat Fyfe',
        'Brennan Cox',
        'Adam Cerra',
        'Caleb Serong',
        'Hayden Young',
      ]),
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.dockers,
      hitPoints: 1,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 100,
      height: 50,
      width: 50,
    })
  }
}

class PortEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: random([
        'Tom Jonas',
        'Ollie Wines',
        'Travis Boak',
        'Connor Rozee',
        'Trent McKenzie',
      ]),
      pos,
      vel,
      sprite: enemyImage.port,
      hitPoints: 2,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 200,
      height: 50,
      width: 50,
    })
  }
}

class EssendonEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: random([
        'Dyson Heppell',
        'Cale Hooker',
        'Kyle Langford',
        'Martin Gleeson',
        'Zach Merrett',
      ]),
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.essendon,
      hitPoints: 1,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 100,
      height: 50,
      width: 50,
    })
  }
}
