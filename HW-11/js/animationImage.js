class animationImage {
  constructor(x, y, w, h) {
    this.currentAnimation = createSprite(x, y, w, h);
    this.direction = 'forward';
    this.spriteGroup = new Group();
    this.spriteGroup.add(this.currentAnimation);
    this.isSliding = false;
    this.slideDuration = 0;
  }

  loadAnimation(animationType, paths) {
    let images = [];
    for (let path of paths) {
      images.push(loadImage(path));
    }
    this.currentAnimation.addAnimation(animationType, ...images);
  }

  updatePosition(direction) {
    this.direction = direction;
    if (this.isSliding) {
      this.slideDuration--;
      if (this.slideDuration <= 0) {
        this.isSliding = false;
        this.currentAnimation.velocity.x = 0;
        console.log("Slide ended naturally, position:", this.currentAnimation.position.x, this.currentAnimation.position.y);
      }
    } else if (direction === 'forward') {
      this.currentAnimation.velocity.x = 5;
    } else if (direction === 'reverse') {
      this.currentAnimation.velocity.x = -5;
    } else if (direction === 'idle') {
      this.currentAnimation.velocity.x = 0;
    }
  }

  drawAnimation(animationType) {
    this.currentAnimation.frameDelay = 5;
    try {
      this.currentAnimation.changeAnimation(animationType);
    } catch (e) {
      console.error("Error changing animation to", animationType, ":", e);
      this.currentAnimation.changeAnimation('idle');
    }

    if (animationType === 'walk' && this.direction === 'forward') {
      this.currentAnimation.mirror.x = false;
    } else if (animationType === 'walk' && this.direction === 'reverse') {
      this.currentAnimation.mirror.x = true;
    } else if (animationType === 'slide') {
      this.currentAnimation.mirror.x = this.direction === 'reverse';
    }

    this.spriteGroup.draw();
  }

  isColliding(myImage) {
    return this.currentAnimation.collide(myImage);
  }

  slide(direction) {
    console.log("Starting slide in direction:", direction);
    this.isSliding = true;
    this.slideDuration = 15; // ~0.25 seconds at 60fps
    this.currentAnimation.velocity.x = direction === 'forward' ? 10 : -10;
  }
}