let orangeImg;
let rootbeerImg; 
let shapes = [];

function preload() {
  orangeImg = loadImage('assets/imgs/AdobeStock_704282557.jpeg');
  rootbeerImg = loadImage('assets/imgs/root-beer.jpg'); 
}

function setup() {
  createCanvas(800, 800, WEBGL);
  ambientLight(120);
  pointLight(255, 255, 255, 0, 0, 250);

  shapes.push(new BoxShape(-250, -100, 0.01, 0.02, 80)); // normal material
  shapes.push(new TorusShape(200, -50, 0.02, 0.015, 40, 15)); // normal material
  shapes.push(new SphereShape(0, -150, 0.015, 0.025, 60, orangeImg)); // textured Orange
  shapes.push(new ConeShape(-100, 150, 0.025, 0.01, 40, 100)); // normal material
  shapes.push(new CylinderShape(150, 200, 0.01, 0.02, 40, 120, rootbeerImg)); // root beer label "textured"

}
function draw() {
  background(30, 10, 50);

  for (let shape of shapes) {
    shape.draw();
  }
}
