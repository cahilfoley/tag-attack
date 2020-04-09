/// <reference path="Enemy.ts"/>

interface YahavaEnemyProps {
  pos: p5.Vector
  vel: p5.Vector
}

class YahavaEnemy extends Enemy {
  constructor({ pos, vel }: YahavaEnemyProps) {
    super({
      name: random(yahavaCoffees),
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.yahava,
      hitPoints: 1,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 100,
      height: 50,
      width: 50,
    })
  }
}
