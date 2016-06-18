const OUT = 99999999999;
const DELTA = 10;
function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}

function changeAngle(xSpeedBefore, ySpeedBefore, der) {
  let derivative = der;
  const tAngle = Math.atan(derivative);
  const vAngle = Math.atan(ySpeedBefore / xSpeedBefore);
  const diffAngle = tAngle - vAngle;
  const resAngle = diffAngle*2;
  const xSpeedAfter = xSpeedBefore * Math.cos(resAngle) - ySpeedBefore * Math.sin(resAngle);
  const ySpeedAfter = xSpeedBefore * Math.sin(resAngle) + ySpeedBefore * Math.cos(resAngle);
  return [xSpeedAfter, ySpeedAfter];
}


const Barrier = function (id, xDiapason, yDiapason, getBarrier, getSpeedAfterBreak, getCaptureSurfaceSpeed, limit=1) {
  const self = this;
  this.id = id;
  this.xDiapason = xDiapason;
  this.yDiapason = yDiapason;
  this.getBarrier = getBarrier; // must be function y(x) and get args x, y
  this.getSpeedAfterBreak = getSpeedAfterBreak; // function, args: x, y, ySpeedBefore, xSeedBefore
  this.getCaptureSurfaceSpeed = getCaptureSurfaceSpeed; // function, args: x, y, ySpeedBefore, xSeedBefore
  this.checkBreak = function checkBreak(x, y) {
    let isBreak = false;
    if (y < self.yDiapason[1] && y > self.yDiapason[0]) {
      const yCalc = self.getBarrier(x, y);
      if (((Math.floor(y) - limit) <  Number((yCalc).toFixed(1))) && (Number((yCalc).toFixed(1)) < (Math.ceil(y) + limit))) {
        isBreak = true;
      } else {
        isBreak = false;
      }
    } else if (self.yDiapason[1] === self.yDiapason[0] && x < self.xDiapason[1] && x > self.xDiapason[0]) {
      const yCalc = self.yDiapason[1];
      if (((Math.floor(y) - limit) <  Number((yCalc).toFixed(1))) && (Number((yCalc).toFixed(1)) < (Math.ceil(y) + limit))) {
        isBreak = true;
      } else {
        isBreak = false;
      }
    }
    return isBreak;
  };
};

const Spring = function (elements) {
  const self = this;
  this.elements = elements;
  this.count = 0;
  this.animateSpring = function animateSpring() {
    if (self.count < 5) {
      self.count = self.count + 1; // self.count + 1;
      for(let i=0; i<self.elements.length; i++) {
        self.elements[i].style.opacity = '0.0';
      }
      const currentSpring = document.getElementById('spring' + self.count);
      currentSpring.style.opacity = '1.0';

      const currentSpringSurface = document.getElementById('springSurface' + self.count);
      currentSpringSurface.style.opacity = '1.0';
    }
  };

  this.animateSpringDecompression = function animateSpringDecompression() {
    if (self.count > 0) {
      self.count = self.count - 1;
      for(let i=0; i<self.elements.length; i++) {
        self.elements[i].style.opacity = '0.0';
      }
      const currentSpring = document.getElementById('spring' + self.count);
      currentSpring.style.opacity = '1.0';

      const currentSpringSurface = document.getElementById('springSurface' + self.count);
      currentSpringSurface.style.opacity = '1.0';
    } else {
      clearInterval(self.springIntervalDecompression);
    }
  };
  this.startSpringTime = function startSpringTime(e) {
    if (e) {
      e.preventDefault();
    }
    self.springIntervalCompression = setInterval(self.animateSpring, 100);
  };
  this.stopSpringTime = function stopSpringTime(e) {
    if (e) {
      e.preventDefault();
    }
    self.springIntervalDecompression = setInterval(self.animateSpringDecompression, 20);
    clearInterval(self.springIntervalCompression);
  };

  this.getCurrentBarrier = function getCurrentBarrier() {
    let yDiapason;
    if (self.count === 0) {
      yDiapason = [396, 396];
    } else if (self.count === 1) {
      yDiapason = [405, 405];
    } else if (self.count === 2) {
      yDiapason = [415, 415];
    } else if (self.count === 3) {
      yDiapason = [425, 425];
    } else if (self.count === 4) {
      yDiapason = [435, 435];
    } else if (self.count === 5) {
      yDiapason = [445, 445];
    }

    const springPosition = new Barrier(
      'spring',
      [296, 315],
      yDiapason,
      function (x, y) {
        if (Math.floor(y) === yDiapason[0] || Math.ceil(y) === yDiapason[0]) {
          return y;
        } else {
          return OUT;
        }
      },
      function (x, y, xSpeedBefore, ySpeedBefore) {
        return [xSpeedBefore*0.5, -ySpeedBefore*0.5];
      },
      function (x, y, xSpeedBefore, ySpeedBefore) {
        // return [-xSpeedBefore, ySpeedBefore];
        return [0, 0];
      },
      5
    );
    return springPosition;
  };
};


