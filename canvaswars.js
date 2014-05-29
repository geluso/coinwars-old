// Dimensions
var WIDTH = 800;
var HEIGHT = 400;

// Colors
var BLACK = "#000000";
var GRAY = "#BBBBBB";
var BROWN = "#8B4513"
var RED = "#FF0000";
var BLUE = "#0000FF";

// Book keeping
var CTX;
var AIMING = false;
var X_START, Y_START, X_END, Y_END;

// Pieces
var TABLE;
var COINS = [];
var COIN;
var ID = 0;

// Physics
var FRAMERATE = 90;
var TICK = (1 / FRAMERATE) * 1000;
var TICKS;
var TIMER;
var SCALE = 3;
var DECAY = .9;
var HALFSIES = false;
var BOUNCY = true;
var RIGID = true;

function calc_distance(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function Table(width, height) {
  var BORDER = 20;
  this.x = BORDER;
  this.y = BORDER;
  this.width = width - 2 * BORDER;
  this.height = height - 2 * BORDER;
}

Table.prototype.draw = function(ctx) {
 ctx.strokeRect(this.x, this.y, this.width, this.height);
}

Table.prototype.contains = function(x, y, size) {
  return x > this.x && x < this.x + this.width &&
      y > this.y && y < this.y + this.height;
}

function Coin(x, y, size, weight, color, team) {
  this.id = ID++;
  this.x = x;
  this.y = y;
  this.ax = 0;
  this.ay = 0;
  this.inactive = false;
  this.size = size;
  this.weight = weight;
  this.color = color;
  this.team = team;
  this.selected = false;
}

function construct_coin(coin, x, y, size, weight, color, team) {
  coin.id = ID++;
  coin.x = x;
  coin.y = y;
  coin.ax = 0;
  coin.ay = 0;
  coin.inactive = false;
  coin.size = size;
  coin.weight = weight;
  coin.color = color;
  coin.team = team;
  coin.selected = false;
}

//function Quarter(x, y, team) {
  //this(x, y, 24, 5.67, GRAY, team); 
//}

Quarter = function(x, y, team) {
  construct_coin(this, x, y, 24, 5.67, GRAY, team);
};

Dime = function(x, y, team) {
  construct_coin(this, x, y, 18, 2.268, GRAY, team);
};

Nickel = function(x, y, team) {
  construct_coin(this, x, y, 21, 5, GRAY, team);
};

Penny = function(x, y, team) {
  construct_coin(this, x, y, 19, 2.5, BROWN, team);
};

Quarter.prototype = new Coin();
Dime.prototype = new Coin();
Nickel.prototype = new Coin();
Penny.prototype = new Coin();

Coin.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
}

Coin.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, true); 
    ctx.closePath();

    if (this.inactive) { 
      ctx.fillStyle = BLACK
    } else if (this.selected) {
      ctx.fillStyle = BLUE;
    } else if (!AIMING && this.contains(X_END, Y_END)) {
      ctx.fillStyle = RED;
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fill();    

    var text_width = ctx.measureText(this.team).width;
    ctx.setStrokeColor(BLACK);
    var x = Math.round(this.x - text_width / 2);
    var y = Math.round(this.y);
    ctx.strokeText(this.team, x, y);
}

Coin.prototype.select = function() {
 this.selected = true;
}

Coin.prototype.deselect = function() {
 this.selected = false;
}

Coin.prototype.contains = function(x, y, size) {
  var distance = calc_distance(this.x, this.y, x, y);
  if (size) {
    return distance < (this.size + size);
  } else {
    return distance < this.size;
  }
}

Coin.prototype.fire = function(dx, dy) {
  this.ax = dx;
  this.ay = dy;
}


