let bgColor;

// Arrays for assets
let walkFrames = [];   //array for walk
let idleFrames = [];    //array for idle
let foods = [];            // Shrooms (display only)
let pepperoni = [];
let cheeseSprinkles = [];
let onions = [];           // Onions (collectible)

// Images and fonts
let foodImg, onionImg, pizzaCutter;
let titleFont, nameFont;

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
let gameTime = 60 * 1000;
let startTime;
let gameStarted = false;

// Food movement variables
let lastFoodMoveTime = 0;
let foodMoveInterval = 5000;

function preload() {
  loadStrings("assets/txt/walk.txt", (lines) => {
    console.log("Walk lines loaded:", lines);
    for (let line of lines) {
      let frame = loadImage("assets/imgs/character/" + line.trim());
      walkFrames.push(frame);
    }
    console.log("Walk frames loaded:", walkFrames.length);
    checkAssetsLoaded();
  }, (error) => {
    console.error("Error loading walk.txt:", error);
  });

  loadStrings("assets/txt/idle.txt", (lines) => {
    console.log("Idle lines loaded:", lines);
    for (let line of lines) {
      let frame = loadImage("assets/imgs/character/" + line.trim());
      idleFrames.push(frame);
    }
    console.log("Idle frames loaded:", idleFrames.length);
    checkAssetsLoaded();
  }, (error) => {
    console.error("Error loading idle.txt:", error);
  });

  foodImg = loadImage("assets/imgs/Shroom.png");
  pizzaCutter = loadImage("assets/imgs/pizzacutter.png");
  onionImg = loadImage("assets/imgs/Onion.png");

  titleFont = loadFont("assets/fonts/Oi/Oi-Regular.ttf");
  nameFont = loadFont("assets/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf");
}

function setup() {
  createCanvas(400, 400);
  bgColor = color(245, 222, 179);
}

function checkAssetsLoaded() {
  if (walkFrames.length >= 10 && idleFrames.length >= 10 && foodImg && onionImg && pizzaCutter && titleFont && nameFont) {
    initializeGame();
  }
}

function initializeGame() {
  if (gameStarted) return;
  gameStarted = true;

  character = new Character(200, 200, idleFrames, walkFrames, characterSpeed);

  for (let i = 0; i < 3; i++) {
    let food = new Food(random(width), random(height), foodImg);
    foods.push(food);
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

  startTime = millis();
}

function draw() {
  background(bgColor);

  if (!gameStarted) {
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text("Loading...", width / 2, height / 2);
    return;
  }

  // Draw pizza base
  fill(240, 180, 50);
  ellipse(200, 200, 320, 320);
  fill(255, 204, 0);
  noStroke();
  ellipse(200, 200, 300, 300);

  // Move and draw pizza cutter
  if (millis() - lastCutterTime > cutterInterval) {
    cutterX = random(width);
    cutterY = random(height);
    lastCutterTime = millis();
  }
  image(pizzaCutter, cutterX, cutterY, 50, 50);

  // Draw toppings
  fill(255, 255, 153);
  drawCheese();
  fill(200, 50, 50);
  for (let p of pepperoni) {
    ellipse(p.x, p.y, 40, 40);
  }

  // Update character movement
  let isMoving = false;
  if (keyIsDown(LEFT_ARROW)) {
    character.x -= characterSpeed;
    facing = -1;
    isMoving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    character.x += characterSpeed;
    facing = 1;
    isMoving = true;
  }
  if (keyIsDown(UP_ARROW)) {
    character.y -= characterSpeed;
    isMoving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    character.y += characterSpeed;
    isMoving = true;
  }
  character.x = constrain(character.x, 0, width);
  character.y = constrain(character.y, 0, height);
  character.setAnimation(isMoving ? walkFrames : idleFrames);
  character.update();
  character.display(facing);

  // Move food randomly
  if (millis() - lastFoodMoveTime > foodMoveInterval) {
    for (let food of foods) food.appearRandomly();
    for (let onion of onions) onion.appearRandomly();
    lastFoodMoveTime = millis();
    foodMoveInterval = random(3000, 7000);
  }

  // Display shrooms (no collision)
  for (let food of foods) {
    food.display();
  }

  // Display and check onion collisions only
  for (let i = onions.length - 1; i >= 0; i--) {
    onions[i].display();
    if (onions[i].checkCollision(character)) {
      onions[i].appearRandomly();
      score += 1;
    }
  }

  // Display UI
  fill(0);
  textFont(titleFont);
  textSize(20);
  textStyle(BOLD);
  text("Catch The Onion Bandit", 10, 20);
  textFont(nameFont);
  textSize(14);
  textStyle(NORMAL);
  text("Michael Howell", width - 100, height - 10);

  // Display score and timer
  textFont("Arial");
  textSize(16);
  text(`Score: ${score}`, 10, 40);
  let timeLeft = Math.max(0, gameTime - (millis() - startTime)) / 1000;
  text(`Time: ${timeLeft.toFixed(1)}s`, 10, 60);

  if (timeLeft <= 0) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
    noLoop();
  }
}

// Topping functions
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

// Mouse interactions
function mousePressed() {
  if (mouseButton === LEFT) {
    pepperoni.push({ x: mouseX, y: mouseY });
  } else if (mouseButton === CENTER) {
    resetPepperoni();
    resetCheese();
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