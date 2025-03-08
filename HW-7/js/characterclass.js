class Character {
  constructor(x, y, idleFrames, walkFrames, speed) {
    this.x = x;
    this.y = y;
    this.idleFrames = idleFrames;
    this.walkFrames = walkFrames;
    this.frames = idleFrames;        // Default to idle
    this.currentFrame = 0;
    this.speed = speed;
    this.w = 80;                     
    this.h = 80;                     
    this.frameInterval = 200;
    this.lastFrameTime = 0;
  }

  setAnimation(frames) {
    if (this.frames !== frames) {
      this.frames = frames;
      this.currentFrame = 0; // Reset frame when animation changes
    }
  }

  update() {
    if (millis() - this.lastFrameTime > this.frameInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.lastFrameTime = millis();
    }
  }

  display(facing) {
    push();
    translate(this.x, this.y);
    scale(facing, 1);
    imageMode(CENTER);
    image(this.frames[this.currentFrame], 0, 0, this.w, this.h);
    pop();
  }
}