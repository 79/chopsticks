class Chopstick {
  constructor(centerX, centerY) {
    this.WIDTH = 30;
    this.LENGTH = 1000;
    this.centerX = centerX;
    this.centerY = centerY;
    this.angle = atan2(width / 2 - centerX, height / 2 - centerY);

    this.isSquishing = false;
    this.isLifting = false;
    this.tipX = 0;
    this.tipY = 0;


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
