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
        return bulletImage;
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
                height: 30,
                width: 30,
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
    constructor({ name, score, fireRate, sprite, children, ...config }) {
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
        this.children = children;
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
        if (this.children) {
            enemies.push(...this.children);
        }
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
            bulletsPerShot: 5,
            hitPoints: 1,
        });
        this.dragForce = 0.03;
        this.minFramesBetweenShots = 10;
        this.lastShot = 0;
        this.vel.limit(1);
    }
    shoot() {
        if (frameCount - this.lastShot > this.minFramesBetweenShots) {
            super.shoot();
            this.lastShot = frameCount;
        }
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
function showNextRoundMessage(font, roundNumber, message, prefix, action) {
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
    transmissionContent.innerHTML = `${prefix} ${message.sender} wants to ${action}`;
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
    text(`matt's tag attack`, windowWidth / 2, 50);
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
    const imageWidth = windowWidth / 2;
    const imageHeight = imageWidth / 1.75;
    image(victoryRoyaleImage, windowWidth / 4, windowHeight / 2 - imageHeight / 1.5, imageWidth, imageHeight);
    textSize(50);
    text(`total score: ${score}`, windowWidth / 2, windowHeight / 2 + 50);
    pop();
}
class CollingwoodEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random([
                'Scott Pendlebury',
                'Steele Sidebottom',
                'Jeremy Howe',
                'Taylor Adams',
                'Ben Reid',
            ]),
            pos,
            vel,
            sprite: enemyImage.collingwood,
            hitPoints: 2,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 150,
            height: 50,
            width: 50,
        });
    }
}
class DockersEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random([
                'Nat Fyfe',
                'Brennan Cox',
                'Adam Cerra',
                'Caleb Serong',
                'Hayden Young',
            ]),
            pos,
            vel: vel.mult(2),
            sprite: enemyImage.dockers,
            hitPoints: 1,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 100,
            height: 50,
            width: 50,
        });
    }
}
class PortEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random([
                'Tom Jonas',
                'Ollie Wines',
                'Travis Boak',
                'Connor Rozee',
                'Trent McKenzie',
            ]),
            pos,
            vel,
            sprite: enemyImage.port,
            hitPoints: 2,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 200,
            height: 50,
            width: 50,
        });
    }
}
class EssendonEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: random([
                'Dyson Heppell',
                'Cale Hooker',
                'Kyle Langford',
                'Martin Gleeson',
                'Zach Merrett',
            ]),
            pos,
            vel: vel.mult(2),
            sprite: enemyImage.essendon,
            hitPoints: 1,
            fireRate: 0.5,
            bulletsPerShot: 1,
            score: 100,
            height: 50,
            width: 50,
        });
    }
}
class ChrisBossEnemy extends Enemy {
    constructor({ pos, vel }) {
        super({
            name: 'Pout Man',
            pos,
            vel: vel.mult(2),
            sprite: enemyImage.chris,
            hitPoints: 10,
            fireRate: 1,
            bulletsPerShot: 3,
            score: 800,
            height: 250,
            width: 200,
        });
    }
    explode() {
        bossExplosion.play();
    }
}
class SteveBossEnemy extends Enemy {
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
const levels = [
    {
        waves: [
            [
                { enemy: EssendonEnemy, count: 6 },
                { enemy: PortEnemy, count: 4 },
            ],
        ],
    },
    {
        waves: [
            [
                { enemy: EssendonEnemy, count: 14 },
                { enemy: PortEnemy, count: 4 },
            ],
        ],
    },
    {
        waves: [[{ enemy: ChrisBossEnemy, count: 4 }]],
    },
    {
        waves: [
            [
                { enemy: EssendonEnemy, count: 6 },
                { enemy: PortEnemy, count: 4 },
                { enemy: DockersEnemy, count: 8 },
            ],
            [
                { enemy: DockersEnemy, count: 12 },
                { enemy: CollingwoodEnemy, count: 8 },
            ],
        ],
    },
    {
        waves: [[{ enemy: SteveBossEnemy, count: 4 }]],
    },
    {
        waves: [
            [
                { enemy: EssendonEnemy, count: 12 },
                { enemy: PortEnemy, count: 16 },
                { enemy: DockersEnemy, count: 10 },
                { enemy: CollingwoodEnemy, count: 8 },
            ],
            [
                { enemy: EssendonEnemy, count: 12 },
                { enemy: PortEnemy, count: 16 },
                { enemy: DockersEnemy, count: 10 },
                { enemy: CollingwoodEnemy, count: 8 },
            ],
            [
                { enemy: EssendonEnemy, count: 12 },
                { enemy: PortEnemy, count: 16 },
                { enemy: DockersEnemy, count: 10 },
                { enemy: CollingwoodEnemy, count: 8 },
            ],
        ],
    },
    {
        waves: [
            [
                { enemy: SteveBossEnemy, count: 6 },
                { enemy: ChrisBossEnemy, count: 8 },
            ],
        ],
    },
];
const messageActions = [
    'jump on a Teams call with you',
    'go a round of Fortnite with you',
    'throw things at Collingwood supporters with you',
    'discuss bruce with you',
];
const messagePrefix = [
    'Adhoc Leech',
    'Dockers Fan',
    'Passport Enthusiast',
    'Simpsons Lover',
];
const chrisList = ['Just', 'Plain', 'Captain Scrum Overlord'];
const bossName = ['Tin Foil Kid'];
class GamepadController {
    constructor() {
        this.controllerIndexes = [];
        this.registerController = (event) => {
            this.controllerIndexes.push(event.gamepad.index);
        };
        this.unregisterController = (event) => {
            this.controllerIndexes = this.controllerIndexes.filter((x) => x !== event.gamepad.index);
        };
    }
    get controllers() {
        const gamepads = navigator.getGamepads();
        return this.controllerIndexes.map((i) => gamepads[i]);
    }
    get analogueStickVector() {
        return this.controllers.reduce((vector, controller) => vector.add(controller.axes[0], controller.axes[1]), createVector());
    }
    isButtonPressed(index) {
        return this.controllers.some((controller) => { var _a; return (_a = controller.buttons[index]) === null || _a === void 0 ? void 0 : _a.pressed; });
    }
    registerListeners() {
        this.unregisterListeners();
        window.addEventListener('gamepadconnected', this.registerController);
        window.addEventListener('gamepaddisconnected', this.unregisterController);
    }
    unregisterListeners() {
        window.removeEventListener('gamepadconnected', this.registerController);
        window.removeEventListener('gamepaddisconnected', this.unregisterController);
    }
}
const gamepadController = new GamepadController();
let enemies;
let gameOver;
let killedBy;
let nextRound;
let victory;
let farewellMessage;
let senderPrefix;
let senderAction;
let roundNumber;
let roundEnded;
let ship;
let backgroundImage;
let enemyShip;
let playerShip;
let playerShipShooting;
let enemyImage;
let bulletImage;
let victoryRoyaleImage;
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
        collingwood: loadImage('images/collingwood.svg'),
        dockers: loadImage('images/dockers.svg'),
        port: loadImage('images/port-adelaide.svg'),
        essendon: loadImage('images/essendon.svg'),
        steve: loadImage('images/steves-head.png'),
        chris: loadImage('images/chris-head.png'),
    };
    playerShip = loadImage('images/player.png');
    playerShipShooting = loadImage('images/player-shooting.png');
    backgroundImage = loadImage('images/background.png');
    bulletImage = loadImage('images/bullet.png');
    victoryRoyaleImage = loadImage('images/victory-royale.png');
    titleFont = loadFont('fonts/StarJedi.ttf');
    regularFont = loadFont('fonts/OpenSans-Regular.ttf');
    laserSound = new p5.SoundFile('sounds/laser.wav');
    playerLaserSound = new p5.SoundFile('sounds/pew.wav');
    explosionSound = new p5.SoundFile('sounds/roblox-death-sound-trimmed.mp3');
    music = new p5.SoundFile('sounds/west-coast-theme.mp3');
    smallExplosion = new p5.SoundFile('sounds/small-explosion.wav');
    bossExplosion = new p5.SoundFile('sounds/boss-explosion.wav');
    roundEndSounds = [
        new p5.SoundFile(`sounds/my-man.mp3`),
        new p5.SoundFile(`sounds/mlg-airhorn.mp3`),
    ];
    sounds = [
        { file: laserSound, volume: 0.3 },
        { file: playerLaserSound, volume: 0.3 },
        { file: explosionSound, volume: 1 },
        { file: music, volume: 0.1 },
        { file: smallExplosion, volume: 1 },
        { file: bossExplosion, volume: 1 },
        ...roundEndSounds.map((file) => ({ file, volume: 0.5 })),
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
                vel: createVector(random(-1, 1), random(0.5, 2)),
            }));
        }
    }
}
function setup() {
    farewellMessages = shuffle(farewellMessages);
    angleMode(RADIANS);
    textAlign(CENTER, CENTER);
    gamepadController.registerListeners();
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
    background(backgroundImage);
    background(0, 150);
    if (gamepadController.controllers.some(({ buttons }) => buttons[0].pressed)) {
        handleKeyPress(' ');
    }
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
            showNextRoundMessage(titleFont, roundNumber, farewellMessage, senderPrefix, senderAction);
            return;
        }
    }
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
    ship.applyForce(gamepadController.analogueStickVector);
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
            farewellMessage.sender == 'Bruce'
                ? ''
                : farewellMessage.sender == 'Boxy'
                    ? random(chrisList)
                    : random(messagePrefix);
        senderAction =
            farewellMessage.sender == 'Bruce'
                ? 'wants to do with you'
                : random(messageActions);
        nextRound = true;
        buttons.continueButton.classList.remove('hidden');
    }
    enemies = newEnemies;
}
let chainingSecret = false;
function handleKeyPress(key) {
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
function keyPressed() {
    handleKeyPress(key);
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
      Hola Matt!

      I can’t believe you’re leaving me. It’s not fair. Who else will appreciate terrible pop culture references. No one. That’s who. Fine. Go. Bye Felicia.
      Despite my personal misery I wish you all the best in your next project and hope our paths cross again. Your expertise has been extremely valuable input into the team and we are in a much better place today because of it. The Koodaideri team will be very lucky to also share in your amazingness. Stay safe and classy.
      
      Boxy
    `,
        sender: 'Boxy',
    },
    {
        content: trimmed `
      Thanks for the laughs, the reboot card saves and hopefully you can still join for some team building
    `,
        sender: 'Amanda',
    },
    {
        content: trimmed `
      Best Wishes on your pregnancy   
    `,
        sender: 'Aiden',
    },
    {
        content: trimmed `
      Hi Matt,
  
      Its been really good working with you, appreciate the work and contributions you have made to the team.
      Shame i didn't get to work with you much but im sure you are pretty scared when you set the bar really high with the tagging stuff.
      
      Best of luck in the future, im sure we will together again
      
      Thanks,
      Kent
    `,
        sender: 'Kent',
    },
    {
        content: trimmed `
      Matt Matt Matt,

      It was such a pleasure working with you and having you in the team.
      Thank you heaps for your great work and contributions in helping us improve Passport.
      You will be missed but I'm sure we will see you again since Perth is small.
      I wish you all the best for the Koodaideri project and other projects you will be working on.
      
      Stay safe and Take care,
      Tina
    `,
        sender: 'Tinaaaaaaaaaaaaaaaaa',
    },
    {
        content: trimmed `
      Hey Matt,
      Thanks for all your help over the last 9+ months. It has been great to have your positive attitude around the office especially when working on the new and complex parts of webcore. Your sense of humor will be missed and good luck with your next project!
      Cheers,
      Steve
    `,
        sender: `Steve`,
    },
    {
        content: trimmed `
      Hey Matt,
      
      It's been a please working with you, you're a quick learner and you've made some awesome contributions!
      
      Thanks for carrying the squad and I in Fortnite, we'll have to keep you around for the lunch hour of power if we want to have any chance of winning again.
      
      All the best,
      <span class='flashing'>Cahil</span>
    `,
        sender: `<span class='flashing'>Cahil</span>`,
    },
    {
        content: trimmed `
      Matt you are a great team member and helped us with progressing PASSPORT further.
      
      Thanks and keep in touch
    `,
        sender: 'Prateek',
    },
    {
        content: trimmed `
      Matt, thanks for all of your support during some crazy times!
      
      Looking forward to working with you again in the future if the opportunity arises.
      
      All the best!   
    `,
        sender: 'Matt (no not you silly, Matt Paps)',
    },
    {
        content: trimmed `
      Do
    `,
        sender: 'Bruce',
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