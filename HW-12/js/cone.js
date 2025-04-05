class ConeShape extends Shape3D {
  constructor(x, y, speedX, speedY, r, h, tex = null) {
    super(x, y, speedX, speedY);
    this.r = r;
    this.h = h;
    this.tex = tex;
  }

  draw() {
    push();
    this.moveShape();

    if (this.tex) {
      texture(this.tex);
    } else {
      normalMaterial();
    }

    cone(this.r, this.h);
    pop();
  }
}
