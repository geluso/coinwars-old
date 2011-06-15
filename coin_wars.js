var FRAMERATE; // frames per second.
var SPEED; // pixels per second.
var ACCELERATION; // pixels per second per second

var timer;

// Associate buttons with their respective functions.
window.onload = function() {
    document.getElementById("reset").onclick = reset;
    document.getElementById("go").onclick = go;
    reset();
}

// Resets the simulation.
function reset() {
    // stop any previous simulation.
    clearInterval(timer);

    // Obtain the customized values.
    SPEED = document.getElementById("speed").value;
    FRAMERATE = document.getElementById("framerate").value;
    ACCELERATION = document.getElementById("acceleration").value;

    // Reset the position of the nickel on the screen.
    var nickel = document.getElementById("nickel");    
    nickel.style.top = "550px";
    nickel.style.left = "250px";
}

// Starts the simulation
function go() {
    reset();
    timer = setInterval(update_position, 1000 / FRAMERATE);
}

// Update the position of the nickel on the screen.
// This function is invoked according to the timer and the framerate.
function update_position() {
    var nickel = document.getElementById("nickel");    
    SPEED *= ACCELERATION;
    var y = parseInt(nickel.style.top);
    var x = parseInt(nickel.style.left);
    nickel.style.top = (y - SPEED) + "px";
    //nickel.style.left = (x + SPEED) + "px";
    console.log(SPEED, x, y);
    // If the piece has stopped moving then disable the timer.
    if (SPEED < 1) {
        clearInterval(timer);
    }
}
