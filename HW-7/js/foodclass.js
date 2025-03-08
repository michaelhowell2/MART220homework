class Food {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.height = 70;  // Fixed height
    this.width = this.height * (img.width / img.height);  
  }
  
  display() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
  
  // Repositions the food randomly on the canvas
  appearRandomly() {
    this.x = random(width);
    this.y = random(height);
  }
  
  // Checks collision with the character using p5.collide2D
  checkCollision(character) {
    // Adjust position to top-left corner (imageMode CENTER shifts it)
    let foodX = this.x - this.width / 2;
    let foodY = this.y - this.height / 2;
    let charX = character.x - character.w / 2;
    let charY = character.y - character.h / 2;
    
    return collideRectRect(
      foodX, foodY, this.width, this.height,  // Food rectangle
      charX, charY, character.w, character.h  // Character rectangle
    );
  }
}