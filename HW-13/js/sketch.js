let sunModel;
let planetModels = [];
let ufoModel;
let junkTextures = [];
let deathStarTexture;
let borgTexture;
let sunTexture;
let planetTextures = [];
let ufoTexture;
let planets = [];
let spaceJunk = [];
let ufos = [];
let stars = [];
let pg;

function preload() {
  sunModel = loadModel('assets/models/sun/sun.obj', true, 
    () => console.log('Sun model loaded'), 
    () => console.error('Sun model failed'));
  planetModels[0] = loadModel('assets/models/mercury/Mercury 1K.obj', true, 
    () => console.log('Mercury model loaded'), 
    () => console.error('Mercury model failed'));
  planetModels[1] = loadModel('assets/models/venus/venus/venus.obj', true, 
    () => console.log('Venus model loaded'), 
    () => console.error('Venus model failed'));
  planetModels[2] = loadModel('assets/models/earth/earth.obj', true, 
    () => console.log('Earth model loaded'), 
    () => console.error('Earth model failed'));
  planetModels[3] = loadModel('assets/models/mars/13903_Mars_v1_l3.obj', true, 
    () => console.log('Mars model loaded'), 
    () => console.error('Mars model failed'));
  planetModels[4] = loadModel('assets/models/jupiter/13905_Jupiter_V1_l3.obj', true, 
    () => console.log('Jupiter model loaded'), 
    () => console.error('Jupiter model failed'));
  ufoModel = loadModel('assets/models/ufo/13884_UFO_Saucer_v1_l2.obj', true, 
    () => console.log('UFO model loaded'), 
    () => console.error('UFO model failed'));

  sunTexture = loadImage('assets/imgs/sun_BaseColor.png', 
    () => console.log('Sun texture loaded'), 
    () => console.error('Sun texture failed'));
  planetTextures[0] = loadImage('assets/imgs/mercurymap.jpg', 
    () => console.log('Mercury texture loaded'), 
    () => console.error('Mercury texture failed'));
  planetTextures[1] = loadImage('assets/imgs/venusmap.jpg', 
    () => console.log('Venus texture loaded'), 
    () => console.error('Venus texture failed'));
  planetTextures[2] = loadImage('assets/imgs/earthmap1k.jpg', 
    () => console.log('Earth texture loaded'), 
    () => console.error('Earth texture failed'));
  planetTextures[3] = loadImage('assets/imgs/mars_1k_color.jpg', 
    () => console.log('Mars texture loaded'), 
    () => console.error('Mars texture failed'));
  planetTextures[4] = loadImage('assets/imgs/jupitermap.jpg', 
    () => console.log('Jupiter texture loaded'), 
    () => console.error('Jupiter texture failed'));
  ufoTexture = loadImage('assets/imgs/ufo.jpg', 
    () => console.log('UFO texture loaded'), 
    () => console.error('UFO texture failed'));

  junkTextures[0] = loadImage('assets/imgs/campbell-soup-can-2473.png', 
    () => console.log('Junk 0 texture loaded'), 
    () => console.error('Junk 0 texture failed'));
  junkTextures[1] = loadImage('assets/imgs/trafficcone.jpg', 
    () => console.log('Junk 1 texture loaded'), 
    () => console.error('Junk 1 texture failed'));
  junkTextures[2] = loadImage('assets/imgs/campbell-soup-can-2473.png', 
    () => console.log('Junk 2 texture loaded'), 
    () => console.error('Junk 2 texture failed'));
  junkTextures[3] = loadImage('assets/imgs/doughnut.jpeg', 
    () => console.log('Junk 3 texture loaded'), 
    () => console.error('Junk 3 texture failed'));
  junkTextures[4] = loadImage('assets/imgs/blackhole.jpg', 
    () => console.log('Black hole texture loaded'), 
    () => console.error('Black hole texture failed'));

  borgTexture = loadImage('assets/imgs/borg.jpg', 
    () => console.log('Borg texture loaded'), 
    () => console.error('Borg texture failed'));
  deathStarTexture = loadImage('assets/imgs/death star front.png', 
    () => console.log('Death Star texture loaded'), 
    () => console.error('Death Star texture failed'));
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pg = createGraphics(windowWidth, windowHeight);
  setAttributes('antialias', true);
  noStroke();

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(-1000, 1000),
      y: random(-1000, 1000),
      z: random(-1000, 1000)
    });
  }

  planets.push(new Planet(150, random(TWO_PI), 0.002, 20, planetModels[0], planetTextures[0], 0.15)); // Mercury
  planets.push(new Planet(200, random(TWO_PI), 0.003, 25, planetModels[1], planetTextures[1], 0.25)); // Venus
  planets.push(new Planet(250, random(TWO_PI), 0.004, 30, planetModels[2], planetTextures[2], 0.18, true)); // Earth
  planets.push(new Planet(300, random(TWO_PI), 0.005, 35, planetModels[3], planetTextures[3], 0.18)); // Mars
  planets.push(new Planet(350, random(TWO_PI), 0.006, 40, planetModels[4], planetTextures[4], 0.3)); // Jupiter

  spaceJunk.push({ type: 'box', x: -300, y: -200, z: 200, speed: 0, size: 40, texture: borgTexture });
  spaceJunk.push({ type: 'cone', radius: 250, angle: random(TWO_PI), speed: 0.0025, size: 30, texture: junkTextures[1] });
  spaceJunk.push({ type: 'cylinder', radius: 300, angle: random(TWO_PI), speed: 0.002, size: 30, texture: junkTextures[2] });
  spaceJunk.push({ type: 'torus', radius: 350, angle: random(TWO_PI), speed: 0.0015, size: 30, texture: junkTextures[3] });
  spaceJunk.push({ type: 'ellipsoid', radius: 400, angle: random(TWO_PI), speed: 0.001, size: 30, texture: junkTextures[4] });
  
  for (let i = 0; i < 2; i++) {
    ufos.push({
      x: random(-300, 300),
      y: random(-100, 100),
      z: random(-200, 200),
      rotX: random(0.01, 0.03),
      rotY: random(0.01, 0.03),
      angleX: 0,
      angleY: 0,
      texture: ufoTexture
    });
  }
}

