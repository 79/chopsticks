// Open and connect socket
var socket = io();
// Keep track of users
var users = {};

// The reason why I changed this part is because if we use a total random RGB,
// then letter will be different colors in different users' screens.
// so I tried to find a logic that to make the random color not so random:)
// I find this function that can turn a string to numbers,
// which means we can give a not-so-random color to each user based on their ID.
// a references:
// (https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript)

const DEBUG = true;

class Sushi {
  constructor() {
    this.WIDTH = 100;
    this.HEIGHT = 200;
    this.cornerX = width / 2 - this.WIDTH / 2;
    this.cornerY = height / 3 * 2 - this.HEIGHT / 2;
  }

  getLiftingBoundary() {
    let tolerance = 10;

    return [
      this.cornerX - tolerance,
      this.cornerY - tolerance,
      this.WIDTH + 2 * tolerance,
      this.HEIGHT + 2 * tolerance
    ];
  }

  getSquishBoundary() {
    let tolerance = 10;

    return [
      this.cornerX + tolerance,
      this.cornerY + tolerance,
      this.WIDTH - 2 * tolerance,
      this.HEIGHT - 2 * tolerance
    ];
  }

  display() {
    push();

    fill("orange");
    rect(this.cornerX, this.cornerY, this.WIDTH, this.HEIGHT);

    if (DEBUG) {
      noFill();
      stroke(DEBUG_COLOR);
      rectMode(CORNER);

      // boundary for picking up
      rect(...this.getLiftingBoundary());

      // boundary for squishing
      rect(...this.getSquishBoundary());

      if (chopstick1.isSquishing) {
        fill('red');
        rect(...this.getSquishBoundary());
      } else if (chopstick1.isLifting) {
        fill('lime');
        rect(...this.getLiftingBoundary());
      }
    }

    pop();
  }
}

class Chopstick {
  constructor(centerX, centerY) {
    this.WIDTH = 30;
    this.LENGTH = 1000;
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = atan2(width / 2 - centerX, height / 2 - centerY);

    this.isSquishing = false;
    this.isLifting = false;
  }

  calculateTip() {
    this.tipX = this.LENGTH / 2 * sin(this.angle) + this.centerX;
    this.tipY = this.LENGTH / 2 * -cos(this.angle) + this.centerY;
  }

  updateAngle(newAngle) {
    this.angle += radians(newAngle);
    this.calculateTip();
  }

  updateCenter(mouseX, mouseY) {
    this.centerX = mouseX;
    this.centerY = mouseY;
    this.calculateTip();
  }

  checkCollisions() {
    this.isSquishing = collidePointRect(this.tipX, this.tipY, ...sushi.getSquishBoundary());
    this.isLifting = collidePointRect(this.tipX, this.tipY, ...sushi.getLiftingBoundary());
  }

  display() {
    push();

    translate(this.centerX, this.centerY);

    rotate(this.angle);
    fill('brown');
    rectMode(CENTER);
    rect(0, 0, this.WIDTH, this.LENGTH);

    pop();

    if (DEBUG) {
      fill(DEBUG_COLOR);
      ellipse(this.centerX, this.centerY, 100, 100);

      fill(DEBUG_COLOR);
      ellipse(this.tipX, this.tipY, 20, 20);
    }
  }
}

function stringToColor(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// Create new user
function createNewUser(id) {
  users[id] = {
    username: id,
    color: stringToColor(id)
  }
}

let chopstick1;
let sushi;

let DEBUG_COLOR;

function setup() {
  collideDebug(DEBUG);
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");
  });

  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });

  chopstick1 = new Chopstick(mouseX, mouseY);
  sushi = new Sushi();

  let r = random(255);
  let g = random(255);
  let b = random(255);
  DEBUG_COLOR = color(r, g, b);
}

function draw() {
  background(255);
  if (DEBUG_COLOR) {
    fill(DEBUG_COLOR);
    rect(0, 0, 100, 100);
  }
  noStroke();

  sushi.display();
  chopstick1.updateCenter(mouseX, mouseY);
  chopstick1.checkCollisions();
  chopstick1.display();

}

function keyPressed() {
  if (key === 'A') {
    chopstick1.updateAngle(-1);
  }

  if (key === 'D') {
    chopstick1.updateAngle(1);
  }

  return false;
}
