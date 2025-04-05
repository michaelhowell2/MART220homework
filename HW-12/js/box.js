class BoxShape extends Shape3D {
    constructor(x, y, speedX, speedY, size) {
      super(x, y, speedX, speedY);
      this.size = size;
    }
  
    draw() {
      push();
      this.moveShape();
      normalMaterial();
      box(this.size);
      pop();
    }
  }
  