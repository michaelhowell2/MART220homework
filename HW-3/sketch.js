// Global variables for pizza toppings and background
let pepperoni = [];
let cheeseSprinkles = [];
let bgColor; // Background color

// Global variables for images and fonts
let img1, img2, img3;
let titleFont, nameFont;

// Variables for the moving image using a timer
let movingImgX, movingImgY;
let timerInterval = 2000; // Move the image every 2000 milliseconds (2 seconds)
let lastTimer = 0;

function preload() {
  // Load images from the assets folder
  img1 = loadImage("Assets/imgs/Onion.png");   
  img2 = loadImage("Assets/imgs/pizzacutter.png");     // Image that moves around
  img3 = loadImage("Assets/imgs/Shroom.png");    

  // Load custom fonts from the assets folder
  titleFont = loadFont("Assets/fonts/Oi/Oi-Regular.ttf");
  nameFont = loadFont("Assets/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf");
}

function setup() {
  createCanvas(400, 400);
  bgColor = color(245, 222, 179); // Light beige, compliments the pizza crust
  resetPepperoni(); // Generate initial pepperoni
  resetCheese();    // Generate initial cheese sprinkles
  
  // Initialize the moving image's position randomly
  movingImgX = random(width);
  movingImgY = random(height);
}

function draw() {
  background(bgColor); // Draw the static background

  // --- Timer for Moving Image ---
  // Every 2 seconds, update the moving image's position to a new random spot.
  if (millis() - lastTimer > timerInterval) {
    movingImgX = random(0, width);
    movingImgY = random(0, height);
    lastTimer = millis();
  }

  // --- Draw Pizza ---
  // Pizza crust
  fill(240, 180, 50);
  ellipse(200, 200, 320, 320);

  // Pizza base
  fill(255, 204, 0);
  noStroke();
  ellipse(200, 200, 300, 300);

  // Draw Cheese Sprinkles
  fill(255, 255, 153);
  drawCheese();

  // Draw Pepperoni
  fill(200, 50, 50);
  for (let p of pepperoni) {
    ellipse(p.x, p.y, 40, 40);
  }

  // --- Display Images ---
  // Moving image (moves every 2 seconds)
  image(img2, movingImgX, movingImgY, 50, 50);
  
  // Static images (positioned on the canvas)
  image(img1, 10, height - 90, 80, 80);         // Bottom-left corner
  image(img3, width - 90, 50, 80, 80);            // Top-right corner

  // --- Title and Name with Custom Fonts ---
  // Title (Bold, using the custom titleFont)
  fill(0);
  textSize(25);
  textStyle(BOLD);
  textFont(titleFont);
  text("Make The Pizza",10, 30);

  // Name 
  textSize(25);
  textStyle(NORMAL);
  textFont(nameFont);
  text("Michael Howell", width - 150, height - 10);
}

// Randomizes pepperoni locations by creating 10 pepperoni slices at random positions
function resetPepperoni() {
  pepperoni = [];
  for (let i = 0; i < 10; i++) {
    pepperoni.push({ x: random(100, 300), y: random(100, 300) });
  }
}

// Generates initial cheese sprinkles with preset positions
function resetCheese() {
  cheeseSprinkles = [
    { x: 180, y: 130 }, { x: 220, y: 260 }, { x: 270, y: 190 },
    { x: 125, y: 130 }, { x: 125, y: 260 }, { x: 300, y: 150 },
    { x: 275, y: 100 }, { x: 165, y: 190 }, { x: 95, y: 190 },
    { x: 300, y: 255 }, { x: 150, y: 75 }, { x: 225, y: 130 },
    { x: 225, y: 195 }
  ];
}

// Draws all cheese sprinkles stored in the cheeseSprinkles array
function drawCheese() {
  for (let c of cheeseSprinkles) {
    rect(c.x, c.y, 10, 40);
  }
}

// Mouse click adds a new pepperoni slice where clicked (left-click)
// CENTER ,ouse wheel resets pepperoni and cheese sprinkles to their initial positions, right click kept popping up a box in windows and annoyed me
function mousePressed() {
  if (mouseButton === LEFT) {
    pepperoni.push({ x: mouseX, y: mouseY });
  } else if (mouseButton === CENTER) {
    resetPepperoni();
    resetCheese();
  }
}

// Mouse wheel scroll interaction:
// Scrolling down (event.delta > 0) removes the last-added pepperoni and cheese sprinkle.
// Scrolling up (event.delta < 0) adds a new cheese sprinkle at a random position.
function mouseWheel(event) {
  if (event.delta > 0) { 
    if (pepperoni.length > 0) {
      pepperoni.pop();
    }
    if (cheeseSprinkles.length > 0) {
      cheeseSprinkles.pop();
    }
  } else if (event.delta < 0) { 
    cheeseSprinkles.push({ x: random(100, 300), y: random(100, 300) });
  }
}
