import p5 from 'p5';

let sketch = function (p) {
  // Tweakable parameters
  const SNOWFLAKES_PER_LAYER = 100;
  const MAX_SIZE = 8;
  const GRAVITY = 0.25;
  const LAYER_COUNT = 5;

  const WIND_SPEED = 0;
  const WIND_CHANGE = 0.0025;

  let SNOWFLAKES = [];

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let frameCount = 0;

  // Will run once when the sketch is opened
  p.setup = function setup() {
    p.createCanvas(windowWidth, windowHeight);
    p.noStroke();

    // Initialize the snowflakes with random positions
    SNOWFLAKES = [];
    for (let l = 0; l < LAYER_COUNT; l++) {
      SNOWFLAKES.push([]);
      for (let i = 0; i < SNOWFLAKES_PER_LAYER; i++) {
        SNOWFLAKES[l].push({
          x: p.random(windowWidth),
          y: p.random(windowWidth),
          mass: p.random(0.75, 1.25),
          l: l + 1,
          color: 'red',
        });
      }
    }
  };

  function makeTree(x, y) {
    p.fill(86, 65, 3);
    p.rect(x + 93, y, 14, 40);
    p.noStroke();
    p.fill(36, 96, 8);
    p.triangle(x + 50, y, x + 150, y, x + 100, y - 100);
    light(x + 103, y - 50);
    light(x + 110, y - 10);
    light(x + 130, y - 20);
    light(x + 80, y - 10);
    light(x + 74, y - 30);
    light(x + 104, y - 70);
    light(x + 90, y - 60);
    light(x + 97, y - 30);
    light(x + 115, y - 30);
    p.stroke(255, 245, 56);
    p.strokeWeight(11);
    p.point(x + 100, y - 100);
    p.noStroke();

    function light(x, y) {
      var c;
      c = p.floor(p.random(1, 3.5));
      var v;
      if (c === 1) {
        v = [255, 0, 0];
      }
      if (c === 2) {
        v = [0, 0, 255];
      }
      if (c === 3) {
        v = [0, 255, 0];
      }
      p.stroke(v);
      p.strokeWeight(7);
      p.point(x, y);
    }
  }

  // Helper function to prepare a given snowflake for the next frame
  function updateSnowflake(snowflake) {
    const diameter = (snowflake.l * MAX_SIZE) / LAYER_COUNT;
    if (snowflake.y > p.height + diameter) snowflake.y = -diameter;
    else snowflake.y += GRAVITY * snowflake.l * snowflake.mass;

    // Get the wind speed at the given layer and area of the page
    const wind =
      p.noise(
        snowflake.l,
        snowflake.y * WIND_CHANGE,
        frameCount * WIND_CHANGE
      ) - 0.5;
    if (snowflake.x > p.width + diameter) snowflake.x = -diameter;
    else if (snowflake.x < -diameter) snowflake.x = p.width + diameter;
    else snowflake.x += wind * WIND_SPEED * snowflake.l;
  }

  // Will run every frame (refreshes many times per second)
  p.draw = function draw() {
    p.clear();

    if (windowWidth > 1000) {
      makeTree(0, 250);
      makeTree(0, 1000);
      makeTree(windowWidth - 200, 500);
      makeTree(windowWidth - 300, 700);
    }

    // Iterate through each snowflake to draw and update them
    for (let l = 0; l < SNOWFLAKES.length; l++) {
      const LAYER = SNOWFLAKES[l];

      for (let i = 0; i < LAYER.length; i++) {
        const snowflake = LAYER[i];
        p.noStroke();
        p.fill(255, 255, 255);
        p.circle(
          snowflake.x,
          snowflake.y,
          (snowflake.l * MAX_SIZE) / LAYER_COUNT
        );
        updateSnowflake(snowflake);
        frameCount++;
      }
    }
  };

  p.windowResized = function windowResized() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    console.log('res', windowWidth, windowHeight);
    p.resizeCanvas(windowWidth, windowHeight);
    p.setup();
  };
};

export const myp5 = (ref) => new p5(sketch, ref);
