/// <reference path="Enemy.ts"/>

class ChrisBossEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: 'Pout Man',
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.chris,
      hitPoints: 10,
      fireRate: 1,
      bulletsPerShot: 3,
      score: 800,
      height: 250,
      width: 200,
    })
  }

  explode() {
    bossExplosion.play()
  }
}

class SteveBossEnemy extends Enemy {
  constructor({ pos, vel }: EnemyProps) {
    super({
      name: 'Tinfoil Kid',
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.steve,
      hitPoints: 15,
      fireRate: 1,
      bulletsPerShot: 5,
      score: 800,
      height: 250,
      width: 250,
    })
  }

  explode() {
    bossExplosion.play()
  }
}
