/// <reference path="Enemy.ts"/>

interface ChrisBossEnemyProps {
  pos: p5.Vector
  vel: p5.Vector
}

class ChrisBossEnemy extends Enemy {
  constructor({ pos, vel }: ChrisBossEnemyProps) {
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
