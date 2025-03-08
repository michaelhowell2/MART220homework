let bgColor;

// Arrays for assets
let walkFrames = [];
let idleFrames = [];
let badFoods = [];
let pepperoni = [];
let cheeseSprinkles = [];
let onions = [];

// Images and fonts
let foodImg, onionImg, pizzaCutter;
let titleFont, nameFont;

// Sounds
let backgroundMusic, eatGoodSound, eatBadSound;

// Character variables
let character;
let characterSpeed = 3;
let facing = 1;

// Pizza cutter variables
let cutterX, cutterY;
let cutterInterval = 2000;
let lastCutterTime = 0;

// Game variables
let score = 0;
let health = 250;
let gameTime = 60 * 1000;
let startTime;
let gameStarted = false;
let audioStarted = false;

let lastFoodMoveTime = 0;
let foodMoveInterval = 5000;

function preload() {
  loadStrings("assets/txt/walk.txt", (lines) => {
    console.log("Walk lines loaded:", lines.length);
    if (lines.length < 10) console.warn("Warning: Expected 10 walk frames, got", lines.length);
    for (let i = 0; i < lines.length; i++) {
      let frame = loadImage("assets/imgs/character/" + lines[i].trim());
      walkFrames.push(frame);
    }
    checkAssetsLoaded();
  }, (error) => {
    console.error("Error loading walk.txt:", error);
  });

  loadStrings("assets/txt/idle.txt", (lines) => {
    console.log("Idle lines loaded:", lines.length);
    if (lines.length < 10) console.warn("Warning: Expected 10 idle frames, got", lines.length);
    for (let i = 0; i < lines.length; i++) {
      let frame = loadImage("assets/imgs/character/" + lines[i].trim());
      idleFrames.push(frame);
    }
    checkAssetsLoaded();
  }, (error) => {
    console.error("Error loading idle.txt:", error);
  });

  foodImg = loadImage("assets/imgs/Shroom.png");
  onionImg = loadImage("assets/imgs/Onion.png");
  pizzaCutter = loadImage("assets/imgs/pizzacutter.png");

  titleFont = loadFont("assets/fonts/Oi/Oi-Regular.ttf");
  nameFont = loadFont("assets/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf");

  backgroundMusic = loadSound("assets/sounds/750340__zhr__energetic-background-music.wav");
  eatGoodSound = loadSound("assets/sounds/368651__jofae__game-powerup.mp3");
  eatBadSound = loadSound("assets/sounds/642984__duisterwho__disgusting-throat-puke-sound-vocal.wav");
}

function setup() {
  createCanvas(400, 400);
  bgColor = color(245, 222, 179);

  // Set sound volumes
  backgroundMusic.setVolume(0.5);
  eatGoodSound.setVolume(0.25);
  eatBadSound.setVolume(1.5);
}

function checkAssetsLoaded() {
  if (walkFrames.length >= 10 && idleFrames.length >= 10 && foodImg && onionImg && pizzaCutter && titleFont && nameFont && backgroundMusic && eatGoodSound && eatBadSound) {
    console.log("All assets loaded, initializing game");
    initializeGame();
  }
}

function initializeGame() {
  if (gameStarted) return;
  gameStarted = true;

  character = new Character(200, 200, idleFrames, walkFrames, characterSpeed);

  for (let i = 0; i < 3; i++) {
    let badFood = new Food(random(width), random(height), foodImg);
    badFoods.push(badFood);
  }
  for (let i = 0; i < 3; i++) {
    let onion = new Food(random(width), random(height), onionImg);
    onions.push(onion);
  }

  resetPepperoni();
  resetCheese();

  cutterX = random(width);
  cutterY = random(height);
  lastCutterTime = millis();
}

