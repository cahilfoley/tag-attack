interface SQLEnemyProps {
  pos: p5.Vector
  vel: p5.Vector
}

class SQLEnemy extends Enemy {
  constructor({ pos, vel }: SQLEnemyProps) {
    super({
      name: random(dbNames),
      pos,
      vel: vel.mult(2),
      spritePath: 'images/sql.png',
      hitPoints: 1,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 100,
      height: 50,
      width: 50
    })
  }
}
