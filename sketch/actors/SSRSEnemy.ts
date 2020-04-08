interface SSRSEnemyProps {
  pos: p5.Vector
  vel: p5.Vector
}

class SSRSEnemy extends Enemy {
  constructor({ pos, vel }: SSRSEnemyProps) {
    super({
      name: random(mugCoffees),
      pos,
      vel: vel.mult(2),
      sprite: enemyImage.mug,
      hitPoints: 1,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 100,
      height: 50,
      width: 50,
    })
  }
}
