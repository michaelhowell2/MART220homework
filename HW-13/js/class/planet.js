class Planet {
    constructor(radius, angle, speed, size, model, texture, scale, isEarth = false) {
      this.radius = radius;      // Distance from sun
      this.angle = angle;        // Current orbit angle
      this.speed = speed;        // Orbit speed
      this.size = size;          // Base size 
      this.model = model;        // 3D model
      this.texture = texture;    // Texture image
      this.scale = scale;        // Scale factor for model
      this.isEarth = isEarth;    //  Earth-specific rotation
    }
  
    update() {
      this.angle += this.speed;  // Update orbit position
    }
  
    draw() {
      let x = cos(this.angle) * this.radius;
      let z = sin(this.angle) * this.radius;
  
      push();
      translate(x, 0, z);
      rotateY(frameCount * 0.01);  // Spin planet
      if (this.isEarth) {
        rotateX(PI);               // Flip Earth upright was upside down...
      }
      scale(this.scale);
      texture(this.texture);
      model(this.model);
      pop();
    }
  }