let pepperoni = [];
let cheeseSprinkles = [];
let bgColor; // Background color

function setup() {
  createCanvas(400, 400);
  bgColor = color(245, 222, 179); // Light beige
  resetPepperoni(); // Generate initial pepperoni
  resetCheese(); // Generate initial cheese sprinkles
}

function draw() {
  background(bgColor); 
  
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

  // Title (Bold)
  fill(0);
  textSize(20);
  textStyle(BOLD);
  text("Make The Pizza", 10, 20);

  // Name 
  textSize(14);
  textStyle(NORMAL);
  textFont("Comic Sans MS");
  text("Michael Howell", width - 100, height - 10);
}

// Randomizes pepperoni locations
function resetPepperoni() {
  pepperoni = [];
  for (let i = 0; i < 10; i++) {
    pepperoni.push({ x: random(100, 300), y: random(100, 300) });
  }
}

// Generates initial cheese sprinkles
function resetCheese() {
  cheeseSprinkles = [
    { x: 180, y: 130 }, { x: 220, y: 260 }, { x: 270, y: 190 },
    { x: 125, y: 130 }, { x: 125, y: 260 }, { x: 300, y: 150 },
    { x: 275, y: 100 }, { x: 165, y: 190 }, { x: 95, y: 190 },
    { x: 300,  y: 255 }, { x: 150, y: 75 }, { x: 225, y: 130 },
    { x: 225, y: 195 }
  ];
}

// Draws all cheese sprinkles
function drawCheese() {
  for (let c of cheeseSprinkles) {
    rect(c.x, c.y, 10, 40);
  }
}

// Mouse click adds a new pepperoni where clicked
function mousePressed() {
  if (mouseButton === LEFT) {
    pepperoni.push({ x: mouseX, y: mouseY }); // Add pepperoni at mouse click
  } else if (mouseButton === RIGHT) {
    resetPepperoni(); // Right-click resets pepperoni positions
    resetCheese(); // Right-click also resets cheese sprinkles
  }
}

// Mouse wheel scroll interaction
function mouseWheel(event) {
  if (event.delta > 0) { 
    // Scrolling down  → Remove last-added pepperoni and cheese 
    if (pepperoni.length > 0) {
      pepperoni.pop();
    }
    if (cheeseSprinkles.length > 0) {
      cheeseSprinkles.pop();
    }
  } else if (event.delta < 0) { 
    // Scrolling up  → Add more cheese sprinkles at random positions
    cheeseSprinkles.push({ x: random(100, 300), y: random(100, 300) });
  }
}
