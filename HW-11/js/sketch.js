var idlePaths = [];
var walkPaths = [];
var slidePaths = [];
var myAnimation;
var treeImageRight;
var treeImageLeft;
var treeImg;
var backgroundImg;
var graves = []; 
var crate;
var bats = [];
var skulls = [];
var poisons = [];
var batImg, graveImg, crateImg, skullImg, poisonImg;
var tombstoneImg2; 
var tombstones = [];
var score = 0;
var health = 5;
var maxHealth = 10;
var badSound, goodSound, bgSound, crateSound;
var gameStarted = false;
var crateSpawnTimer = 0;
var crateSpawnInterval = 240;
var particles = [];
var attackCooldown = 0;
var enemiesDestroyed = 0;

//load assests
function preload() {
  tombstoneImg2 = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/TombStone (2).png');
  idlePaths = loadStrings('assets/txt/idle.txt');
  walkPaths = loadStrings('assets/txt/walk.txt');
  slidePaths = loadStrings('assets/txt/slide.txt');
  treeImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/Tree.png');
  backgroundImg = loadImage('assets/tileset/graveyardtilesetnew/png/BG.png');
  batImg = loadImage('assets/imgs/jackfree/png/vecteezy_cartoon-cute-bat-animal_23281380.png');
  graveImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/TombStone (1).png');
  crateImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/Crate.png');
  skullImg = loadImage('assets/tileset/graveyardtilesetnew/png/Tiles/Bone (2).png');
  poisonImg = loadImage('assets/imgs/jackfree/png/505pIkbEsTb4G.png');
  
  badSound = loadSound('assets/sounds/642984__duisterwho__disgusting-throat-puke-sound-vocal.wav');
  goodSound = loadSound('assets/sounds/368651__jofae__game-powerup.mp3');
  bgSound = loadSound('assets/sounds/dark-ambient-horror-cinematic-halloween-atmosphere-scary-118585.mp3');
  crateSound = loadSound('assets/sounds/624150__markdalderup__snapped-wood.wav');
}

function setup() {
  createCanvas(800, 600);
  
  myAnimation = new animationImage(120, 400, 60, 60);
  myAnimation.currentAnimation.scale = 0.25;
  myAnimation.loadAnimation('idle', idlePaths);
  myAnimation.loadAnimation('walk', walkPaths);
  myAnimation.loadAnimation('slide', slidePaths);
  
  myAnimation.currentAnimation.rotation = 0;
  myAnimation.currentAnimation.rotationSpeed = 0;
  myAnimation.currentAnimation.collider = 'dynamic';
  myAnimation.currentAnimation.mass = 1;
  
  treeImageLeft = createSprite(100, 500, 100, 100);
  treeImageLeft.addImage(treeImg);
  treeImageLeft.scale = 1.0;
  treeImageLeft.collider = 'static';

  treeImageRight = createSprite(700, 500, 100, 100);
  treeImageRight.addImage(treeImg);
  treeImageRight.scale = 1.0;
  treeImageRight.collider = 'static';

  for (let i = 0; i < 3; i++) {
    let grave = createSprite(random(150, 650), random(50, 350), 50, 50);
    grave.addImage(graveImg);
    grave.scale = 1.0;
    grave.collider = 'kinematic';
    grave.velocity.x = random(-2, 2);
    grave.velocity.y = random(-2, 2);
    grave.mass = 2;
    graves.push(grave);
  }

  for (let i = 0; i < 5; i++) { // Changed to 5 tombstones
    let x, y;
    do {
      x = random(50, 750);
      y = random(400, 550);
    } while (!isSafeSpawn(x, y));
    let tombstone = createSprite(x, y, 50, 50);
    tombstone.addImage(tombstoneImg2);
    tombstone.scale = 1.0;
    tombstone.collider = 'static';
    tombstone.health = 3; // Health set to 3 hits
    tombstones.push(tombstone);
  }

  crate = createSprite(random(50, 750), -50, 50, 50);
  crate.addImage(crateImg);
  crate.scale = 1.0;
  crate.collider = 'kinematic';
  crate.velocity.y = 3;

  for (let i = 0; i < 3; i++) {
    let bat = createSprite(random(150, 650), random(50, 350), 50, 50);
    bat.addImage(batImg);
    bat.scale = -0.2;
    bat.collider = 'kinematic';
    bat.velocity.x = random(-2, 2);
    bat.velocity.y = random(-2, 2);
    bat.mass = 2;
    bats.push(bat);
  }

  spawnSkulls();
  spawnPoisons();
}

function mousePressed() {
  if (!gameStarted && bgSound) {
    bgSound.loop();
    bgSound.setVolume(0.3);
    gameStarted = true;
  }
}

