var idlePaths = [];
var walkPaths = [];
var jumpPaths = [];
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
var tombstones = []; // Array for static tombstones
var score = 0;
var health = 5;
var maxHealth = 10; // Max health 
var badSound, goodSound, bgSound;
var gameStarted = false;
var crateSpawnTimer = 0; // Timer for crate spawn
var crateSpawnInterval = 240; // ~4 seconds at 60fps

function preload() {
  tombstoneImg2 = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/TombStone (2).png');
  idlePaths = loadStrings('assets/txt/idle.txt', () => console.log('idle.txt loaded'), (err) => console.error('idle.txt error:', err));
  walkPaths = loadStrings('assets/txt/walk.txt', () => console.log('walk.txt loaded'), (err) => console.error('walk.txt error:', err));
  jumpPaths = loadStrings('assets/txt/jump.txt', () => console.log('jump.txt loaded'), (err) => console.error('jump.txt error:', err));
  treeImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/Tree.png', () => console.log('treeImg loaded'), (err) => console.error('treeImg error:', err));
  backgroundImg = loadImage('assets/tileset/graveyardtilesetnew/png/BG.png', () => console.log('backgroundImg loaded'), (err) => console.error('backgroundImg error:', err));
  batImg = loadImage('assets/imgs/jackfree/png/vecteezy_cartoon-cute-bat-animal_23281380.png', () => console.log('batImg loaded'), (err) => console.error('batImg error:', err));
  graveImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/TombStone (1).png', () => console.log('graveImg loaded'), (err) => console.error('graveImg error:', err));
  crateImg = loadImage('assets/tileset/graveyardtilesetnew/png/Objects/Crate.png', () => console.log('crateImg loaded'), (err) => console.error('crateImg error:', err));
  skullImg = loadImage('assets/tileset/graveyardtilesetnew/png/Tiles/Bone (2).png', () => console.log('skullImg loaded'), (err) => console.error('skullImg error:', err));
  poisonImg = loadImage('assets/imgs/jackfree/png/505pIkbEsTb4G.png', () => console.log('poisonImg loaded'), (err) => console.error('poisonImg error:', err));
  
  // Load sounds
  badSound = loadSound('assets/sounds/642984__duisterwho__disgusting-throat-puke-sound-vocal.wav', () => console.log('badSound loaded'), (err) => console.error('badSound error:', err));
  goodSound = loadSound('assets/sounds/368651__jofae__game-powerup.mp3', () => console.log('goodSound loaded'), (err) => console.error('goodSound error:', err));
  bgSound = loadSound('assets/sounds/dark-ambient-horror-cinematic-halloween-atmosphere-scary-118585.mp3', () => console.log('bgSound loaded'), (err) => console.error('bgSound error:', err));
}

function setup() {
  createCanvas(800, 600);
  
  // Character: Moves freely
  myAnimation = new animationImage(120, 400, 60, 60);
  myAnimation.currentAnimation.scale = 0.25;
  myAnimation.loadAnimation('idle', idlePaths);
  myAnimation.loadAnimation('walk', walkPaths);
 
  myAnimation.currentAnimation.rotation = 0;
  myAnimation.currentAnimation.rotationSpeed = 0;
  myAnimation.currentAnimation.collider = 'dynamic';
  myAnimation.currentAnimation.mass = 1;
  
  // Static Trees
  treeImageLeft = createSprite(100, 500, 100, 100);
  treeImageLeft.addImage(treeImg);
  treeImageLeft.scale = 1.0;
  treeImageLeft.collider = 'static';

  treeImageRight = createSprite(700, 500, 100, 100);
  treeImageRight.addImage(treeImg);
  treeImageRight.scale = 1.0;
  treeImageRight.collider = 'static';

  // Graves Random (3 total, move and push)
  graves = [];
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

  // New Static Tombstones (random, immovable, lower 1/3)
  tombstones = [];
  for (let i = 0; i < 3; i++) {
    let x, y;
    do {
      x = random(50, 750); // Full width with padding
      y = random(400, 550); // Lower 1/3 of screen (400 to 600) with padding
    } while (!isSafeSpawn(x, y));

    let tombstone = createSprite(x, y, 50, 50);
    tombstone.addImage(tombstoneImg2); //2nd tombstone
    tombstone.scale = 1.0;
    tombstone.collider = 'static';
    tombstones.push(tombstone);
  }

  // Crate (starts off-screen, will fall)
  crate = createSprite(random(50, 750), -50, 50, 50);
  crate.addImage(crateImg);
  crate.scale = 1.0;
  crate.collider = 'kinematic';
  crate.velocity.y = 3; // Falling speed

  // Random bats
  bats = [];
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

  // Initial Skulls
  spawnSkulls();

  // Initial Poisons
  spawnPoisons();
} 


