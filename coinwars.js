var STAGE;
var RENDERER;
var WIDTH = 1200;
var HEIGHT = 600;

function init() {
  STAGE = new PIXI.Stage(0x66FF99);
  RENDERER = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  document.body.appendChild(RENDERER.view);

  requestAnimFrame(animate);
  createCoins();
}

function animate() {
    requestAnimFrame(animate);

    RENDERER.render(STAGE);
}

function createCoins() {
  createCoin("quarter", "heads", 1/16, 2/9);
  createCoin("quarter", "heads", 1/16, 4/9);
  createCoin("quarter", "heads", 1/16, 6/9);
  createCoin("quarter", "heads", 1/16, 8/9);
  createCoin("nickel", "heads", 3/16, 3/9);
  createCoin("general", "heads", 3/16, 5/9);
  createCoin("dime", "heads", 3/16, 7/9);

  createCoin("quarter", "tails", 15/16, 2/9);
  createCoin("quarter", "tails", 15/16, 4/9);
  createCoin("quarter", "tails", 15/16, 6/9);
  createCoin("quarter", "tails", 15/16, 8/9);
  createCoin("nickel", "tails", 13/16, 3/9);
  createCoin("general", "tails", 13/16, 5/9);
  createCoin("dime", "tails", 13/16, 7/9);
}

function createCoin(coin, team, x, y) {
  var texture = PIXI.Texture.fromImage("img/" + coin + "_" + team + ".png");
  var coin = new PIXI.Sprite(texture);

  // center the sprites anchor point
  coin.anchor.x = 0.5;
  coin.anchor.y = 0.5;

  // move the sprite t the center of the screen
  coin.position.x = x * WIDTH;
  coin.position.y = y * HEIGHT;

  STAGE.addChild(coin);
}


$(document).ready(init);
