/// <reference path="actors/Enemy.ts"/>
/// <reference path="actors/PlayerShip.ts"/>
/// <reference path="misc/text.ts"/>
/// <reference path="misc/data.ts"/>

let ship: PlayerShip
let backgroundImage: p5.Image

let enemies: Enemy[]
let gameOver: boolean
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
let music: p5.SoundFile

let score: number

let buttons: ReturnType<typeof setupButtons>

function preload() {
  backgroundImage = loadImage('images/background.png')
  titleFont = loadFont('fonts/StarJedi.ttf')
  regularFont = loadFont('fonts/OpenSans-Regular.ttf')
  laserSound = new p5.SoundFile('sounds/laser.wav')
  laserSound.setVolume(0.3)
  playerLaserSound = new p5.SoundFile('sounds/pew.wav')
  playerLaserSound.setVolume(0.3)
  explosionSound = new p5.SoundFile('sounds/boom.wav')
  playerShip = loadImage('images/fj.png')
  music = new p5.SoundFile('sounds/midnight-chase.mp3')
  smallExplosion = new p5.SoundFile('sounds/small-explosion.wav')
  bossExplosion = new p5.SoundFile('sounds/boss-explosion.wav')
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
      wave.flatMap(enemyType =>
        Array.from({ length: enemyType.count }).map((_, i) => enemyType.enemy)
      )
    )
    for (let i = 0; i < allEnemies.length; i++) {
      let xPosition = xSpacing * i + xPadding
      let yPosition = ySpacing * waveNumber * 10

      enemies.push(
        new allEnemies[i]({
          pos: createVector(xPosition, -yPosition * random(0.8, 1.2) - 400),
          name: random(dbNames),
          vel: createVector(random(-1, 1), random(0.5, 2))
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
  rectMode(CENTER)

  gameOver = false

  ship = new PlayerShip({
    pos: createVector(windowWidth / 2, windowHeight - 140),
    height: 120,
    width: 85
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
    showGameOverMessage(titleFont, score)
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
  showGameTitle(titleFont)
  showScore(titleFont, score)

  if (keyIsDown(LEFT_ARROW)) ship.moveLeft()
  if (keyIsDown(RIGHT_ARROW)) ship.moveRight()

  ship.update().draw()

  const newEnemies: Enemy[] = []

  for (const enemy of enemies) {
    if (!enemy.active) continue

    const collision = ship.checkBulletCollision(enemy)
    if (collision) {
      ship.bullets = ship.bullets.filter(x => x !== collision)
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
    }

    newEnemies.push(enemy.update().draw())
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
