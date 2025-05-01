class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  addParticles(count, x, y, type) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: random(-2, 2),
        vy: random(-2, 2),
        alpha: 255,
        size: type === "spark" ? random(2, 5) : random(5, 10),
        type: type || "spark",
        lifetime: type === "spark" ? 30 : 60
      });
    }
  }

  update() {
    this.particles = this.particles.filter(p => p.alpha > 0 && p.lifetime > 0);
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.type === "spark" ? 8 : 4;
      p.lifetime--;
    }
  }

  display() {
    noStroke();
    for (let p of this.particles) {
      if (p.type === "spark") {
        fill(255, 255, 0, p.alpha);
      } else {
        fill(100, 100, 255, p.alpha);
      }
      ellipse(p.x, p.y, p.size, p.size);
    }
  }
}