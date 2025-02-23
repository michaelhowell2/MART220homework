
let bgColor; // Background color for the canvas

// Arrays for our assets:
let characterFrames = [];  // Array to hold all frames for the character animation
let foods = [];            // Array to hold multiple Food objects 
let pepperoni = [];        // Array for pepperoni positions
let cheeseSprinkles = [];  // Array for cheese sprinkles positions
let onions = [];           // Array for onion food objects

// images and fonts
let foodImg;             // Food image (
let onionImg;            // Onion image
let pizzaCutter;         // Pizza cutter image
let titleFont, nameFont; // Custom fonts

// The character object (instance of Character class)
let character;

//  variables for the moving pizza cutter
let cutterX, cutterY;
let cutterInterval = 2000;  // Move the cutter every 2000 ms (2 seconds)
let lastCutterTime = 0;

function preload() {
  // Load character animation frames into an array.
   for (let i = 1; i <= 10; i++) {
    let frame = loadImage("assets/imgs/character/Walk (" + i + ").png");
    characterFrames.push(frame);
  }
  
  // Load the shroom image
  foodImg = loadImage("assets/imgs/Shroom.png");
  
  // Load the pizza cutter image
  pizzaCutter = loadImage("assets/imgs/pizzacutter.png");
  
  // Load the onion image
  onionImg = loadImage("assets/imgs/Onion.png");
  
  // Load custom fonts for title and name
  titleFont = loadFont("assets/fonts/Oi/Oi-Regular.ttf");
  nameFont = loadFont("assets/fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf");
}

function setup() {
  createCanvas(400, 400);
  bgColor = color(245, 222, 179); // Light beige

  // Create character object. Starting at center with a speed of 3 pixels per frame.
  character = new Character(200, 200, characterFrames, 3);

  // Create multiple Food objects for shrooms (using a larger size, e.g., 40)
  for (let i = 0; i < 3; i++) {
    let food = new Food(random(width), random(height), foodImg, 40);
    foods.push(food);
  }
  
  // Initialize pepperoni and cheese sprinkles
  resetPepperoni();
  resetCheese();
  
  // Create multiple onion objects 
  for (let i = 0; i < 3; i++) {
    let onion = new Food(random(width), random(height), onionImg, 50);
    onions.push(onion);
  }
  
  // Initialize pizza cutter position and timer
  cutterX = random(width);
  cutterY = random(height);
  lastCutterTime = millis();
}

function draw() {
  background(bgColor);

  // --- Draw Pizza Background ---
  fill(240, 180, 50);
  ellipse(200, 200, 320, 320);  // Crust
  fill(255, 204, 0);
  noStroke();
  ellipse(200, 200, 300, 300);  // Base
  
  //  Draw Random Moving Pizza Cutter ---
  if (millis() - lastCutterTime > cutterInterval) {
    cutterX = random(width);
    cutterY = random(height);
    lastCutterTime = millis();
  }
  image(pizzaCutter, cutterX, cutterY, 50, 50);
  
  // --- Draw Toppings (Pepperoni & Cheese) ---
  // Draw cheese sprinkles
  fill(255, 255, 153);
  drawCheese();
  
  // Draw pepperoni slices
  fill(200, 50, 50);
  for (let p of pepperoni) {
    ellipse(p.x, p.y, 40, 40);
  }
  
  /*// --- Check Collisions for Pepperoni & Cheese ---
  for (let i = 0; i < pepperoni.length; i++) {
    if (dist(pepperoni[i].x, pepperoni[i].y, character.x, character.y) < (20 + character.w/2)) {
      // "Eat" the pepperoni by repositioning it.
      pepperoni[i].x = random(100, 300);
      pepperoni[i].y = random(100, 300);
    }
  }
  
  /*for (let i = 0; i < cheeseSprinkles.length; i++) {
    if (dist(cheeseSprinkles[i].x, cheeseSprinkles[i].y, character.x, character.y) < (20 + character.w/2)) {
      // "Eat" the cheese by repositioning it.
      cheeseSprinkles[i].x = random(100, 300);
      cheeseSprinkles[i].y = random(100, 300);
    }
  }
  */
  //  Display the Character
  character.update();
  character.display();
  
   // Display Each Food Object (Shrooms) and Check for Collision 
  for (let i = 0; i < foods.length; i++) {
    foods[i].display();
   if (foods[i].checkCollision(character)) {
      foods[i].appearRandomly();
    }
  }
  
  /*//  Display Onions and Check Collision 
  for (let i = 0; i < onions.length; i++) {
    onions[i].display();
    if (onions[i].checkCollision(character)) {
      onions[i].appearRandomly();
    }
  }
  */
  //  Title and Name with Custom Fonts 
  fill(0);
  textSize(20);
  textStyle(BOLD);
  textFont(titleFont);
  text("Make The Pizza", 10, 20);
  
  textSize(14);
  textStyle(NORMAL);
  textFont(nameFont);
  text("Michael Howell", width - 100, height - 10);
}


// Pepperoni & Cheese Functions

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


// Mouse Interactions (Optional)

function mousePressed() {
  if (mouseButton === LEFT) {
    // Left-click adds a new pepperoni slice at the mouse position.
    pepperoni.push({ x: mouseX, y: mouseY });
  } else if (mouseButton === CENTER) {
    // Center-click resets pepperoni and cheese sprinkles.
    resetPepperoni();
    resetCheese();
  }
}

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
