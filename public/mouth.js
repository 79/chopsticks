class Mouth {

  constructor(x, y) {
    this.x = x;
    this.y = y;

  }

  display() {
    image(img2, this.x, this.y, 150, 150);
  }

  collision(other) {
    let distance = dist(this.x, this.y, other.cornerX, other.cornerY);
    if (distance < 50) {
      sushiArray.splice(0, 1);
      sushiArray.push(new Sushi());
      console.log("collision");
      score += 1;
    }
  }

}
