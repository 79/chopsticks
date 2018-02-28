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


let sushi;
let img;
let img2;
let socket_id;
let sushiArray = [];
let scoreText = "PIECES OF SUSHI EATEN: ";
let score = 0;

let DEBUG_COLOR;

function createNewUser(id) {
  users[id] = {
    color: stringToColor(id),
    chopstick: new Chopstick(mouseX, mouseY)
  }
}

function preload() {
  img = loadImage("ImageSushi.png");
  img2 = loadImage("mouth.png");
}

function setup() {
  collideDebug(DEBUG);
  // NOTE: because our game wants to be pixel-perfect,
  // we set max canvas but try to keep everything within 1000x1000
  createCanvas(windowWidth, windowHeight);

  // Listen for confirmation of connection
  socket.on('connect', function() {
    console.log("Connected");
  });

  // Remove disconnected users
  socket.on('disconnected', function(id) {
    delete users[id];
  });

  socket.on('a_user_was_updated', function(userChanges) {
    let id = userChanges.id;

    if (!(id in users)) {
      createNewUser(id);
    }

    let chopstick = users[id].chopstick;
    chopstick.updateAngle(userChanges.angle);
    chopstick.updateCenter(userChanges.centerX, userChanges.centerY);
  });

  socket.on('changes_made_to_sushi_location', function(sushiChanges) {
    sushiChanges.updateCorner(sushiChanges.cornerX, sushiChanges.cornerY);
  });

  sushiArray.push(new Sushi());
  mouth = new Mouth(300, 100);

  let r = random(255);
  let g = random(255);
  let b = random(255);
  DEBUG_COLOR = color(r, g, b);
}

let lastSentTime = 0;

function draw() {
  currentTime = millis();
  if (currentTime - lastSentTime > 50) {
    let angle = (users[socket.id]) ? users[socket.id].chopstick.angle : 0;
    socket.emit('user_update', {
      centerX: mouseX,
      centerY: mouseY,
      angle: angle
    });

    if (sushi) {
      socket.emit('sushi_update', {
        cornerX: sushi.cornerX,
        cornerY: sushi.cornerY
      });
    }

    lastSentTime = currentTime;
  }

  if (!socket.id) {
    return;
  }

  background('lightgoldenrodyellow');
  ellipse(500, 550, 500, 100);
  ellipse(500, 550, 250, 50);
  text(scoreText + score, width / 2, 100);
  mouth.display();

  // if (DEBUG_COLOR) {
  //   fill(DEBUG_COLOR);
  //   rect(0, 0, 100, 100);
  // }
  // noStroke();

  for (key in users) {
    let user = users[key];

    user.chopstick.checkCollisions();
    user.chopstick.display();
  }

  sushi = sushiArray[sushiArray.length - 1];
  sushi.display();
  sushi.drag();
  mouth.collision(sushi);

  sushi.gravity(0.3);

}

function keyPressed() {
  if (key === 'A') {
    users[socket.id].chopstick.updateAngle(
      users[socket.id].chopstick.angle - radians(5)
    );
  }

  if (key === 'D') {
    users[socket.id].chopstick.updateAngle(
      users[socket.id].chopstick.angle + radians(5)
    );
  }

  return false;
}
