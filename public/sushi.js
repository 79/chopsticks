const DEBUG = true;


class Sushi {
  constructor() {
    this.WIDTH = 100;
    this.HEIGHT = 100;
    this.cornerX = 1000 / 2 - this.WIDTH / 2;
    this.cornerY = 600 / 3 * 2 - this.HEIGHT / 2;
    this.speed = 0;

  }

  getLiftingBoundary() {
    let tolerance = 3;

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

    if (this.cornerY > 1200 - 100 - this.HEIGHT) {
      this.speed = this.speed * -0.85;
    }
    if (this.cornerY > 1200 - 100 - this.HEIGHT) {
      this.cornerY = 1200 - 100 - this.HEIGHT;
    }
  }

  drag() {
    let user_ids = Object.keys(users).sort();

    if (user_ids.length !== 2) {
      return;
    }

    // NOTE: Assign chopstick1 based on sorted array of socket ids
    // THIS IS IMPORTANT, so that they're the same chopstick on any client
    let chopstick1 = users[user_ids[0]].chopstick;
    let chopstick2 = users[user_ids[1]].chopstick;

    if (chopstick1.isSquishing || chopstick2.isSquishing) {
      return;
    }

    let sushiCenterX = sushi.cornerX + sushi.WIDTH / 2;
    let sushiCenterY = sushi.cornerY + sushi.HEIGHT / 2;

    if (chopstick1.isLifting && chopstick2.isLifting) {
      let distance1 = dist(chopstick1.tipX, chopstick1.tipY, sushiCenterX, sushiCenterY);
      let distance2 = dist(chopstick2.tipX, chopstick2.tipY, sushiCenterX, sushiCenterY);

      if (distance1 > distance2) {
        console.log("chopstick1 greater");
        // i.e. if chopstick1 is further than chopstick2
        let dx = chopstick1.tipX - sushi.cornerX;
        let xMove = (dx > sushi.WIDTH / 2) ? 1 : -1;
        sushi.cornerX = chopstick1.tipX - dx + xMove;
        let dy = chopstick1.tipY - sushi.cornerY;
        let yMove = (dy > sushi.HEIGHT / 2) ? 1 : -1;
        sushi.cornerY = chopstick1.tipY - dy + yMove;
      } else {
        console.log("chopstick2 greater 222");
        let dx = chopstick2.tipX - sushi.cornerX;
        let xMove = (dx > sushi.WIDTH / 2) ? 1 : -1;
        sushi.cornerX = chopstick2.tipX - dx + xMove;
        let dy = chopstick2.tipY - sushi.cornerY;
        let yMove = (dy > sushi.HEIGHT / 2) ? 1 : -1;
        sushi.cornerY = chopstick2.tipY - dy + yMove;
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

      let user_ids = Object.keys(users).sort();

      if (user_ids.length !== 2) {
        return;
      }

      // NOTE: Assign chopstick1 based on sorted array of socket ids
      // THIS IS IMPORTANT, so that they're the same chopstick on any client
      let chopstick1 = users[user_ids[0]].chopstick;
      let chopstick2 = users[user_ids[1]].chopstick;

      if (chopstick1.isSquishing && chopstick2.isSquishing) {
        fill('red');
        rect(...this.getSquishBoundary());
      } else if (chopstick1.isLifting && chopstick2.isLifting) {
        fill('lime');
        rect(...this.getLiftingBoundary());
      }
    }

    pop();
  }
}
