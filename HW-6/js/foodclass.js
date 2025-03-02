class Food {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.height = 70;  // increased height from 50 to 70
    this.width = this.height * (img.width / img.height);  // Preserve aspect ratio was geting "squished"
  }
  
  display() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
  
  // Repositions the food randomly on the canvas
  appearRandomly() {
    this.x = random(width);
    this.y = random(height);
  }
  
  // Checks collision with the character
  checkCollision(character) {
    let d = dist(this.x, this.y, character.x, character.y);
    // Use average of width and height for collision radius
    let foodRadius = (this.width + this.height) / 4; // Approximate radius
    return (d < (foodRadius + character.w / 2));
  }
}