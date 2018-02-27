const DEBUG = true;

class Sushi {
  constructor() {
    this.WIDTH = 100;
    this.HEIGHT = 200;
    this.cornerX = 1000 / 2 - this.WIDTH / 2;
    this.cornerY = 600 / 3 * 2 - this.HEIGHT / 2;
    this.speed = 0;
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

  gravity(n) {
    let gravity = n;

    this.speed = this.speed + gravity;
    this.cornerY = this.cornerY + this.speed;

    if (this.cornerY > height - 100 - this.HEIGHT) {
      this.speed = this.speed * -0.85;
    }
    if (this.cornerY > height - 100 - this.HEIGHT) {
      this.cornerY = height - 100 - this.HEIGHT;
    }
  }

  drag() {
    let user_ids = Object.keys(users);

    if (user_ids.length !== 2) {
      return;
    }

    let myChopstick = users[socket.id].chopstick;

    let index = user_ids.indexOf(socket.id);
    if (index > -1) {
      user_ids.splice(index, 1);
    }
    let other_id = user_ids[0];
    let otherChopstick = users[other_id].chopstick;



    if (myChopstick.isLifting && otherChopstick.isLifting) {
      let d1 = dist(myChopstick.tipX, myChopstick.tipY, sushi.cornerX - sushi.WIDTH / 2, sushi.cornerY - sushi.HEIGHT / 2)
      let d2 = dist(otherChopstick.tipX, otherChopstick.tipY, sushi.cornerX - sushi.WIDTH / 2, sushi.cornerY - sushi.HEIGHT / 2)
      if (d1 > d2) {
        let dx = myChopstick.tipX - sushi.cornerX;
        sushi.cornerX = myChopstick.tipX + dx;
        let dy = myChopstick.tipY - sushi.cornerY;
        sushi.cornerY = myChopstick.tipY - dy;
      } else {
        let dx = otherChopstick.tipX - sushi.cornerX;
        sushi.cornerX = otherChopstick.tipX + dx;
        let dy = otherChopstick.tipY - sushi.cornerY;
        sushi.cornerY = otherChopstick.tipY - dy;
      }

    }

  }


  display(locationX, locationY) {
    push();

    locationX = locationX || this.cornerX;
    locationY = locationY || this.cornerY;
    image(img, locationX, locationY, this.WIDTH, this.HEIGHT);

    if (DEBUG) {
      noFill();
      stroke(DEBUG_COLOR);
      rectMode(CORNER);

      // boundary for picking up
      rect(...this.getLiftingBoundary());

      // boundary for squishing
      rect(...this.getSquishBoundary());

      let user_ids = Object.keys(users);

      if (user_ids.length !== 2) {
        return;
      }

      let myChopstick = users[socket.id].chopstick;

      let index = user_ids.indexOf(socket.id);
      if (index > -1) {
        user_ids.splice(index, 1);
      }
      let other_id = user_ids[0];
      let otherChopstick = users[other_id].chopstick;

      if (myChopstick.isSquishing && otherChopstick.isSquishing) {
        fill('red');
        rect(...this.getSquishBoundary());
      } else if (myChopstick.isLifting && otherChopstick.isLifting) {
        fill('lime');
        rect(...this.getLiftingBoundary());
      }
    }

    pop();
  }
}
