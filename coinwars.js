var STAGE;
var RENDERER;
var WIDTH = 1200;
var HEIGHT = 600;

function init() {
  var interactive = true;
  STAGE = new PIXI.Stage(0x66FF99, interactive);

  STAGE.mousedown = stagedown;
  STAGE.mouseup = stageup;

  RENDERER = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
  document.body.appendChild(RENDERER.view);

  requestAnimFrame(animate);
  createCoins();
}

function animate() {
    requestAnimFrame(animate);

    /*
    var coin = _.sample(STAGE.children);
    coin.position.x = _.random(0, WIDTH);
    coin.position.y = _.random(0, HEIGHT);
    */

    RENDERER.render(STAGE);
}

function stagedown(mouseData) {
  console.log("stagedown");
}

function stageup(mouseData) {
  console.log("stageup");
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
  coin.position.x = Math.floor((x * WIDTH) - coin.width / 2);
  coin.position.y = Math.floor((y * HEIGHT) - coin.height / 2);

  coin.setInteractive(true);
  coin.mousedown = function(mouseData){
     console.log("MOUSE DOWN!");
  }
   
  coin.mouseup = function(mouseData){
     console.log("MOUSE UP!");
  }

  STAGE.addChild(coin);
}


$(document).ready(init);
