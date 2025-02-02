let colors = [[200, 200, 255], [255, 228, 196], [255, 222, 173]]; // Different bowl colors
let bowlColorIndex = 0; // Initial bowl color index

function setup() {
  createCanvas(400, 400);
  drawRamen();
}

function drawRamen() {
  background(220);

  // Bowl base
  fill(colors[bowlColorIndex]); // Change bowl color on key press
  arc(200, 300, 250, 150, PI, TWO_PI, OPEN);

  // Noodles
  stroke(255, 204, 153); // Light beige
  strokeWeight(3);
  for (let i = 110; i <= 290; i += 10) {
    line(i, random(240, 260), i + 10, random(250, 270)); // Noodles move slightly on mouse click
  }

  // Egg
  fill(255, 255, 200); // Pale yellow
  noStroke();
  ellipse(250, 220, 50, 35);

  fill(255, 153, 102); // Orange yolk
  ellipse(250, 220, 20, 20);

  // Seaweed
  fill(50, 100, 50); // Dark green
  rect(140, 200, 20, 50);

  // Green onion
  fill(102, 255, 102); // Light green
  ellipse(180, 230, 10, 10);
  ellipse(190, 240, 10, 10);
  ellipse(200, 230, 10, 10);

  // Chopsticks
  stroke(153, 102, 51); // Light brown
  strokeWeight(5);
  line(100, 150, 180, 250);
  line(120, 140, 200, 240);

  // Signature and title
  fill(0);
  textSize(16);
  text("by Your Name", 280, 390); // Your name in lower right corner
  text("Ramen Delight", 10, 20); // Name of the piece in upper left corner
}

function mousePressed() {
  drawRamen(); // Redraw ramen to move noodles on mouse click
}

function keyPressed() {
  bowlColorIndex = (bowlColorIndex + 1) % colors.length; // Change bowl color on key press
  drawRamen();
}