const rPipeLine = new Barrier(
  'rPipeLine',
  [315, 315],
  [134, 500],
  function (x, y) {
    if (Math.floor(x) === 315 || Math.ceil(x) === 315) {
      return y;
    } else {
      return OUT;
    }
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    return [-xSpeedBefore, ySpeedBefore];
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);
const leftPipeLine = new Barrier(
  'leftPipeLine',
  [296, 296],
  [150, 500],
  function (x, y) {
    if (Math.floor(x) === 296 || Math.ceil(x) === 296) {
      return y;
    } else {
      return OUT;
    }
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    return [-xSpeedBefore, ySpeedBefore];
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);
const upPipeArc = new Barrier(
  'upPipeArc',
  [5, 315],
  [10, 150],
  function (x, y) {
    // c = [(x,  (170 -(25000 - (x-160)**2)**(0.5) )  ) for x in xrange(0, 340) if ((25000 - (x-160)**2) >  0) and (x <= 315) and (x >= 5)]
    return (170 - Math.sqrt(25000 - Math.pow(x - 160, 2)) );
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = (x - 160) / Math.sqrt(25000 - Math.pow(x - 160, 2));
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);
const bottomPipeArc = new Barrier(
  'bottomPipeArc',
  [5, 315],
  [5, 150],
  function (x, y) {
    // c = [(x,  (170 -(18400 - (x-161)**2)**(0.5) )  ) for x in xrange(0, 340) if (18400 - (x-161)**2) >  0]
    return (170 -Math.sqrt(18400 - Math.pow(x - 161, 2)) );
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = (x - 160) / Math.sqrt(25000 - Math.pow(x - 160, 2));
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);
const bottomParabola = new Barrier(
  'bottomParabola',
  [2, 65],
  [160, 250],
  function (x, y) {
    // c = [(x, (10*(x-2)**0.5 + 164)  ) for x in xrange(0, 340) if (x <= 60) and (x >= 2)]
    return (164 + 10 * Math.sqrt(x - 2) );
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = 5 / Math.sqrt(x - 2);
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);
const topParabola = new Barrier(
  'topParabola',
  [26, 65],
  [160, 170],
  function (x, y) {
    // c = [(x, (5*(x-26)**0.5 + 156)  ) for x in xrange(0, 340) if (x <= 60) and (x >= 26)]
    return (156 + 2 * Math.sqrt(x - 26) );
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    const derivative = 1 / (Math.sqrt(x - 26));
    return changeAngle(xSpeedBefore, ySpeedBefore, derivative);
  },
  function (x, y, xSpeedBefore, ySpeedBefore) {
    // return [-xSpeedBefore, ySpeedBefore];
  }
);


const barriers = [
  rPipeLine,
  leftPipeLine,
  upPipeArc,
  bottomPipeArc,
  bottomParabola,
  topParabola
];


const Ball = function () {
  const self = this;
  this.element = document.getElementById ( 'gameBall' );
  this.xSpeed = -0.02; // +0.02;
  this.ySpeed = -0.28;
  this.yAcceleration = 0.00005;
  this.xAcceleration = 0;
  this.delta = DELTA;
  // work with surfaces and self force
  this.surface = {};
  this.x = 305;
  this.element.setAttribute ( "cx", this.x);
  this.y = 255; // 395
  this.element.setAttribute ( "cy", this.y);
  this.bang = false;
  this.init = function init(stopFunc) {
    this.stopCallBack = stopFunc;
  };
  this.stopBall = function stopBall() {
    self.xSpeed = 0;
    self.ySpeed = 0;
    self.yAcceleration = 0;
    self.xAcceleration = 0;
    self.stopCallBack();
  };
  this.setNewSpeed = function setNewSpeed(xSpeed, ySpeed) {
    self.xSpeed = xSpeed;
    self.ySpeed = ySpeed;
  };
  this.getNewSpeed = function getNewSpeed() {
    self.xSpeed = self.xSpeed + self.xAcceleration * self.delta;
    self.ySpeed = self.ySpeed + self.yAcceleration * self.delta;
  };
  this.getNewPosition = function getNewPosition() {
    let cxNew, cyNew;
    const cxPrev = self.element.getAttribute( 'cx' );
    const cyPrev = self.element.getAttribute( 'cy' );
    cyNew = parseFloat(cyPrev) + self.ySpeed * self.delta + self.yAcceleration * self.delta * self.delta / 2;
    cxNew = parseFloat(cxPrev) + self.xSpeed * self.delta + self.xAcceleration * self.delta * self.delta / 2;
    self.element.setAttribute ( "cx", cxNew );
    self.element.setAttribute ( "cy", cyNew );
    self.checkBreakPoint(cxNew, cyNew, self.xSpeed, self.ySpeed, self.setNewSpeed, self.getNewSpeed);
    // self.stopBall();
  };
  this.checkBreakPoint = function checkBreakPoint(x, y, xSpeedBefore, ySpeedBefore, breakSpeedFunc, simpleSpeedFunc) {
    let isBreak = false;
    for (let i in barriers) {
      if (barriers[i].checkBreak(x, y)) {
        isBreak = true;
        if (breakSpeedFunc) {
          // check if prev surface equel current then get speed with self force
          if (self.surface && self.surface.id === barriers[i]) {
            console.log('self force calc');
          } else {
            breakSpeedFunc.apply(self, barriers[i].getSpeedAfterBreak(x, y, xSpeedBefore, ySpeedBefore));
          }
          self.surface = barriers[i];
        }
        // self.stopBall();
        break;
      }
    }
    // check if in bat zone
    if (x <= 245 && x >= 60 && y <=470 && y>= 330) {
      const rightBatBarrier = rightBat.getCurrentBarrier();
      const leftBatBarrier = leftBat.getCurrentBarrier();
      if (rightBatBarrier.checkBreak(x, y)) {
        isBreak = true;
        if (self.surface && self.surface.id === rightBatBarrier.id) {
          console.log('self force calc');
        } else {
          breakSpeedFunc.apply(self, rightBatBarrier.getSpeedAfterBreak(x, y, xSpeedBefore, ySpeedBefore));
        }
        self.surface = rightBatBarrier;
      } else if (leftBatBarrier.checkBreak(x, y)) {
        isBreak = true;
        if (self.surface && self.surface.id === rightBatBarrier.id) {
          console.log('self force calc');
        } else {
          breakSpeedFunc.apply(self, leftBatBarrier.getSpeedAfterBreak(x, y, xSpeedBefore, ySpeedBefore));
        }
        self.surface = leftBatBarrier;
      }
    }

    // check if in spring zone
    if (x <= 320 && x >= 290 && y <=450 && y>= 380) {
      const springtBarrier = gameSpring.getCurrentBarrier();
      if (springtBarrier.checkBreak(x, y)) {
        isBreak = true;
        if (self.surface && self.surface.id === springtBarrier.id) {
          breakSpeedFunc.apply(self, springtBarrier.getCaptureSurfaceSpeed(x, y, xSpeedBefore, ySpeedBefore));
        } else {
          breakSpeedFunc.apply(self, springtBarrier.getSpeedAfterBreak(x, y, xSpeedBefore, ySpeedBefore));
        }
        self.surface = springtBarrier;
      }
    }
    if (isBreak == false) {
      self.surface = {};
      simpleSpeedFunc();
    }

    return isBreak;
  };
};


const Bat = function (element, clockwise=true) {
  // <rect id="left-bat" width="90" height="10" ry="5" style="fill:white;" x="60" y="400" transform="rotate(-35 65 400)"/>
  const self = this;
  this.element = element;
  this.clockwise = clockwise;
  if (clockwise) {
    this.speed = 5;
  } else {
    this.speed = -5;
  }
  this.angleDiapason = [-45, 45];
  this.power = false; // if power off, animate bottom splice
  this.init = function init() {
    const transform = self.element.getAttribute('transform');
    const args = transform.split("(")[1].split(')')[0].split(" ").map(parseFloat);
    self.angle = args[0];
    self.xRotate = args[1];
    self.yRotate = args[2];
  };
  this.getCurrentBarrier = function getCurrentBarrier() {
    const angle = self.angle * Math.PI / 180;
    const tan = Math.tan(angle);
    const y2 = Math.sin(angle) * 90;
    const x2 = Math.cos(angle) * 90;
    const b = self.yRotate - tan * self.xRotate;

    let id;
    if (self.clockwise) {
      id = 'leftBat';
    } else {
      id = 'rightBat';
    }

    const batPosition = new Barrier(
      id,
      [Math.min(self.xRotate, x2), Math.max(self.xRotate, x2)],
      [Math.min(self.yRotate, y2), Math.max(self.yRotate, y2)],
      function (x, y) {
        const y1 = tan * x + b;
        return y1;
      },
      function (x, y, xSpeedBefore, ySpeedBefore) {
        const tAngle = angle;
        const vAngle = Math.atan(xSpeedBefore / ySpeedBefore);
        const diffAngle = Math.abs(Math.abs(tAngle < 0 ? (Math.PI + tAngle) : tAngle) - Math.abs(vAngle < 0 ? (Math.PI + vAngle) : vAngle));
        const normAngle = (diffAngle > Math.PI / 2) ? (Math.PI - diffAngle) : diffAngle;
        const resAngle = normAngle*2;
        const xSpeedAfter = xSpeedBefore * Math.cos(resAngle) - ySpeedBefore * Math.sin(resAngle);
        const ySpeedAfter = xSpeedBefore * Math.sin(resAngle) + ySpeedBefore * Math.cos(resAngle);
        return [xSpeedAfter, ySpeedAfter];
      },
      function (x, y, xSpeedBefore, ySpeedBefore) {
        // return [-xSpeedBefore, ySpeedBefore];
      },
      3
    );
    return batPosition;
  };
  this.setPower = function setPower() {
    self.power = true;
  };

  this.zeroPower = function zeroPower() {
    self.power = false;
  };
  this.getNewPosition = function getNewPosition() {
    if (!self.power) {
      // calc position
      self.angle = self.angle + self.speed;
      if (Math.abs(self.angle) >= 45) {
        if (self.clockwise) {
          self.angle = 45;
        } else {
          self.angle = -45;
        }
      }
      self.element.setAttribute('transform', 'rotate(' + self.angle + ' ' + self.xRotate + ' ' + self.yRotate + ')');
    } else {
      self.angle = self.angle - self.speed;
      if (self.clockwise) {
        self.angle = Math.max(self.angleDiapason[0], self.angle);
      } else {
        self.angle = Math.min(self.angleDiapason[1], self.angle);
      }
      self.element.setAttribute('transform', 'rotate(' + self.angle + ' ' + self.xRotate + ' ' + self.yRotate + ')');
    }
  };
};

const leftBatElement = document.getElementById('left-bat');
const rightBatElement = document.getElementById('right-bat');
const leftBat = new Bat(leftBatElement, true);
const rightBat = new Bat(rightBatElement, false);
leftBat.init();
rightBat.init();
document.onkeydown = function (e) {
  if (e.keyCode === 65) {
    leftBat.setPower();
  } else if (e.keyCode === 68) {
    rightBat.setPower();
  }
};
document.onkeyup = function (e) {
  if (e.keyCode === 65) {
    leftBat.zeroPower();
  } else if (e.keyCode === 68) {
    rightBat.zeroPower();
  }
};


const Game = function () {
  const self = this;
  this.animate = function animate() {
    leftBat.getNewPosition();
    rightBat.getNewPosition();
    self.gameBall.getNewPosition();
  };
  this.play = function play() {
    const gameBall = new Ball();
    gameBall.init(self.stop);
    self.gameBall = gameBall;
    self.animateInterval = setInterval(self.animate, DELTA);
  };
  this.stop = function stop() {
    clearInterval(self.animateInterval);
  };
  this.start = function start() {
    self.animateInterval = setInterval(self.animate, DELTA);
  };
  this.reset = function reset() {
    clearInterval(self.animateInterval);
    delete self.gameBall;
    const gameBall = new Ball();
    self.gameBall = gameBall;
    self.animateInterval = setInterval(self.animate, DELTA);
  };
};


const springElement = document.getElementById('spring');
const springAnimatedElements = document.getElementsByClassName("spring");
const gameSpring = new Spring(springAnimatedElements);
springElement.onmousedown = gameSpring.startSpringTime.bind(null);
springElement.onmouseup = gameSpring.stopSpringTime.bind(null);
springElement.touchstart = gameSpring.startSpringTime.bind(null); // touch actions
springElement.touchend = gameSpring.stopSpringTime.bind(null); // touch actions


const game = new Game();
game.play();

const stop = document.getElementById('stop');
const start = document.getElementById('start');
const reset = document.getElementById('reset');
stop.onclick = game.stop;
start.onclick = game.start;
reset.onclick = game.reset;