function mousePressed() {
  if (!gameStarted && bgSound) {
    bgSound.loop();
    bgSound.setVolume(0.5);
    gameStarted = true;
  }
}

function isSafeSpawn(x, y) {// prevent getting stuck by objects (theoretically haha)
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
  for (let i = 0; i < 5; i++) {
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

function draw() {
  if (!gameStarted) {
    background(120);
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Click to Start the Nightmare!", width / 2, height / 2);
    return;
  }

  if (backgroundImg) {
    image(backgroundImg, 0, 0, 800, 600);
  } else {
    background(120);
  }

  // Crate spawn timer
  crateSpawnTimer++;
  if (crateSpawnTimer >= crateSpawnInterval) {
    spawnCrate();
    crateSpawnTimer = 0; // Reset timer
  }

  // Horizontal limits for character
  let char = myAnimation.currentAnimation;
  let effectiveWidth = char.width * char.scale;
  let charLeft = char.position.x - effectiveWidth / 2;
  let charRight = char.position.x + effectiveWidth / 2;
  if (charLeft <= 0) {
    char.position.x = effectiveWidth / 2;
    char.velocity.x = 0;
  }
  if (charRight >= 800) {
    char.position.x = 800 - effectiveWidth / 2;
    char.velocity.x = 0;
  }

  // Vertical limits for character
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

  // Moving objects bounce off edges
  for (let bat of bats) {
    if (bat.position.x < 50 || bat.position.x > 750) bat.velocity.x *= -1;
    if (bat.position.y < 50 || bat.position.y > 550) bat.velocity.y *= -1;
  }
  for (let grave of graves) {
    if (grave.position.x < 50 || grave.position.x > 750) grave.velocity.x *= -1;
    if (grave.position.y < 50 || grave.position.y > 550) grave.velocity.y *= -1;
  }

  // Crate falling 
  if (crate.position.y >= 600 - (crate.height * crate.scale / 2)) {
    crate.velocity.y = 0;
    crate.collider = 'static';
    crate.position.y = 600 - (crate.height * crate.scale / 2);
  }

  // Movement
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

  // Respawn skulls and poisons
  if (skulls.length === 0) {
    spawnSkulls();
  }
  if (poisons.length === 0) {
    spawnPoisons();
  }

  myAnimation.currentAnimation.rotation = 0;

  // Display score and health
  textSize(20);
  fill(255);
  textAlign(CENTER, TOP);
  text(`Score: ${score}`, width / 2, 10);
  text(`Health: ${health}`, width / 2, 40);

  // Win/Lose conditions
  if (score >= 10) {
    textSize(50);
    stroke(0);
    strokeWeight(2);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("The Spirits Are Pleased!", width / 2, height / 2);
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

function checkCollisions() {
  let char = myAnimation.currentAnimation;

  // Check collisions with static objects
  if (myAnimation.isColliding(treeImageRight) || 
      myAnimation.isColliding(treeImageLeft) ||
      tombstones.some(tombstone => myAnimation.isColliding(tombstone))) {
    myAnimation.updatePosition('idle');
    myAnimation.drawAnimation('idle');
    char.velocity.x = 0;
    char.velocity.y = 0;
  }

  // Check crate collision
  if (myAnimation.isColliding(crate) && crate.collider === 'kinematic') {
    health -= 5;
    crate.velocity.y = 0;
    crate.collider = 'static';
    crate.position.y = 600 - (crate.height * crate.scale / 2);
    if (badSound) badSound.play();
  }

  // Collectibles
  for (let i = skulls.length - 1; i >= 0; i--) {
    if (myAnimation.isColliding(skulls[i])) {
      skulls[i].remove();
      skulls.splice(i, 1);
      score += 1;
      if (health < maxHealth) health += 1;
      if (goodSound) goodSound.play();
    }
  }

  for (let i = poisons.length - 1; i >= 0; i--) {
    if (myAnimation.isColliding(poisons[i])) {
      poisons[i].remove();
      poisons.splice(i, 1);
      health -= 1;
      if (badSound) badSound.play();
    }
  }
}