const DEBUG = true;

class Sushi {
  constructor() {
    this.WIDTH = 100;
    this.HEIGHT = 200;
    this.cornerX = width / 2 - this.WIDTH / 2;
    this.cornerY = height / 3 * 2 - this.HEIGHT / 2;
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
