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


let chopstick1;
let sushi;
let img;

let DEBUG_COLOR;


function preload() {
  img = loadImage("ImageSushi.png");
}

function setup() {
  collideDebug(DEBUG);
  createCanvas(windowWidth, windowHeight);
  background(255);


  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
  });

  // Remove disconnected users
  socket.on('disconnected', function(id) {
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
  //sushi.gravity(0.3);
  chopstick1.updateCenter(mouseX, mouseY);
  chopstick1.checkCollisions();
  chopstick1.display();

  if (chopstick1.isLifting) {
    sushi.cornerY = chopstick1.tipY
    sushi.cornerX = chopstick1.tipX
    //console.log(sushi.tipX + sushi.tipY);
  }

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


function createNewUser(id) {
  users[id] = {
    username: id,
    color: stringToColor(id)
  }
}