function draw() {
  background(0);
  orbitControl(1, 1, 0.1);

  if (!sunModel || !sunTexture) return; 

  ambientLight(80);
  directionalLight(150, 150, 150, 0, 0, -1);
  pointLight(255, 147, 41, 0, 0, 0);

  push();
  stroke(255);
  strokeWeight(2);
  for (let star of stars) {
    point(star.x, star.y, star.z);
  }
  pop();

  push();
  rotateY(frameCount * 0.01);
  scale(1);
  texture(sunTexture);
  model(sunModel);
  pop();

  for (let planet of planets) {
    if (planet.model && planet.texture) { 
      planet.update();
      planet.draw();
    }
  }

  for (let junk of spaceJunk) {
    if (!junk.texture) continue; 

    let x, y, z;
    if (junk.speed === 0) {
      x = junk.x;
      y = junk.y;
      z = junk.z;
    } else {
      junk.angle += junk.speed;
      x = cos(junk.angle) * junk.radius;
      z = sin(junk.angle) * junk.radius;
      y = 0;
    }

    push();
    translate(x, y, z);
    if (junk.speed !== 0) {
      rotateY(frameCount * 0.01);
    }
    texture(junk.texture);

    switch (junk.type) {
      case 'box': 
        box(junk.size); 
        break;
      case 'cone':
        rotateX(PI);
        rotateZ(frameCount * 0.01);
        cone(junk.size, junk.size * 2, 24);
        break;
      case 'cylinder': 
        cylinder(junk.size / 2, junk.size * 1.5); 
        break;
      case 'torus': 
        torus(junk.size, junk.size / 3, 24, 16); 
        break;
      case 'ellipsoid': 
        ellipsoid(junk.size, junk.size * 1.2, junk.size, 24, 24); 
        break;
    }
    pop();
  }

  // Black Hole Swirls
  let blackHole = spaceJunk[4];
  if (blackHole.texture) { 
    let blackHoleX = cos(blackHole.angle) * blackHole.radius;
    let blackHoleZ = sin(blackHole.angle) * blackHole.radius;
    let blackHoleY = 0;

    push();
    translate(blackHoleX, blackHoleY, blackHoleZ);
    noStroke();
    fill(255, 255, 255, 150);
    
    for (let i = 0; i < 20; i++) {
      let angle = frameCount * 0.05 + (TWO_PI / 20) * i;
      let radius = 40 + sin(angle) * 20;
      let swirlX = cos(angle) * radius;
      let swirlY = sin(angle) * radius * 0.2;
      let swirlZ = sin(angle) * radius;
      
      push();
      translate(swirlX, swirlY, swirlZ);
      sphere(3, 8, 8);
      pop();
    }
    pop();
  }

  // Death Star
  if (deathStarTexture) { 
    push();
    translate(300, -200, 200);
    rotateX(PI / 7);
    rotateY(-PI / 0.75);
    rotateZ(0);
    texture(deathStarTexture);
    sphere(35, 20, 20);
    pop();
  }

  for (let u of ufos) {
    if (u.texture && ufoModel) { 
      push();
      translate(u.x, u.y, u.z);
      rotateX(u.angleX);
      rotateY(u.angleY);
      scale(0.5);
      texture(u.texture);
      model(ufoModel);
      pop();

      u.angleX += u.rotX;
      u.angleY += u.rotY;
    }
  }

  pg.clear();
  pg.fill(255);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(80);
  pg.textStyle(BOLD);
  pg.textFont('Arial');
  pg.text("Michael Howell - Ah Oh...", windowWidth / 2, 100);
  image(pg, -width / 2, -height / 2, width, height);
}

function mousePressed() {
  if (ufos && ufos.length >= 2) {
    for (let i = 0; i < 2; i++) {
      ufos[i].x = random(-300, 300);
      ufos[i].y = random(-100, 100);
      ufos[i].z = random(-200, 200);
    }
  } else {
    console.error('UFOs array not properly loaded:', ufos);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
}