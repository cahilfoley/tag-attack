interface SSRSEnemyProps {
  pos: p5.Vector
  vel: p5.Vector
}

class BossEnemy extends Enemy {
  constructor({ pos, vel }: SSRSEnemyProps) {
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
