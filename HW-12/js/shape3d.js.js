class Shape3D {
  constructor(x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.zSpin = random(0.005, 0.015);
  }

  moveShape() {
    translate(this.x, this.y);
    rotateX(frameCount * this.speedX);
    rotateY(frameCount * this.speedY);
    rotateZ(frameCount * this.zSpin);
  }
}
