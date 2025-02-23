
class Food {
    constructor(x, y, img,) {
      this.x = x;
      this.y = y;
      this.img = img;
      this.size = 50;  // Display size
    }
    
    display() {
      image(this.img, this.x, this.y, this.size, this.size);
    }
    
    // Repositions the food randomly on the canvas
    appearRandomly() {
      this.x = random(width);
      this.y = random(height);
    }
    
    // Checks collision with the character
    checkCollision(character) {
      let d = dist(this.x, this.y, character.x, character.y);
      // Collision threshold: half of food size plus half of character width
      return (d < (this.size / 2 + character.w / 2));
    }
  }