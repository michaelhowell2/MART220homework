
class Character {
  constructor(x, y, frames, speed) {
    this.x = x;
    this.y = y;
    this.frames = frames;         // Array of images for animation
    this.currentFrame = 0;        // Index for current frame
    this.speed = speed;           // Movement speed
    this.w = 50;                  // Display width
    this.h = 50;                  // Display height
    this.facing = 1;              // 1 = facing right, -1 = facing left
  
    // Timer for controlling frame change (idle animation)
    this.frameInterval = 200;     // Time (in ms) per frame
    this.lastFrameTime = 0;       // When the last frame update occurred
  }
  
  update() {
    // Update animation frame based on a timer
    if (millis() - this.lastFrameTime > this.frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.lastFrameTime = millis();
    }
    
    // Move the character using arrow keys and update facing direction
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.facing = -1;  // Face left
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.facing = 1;   // Face right
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
    
    // Constrain the character to the canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }
  
  display() {
    push();
    // Move the origin to the character's position
    translate(this.x, this.y);
    // scaling based on facing direction
    scale(this.facing, 1);
    // Center the image 
    imageMode(CENTER);
    image(this.frames[this.currentFrame], 0, 0, this.w =70, this.h = 70);
    pop();
  }
}
