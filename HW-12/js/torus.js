class TorusShape extends Shape3D {
  constructor(x, y, speedX, speedY, r, t) {
    super(x, y, speedX, speedY);
    this.r = r;
    this.t = t;
  }

  draw() {
    push();
    this.moveShape();
    normalMaterial();
    torus(this.r, this.t);
    pop();
  }
}
