import p5 from 'p5';

function heighestHeight() {
  var body = document.body,
    html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
}

let sketch = function (p) {
  // Tweakable parameters
  const STREAMS_PER_LAYER = 5;
  const MAX_SIZE = 15;
  const GRAVITY = 0.04;
  const LAYER_COUNT = 5;

  const WIND_SPEED = 0.025;
  const WIND_CHANGE = 0.0001;

  let STREAMS = [];
  let pumpkins = 0;
  let pumpkinCoordinates = [];

  let windowWidth = window.innerWidth;
  let windowHeight = heighestHeight();
  let frameCount = 0;

  window.addEventListener('click', (e) => {
    pumpkinCoordinates[pumpkins] = { x: e.pageX - 90, y: e.pageY + 20 };
    pumpkins++;
  });

  // Will run once when the sketch is opened
  p.setup = function setup() {
    p.createCanvas(windowWidth, windowHeight);
    p.noStroke();

    // Initialize the stream with random positions
    STREAMS = [];
    for (let l = 0; l < LAYER_COUNT; l++) {
      STREAMS.push([]);
      for (let i = 0; i < STREAMS_PER_LAYER; i++) {
        STREAMS[l].push({
          x: p.random(windowWidth),
          y: 0, // from the top
          mass: p.random(0.75, 1.25),
          l: l + 1,
          color: 'red',
        });
      }
    }
    pumpkinCoordinates = [...Array(100)].map((_) => ({
      x: Math.random() * windowWidth,
      y: Math.random() * windowHeight,
    }));
  };

  function makePumpkin(x, y) {
    //Jack-O-Lantern
    //stem
    p.fill(100, 90, 0);
    p.rect(x + 85, y - 40, 10, 20);
    //pumpkin body
    p.fill(244, 167, 66);
    p.ellipse(x + 100, y, 70, 60);
    p.ellipse(x + 80, y, 70, 60);
    //smile
    p.fill(0);
    p.ellipse(x + 90, y + 10, 70, 20);
    p.fill(244, 167, 66);
    p.ellipse(x + 90, y, 70, 20);
    //fill(100, 0, 0);
    //fangs
    p.triangle(x + 110, y + 15, x + 120, y, x + 100, y);
    p.triangle(x + 70, y + 15, x + 60, y, x + 80, y);
    //eyes
    p.fill(0);
    p.triangle(x + 105, y - 15, x + 115, y, x + 95, y);
    p.triangle(x + 75, y - 15, x + 65, y, x + 85, y);
  }

  // Helper function to prepare a given stream for the next frame
  function updateStream(stream) {
    const diameter = (stream.l * MAX_SIZE) / LAYER_COUNT;
    if (stream.y > p.height + diameter) stream.y = -diameter;
    else stream.y += GRAVITY * stream.l * stream.mass;

    // Get the wind speed at the given layer and area of the page
    const wind =
      p.noise(stream.l, stream.y * WIND_CHANGE, frameCount * WIND_CHANGE) - 0.5;
    if (stream.x > p.width + diameter) stream.x = -diameter;
    else if (stream.x < -diameter) stream.x = p.width + diameter;
    else stream.x += wind * WIND_SPEED * stream.l;
  }

  // Will run every frame (refreshes many times per second)
  p.draw = function draw() {
    //p.clear(); // Comment out for Halloween

    if (windowWidth > 1000) {
      makePumpkin(0, 250);
      makePumpkin(windowWidth - 200, 900);
      makePumpkin(windowWidth - 200, 500);
      makePumpkin(windowWidth - 300, 700);
      pumpkinCoordinates.map((tree, i) => {
        if (i < pumpkins) {
          makePumpkin(tree.x, tree.y);
        }
      });
    }

    // Iterate through each stream to draw and update them
    for (let l = 0; l < STREAMS.length; l++) {
      const LAYER = STREAMS[l];

      for (let i = 0; i < LAYER.length; i++) {
        const stream = LAYER[i];
        p.noStroke();
        p.fill(255, 0, 0);

        p.circle(stream.x, stream.y, (stream.l * MAX_SIZE) / LAYER_COUNT);
        updateStream(stream);
        frameCount++;
      }
    }
  };

  p.windowResized = function windowResized() {
    windowWidth = window.innerWidth;
    windowHeight = heighestHeight();
    p.resizeCanvas(windowWidth, windowHeight);
    p.setup();
  };

  new ResizeObserver(() => p.windowResized()).observe(document.body);
};

export const myp5 = (ref) => new p5(sketch, ref);
