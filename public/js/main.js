var zone2 = {
    Actions: {
        Send: {
            Stats: {
                Location: null,
                Pulse: null,
            },
            Communication: {
                Wave: null,
                Text: null,
            }
        },
        Settings: {
            Systems: {
                Bluetooth: null,
                GPS: null,
            },
            Modes: {
                DoNotDisturb: null,
                Sleep: null,
            }
        }
    },
    Info: {
        Calendar: {
            View: {
                Today: null,
                Tomorrow: null,
            },
            Change: {
                AddEvent: null,
                CancelEvent: null,
            }
        },
        Health: {
            Cardiac: {
                Pulse: null,
                O2: null,
            },
            Energy: {
                Calories: null,
                Steps: null,
            }
        }
    },
};

var zone4 = {
    Send: {
        Location: null,
        Pulse: null,
        Wave: null,
        Text: null
    },
    Settings: {
        Bluetooth: null,
        GPS: null,
        Do_Not_Disturb: null,
        Sleep: null
    },
    Calendar: {
        Today: null,
        Tomorrow: null,
        Add_Event: null,
        Cancel_Event: null
    },
    Health: {
        Pulse: null,
        O2: null,
        Calories: null,
        Steps: null
    },
};

var level = [];

document.addEventListener('DOMContentLoaded', function() {

    var c = document.querySelector(".zone-nuetral");
    var ctx = c.getContext("2d");

    var twoZone = true;
    var menu = zone2;
    var maxLevel = 2;

    function drawMenu() {
      ctx.clearRect(0, 0, c.width, c.height);

      if (level.length) {
          for (var i in level) {
              menu = menu[level[i]];
          }
      }
  
      var i = 0;
      for (var option in menu) {
          ctx.font = "15px Arial";
  
          if (i++ === 0) {
              ctx.fillText(option, 120, 40);
          } else {
              ctx.fillText(option, 130, 120);
          }
      }
    }

    drawMenu();

    var ball = document.querySelector('.ball');
    var zone = document.querySelector('.zone-2');
    var zoneNeutral = document.querySelector('.zone-nuetral');
    // var output = document.querySelector('.output');

    var maxX = zone.clientWidth - ball.clientWidth;
    var maxY = zone.clientHeight - ball.clientHeight;

    var selection = {
      _timer: null,
      start: function(cb) {
        if (this._timer === null) {
          this._timer = setTimeout(function() {
            cb();
          }, 2000);
        }
      },
      stop: function() {
        if (this._timer) {
          clearTimeout(this._timer);
          this._timer = null;
        }
      }
    };

    function handleOrientation(event) {
        var ballCenterX = ball.offsetLeft - 160;
        var ballCenterY = ball.offsetTop - 160;

        var d = ((ballCenterX)^2 + (ballCenterY))^0.5;

        if (Math.abs(d) > 130) {
          ball.style.background = "blue";
          selection.start(function() {
            if (level.length < maxLevel-1) {

              if (twoZone) {
                if (ballCenterY > 0) {
                  level.push(Object.keys(menu)[0]);
                } else {
                  level.push(Object.keys(menu)[1]);
                }
              } else {

              }
              drawMenu();
            }
          });
        } else if (Math.abs(d) > 45) {
          ball.style.background = "green";
          selection.stop();
        } else {
          ball.style.background = "red";
        }

        var scale = 3;

        var y = event.beta * scale; // In degree in the range [-180,180]
        var x = event.gamma * scale; // In degree in the range [-90,90]

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
        ball.style.top = (maxY * y / 180.0 - ball.clientWidth/2.0) + "px";
        ball.style.left = (maxX * x / 180.0 - ball.clientWidth/2.0) + "px";
    }

    window.addEventListener('deviceorientation', handleOrientation);
});