/// <reference path="Enemy.ts"/>

interface NeroEnemyProps {
  vel: p5.Vector
  pos: p5.Vector
}

class NeroEnemy extends Enemy {
  constructor({ pos, vel }: NeroEnemyProps) {
    super({
      name: random(neroCoffees),
      pos,
      vel,
      sprite: enemyImage.nero,
      hitPoints: 2,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 200,
      height: 50,
      width: 50,
    })
  }
}