//safe spaen for character
function isSafeSpawn(x, y) {
  let safe = true;
  let minDistance = 60;
  let distLeft = dist(x, y, treeImageLeft.position.x, treeImageLeft.position.y);
  if (distLeft < minDistance) safe = false;
  let distRight = dist(x, y, treeImageRight.position.x, treeImageRight.position.y);
  if (distRight < minDistance) safe = false;
  for (let grave of graves) {
    let distGrave = dist(x, y, grave.position.x, grave.position.y);
    if (distGrave < minDistance) safe = false;
  }
  for (let tombstone of tombstones) {
    let distTombstone = dist(x, y, tombstone.position.x, tombstone.position.y);
    if (distTombstone < minDistance) safe = false;
  }
  return safe;
}

function spawnSkulls() {
  while (skulls.length < 5) {
    let x, y;
    do {
      x = random(150, 650);
      y = random(50, 350);
    } while (!isSafeSpawn(x, y));
    let skull = createSprite(x, y, 20, 20);
    skull.addImage(skullImg);
    skull.scale = 1.0;
    skull.collider = 'static';
    skulls.push(skull);
  }
}

function spawnPoisons() {
  for (let i = 0; i < 3; i++) {
    let x, y;
    do {
      x = random(150, 650);
      y = random(50, 350);
    } while (!isSafeSpawn(x, y));
    let poison = createSprite(x, y, 30, 30);
    poison.addImage(poisonImg);
    poison.scale = 0.2;
    poison.collider = 'static';
    poisons.push(poison);
  }
}

function spawnCrate() {
  crate = createSprite(random(50, 750), -50, 50, 50);
  crate.addImage(crateImg);
  crate.scale = 1.0;
  crate.collider = 'kinematic';
  crate.velocity.y = 3;
}

