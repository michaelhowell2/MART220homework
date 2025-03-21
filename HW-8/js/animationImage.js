class animationImage {
  constructor(x, y, w, h) {
    this.currentAnimation = createSprite(x, y, w, h);
    this.direction = 'forward';
    this.spriteGroup = new Group();
    this.spriteGroup.add(this.currentAnimation);
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
    if (direction === 'forward') {
      this.currentAnimation.velocity.x = 5;
    } else if (direction === 'reverse') {
      this.currentAnimation.velocity.x = -5;
    } else if (direction === 'idle') {
      this.currentAnimation.velocity.x = 0;
    }
  }

  drawAnimation(animationType) {
    this.currentAnimation.frameDelay = 5;
    this.currentAnimation.changeAnimation(animationType);

    if (animationType === 'walk' && this.direction === 'forward') {
      this.currentAnimation.mirror.x = false;
    } else if (animationType === 'walk' && this.direction === 'reverse') {
      this.currentAnimation.mirror.x = true;
    }

    this.spriteGroup.draw();
  }

  isColliding(myImage) {
    return this.currentAnimation.collide(myImage);
  }
}
