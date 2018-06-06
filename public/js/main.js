document.addEventListener('DOMContentLoaded', function () {
  var ball = document.querySelector('.ball');
  var zone = document.querySelector('.zone-2');
  // var output = document.querySelector('.output');

  var maxX = zone.clientWidth - ball.clientWidth;
  var maxY = zone.clientHeight - ball.clientHeight;

  function handleOrientation(event) {
    var scale = 3;

    var x = event.beta * scale; // In degree in the range [-180,180]
    var y = event.gamma * scale; // In degree in the range [-90,90]

    // output.innerHTML  = "beta : " + x + "\n";
    // output.innerHTML += "gamma: " + y + "\n";

    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }

    // To make computation easier we shift the range of 
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top = (maxX * x / 180 - 30) + "px";
    ball.style.left = (maxY * y / 180 - 30) + "px";
  }

  window.addEventListener('deviceorientation', handleOrientation);
});