//the fun stuff
function draw() {
  if (!gameStarted) {
    background(120);
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Click to Start the Nightmare!", width / 2, height / 2);
    return;
  }

  if (backgroundImg) image(backgroundImg, 0, 0, 800, 600);
  else background(120);

  crateSpawnTimer++;
  if (crateSpawnTimer >= crateSpawnInterval) {
    spawnCrate();
    crateSpawnTimer = 0;
  }

  let char = myAnimation.currentAnimation;
  let effectiveWidth = char.width * char.scale;
  let charLeft = char.position.x - effectiveWidth / 2;
  let charRight = char.position.x + effectiveWidth / 2;

  if (charLeft <= 0) {
    char.position.x = effectiveWidth / 2;
    char.velocity.x = 0;
    if (myAnimation.isSliding) {
      myAnimation.isSliding = false;
      console.log("Slide stopped at left edge");
    }
  }
  if (charRight >= 800) {
    char.position.x = 800 - effectiveWidth / 2;
    char.velocity.x = 0;
    if (myAnimation.isSliding) {
      myAnimation.isSliding = false;
      console.log("Slide stopped at right edge");
    }
  }

  let effectiveHeight = char.height * char.scale;
  let charTop = char.position.y - effectiveHeight / 2;
  let charBottom = char.position.y + effectiveHeight / 2;
  if (charTop <= 0) {
    char.position.y = effectiveHeight / 2;
    char.velocity.y = 0;
  }
  if (charBottom >= 600) {
    char.position.y = 600 - effectiveHeight / 2;
    char.velocity.y = 0;
  }

  for (let bat of bats) {
    if (bat.position.x < 50 || bat.position.x > 750) bat.velocity.x *= -1;
    if (bat.position.y < 50 || bat.position.y > 550) bat.velocity.y *= -1;
  }
  for (let grave of graves) {
    if (grave.position.x < 50 || grave.position.x > 750) grave.velocity.x *= -1;
    if (grave.position.y < 50 || grave.position.y > 550) grave.velocity.y *= -1;
  }

  if (crate && crate.position.y >= 600 - (crate.height * crate.scale / 2)) {
    crate.velocity.y = 0;
    crate.collider = 'static';
    crate.position.y = 600 - (crate.height * crate.scale / 2);
  }
//movement parameters
  if (kb.pressing('x') && attackCooldown <= 0 && !myAnimation.isSliding) {
    console.log("X pressed, initiating slide");
    myAnimation.slide(char.velocity.x >= 0 ? 'forward' : 'reverse');
    myAnimation.drawAnimation('slide');
    attackEnemy();
  } else if (!myAnimation.isSliding) {
    if (kb.pressing('d') || kb.pressing(RIGHT_ARROW)) {
      myAnimation.updatePosition('forward');
      myAnimation.drawAnimation('walk');
      checkCollisions();
    } else if (kb.pressing('a') || kb.pressing(LEFT_ARROW)) {
      myAnimation.updatePosition('reverse');
      myAnimation.drawAnimation('walk');
      checkCollisions();
    } else if (kb.pressing('w') || kb.pressing(UP_ARROW)) {
      char.velocity.y = -5;
      myAnimation.drawAnimation('walk');
      checkCollisions();
    } else if (kb.pressing('s') || kb.pressing(DOWN_ARROW)) {
      char.velocity.y = 5;
      myAnimation.drawAnimation('walk');
      checkCollisions();
    } else {
      myAnimation.updatePosition('idle');
      myAnimation.drawAnimation('idle');
      char.velocity.x = 0;
      char.velocity.y = 0;
    }
  } else {
    myAnimation.drawAnimation('slide');
    myAnimation.updatePosition(myAnimation.direction);
    if (frameCount % 5 === 0) attackEnemy();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  if (attackCooldown > 0) attackCooldown--;

  if (skulls.length < 5) spawnSkulls();
  if (poisons.length === 0) spawnPoisons();

  myAnimation.currentAnimation.rotation = 0;

  textSize(20);
  fill(255);
  textAlign(CENTER, TOP);
  text(`Score: ${score}`, width / 2, 10);
  text(`Health: ${health}`, width / 2, 40);

  // Win when all 5 tombstones are destroyed
  if (tombstones.length === 0 && gameStarted) {
    textSize(50);
    stroke(0);
    strokeWeight(2);
    fill(255, 165, 0);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2); // Updated win condition
    noStroke();
    noLoop();
  }
  if (health <= 0) {
    textSize(50);
    stroke(0);
    strokeWeight(2);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Eternal Darkness Claims You!", width / 2, height / 2);
    noStroke();
    noLoop();
  }

  allSprites.draw();
}
//crash bangs
function checkCollisions() {
  let char = myAnimation.currentAnimation;

  if (myAnimation.isColliding(treeImageRight) || 
      myAnimation.isColliding(treeImageLeft) ||
      tombstones.some(tombstone => myAnimation.isColliding(tombstone))) {
    myAnimation.updatePosition('idle');
    myAnimation.drawAnimation('idle');
    char.velocity.x = 0;
    char.velocity.y = 0;
  }

  if (crate && myAnimation.isColliding(crate) && crate.collider === 'kinematic' && !myAnimation.isSliding) {
    health -= 5;
    crate.velocity.y = 0;
    crate.collider = 'static';
    crate.position.y = 600 - (crate.height * crate.scale / 2);
    if (badSound && badSound.isLoaded()) {
      badSound.setVolume(0.5);
      badSound.play();
      console.log("Played badSound for crate collision");
    }
  }
//collectables
  for (let i = skulls.length - 1; i >= 0; i--) {
    if (myAnimation.isColliding(skulls[i])) {
      skulls[i].remove();
      skulls.splice(i, 1);
      score += 1;
      if (health < maxHealth) health += 1;
      if (goodSound && goodSound.isLoaded()) {
        goodSound.setVolume(0.5);
        goodSound.play();
        console.log("Played goodSound for skull");
      }
    }
  }

  for (let i = poisons.length - 1; i >= 0; i--) {
    if (myAnimation.isColliding(poisons[i])) {
      poisons[i].remove();
      poisons.splice(i, 1);
      health -= 1;
      if (badSound && badSound.isLoaded()) {
        badSound.setVolume(0.5);
        badSound.play();
        console.log("Played badSound for poison");
      }
    }
  }
}
//crates
function attackEnemy() {
  if (attackCooldown <= 0 && myAnimation.isSliding) {
    let char = myAnimation.currentAnimation;

    if (crate) {
      let crateDistance = dist(char.position.x, char.position.y, crate.position.x, crate.position.y);
      console.log("Checking crate: Distance =", crateDistance);
      if (crateDistance < 80) {
        console.log("Hit crate - exploding!");
        for (let j = 0; j < 20; j++) {
          particles.push(new Particle(crate.position.x, crate.position.y));
        }
        crate.remove();
        enemiesDestroyed++;
        score += 1;
        console.log("Crate exploded! Enemies destroyed:", enemiesDestroyed, "Score:", score);
        spawnCrate();
        if (crateSound && crateSound.isLoaded()) {
          crateSound.setVolume(0.2);
          crateSound.play();
          console.log("Played crateSound for crate explosion");
        }
        attackCooldown = 30;
      }
    }

    //attack tombstone
    for (let i = tombstones.length - 1; i >= 0; i--) {
      let tombstoneDistance = dist(char.position.x, char.position.y, tombstones[i].position.x, tombstones[i].position.y);
      console.log("Checking tombstone", i, ": Distance =", tombstoneDistance, "Health:", tombstones[i].health);
      if (tombstoneDistance < 80) {
        console.log("Hit tombstone!");
        tombstones[i].health--; // Reduce health
        for (let j = 0; j < 20; j++) {
          particles.push(new Particle(tombstones[i].position.x, tombstones[i].position.y));
        }
        if (tombstones[i].health <= 0) {
          console.log("Tombstone exploded!");
          tombstones[i].remove();
          tombstones.splice(i, 1);
          enemiesDestroyed++;
          score += 1;
          console.log("Tombstone exploded! Enemies destroyed:", enemiesDestroyed, "Score:", score);
          if (crateSound && crateSound.isLoaded()) {
            crateSound.setVolume(0.2);
            crateSound.play();
            console.log("Played crateSound for tombstone explosion");
          }
        } else {
          console.log("Tombstone health remaining:", tombstones[i].health);
        }
        attackCooldown = 30;
      }
    }
  }
}