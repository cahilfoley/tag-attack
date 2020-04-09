/// <reference path="Enemy.ts"/>

interface DHEnemyProps {
  vel: p5.Vector
  pos: p5.Vector
}

class DHEnemy extends Enemy {
  constructor({ pos, vel }: DHEnemyProps) {
    super({
      name: random(dhCoffees),
      pos,
      vel,
      sprite: enemyImage.dh,
      hitPoints: 2,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 150,
      height: 50,
      width: 50,
    })
  }
}
