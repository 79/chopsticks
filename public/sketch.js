// Open and connect socket
var socket = io();
// Keep track of users
var users = {};
// keep track of osc objects
var osc = {};


// The reason why I changed this part is because if we use a total random RGB,
// then letter will be different colors in different users' screens.
// so I tried to find a logic that to make the random color not so random:)
// I find this function that can turn a string to numbers,
// which means we can give a not-so-random color to each user based on their ID.
// a references:
// (https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript)

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

function setup() {
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
}

function draw() {
  background(255);
}
