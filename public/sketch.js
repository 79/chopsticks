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
let socket_id;

let DEBUG_COLOR;

function createNewUser(id) {
  users[id] = {
    color: stringToColor(id),
    chopstick: new Chopstick(mouseX, mouseY)
  }
}

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

  socket.on('a_user_was_updated', function(userChanges) {
    let id = userChanges.id;

    if (!(id in users)) {
      createNewUser(id);
    }

    let chopstick = users[id].chopstick;
    chopstick.updateAngle(userChanges.angle);
    chopstick.updateCenter(userChanges.centerX, userChanges.centerY);
  });

  sushi = new Sushi();

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

    lastSentTime = currentTime;
  }

  if (!socket.id) {
    return;
  }

  background(255);

  if (DEBUG_COLOR) {
    fill(DEBUG_COLOR);
    rect(0, 0, 100, 100);
  }
  noStroke();

  for (key in users) {
    let user = users[key];

    user.chopstick.checkCollisions();
    user.chopstick.display();
  }

  sushi.display();
}

function keyPressed() {
  if (key === 'A') {
    users[socket.id].chopstick.updateAngle(
      users[socket.id].chopstick.angle - radians(1)
    );
  }

  if (key === 'D') {
    users[socket.id].chopstick.updateAngle(
      users[socket.id].chopstick.angle + radians(1)
    );
  }

  return false;
}