function draw() {
  background(bgColor);

  if (!gameStarted) {
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Click to Start Game and Music", width / 2, height / 2);
    return;
  }

  // Draw static elements
  fill(240, 180, 50);
  ellipse(200, 200, 320, 320);
  fill(255, 204, 0);
  noStroke();
  ellipse(200, 200, 300, 300);

  fill(255, 255, 153);
  drawCheese();
  fill(200, 50, 50);
  for (let p of pepperoni) {
    ellipse(p.x, p.y, 40, 40);
  }
  image(pizzaCutter, cutterX, cutterY, 50, 50);

  // Consistent UI layout
  fill(0);
  textFont(titleFont);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER);
  text("Catch The Onion Bandit", width / 2, 30);
  textFont(nameFont);
  textSize(25);
  textStyle(NORMAL);
  textAlign(LEFT);
  text("Michael Howell", 10, height - 20);

  textFont("Arial");
  textSize(20);
  textStyle(BOLD);
  text(`Score: ${score}`, 10, 60);
  text(`Health: ${health}`, 10, 85);

  if (!startTime) {
    text("Time: 60.0s", 10, 110);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Click to Begin!", width / 1.25, height / 2);
    character.display(facing);
    for (let badFood of badFoods) badFood.display();
    for (let onion of onions) onion.display();
    return;
  }

  //  game after click wanted it to start after becasue timer was just going before I could move
  if (millis() - lastCutterTime > cutterInterval) {
    cutterX = random(width);
    cutterY = random(height);
    lastCutterTime = millis();
  }

  let isMoving = false;
  if (keyIsDown(65)) { // A key (left)
    character.x -= characterSpeed;
    facing = -1;
    isMoving = true;
  }
  if (keyIsDown(68)) { // D key (right)
    character.x += characterSpeed;
    facing = 1;
    isMoving = true;
  }
  if (keyIsDown(87)) { // W key (up)
    character.y -= characterSpeed;
    isMoving = true;
  }
  if (keyIsDown(83)) { // S key (down)
    character.y += characterSpeed;
    isMoving = true;
  }
  character.x = constrain(character.x, 0, width);
  character.y = constrain(character.y, 0, height);
  character.setAnimation(isMoving ? walkFrames : idleFrames);
  character.update();
  character.display(facing);

  if (millis() - lastFoodMoveTime > foodMoveInterval) {
    for (let badFood of badFoods) badFood.appearRandomly();
    for (let onion of onions) onion.appearRandomly();
    lastFoodMoveTime = millis();
    foodMoveInterval = random(3000, 7000);
  }

  for (let i = badFoods.length - 1; i >= 0; i--) {
    badFoods[i].display();
    if (badFoods[i].checkCollision(character)) {
      badFoods[i].appearRandomly();
      health -= 10;
      if (audioStarted && eatBadSound.isLoaded()) eatBadSound.play();
    }
  }

  for (let i = onions.length - 1; i >= 0; i--) {
    onions[i].display();
    if (onions[i].checkCollision(character)) {
      onions[i].appearRandomly();
      score += 1;
      if (audioStarted && eatGoodSound.isLoaded()) eatGoodSound.play();
    }
  }

  let timeLeft = Math.max(0, gameTime - (millis() - startTime)) / 1000;
  text(`Time: ${timeLeft.toFixed(1)}s`, 10, 110);

  if (timeLeft <= 0 || health <= 0) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
    if (audioStarted && backgroundMusic.isPlaying()) backgroundMusic.stop();
    noLoop();
  }
}

function mousePressed() {
  if (!gameStarted) return;

  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
    if (backgroundMusic.isLoaded()) backgroundMusic.loop();
  }

  if (!startTime) {
    startTime = millis();
  }

  if (mouseButton === LEFT) {
    pepperoni.push({ x: mouseX, y: mouseY });
  } else if (mouseButton === CENTER) {
    resetPepperoni();
    resetCheese();
  }
}

function resetPepperoni() {
  pepperoni = [];
  for (let i = 0; i < 10; i++) {
    pepperoni.push({ x: random(100, 300), y: random(100, 300) });
  }
}

function resetCheese() {
  cheeseSprinkles = [
    { x: 180, y: 130 }, { x: 220, y: 260 }, { x: 270, y: 190 },
    { x: 125, y: 130 }, { x: 125, y: 260 }, { x: 300, y: 150 },
    { x: 275, y: 100 }, { x: 165, y: 190 }, { x: 95, y: 190 },
    { x: 300, y: 255 }, { x: 150, y: 75 }, { x: 225, y: 130 },
    { x: 225, y: 195 }
  ];
}

function drawCheese() {
  for (let c of cheeseSprinkles) {
    rect(c.x, c.y, 10, 40);
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    if (pepperoni.length > 0) pepperoni.pop();
    if (cheeseSprinkles.length > 0) cheeseSprinkles.pop();
  } else if (event.delta < 0) {
    cheeseSprinkles.push({ x: random(100, 300), y: random(100, 300) });
  }
}