interface SpotfireEnemyProps {
  vel: p5.Vector
  pos: p5.Vector
}

class SpotfireEnemy extends Enemy {
  constructor({ pos, vel }: SpotfireEnemyProps) {
    super({
      name: random(dhCoffees),
      pos,
      vel,
      spritePath: 'images/dh.png',
      hitPoints: 2,
      fireRate: 0.5,
      bulletsPerShot: 1,
      score: 150,
      height: 50,
      width: 50
    })
  }
}
