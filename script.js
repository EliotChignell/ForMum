
const canvas = document.querySelector('#mainCanvas');
const context = canvas.getContext('2d');

const display = {
  width: 600,
  height: 600
}

const fps = 30;

var gameState = 0;
var wave = 0;

var pl = { // player / teacher
  x:360,
  y:400,
  w:40,
  h:40,
  c:'deepskyblue'
};

var studentsCaught = 0;

var timeBar = {
  x:0,
  y:580,
  w:canvas.width*2,
  h:20,
  c:'SpringGreen', // SpringGreen => Orange => Crimson
  r:2
}

var keysDown = {};
var students = [];

// Drawing Rectangles
function dr(x,y,w,h,c) {
  context.fillStyle = c;
  context.fillRect(x,y,w,h);
}

// Drawing Text
function dt(x,y,c,f,t) {
  context.fillStyle = c;
  context.font = f;
  context.fillText(t,x,y);
}

// Collision Detection
function collision(ax,ay,aw,ah,bx,by,bw,bh) {
  if (ax < bx + bw && ax + aw  > bx && ay < by + bh && ay + ah > by) {
    return true;
  } else {
    return false;
  }
}

// Random Function
function rand(min, max) {
  return Math.floor((Math.random() * max) + min);
}

// Removing items from arrays
function removeFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
}

// Listening for keys
function listenForKeys() {
  addEventListener('keydown',e => {
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener('keyup',e => {
    delete keysDown[e.keyCode];
  }, false);
}

canvas.width = display.width;
canvas.height = display.height;

function student(x,y) {
  this.x = x;
  this.y = y;
  this.w = 20;
  this.h = 20;
  this.update = function() {
    dr(this.x,this.y,this.w,this.h,'crimson');
  }
}

function generateStudents(amount) {
  for (var i=0;i<amount;i++) {
    students.push(new student(rand(0,canvas.width-20),rand(50,display.height-90)));
  }
}

function mLoop() {

  switch (gameState) {
    case 0:
      listenForKeys();

      // Drawing the background/clearing the screen
      dr(0,0,canvas.width,canvas.height,'black');

      // Drawing teacher
      dr(pl.x,pl.y,pl.w,pl.h,pl.c);

      // Drawing the timeBar
      dr(timeBar.x,timeBar.y,timeBar.w,timeBar.h,timeBar.c);

      // students adding/removing
      for (var i=0;i<students.length;i++) {
        students[i].update();
        if (collision(pl.x,pl.y,pl.w,pl.h,students[i].x,students[i].y,students[i].w,students[i].h)) {
          removeFromArray(students,students[i]);
          studentsCaught++;
        }
      }

      // Drawing the score bar
      dr(0,0,display.width,50,'LightSkyBlue');
      dt(15,35,'black','30px SFCompactDisplay','Students Caught: '+studentsCaught);
      dt(470,35,'black','30px SFCompactDisplay','For Mum');

      // Moving the player
      if ((87 in keysDown || 38 in keysDown) && pl.y > 50) pl.y -= 10;
      if ((83 in keysDown || 40 in keysDown) && pl.y < 540) pl.y += 10;
      if ((65 in keysDown || 37 in keysDown) && pl.x > 0) pl.x -= 10;
      if ((68 in keysDown || 39 in keysDown) && pl.x < 560) pl.x += 10;

      // Updating the timebar
      timeBar.w -= timeBar.r;

      if (students.length < 1) {
        timeBar.w = canvas.width;
        wave++;
        generateStudents(Math.floor(wave*1.5));
      } 

      if (timeBar.w < 1) gameState = 1;
      break;
    case 1:
      // Lol game over scrub
      listenForKeys();

      dr(0,0,canvas.width,canvas.height,'crimson');
      dt(167,100,'black','50px SFCompactDisplay','Game Over!');
      dt(75,300,'black','30px SFCompactDisplay','Press r to restart or press q to quit');
      dt(175,450,'black','30px SFCompactDisplay','Students Caught: '+studentsCaught);
      dt(5,550,'black','30px SFCompactDisplay','Press g to go to the GitHub page of this game');

      if (82 in keysDown) { // restart
        studentsCaught = 0;
        wave = 0;
        generateStudents(1);
        gameState = 0;
      }

      if (81 in keysDown) window.location = 'https://eliotchignell.github.io/';
      if (71 in keysDown) window.location = 'https://github.com/EliotChignell/ForMum';
      break;
  }
}
generateStudents(1);
setInterval(mLoop, 1000/fps);
