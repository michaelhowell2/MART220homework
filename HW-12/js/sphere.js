class SphereShape extends Shape3D {
  constructor(x, y, speedX, speedY, radius, tex = null) {
    super(x, y, speedX, speedY);
    this.radius = radius;
    this.tex = tex;//texture Orange
  }

  draw() {
    push();
    this.moveShape();

    if (this.tex) {
      texture(this.tex);
    } else {
      normalMaterial();
    }

    sphere(this.radius);
    pop();
  }
}
