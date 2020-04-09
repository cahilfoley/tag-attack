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
        return (object.right > this.left + 10 &&
            object.left < this.right - 10 &&
            object.bottom > this.top + 20 &&
            object.top < this.bottom - 20);
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
    constructor({ spritePath, sprite, ...config }) {
        super(config);
        this.sprite = sprite || (spritePath && loadImage(spritePath));
    }
    draw({ x = this.pos.x, y = this.pos.y, sprite = this.sprite } = {}) {
        image(sprite, x, y, this.width, this.height);
        return this;
    }
}
class Bullet extends SpriteMover {
    static getSpriteImage() {
        return random(tetrisImages);
    }
    constructor(config) {
        super({ ...config, sprite: Bullet.getSpriteImage() });
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
        rotate(PI / 2);
        super.draw({ x: 0, y: 0 });
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
    constructor({ bulletVelocity, bulletsSpawnFrom, bulletsPerShot, hitPoints, customLaserSound = laserSound, ...config }) {
        super(config);
        this.upForce = createVector(0, -0.4);
        this.leftForce = createVector(-0.4, 0);
        this.downForce = createVector(0, 0.4);
        this.rightForce = createVector(0.4, 0);
        this.damage = 1;
        this.bullets = [];
        this.bulletVelocity = bulletVelocity;
        this.bulletsSpawnFrom = bulletsSpawnFrom;
        this.bulletsPerShot = bulletsPerShot;
        this.hitPoints = hitPoints;
        this.maxHitPoints = hitPoints;
        this.laserSound = customLaserSound;
    }
    moveUp() {
        return this.applyForce(this.upForce);
    }
    moveLeft() {
        return this.applyForce(this.leftForce);
    }
    moveDown() {
        return this.applyForce(this.downForce);
    }
    moveRight() {
        return this.applyForce(this.rightForce);
    }
    update() {
        super.update();
        this.bullets = this.bullets.filter((x) => x.active).map((x) => x.update());
        return this;
    }
    draw(...args) {
        super.draw(...args);
        this.bullets.forEach((x) => x.draw());
        return this;
    }
    shoot() {
        if (!this.isOffScreen) {
            this.laserSound.play();
        }
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
                height: 40,
                width: 20,
            });
            this.bullets.push(bullet);
        }
        pop();
    }
    checkBulletCollision(object) {
        return this.bullets.find((bullet) => object.checkCollision(bullet));
    }
}
class Enemy extends Ship {
    constructor({ name, score, fireRate, sprite, ...config }) {
        super({
            ...config,
            sprite,
            bulletVelocity: createVector(0, 10),
            bulletsSpawnFrom: 1,
            customLaserSound: laserSound,
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
        const sectionWidth = this.width / this.maxHitPoints;
        const healthPercentage = this.hitPoints / this.maxHitPoints;
        if (healthPercentage > 0.5) {
            fill(100, 255, 100, 150);
        }
        else {
            fill(255, 0, 0, 150);
        }
        for (let i = 0; i < this.hitPoints; i++) {
            rect(this.left + sectionWidth * i, this.top - 10, sectionWidth - 2, 4);
        }
        return this;
    }
}
class PlayerShip extends Ship {
    constructor(config) {
        super({
            ...config,
            sprite: playerShip,
            bulletVelocity: createVector(0, -10),
            bulletsSpawnFrom: 0,
            customLaserSound: playerLaserSound,
            bulletsPerShot: 1,
            hitPoints: 1,
        });
        this.dragForce = 0.03;
        this.lastShot = 0;
        this.vel.limit(1);
    }
    shoot() {
        super.shoot();
        this.lastShot = frameCount;
        return this;
    }
    move() {
        super.move();
        this.vel.mult(1 - this.dragForce);
        if (this.left < 0 || this.right > windowWidth) {
            this.vel.x = -this.vel.x;
            this.pos.x += this.vel.x;
        }
        if (this.top < 0 || this.bottom > windowHeight) {
            this.vel.y = -this.vel.y;
            this.pos.y += this.vel.y;
        }
        return this;
    }
    draw() {
        if (frameCount - this.lastShot < 10) {
            super.draw({ sprite: playerShipShooting });
        }
        else {
            super.draw();
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
    transmissionContent.innerHTML = `${prefix} ${message.sender} wants to grab a coffee with you`;
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
    text(`ayesha's coffee shot`, windowWidth / 2, 50);
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
            sprite: enemyImage.steve,
            hitPoints: 15,
            fireRate: 1,
            bulletsPerShot: 5,
            score: 800,
            height: 250,
            width: 250,
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
            sprite: enemyImage.nero,
            hitPoints: 2,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 200,
            height: 50,
            width: 50,
        });
    }
}
class SSRSEnemy extends Enemy {
    constructor({ pos, vel }) {
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
        });
    }
}
class SQLEnemy extends Enemy {
    constructor({ pos, vel }) {
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
        });
    }
}
class SpotfireEnemy extends Enemy {
    constructor({ pos, vel }) {
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
    'Fancy Pants Drip Coffee',
];
const mugCoffees = ['OC', 'LVL 17', 'Instant '];
const levels = [
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 3 },
                { enemy: PowerBIEnemy, count: 2 },
            ],
        ],
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 7 },
                { enemy: PowerBIEnemy, count: 2 },
            ],
        ],
    },
    {
        waves: [[{ enemy: BossEnemy, count: 1 }]],
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 3 },
                { enemy: PowerBIEnemy, count: 2 },
                { enemy: SSRSEnemy, count: 4 },
            ],
            [
                { enemy: SSRSEnemy, count: 6 },
                { enemy: SpotfireEnemy, count: 4 },
            ],
        ],
    },
    {
        waves: [[{ enemy: BossEnemy, count: 2 }]],
    },
    {
        waves: [
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 },
            ],
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 },
            ],
            [
                { enemy: SQLEnemy, count: 6 },
                { enemy: PowerBIEnemy, count: 9 },
                { enemy: SSRSEnemy, count: 5 },
                { enemy: SpotfireEnemy, count: 4 },
            ],
        ],
    },
    {
        waves: [[{ enemy: BossEnemy, count: 10 }]],
    },
];
const messagePrefix = [
    'Loud Sipper',
    'Chief Sipper',
    'Coffee Snob',
    'Barista Wannabe',
];
const chrisList = ['Just', 'Plain', 'Blend 43',];
const bossName = ['Tin Foil Kid'];
let enemies;
let gameOver;
let killedBy;
let nextRound;
let victory;
let farewellMessage;
let senderPrefix;
let roundNumber;
let roundEnded;
let ship;
let backgroundImage;
let enemyShip;
let playerShip;
let playerShipShooting;
let enemyImage;
let tetrisImages;
let titleFont;
let regularFont;
let laserSound;
let playerLaserSound;
let explosionSound;
let smallExplosion;
let bossExplosion;
let music;
let roundEndSounds;
let sounds;
let score;
let buttons;
function preload() {
    enemyImage = {
        dh: loadImage('images/dh.png'),
        nero: loadImage('images/nero.png'),
        mug: loadImage('images/mug.png'),
        yahava: loadImage('images/yahava.png'),
        steve: loadImage('images/steves-head.png'),
    };
    playerShip = loadImage('images/player.png');
    playerShipShooting = loadImage('images/player-shooting.png');
    backgroundImage = loadImage('images/background.jpg');
    tetrisImages = Array.from({ length: 7 }).map((_, i) => loadImage(`images/tetris-${i}.png`));
    titleFont = loadFont('fonts/StarJedi.ttf');
    regularFont = loadFont('fonts/OpenSans-Regular.ttf');
    laserSound = new p5.SoundFile('sounds/laser.wav');
    playerLaserSound = new p5.SoundFile('sounds/pew.wav');
    explosionSound = new p5.SoundFile('sounds/boom.wav');
    music = new p5.SoundFile('sounds/tetris-theme.mp3');
    smallExplosion = new p5.SoundFile('sounds/slurp.wav');
    bossExplosion = new p5.SoundFile('sounds/boss-explosion.wav');
    roundEndSounds = Array.from({ length: 5 }).map((_, i) => new p5.SoundFile(`sounds/coffee-voice-${i}.mp3`));
    sounds = [
        { file: laserSound, volume: 0.3 },
        { file: playerLaserSound, volume: 0.3 },
        { file: explosionSound, volume: 1 },
        { file: music, volume: 0.1 },
        { file: smallExplosion, volume: 1 },
        { file: bossExplosion, volume: 1 },
        ...roundEndSounds.map((file) => ({ file, volume: 1 })),
    ];
    sounds.forEach((sound) => sound.file.setVolume(sound.volume));
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
    rectMode(CORNER);
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
    if (keyIsDown(UP_ARROW))
        ship.moveUp();
    if (keyIsDown(RIGHT_ARROW))
        ship.moveRight();
    if (keyIsDown(DOWN_ARROW))
        ship.moveDown();
    ship.update().draw();
    const newEnemies = [];
    for (const enemy of enemies) {
        enemy.update().draw();
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
        newEnemies.push(enemy);
    }
    if (newEnemies.length === 0) {
        roundEnded = Date.now();
        const sound = random(roundEndSounds);
        sound.play();
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
        if (nextRound) {
            if (Date.now() - roundEnded > 500) {
                buttons.continueButton.click();
            }
        }
        else if (gameOver) {
            buttons.retryButton.click();
        }
        else {
            ship.shoot();
        }
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
        muted = !muted;
        sounds.forEach((sound) => sound.file.setVolume(muted ? 0 : sound.volume));
        muteButton.classList[muted ? 'add' : 'remove']('muted');
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
        require('electron').remote.getCurrentWindow().close();
    };
    return { continueButton, exitButton, muteButton, retryButton };
}
let farewellMessages = [
    {
        content: trimmed `
      Hey Ayesha, sad to hear that you are leaving the team.
      
      We didn’t work together, but who else would I talk to about the new bbt place that I’ve tried over the weekend or how crappy the shopping is in perth.
      Will miss having you around!
      
      KIT and hope to see you around with a milk tea in hand ;-)
    `,
        sender: 'Gabrielle',
    },
    {
        content: trimmed `
      Hi Ayesha,
      
      It was a pleasure working with you. All the very best. Take care and stay safe.
      
      Cheers
      Sharief
    `,
        sender: 'Sharief',
    },
    {
        content: trimmed `
      Hey Ayesha
      
      Going to miss having you in the team, a fellow chick who knew how to cook and loved to talk hair, fashion and other girlie stuff with a this frumpie mum are very hard to find. Your help over the months has been invaluable as has been the friendship
      
      Cheers Amanda    
    `,
        sender: 'Amanda',
    },
    {
        content: trimmed `
      Hey Ayesha!
      
      Sad to “virtually” see you go! Definitely know it won’t be the last time we see each other! It’s been great working with you on some mentally challenging projects hahaha
      In hindsight i should of come met Yufei with you, Big regrets! Lets catch up for drinks when this is all over :D
      
      All the best
      Kent
    `,
        sender: 'Kent',
    },
    {
        content: trimmed `
      Hi PowerBI Guru,
      
      It was such a great pleasure working with you. 
      Thank you heaps for the tremendous contribution and support you brought to the team, including me.
      We have definitely learnt a lot from you, especially the PowerBI tricks, and have enjoyed working with you.
      Thanks for helping me out with organising some gatherings with the team. I will miss buying doughnuts with you  
      Perth is small and I’m sure we will cross paths again on future projects or even, outside work…who knows  
      Btw, I’m still waiting for your dancing video  
      
      I wish you all the best in your other projects.
      
      Take care,
      Tina
    `,
        sender: 'Tinaaaaaaaaaaaaaaaaa',
    },
    {
        content: trimmed `
      Hi Ayesha,
      
      Thanks for all your help and support since I started. You have been great to work with and thanks for all the laughs.
      
      I hope your next team is as awesome as us and appreciate you as much as we do! You will be missed greatly.
      
      Good luck and keep on sipping,
      
      <span class='flashing'>Steve</span>
      `,
        sender: `<span class='flashing'>Steve</span>`,
    },
    {
        content: trimmed `
      Hey Ayesha,
      
      So sad to see you're leaving - I'm going to miss learning loads of interesting pop culture facts at lunch.
      
      You've been an absolute star in the team, no matter what came up you just take in in stride, wherever you're headed next they are lucky to have you!
      
      All the best for everything the future holds, I hope our we see you around again one day!
      
      <span class='flashing'>Cahil</span>
    `,
        sender: `<span class='flashing'>Cahil</span>`,
    },
    {
        content: trimmed `
      Thanks for your commitment and persistence.

      You always find a way to get it done.
    `,
        sender: 'Fredy',
    },
    {
        content: trimmed `
      Hi Ayesha,
      
      Thanks for your contribution to L&H reporting improvements. All the best for your new chapter!
      
      Cheers,
      Ginger    
    `,
        sender: 'Ginger',
    },
    {
        content: trimmed `
      Hey Ayesha!

      Thank you for all the hard work you’ve put in, the laughs, and most of all putting up with me :D I hope your next project goes smooth and that we cross paths again sooner rather than later. You’re always welcome for noodles. 
      
      Cheers,
      Boxy    
    `,
        sender: 'Boxy',
    },
];
function trimLines(string) {
    return string
        .split(/\n|\r|\r\n/g)
        .map((line) => line.trim())
        .join('<br/>\n')
        .replace(/(^(<br\/>)+)|((<br\/>)+)$/g, '')
        .replace(/(<br\/>\n){3,}/g, '<br/>\n<br/>\n')
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