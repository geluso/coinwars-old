var STAGE;
var RENDERER;
var MARGIN = 50;
var WIDTH = window.innerWidth - 2 * MARGIN;
var HEIGHT = window.innerHeight - 2 * MARGIN;

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

    _.each(STAGE.children, function(coin1) {
      coin1.position.x += coin1._meta.ax;
      coin1.position.y += coin1._meta.ay;

      _.each(STAGE.children, function(coin2) {
        if (collision(coin1, coin2)) {
          coin2._meta.ax = coin1._meta.ax;
          coin2._meta.ay = coin1._meta.ay;

          coin1._meta.ax = 0;
          coin1._meta.ay = 0;

          convert(coin1, coin2);
          convert(coin2, coin1);
          immobilize(coin1, coin2);
          immobilize(coin2, coin1);
        }

        coin1._meta.ax *= .99;
        coin1._meta.ay *= .99;

        stop(coin1);
      });
    });

    RENDERER.render(STAGE);
}

function stagedown(mouseData) {
}

function stageup(mouseData) {
  if (!TURN) {
    return;
  }
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

function createCoin(type, team, x, y) {
  var texture = PIXI.Texture.fromImage("img/" + type + "_" + team + ".png");
  var coin = new PIXI.Sprite(texture);
  coin._meta = {
    type: type,
    team: team,
    ax: 0,
    ay: 0
  };

  // center the sprites anchor point
  coin.anchor.x = 0.5;
  coin.anchor.y = 0.5;

  // move the sprite t the center of the screen
  coin.position.x = Math.floor((x * WIDTH) - coin.width / 2);
  coin.position.y = Math.floor((y * HEIGHT) - coin.height / 2);

  coin.setInteractive(true);

  coin.mousedown = function(mouseData){
     if (this._meta.immobilized) {
       return;
     }
     TURN = true;
     this._meta.x0 = Math.round(mouseData.global.x);
     this._meta.y0 = Math.round(mouseData.global.y);
  }
   
  coin.mouseup = function(mouseData){
    if (!TURN) {
      return;
    }

    TURN = false;
    _.each(STAGE.children, function(coin) {
      coin._meta.immobilized = false;
    });

    this._meta.x1 = Math.round(mouseData.global.x);
    this._meta.y1 = Math.round(mouseData.global.y);

    this._meta.ax = this._meta.x0 - this._meta.x1;
    this._meta.ay = this._meta.y0 - this._meta.y1;

    this._meta.active = true;
  }

  STAGE.addChild(coin);
}

function distance(coin1, coin2) {
  var dx = coin1.position.x - coin2.position.x;
  var dy = coin1.position.y - coin2.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function collision(coin1, coin2) {
  // coins don't collide with themselves.
  if (coin1 === coin2) {
    return false;
  }

  var d = distance(coin1, coin2);
  var touching = (coin1.width / 2) + (coin2.width / 2);
  return d <= touching;
}

function stop(coin) {
  if (coin._meta.ax == 0 && coin._meta.ay == 0) {
    coin._meta.active = false;
  }
}

function convert(coin1, coin2) {
  // only dimes convert
  if (coin1._meta.type !== "dime") {
    return; 
  }

  // the dime must be the active coin.
  if (!coin1._meta.active) {
    return; 
  }
  
  // generals and dimes can't be converted.
  if (coin2._meta.type === "general" || coin2._meta.type === "dime") {
    return;
  }

  // dimes don't converted their own pieces.
  if (coin1._meta.team === coin2._meta.team) {
    return;
  }

  // ok, converted the coin!
  var filename = coin2._meta.type + "_" + coin1._meta.team + ".png";
  var texture = PIXI.Texture.fromFrame("img/" + filename);
  coin2._meta.team = coin2._meta.team;
  coin2._meta.type = coin2._meta.type;
  coin2.setTexture(texture);
}

function immobilize(coin1, coin2) {
  // the coin must be active.
  if (!coin1._meta.active) {
    return;
  }

  // only nickels immobilize
  if (coin1._meta.type !== "nickel") {
    return;
  }

  // they don't immobilize their own team.
  if (isSameTeam(coin1, coin2)) {
    return;
  }

  // ok, immobilize!
  coin2._meta.immobilized = true;
}

function isSameTeam(coin1, coin2) {
  return coin1._meta.team === coin2._meta.team;
}

$(document).ready(init);
