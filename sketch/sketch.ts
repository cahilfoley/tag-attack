/// <reference path="actors/Enemy.ts"/>
/// <reference path="actors/PlayerShip.ts"/>
/// <reference path="misc/text.ts"/>
/// <reference path="misc/data.ts"/>

let ship: PlayerShip
let backgroundImage: p5.Image

let enemies: Enemy[]
let gameOver: boolean
let killedBy: string
let nextRound: boolean
let victory: boolean
let farewellMessage: Message
let senderPrefix: string
let roundNumber: number
let titleFont: p5.Font
let regularFont: p5.Font
let laserSound: p5.SoundFile
let playerLaserSound: p5.SoundFile
let explosionSound: p5.SoundFile
let smallExplosion: p5.SoundFile
let bossExplosion: p5.SoundFile
let enemyShip: p5.Image
let playerShip: p5.Image
let playerShipShooting: p5.Image
let music: p5.SoundFile
let enemyImage: Record<string, p5.Image>
let tetrisImages: p5.Image[]

interface Sound {
  file: p5.SoundFile
  volume: number
}

let sounds: Sound[]

let score: number

let buttons: ReturnType<typeof setupButtons>

function preload() {
  // Images
  enemyImage = {
    dh: loadImage('images/dh.png'),
    nero: loadImage('images/nero.png'),
    mug: loadImage('images/mug.png'),
    yahava: loadImage('images/yahava.png'),
    steve: loadImage('images/steves-head.png'),
  }
  playerShip = loadImage('images/player.png')
  playerShipShooting = loadImage('images/player-shooting.png')
  backgroundImage = loadImage('images/background.jpg')
  tetrisImages = Array.from({ length: 7 }).map((_, i) =>
    loadImage(`images/tetris-${i}.png`)
  )

  // Fonts
  titleFont = loadFont('fonts/StarJedi.ttf')
  regularFont = loadFont('fonts/OpenSans-Regular.ttf')

  // Sounds
  laserSound = new p5.SoundFile('sounds/laser.wav')
  playerLaserSound = new p5.SoundFile('sounds/pew.wav')
  explosionSound = new p5.SoundFile('sounds/boom.wav')
  music = new p5.SoundFile('sounds/tetris-theme.mp3')
  smallExplosion = new p5.SoundFile('sounds/small-explosion.wav')
  bossExplosion = new p5.SoundFile('sounds/boss-explosion.wav')

  sounds = [
    { file: laserSound, volume: 0.3 },
    { file: playerLaserSound, volume: 0.3 },
    { file: explosionSound, volume: 1 },
    { file: music, volume: 0.1 },
    { file: smallExplosion, volume: 1 },
    { file: bossExplosion, volume: 1 },
  ]

  sounds.forEach((sound) => sound.file.setVolume(sound.volume))
}

interface EnemyConstructor {
  new (...args: any[]): Enemy
}

interface EnemyWave {
  enemy: EnemyConstructor
  count: number
}

interface RoundSettings {
  waves: EnemyWave[][]
}

function startRound(settings: RoundSettings) {
  document.getElementById('messageContainer').classList.add('hidden')
  ship.bullets = []
  nextRound = false

  enemies = []

  // Padding on the left and right sides
  const xPadding = windowWidth * 0.1
  // Calculate gap between enemies using the padding
  const ySpacing = windowHeight / 2 / settings.waves.length

  for (let waveNumber = 0; waveNumber < settings.waves.length; waveNumber++) {
    const wave = settings.waves[waveNumber]
    const xSpacing =
      (windowWidth - xPadding * 2) /
      wave.reduce((total, waveEnemy) => total + waveEnemy.count, 0)

    const allEnemies = shuffle(
      wave.flatMap((enemyType) =>
        Array.from({ length: enemyType.count }).map((_, i) => enemyType.enemy)
      )
    )
    for (let i = 0; i < allEnemies.length; i++) {
      let xPosition = xSpacing * i + xPadding
      let yPosition = ySpacing * waveNumber * 10

      enemies.push(
        new allEnemies[i]({
          pos: createVector(xPosition, -yPosition * random(0.8, 1.2) - 400),
          name: random(yahavaCoffees),
          vel: createVector(random(-1, 1), random(0.5, 2)),
        })
      )
    }
  }
}

function setup() {
  farewellMessages = shuffle(farewellMessages)
  angleMode(RADIANS)
  textAlign(CENTER, CENTER)

  createCanvas(windowWidth, windowHeight)
  rectMode(CORNER)

  gameOver = false

  ship = new PlayerShip({
    pos: createVector(windowWidth / 2, windowHeight - 140),
    height: 120,
    width: 85,
  })

  score = 0
  roundNumber = 0
  victory = false
  buttons = setupButtons()
  startRound(levels[0])
}

function draw() {
  if (music.isLoaded() && !music.isPlaying()) {
    music.setVolume(0.1)
    music.loop()
  }

  if (gameOver) {
    showGameOverMessage(titleFont, score, killedBy)
    buttons.retryButton.classList.remove('hidden')
    noLoop()
    return
  }

  if (nextRound) {
    if (roundNumber >= levels.length) {
      showVictoryMessage(titleFont, score)
      victory = true
      return
    } else {
      showNextRoundMessage(
        titleFont,
        roundNumber,
        farewellMessage,
        senderPrefix
      )
      return
    }
  }

  background(backgroundImage)
  background(0, 150)
  showGameTitle(titleFont)
  showScore(titleFont, score)

  if (keyIsDown(LEFT_ARROW)) ship.moveLeft()
  if (keyIsDown(UP_ARROW)) ship.moveUp()
  if (keyIsDown(RIGHT_ARROW)) ship.moveRight()
  if (keyIsDown(DOWN_ARROW)) ship.moveDown()

  ship.update().draw()

  const newEnemies: Enemy[] = []

  for (const enemy of enemies) {
    enemy.update().draw()

    if (!enemy.active) continue

    const collision = ship.checkBulletCollision(enemy)
    if (collision) {
      ship.bullets = ship.bullets.filter((x) => x !== collision)
      enemy.hitPoints -= ship.damage

      if (enemy.hitPoints <= 0) {
        // Ship getting blown up, don't do anything with it
        score += enemy.score
        enemy.explode()
        continue
      }
    }

    if (enemy.checkBulletCollision(ship)) {
      explosionSound.play()
      gameOver = true
      killedBy = enemy.name
    }

    newEnemies.push(enemy)
  }

  if (newEnemies.length === 0) {
    roundNumber++
    farewellMessage = farewellMessages[roundNumber % farewellMessages.length]

    senderPrefix =
      farewellMessage.sender == 'Boxy'
        ? random(chrisList)
        : random(messagePrefix)

    nextRound = true
    buttons.continueButton.classList.remove('hidden')
  }

  enemies = newEnemies
}

let chainingSecret = false

function keyPressed() {
  if (key === ' ') {
    ship.shoot()
  } else if (key === 'f') {
    chainingSecret = true
  } else if (key === 'j' && chainingSecret) {
    alert('You better be a dev 😒')
    ship.bulletsPerShot += 20
    ship.damage += 20
    ship.vel = createVector(ship.vel.x, ship.vel.y).limit(10)
    ship.dragForce = 0
  } else {
    chainingSecret = false
  }
}
