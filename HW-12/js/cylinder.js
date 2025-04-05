class CylinderShape extends Shape3D {
  constructor(x, y, speedX, speedY, r, h, tex = null) {
    super(x, y, speedX, speedY);
    this.r = r;
    this.h = h;
    this.tex = tex;
  }

  draw() {
    push();
    this.moveShape();

    //  Can body  texture
    if (this.tex) {
      texture(this.tex);
    } else {
      normalMaterial();
    }
    cylinder(this.r, this.h, 32, 16);

    // "Aluminum" Top of can
    push();
    translate(0, -this.h / 2 - 2); // adjustment to make fit top bottom
    cylinder(this.r, 4, 32, 1); 
    pop();

    // "Aluminum" bottom can
    push();
    translate(0, this.h / 2 + 2); // adjustment to make fit can bottom
    cylinder(this.r, 4, 32, 1); 
    pop();

    pop();
  }
}
