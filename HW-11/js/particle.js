class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = random(5, 15);
      this.life = 255;
      this.vx = random(-2, 2);
      this.vy = random(-2, 2);
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 5;
    }
  
    display() {
      noStroke();
      fill(255, 165, 0, this.life);
      ellipse(this.x, this.y, this.size);
    }
  
    isDead() {
      return this.life <= 0;
    }
  }