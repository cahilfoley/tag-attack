class Mover {
    constructor({ pos, height, width, vel }) {
        this.active = true;
        this.pos = pos;
        this.vel = vel || createVector();
        this.acc = createVector();
        this.height = height;
        this.width = width;
    }
    get isOffScreen() {
        return (this.right < 0 ||
            this.left > windowWidth ||
            this.bottom < 0 ||
            this.top > windowHeight);
    }
    get left() {
        return this.pos.x;
    }
    get right() {
        return this.left + this.width;
    }
    get top() {
        return this.pos.y;
    }
    get bottom() {
        return this.top + this.height;
    }
    checkCollision(object) {
        return (object.right > this.left &&
            object.left < this.right &&
            object.bottom > this.top &&
            object.top < this.bottom);
    }
    applyForce(force) {
        this.acc.add(force);
        return this;
    }
    move() {
        this.vel.add(this.acc);
        this.acc.mult(0);
        this.pos.add(this.vel);
        return this;
    }
    update() {
        this.move();
        return this;
    }
}
class SpriteMover extends Mover {
    constructor({ spritePath, ...config }) {
        super(config);
        this.sprite = loadImage(spritePath);
    }
    draw() {
        image(this.sprite, this.pos.x, this.pos.y, this.width, this.height);
        return this;
    }
}
class Bullet extends SpriteMover {
    constructor({ font, text, ...config }) {
        super({ ...config, spritePath: './images/bullet.png' });
        this.font = font;
        this.text = text;
    }
    move() {
        super.move();
        if (this.isOffScreen) {
            this.active = false;
        }
        return this;
    }
    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        fill(255);
        textFont(this.font);
        textSize(16);
        text(this.text, 0, 0);
        pop();
        return this;
    }
}
var BulletSpawnPosition;
(function (BulletSpawnPosition) {
    BulletSpawnPosition[BulletSpawnPosition["TOP"] = 0] = "TOP";
    BulletSpawnPosition[BulletSpawnPosition["BOTTOM"] = 1] = "BOTTOM";
})(BulletSpawnPosition || (BulletSpawnPosition = {}));
class Ship extends SpriteMover {
    constructor({ bulletFont, bulletTextOptions, bulletVelocity, bulletsSpawnFrom, bulletsPerShot, hitPoints, customLaserSound = laserSound, ...config }) {
        super(config);
        this.leftForce = createVector(-0.4, 0);
        this.rightForce = createVector(0.4, 0);
        this.damage = 1;
        this.bullets = [];
        this.bulletVelocity = bulletVelocity;
        this.bulletsSpawnFrom = bulletsSpawnFrom;
        this.bulletFont = bulletFont;
        this.bulletTextOptions = bulletTextOptions;
        this.bulletsPerShot = bulletsPerShot;
        this.hitPoints = hitPoints;
        this.laserSound = customLaserSound;
    }
    moveLeft() {
        return this.applyForce(this.leftForce);
    }
    moveRight() {
        return this.applyForce(this.rightForce);
    }
    update() {
        super.update();
        this.bullets = this.bullets.filter(x => x.active).map(x => x.update());
        return this;
    }
    draw() {
        super.draw();
        this.bullets.forEach((x, i) => {
            x.draw();
        });
        return this;
    }
    shoot() {
        if (!this.isOffScreen) {
            this.laserSound.play();
        }
        const bulletText = random(this.bulletTextOptions);
        let radiusPerShot = HALF_PI / (this.bulletsPerShot - 1);
        push();
        for (let i = 0; i < this.bulletsPerShot; i++) {
            const bulletPosition = this.pos.copy().add(this.width / 2);
            if (this.bulletsSpawnFrom === 1) {
                bulletPosition.set(bulletPosition.x, this.bottom);
            }
            const bulletVelocity = this.bulletVelocity.copy();
            if (this.bulletsPerShot > 1) {
                bulletVelocity.rotate(radiusPerShot * i - HALF_PI / 2);
            }
            const bullet = new Bullet({
                pos: bulletPosition,
                vel: bulletVelocity,
                height: 15,
                width: 5,
                text: bulletText,
                font: this.bulletFont
            });
            this.bullets.push(bullet);
        }
        pop();
    }
    checkBulletCollision(object) {
        return this.bullets.find(bullet => object.checkCollision(bullet));
    }
}
class Enemy extends Ship {
    constructor({ name, score, fireRate, spritePath, ...config }) {
        super({
            ...config,
            spritePath,
            bulletVelocity: createVector(0, 10),
            bulletsSpawnFrom: 1,
            bulletFont: regularFont,
            bulletTextOptions: enemyBullets,
            customLaserSound: laserSound
        });
        this.nextShotAtFrame = Math.floor(random(150));
        this.nextDirectionChangeAtFrame = Math.floor(random(400));
        this.name = name;
        this.score = score;
        this.fireRate = fireRate;
    }
    move() {
        super.move();
        if (this.right > windowWidth - 10) {
            this.vel.set(-2, this.vel.y);
        }
        else if (this.left < 10) {
            this.vel.set(2, this.vel.y);
        }
        return this;
    }
    update() {
        super.update();
        if (this.top > windowHeight) {
            this.active = false;
        }
        if (frameCount >= this.nextShotAtFrame && !this.isOffScreen) {
            this.shoot();
            this.nextShotAtFrame = frameCount + random(500 / this.fireRate);
        }
        if (frameCount >= this.nextDirectionChangeAtFrame) {
            this.vel = createVector(random(-1, 1), random(0.5, 2));
            this.nextDirectionChangeAtFrame = frameCount + random(400);
        }
        return this;
    }
    explode() {
        smallExplosion.play();
    }
    draw() {
        super.draw();
        textSize(16);
        noStroke();
        textFont(regularFont);
        fill(255);
        text(this.name.toUpperCase(), this.left + this.width / 2, this.bottom + 16);
        return this;
    }
}
class PlayerShip extends Ship {
    constructor(config) {
        super({
            ...config,
            spritePath: './images/player.png',
            bulletVelocity: createVector(0, -10),
            bulletsSpawnFrom: 0,
            bulletFont: titleFont,
            bulletTextOptions: playerBullets,
            customLaserSound: playerLaserSound,
            bulletsPerShot: 1,
            hitPoints: 1
        });
        this.dragForce = 0.03;
        this.vel.limit(1);
    }
    move() {
        super.move();
        this.vel.mult(1 - this.dragForce);
        if (this.left < 0 || this.right > windowWidth) {
            this.vel.mult(-1);
            this.pos.add(this.vel);
        }
        return this;
    }
}
function showGameOverMessage(font, score, killedBy) {
    push();
    background(0, 150);
    fill(255);
    textFont(font);
    textStyle(BOLD);
    stroke(150, 50, 50);
    strokeWeight(10);
    textSize(150);
    text('game over', windowWidth / 2, windowHeight / 2 - 75);
    textSize(50);
    text(`your score: ${score}`, windowWidth / 2, windowHeight / 2 + 50);
    textSize(35);
    textFont(regularFont);
    strokeWeight(2);
    text(`You were killed by: ${killedBy}`, windowWidth / 2, windowHeight / 2 + 125);
    pop();
}
function showNextRoundMessage(font, roundNumber, message, prefix) {
    push();
    background(0, 150);
    fill(255);
    textFont(font);
    textStyle(BOLD);
    stroke(150, 50, 50);
    strokeWeight(10);
    textSize(150);
    text(`round ${roundNumber + 1}`, windowWidth / 2, windowHeight / 3);
    const messageBox = document.getElementById('messageContainer');
    const messageContent = document.getElementById('message');
    messageBox.classList.remove('hidden');
    messageContent.innerHTML = message.content;
    const transmissionContent = document.getElementById('transmission');
    transmissionContent.innerHTML = `Incomming Transmission from ${prefix} ${message.sender}`;
    pop();
}
function showGameTitle(font) {
    push();
    stroke(255, 232, 31);
    noFill();
    strokeWeight(4);
    textFont(font);
    textSize(80);
    textStyle(BOLD);
    text(`fj's data blaster`, windowWidth / 2, 50);
    pop();
}
function showScore(font, score) {
    push();
    stroke(255, 232, 31);
    noFill();
    strokeWeight(2);
    textFont(font);
    textSize(35);
    textStyle(BOLD);
    text(`score: ${score}`, windowWidth - 200, 50);
    pop();
}
function showVictoryMessage(font, score) {
    push();
    background(0, 150);
    fill(255);
    textFont(font);
    textStyle(BOLD);
    stroke(150, 50, 50);
    strokeWeight(10);
    textSize(150);
    textSize(50);
    text(`victory - well done`, windowWidth / 2, windowHeight / 2 - 75);
    textSize(50);
    text(`total score: ${score}`, windowWidth / 2, windowHeight / 2 + 50);
    pop();
}
function messages(font, message) {
    rect(windowWidth / 2, windowHeight / 2, 200, 200);
    fill('lightGrey');
}
class BossEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: 'Tinfoil Kid',
            pos,
            vel: vel.mult(2),
            spritePath: 'images/steves-head.png',
            hitPoints: 15,
            fireRate: 1,
            bulletsPerShot: 5,
            score: 800,
            height: 250,
            width: 250
        });
    }
    explode() {
        bossExplosion.play();
    }
}
class PowerBIEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random(neroCoffees),
            pos,
            vel,
            spritePath: 'images/nero.png',
            hitPoints: 2,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 200,
            height: 50,
            width: 50
        });
    }
}
class SSRSEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random(mugCoffees),
            pos,
            vel: vel.mult(2),
            spritePath: 'images/mug.png',
            hitPoints: 1,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 100,
            height: 50,
            width: 50
        });
    }
}
class SQLEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random(yahavaCoffees),
            pos,
            vel: vel.mult(2),
            spritePath: 'images/yahava.png',
            hitPoints: 1,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 100,
            height: 50,
            width: 50
        });
    }
}
class SpotfireEnemy extends Enemy {
    constructor({ pos, vel }) {
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
        });
    }
}
const yahavaCoffees = [
    'Caffe Americano',
    'Cafe Latte ',
    'Cappuccino',
    'Espresso',
    'Flat White',
    'Long Black',
];
const neroCoffees = [
    'Macchiato',
    'Piccolo Latte',
    'Mochaccino',
    'Vienna',
    'Affogato',
];
const dhCoffees = [
    'Cafe Latte ',
    'Cappuccino',
    'Espresso',
    'Vienna',
    'Fancy Pants Drip Coffee'
];
const mugCoffees = ['OC', 'LVL 17', 'Instant '];
const enemyBullets = ['SELECT *', 'LOCK ON'];
const playerBullets = ['truncate', 'drop', 'restart', 'ssis'];
const levels = [
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 3 },
                { enemy: PowerBIEnemy, count: 2 }
            ]
        ]
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 7 },
                { enemy: PowerBIEnemy, count: 2 }
            ]
        ]
    },
    {
        waves: [[{ enemy: BossEnemy, count: 1 }]]
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 3 },
                { enemy: PowerBIEnemy, count: 2 },
                { enemy: SSRSEnemy, count: 4 }
            ],
            [
                { enemy: SSRSEnemy, count: 6 },
                { enemy: SpotfireEnemy, count: 4 }
            ]
        ]
    },
    {
        waves: [[{ enemy: BossEnemy, count: 2 }]]
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 }
            ],
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 }
            ],
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 }
            ]
        ]
    },
    {
        waves: [[{ enemy: BossEnemy, count: 10 }]]
    }
];
const messagePrefix = [
    'Captain',
    'Officer',
    'Weapons Specalist',
    'Major Sergeant General',
    'Ultimate Mega Badass',
    'Supreme Commander'
];
const chrisList = ['Just', 'Plain', 'Space Cadet', 'Noob', 'Very Naughty Boy'];
const bossName = ['Tin Foil Kid'];
let ship;
let backgroundImage;
let enemies;
let gameOver;
let killedBy;
let nextRound;
let victory;
let farewellMessage;
let senderPrefix;
let roundNumber;
let titleFont;
let regularFont;
let laserSound;
let playerLaserSound;
let explosionSound;
let smallExplosion;
let bossExplosion;
let enemyShip;
let playerShip;
let music;
let score;
let buttons;
function preload() {
    backgroundImage = loadImage('images/background.jpg');
    titleFont = loadFont('fonts/StarJedi.ttf');
    regularFont = loadFont('fonts/OpenSans-Regular.ttf');
    laserSound = new p5.SoundFile('sounds/laser.wav');
    laserSound.setVolume(0.3);
    playerLaserSound = new p5.SoundFile('sounds/pew.wav');
    playerLaserSound.setVolume(0.3);
    explosionSound = new p5.SoundFile('sounds/boom.wav');
    playerShip = loadImage('images/player.png');
    music = new p5.SoundFile('sounds/tetris-theme.mp3');
    music.setVolume(0.1);
    smallExplosion = new p5.SoundFile('sounds/small-explosion.wav');
    bossExplosion = new p5.SoundFile('sounds/boss-explosion.wav');
}
function startRound(settings) {
    document.getElementById('messageContainer').classList.add('hidden');
    ship.bullets = [];
    nextRound = false;
    enemies = [];
    const xPadding = windowWidth * 0.1;
    const ySpacing = windowHeight / 2 / settings.waves.length;
    for (let waveNumber = 0; waveNumber < settings.waves.length; waveNumber++) {
        const wave = settings.waves[waveNumber];
        const xSpacing = (windowWidth - xPadding * 2) /
            wave.reduce((total, waveEnemy) => total + waveEnemy.count, 0);
        const allEnemies = shuffle(wave.flatMap((enemyType) => Array.from({ length: enemyType.count }).map((_, i) => enemyType.enemy)));
        for (let i = 0; i < allEnemies.length; i++) {
            let xPosition = xSpacing * i + xPadding;
            let yPosition = ySpacing * waveNumber * 10;
            enemies.push(new allEnemies[i]({
                pos: createVector(xPosition, -yPosition * random(0.8, 1.2) - 400),
                name: random(yahavaCoffees),
                vel: createVector(random(-1, 1), random(0.5, 2)),
            }));
        }
    }
}
function setup() {
    farewellMessages = shuffle(farewellMessages);
    angleMode(RADIANS);
    textAlign(CENTER, CENTER);
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER);
    gameOver = false;
    ship = new PlayerShip({
        pos: createVector(windowWidth / 2, windowHeight - 140),
        height: 120,
        width: 85,
    });
    score = 0;
    roundNumber = 0;
    victory = false;
    buttons = setupButtons();
    startRound(levels[0]);
}
function draw() {
    if (music.isLoaded() && !music.isPlaying()) {
        music.setVolume(0.1);
        music.loop();
    }
    if (gameOver) {
        showGameOverMessage(titleFont, score, killedBy);
        buttons.retryButton.classList.remove('hidden');
        noLoop();
        return;
    }
    if (nextRound) {
        if (roundNumber >= levels.length) {
            showVictoryMessage(titleFont, score);
            victory = true;
            return;
        }
        else {
            showNextRoundMessage(titleFont, roundNumber, farewellMessage, senderPrefix);
            return;
        }
    }
    background(backgroundImage);
    background(0, 150);
    showGameTitle(titleFont);
    showScore(titleFont, score);
    if (keyIsDown(LEFT_ARROW))
        ship.moveLeft();
    if (keyIsDown(RIGHT_ARROW))
        ship.moveRight();
    ship.update().draw();
    const newEnemies = [];
    for (const enemy of enemies) {
        if (!enemy.active)
            continue;
        const collision = ship.checkBulletCollision(enemy);
        if (collision) {
            ship.bullets = ship.bullets.filter((x) => x !== collision);
            enemy.hitPoints -= ship.damage;
            if (enemy.hitPoints <= 0) {
                score += enemy.score;
                enemy.explode();
                continue;
            }
        }
        if (enemy.checkBulletCollision(ship)) {
            explosionSound.play();
            gameOver = true;
            killedBy = enemy.name;
        }
        newEnemies.push(enemy.update().draw());
    }
    if (newEnemies.length === 0) {
        roundNumber++;
        farewellMessage = farewellMessages[roundNumber % farewellMessages.length];
        senderPrefix =
            farewellMessage.sender == 'Boxy'
                ? random(chrisList)
                : random(messagePrefix);
        nextRound = true;
        buttons.continueButton.classList.remove('hidden');
    }
    enemies = newEnemies;
}
let chainingSecret = false;
function keyPressed() {
    if (key === ' ') {
        ship.shoot();
    }
    else if (key === 'f') {
        chainingSecret = true;
    }
    else if (key === 'j' && chainingSecret) {
        alert('You better be a dev 😒');
        ship.bulletsPerShot += 20;
        ship.damage += 20;
        ship.vel = createVector(ship.vel.x, ship.vel.y).limit(10);
        ship.dragForce = 0;
    }
    else {
        chainingSecret = false;
    }
}
function setupButtons() {
    const muteButton = document.getElementById('mute');
    let muted = false;
    muteButton.onclick = function (event) {
        if (muted) {
            music.setVolume(0.1);
            explosionSound.setVolume(1);
            laserSound.setVolume(0.4);
            playerLaserSound.setVolume(0.6);
            muted = false;
            muteButton.classList.remove('muted');
        }
        else {
            music.setVolume(0);
            explosionSound.setVolume(0);
            laserSound.setVolume(0);
            playerLaserSound.setVolume(0);
            muted = true;
            muteButton.classList.add('muted');
        }
    };
    const retryButton = document.getElementById('retry');
    retryButton.onclick = function (event) {
        setup();
        loop();
        retryButton.classList.add('hidden');
    };
    const continueButton = document.getElementById('continue');
    continueButton.onclick = function (event) {
        startRound(levels[roundNumber]);
        continueButton.classList.add('hidden');
    };
    const exitButton = document.getElementById('exit');
    exitButton.onclick = function () {
        require('electron')
            .remote.getCurrentWindow()
            .close();
    };
    return { continueButton, exitButton, muteButton, retryButton };
}
let farewellMessages = [
    {
        content: trimmed `
      Dear FJ,
      <br/><br/>
      It was such a great pleasure working with you.<br/>
      Words are not enough to express how grateful and blessed we are for having you in the team.<br/>
      You have been a great team player, coach and ARBIA lead to the team, including me, and you have assisted us tremendously with ARBIA and improving our servers.<br/>
      I personally have learnt a lot from you around the architecture.<br/>
      Once again, thank you for your great support and contribution. Perth is small. So, I’m sure we will meet again.<br/>
      Take care of yourself and your family, and Good luck in your new and upcoming projects.<br/>
      God bless,<br/>
      <br/>
      Tina
    `,
        sender: 'Tina'
    },
    {
        content: trimmed `
      Yooo,<br/>
  <br/>
      This definitely isnt goodbye since were in the same team.... but its been awesome working in the AMES team with you. Thanks for listening to my pre-coffee rambles, and for always somehow figuring out easy fixes to my annoying DAX and SQL problems.<br/>
      Heres to more coffee catchups in the (hopefully) near future<br/>
      Thanks for everything!<br/>
  <br/>
      Ayesha
    `,
        sender: 'Ayesha'
    },
    {
        content: trimmed `
      See yaaa FJ !!
  <br/><br/>
      Not only have I enjoyed working with you, but I have also gained a lot of experience. Thank you for your support and kindness.<br/>
      I wish you the best of luck and continued success whereever you may find yourself.<br/>
  <br/>
      With all good wishes,<br/>
  <br/>
      Sharief
    `,
        sender: 'Sharief'
    },
    {
        content: trimmed `
      Hola FJ!<br/>
        <br/>
      Thank you so much for all the mentoring you have provided and the laughs shared. I wish you all the best with your next project and hope you miss us so terribly that you come back once its done. Stay safe you rock-star.<br/>
      Yours from afar,<br/>
      <br/>
      Boxy
    `,
        sender: 'Boxy',
        prefix: 'Space Cadet'
    },
    {
        content: trimmed `
      BYEEEEEEEEEEEE FJ!!
      <br/><br/>
      It has been a pleasure fighting with you for the last (Cant even remember how long.. its been a long time).
      I’ll miss coming over to you and bypassing our beloved RTTMS system to get AUPERSQL117 in tip top shape when it falls over, although we haven’t directly worked with each other much, we can always rely on 117s problems to bring us together J
      But on a serious note, your thorough understanding of the teams architecture and the developments you have made to make 117 usable is really commendable and I thank you for your hard work (We all know it probably some of the most stressful stuff) you will be missed thoroughly.
      Yours truly, the annoying guy who comes to you to fix things J
      <br/><br/>
      Kent
    `,
        sender: 'Kent'
    },
    {
        content: trimmed `
      Hi FJ,
      <br/>
      <br/>
      Thanks for all your time and help with SQL, SSRS, PowerBI.... well <span class='flashing'><em>everything!</em></span> You have been a great source of information and your input is always highly valued.
      <br/>
      <br/>
      I ran of out words and used them all on building this with <span class='flashing'>Cahil</span> . 
      <br/>
      <br/>
      Stay in touch and enjoy your game,
      <br/>
      <br/>
      <span class='flashing'>Steve</span>
      `,
        sender: `<span class='flashing'>Steve</span>`
    },
    {
        content: trimmed `
      Hey Database Super-Guru,
      <br/>
      <br/>
      Thanks for all your help over what feels like years now, youve been an absolute star when weve been under the pump. You will be sorely missed, I only wish that I got to work with you more!
      <br/>
      <br/>
      I dont think words can really do it justice so I hope this game that Steve and I made for you sums it up.
      <br/>
      <br/>
      All the best for everything the future holds, I hope our (atleast virtual) paths cross again one day!
      <br/>
      <br/>
      <span class='flashing'>Cahil</span>
    `,
        sender: `<span class='flashing'>Cahil</span>`
    },
    {
        content: trimmed `
      Hey FJ,
      <br/>
      <br/>
      Thanks for all your help and for the coffee chats every morning
      <br/>
      See you on the other side
      <br/>
      <br/>
      Matt
    `,
        sender: 'Matt'
    },
    {
        content: trimmed `
      FJ you provided great coaching to the team with your diverse experience in IST industry.
      <br/>
      <br/>
      It is our loss, however I am sure we will cross paths on future project opportunities.
    `,
        sender: 'Prateek'
    }
];
function trimLines(string) {
    return string
        .split(/\n|\r|\r\n/g)
        .map(line => line.trim())
        .join('\n')
        .trim();
}
function trimmed(stringParts, ...variables) {
    if (typeof stringParts === 'string')
        return trimLines(stringParts);
    const allParts = [];
    for (const index in stringParts) {
        allParts.push(stringParts[index]);
        allParts.push(variables[index]);
    }
    return trimLines(allParts.join(''));
}
//# sourceMappingURL=build.js.map