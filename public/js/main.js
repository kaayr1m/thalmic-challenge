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

let app = firebase.app();
var database = firebase.database();

var selection = {
  _timer: null,
  start: function (cb) {
    if (this._timer === null) {
      this._timer = setTimeout(function () {
        cb();
      }, 1500);
    }
  },
  stop: function () {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
};

var analytics = {
  _prevTime: null,
  _complete: false,
  _started: false,
  _study: {},
  reset: function () {
    this._prevTime = null;
    this._started = false;
    this._complete = false;
    this._study = {};
  },
  start: function (cb) {
    if (this._complete || this._started) return;
    this._started = true;

    this._prevTime = new Date();
  },
  mark: function (toLevel) {
    if (this._complete || !this._started) return;

    var currTime = new Date();

    var seconds = Math.round((currTime - this._prevTime) / 1000);
    this._study["TimeTo" + toLevel] = seconds;

    this._prevTime = currTime;
  },
  stop: function () {
    if (this._complete || !this._started) return;

    this._complete = true;

    var currTime = new Date();
    var seconds = Math.round((currTime - this._prevTime) / 1000);
    this._study.TimeToFinal = seconds;

    firebase.database().ref('studies/' + new Date()).set(this._study);

    if (twoZone) newStudy2Zones();
    else newStudy4Zones();

    swal({
      title: "Good job!",
      text: "Thanks for completing this part of the study. Await for the next intructions.",
      icon: "success",
      button: "Ok!",
    });
  }
};

var c = document.querySelector(".zone-nuetral");
  var ctx = c.getContext("2d");

  var twoZone = true;
  var menu;
  var maxLevel;
  function drawMenu() {
    if (twoZone) {
      menu = zone2;
      maxLevel = 4;
    } else {
      menu = zone4;
      maxLevel = 2;
    }
    ctx.clearRect(0, 0, c.width, c.height);

    if (level.length) {
      for (var i in level) {
        menu = menu[level[i]];
      }
    }

    var i = 0;
    if (twoZone) {
      for (let option in menu) {
        ctx.font = "15px Arial";

        if (i++ === 0) {
          ctx.fillText(option, 120, 40);
        } else {
          ctx.fillText(option, 130, 120);
        }
      }
    } else {
      for (let option in menu) {
        ctx.font = "15px Arial";

        var o = option.replace("_", " ");

        if (i === 0) {
          ctx.fillText(o, 120, 40);
        } else if (i === 1) {
          ctx.fillText(o, 200, 80);
        } else if (i === 2) {
          ctx.fillText(o, 130, 120);
        } else if (i === 3) {
          ctx.fillText(o, 30, 80);
        }

        i ++;
      }
    }
  }

function newStudy2Zones() {
  document.getElementById("zone").className = "zone-2";
  twoZone = true;
  level = [];
  analytics.reset();
  drawMenu();
}

function newStudy4Zones() {
  document.getElementById("zone").className = "zone-4";
  twoZone = false;
  level = [];
  analytics.reset();
  drawMenu();
}

document.addEventListener('DOMContentLoaded', function () {

  drawMenu();

  var ball = document.querySelector('.ball');
  var zone = document.querySelector('.zone-2');
  var zoneNeutral = document.querySelector('.zone-nuetral');
  // var output = document.querySelector('.output');

  var maxX = zone.clientWidth - ball.clientWidth;
  var maxY = zone.clientHeight - ball.clientHeight;

  function handleOrientation(event) {
    var ballCenterX = ball.offsetLeft - 160;
    var ballCenterY = ball.offsetTop - 160;

    var d = ((ballCenterX) ^ 2 + (ballCenterY)) ^ 0.5;

    if (Math.abs(d) > 130) {
      ball.style.background = "blue";
      selection.start(function () {
        if (level.length < maxLevel - 1) {
          if (twoZone) {
            if (ballCenterY > 0) {
              level.push(Object.keys(menu)[0]);
            } else {
              level.push(Object.keys(menu)[1]);
            }
          } else {
            if (ballCenterY > 0 && (ballCenterX < 97 && ballCenterX > -97)) {
              level.push(Object.keys(menu)[0]);
            } else if (ballCenterY < 0 && (ballCenterX < 97 && ballCenterX > -97)) {
              level.push(Object.keys(menu)[2]);
            } else if (ballCenterX < 0 && (ballCenterY < 97 && ballCenterY > -97)) {
              level.push(Object.keys(menu)[3]);
            } else if (ballCenterX > 0 && (ballCenterY < 97 && ballCenterY > -97)) {
              level.push(Object.keys(menu)[1]);
            }
          }
          analytics.mark(level[level.length - 1]);
          drawMenu();
        } else {
          analytics.stop();
        }
      });
    } else if (Math.abs(d) > 45) {
      ball.style.background = "green";
      analytics.start();
      selection.stop();
    } else {
      ball.style.background = "red";
    }

    var scale = 3;

    var y = event.beta * scale;
    var x = event.gamma * scale;

    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }

    x += 90;
    y += 90;

    ball.style.top = (maxY * y / 180.0 - ball.clientWidth / 2.0) + "px";
    ball.style.left = (maxX * x / 180.0 - ball.clientWidth / 2.0) + "px";
  }

  window.addEventListener('deviceorientation', handleOrientation);
});