Coin.prototype.update = function() {
  if (this.inactive) {
    return false;
  }

  this.ax *= DECAY;
  this.ay *= DECAY;
  if (Math.abs(this.ax) < 1) {
    this.ax = 0;
  }
  if (Math.abs(this.ay) < 1) {
    this.ay = 0;
  }
  this.x += this.ax;
  this.y += this.ay;

  var moved = (this.ax + this.ay != 0);

  if (!TABLE.contains(this.x, this.y, this.size)) {
    this.inactive = true;
  } else {
    var collision = false;
    for (var i = 0; i < COINS.length; i++) {
      var other_coin = COINS[i];
      if (other_coin.id != this.id && this.contains(other_coin.x, other_coin.y, other_coin.size)) {
        collision = true;
        other_coin.ax = (this.ax);
        other_coin.ay = (this.ay);
        if (this instanceof Dime && !(other_coin instanceof Dime)) {
          console.log(this, other_coin);
          other_coin.team = this.team;
        }
      }
    }
    if (collision) {
      if (HALFSIES) {
        this.ax = (this.ax / 2);
        this.ay = (this.ay / 2);
      } else if (BOUNCY) { 
        this.ax = -(this.ax / 10);
        this.ay = -(this.ay / 10);
      } else if (RIGID) {
        this.ax = 0;
        this.ay = 0;
      }
    }
  }

  return moved;
}

function clear() {
	CTX.clearRect(0, 0, WIDTH, HEIGHT);
  TABLE.draw(CTX);
  for (var i = 0; i < COINS.length; i++) {
    COINS[i].draw(CTX);
  }
}

function draw_line() {
	CTX.beginPath();
	CTX.moveTo(X_START, Y_START);
	CTX.lineTo(X_END, Y_END);
	CTX.stroke();
}

function event_loop() {
  clear();
  if (AIMING) {
    draw_line();
  }
}

function select_coin(x, y) {
  for (var i = 0; i < COINS.length; i++) {
    if (COINS[i].contains(x, y)) {
      COINS[i].select();
      return COINS[i];
    }
  }
}

function tick() {
  var any_moved = false;
  for (var i = 0; i < COINS.length; i++) {
    var coin_moved = COINS[i].update();
    any_moved = any_moved || coin_moved;
  }
  if (!any_moved) {
    clearInterval(TIMER);
  } else {
    clear();
  }
}

function mouse_down(e) {
  AIMING = true;
  X_START = e.pageX - this.offsetLeft;
  Y_START = e.pageY - this.offsetTop;
  COIN = select_coin(X_START, Y_START);
  event_loop(e);
}

function mouse_move(e) {
  X_END = e.pageX - this.offsetLeft;
  Y_END = e.pageY - this.offsetTop;
  event_loop(e);
}

function mouse_up(e) {
  AIMING = false;

  dx = (X_START - X_END) / SCALE;
  dy = (Y_START - Y_END) / SCALE;

  if (COIN) { 
    TICKS = 0;
    COIN.fire(dx, dy);
    COIN.deselect();
    TIMER = setInterval(tick, 1000 / FRAMERATE);

    COIN = null;
  }

  event_loop();
}

function init() {
  // get a reference to the <canvas> tag
  var canvas = $("#canvas");
  canvas.mousedown(mouse_down);
  canvas.mousemove(mouse_move);
  canvas.mouseup(mouse_up);

  //canvas.width = WIDTH;
  canvas.width = document.width;
  //canvas.height = HEIGHT;
  canvas.height = document.height;

  TABLE = new Table(WIDTH, HEIGHT);
  COINS.push(new Quarter(50, 75, "H"));
  COINS.push(new Quarter(50, 150, "H"));
  COINS.push(new Quarter(50, 225, "H"));
  COINS.push(new Quarter(50, 300, "H"));
  COINS.push(new Dime(100, 175, "H"));
  COINS.push(new Nickel(100, 250, "H"));
  
  COINS.push(new Quarter(700, 75, "T"));
  COINS.push(new Quarter(700, 150, "T"));
  COINS.push(new Quarter(700, 225, "T"));
  COINS.push(new Quarter(700, 300, "T"));
  COINS.push(new Dime(650, 175, "T"));
  COINS.push(new Nickel(650, 250, "T"));

  // if the browser support canvas
  if (document.getElementById("canvas").getContext) {
    CTX = document.getElementById("canvas").getContext('2d');
    clear();
  } else {
    alert("Browser doesn't support canvas.");
  }
}

// calls the draw() function when the page finished loading
window.onload = init;
