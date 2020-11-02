//init
canvas = document.querySelector('#canvas');
c = canvas.getContext('2d');
univScale = 1;
absPos = [0, 0];
shapes = {};
playing = 0;

//canvas related
canvasSetting = {
  'backColor': '#e3ddc5'
}
function drawCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.rect(0, 0, canvas.width, canvas.height);
  c.fillStyle = canvasSetting.backColor;
  c.fill();
  for (var name in shapes) {
    shapes[name].rotation = (shapes[name].rotation+shapes[name].rotationSpeed)%360;
    shapes[name].moveDeg += shapes[name].degSpeed;
    shapes[name].moveSpeed = Math.min(shapes[name].moveSpeed+shapes[name].accSpeed, shapes[name].speedCap);
    shapes[name].position[0] += shapes[name].moveSpeed*Math.sin(Math.rad(shapes[name].moveDeg))/100;
    shapes[name].position[1] -= shapes[name].moveSpeed*Math.cos(Math.rad(shapes[name].moveDeg))/100;
    shapes[name].scale[0] = Math.min(shapes[name].scale[0]+shapes[name].scaleSpeed[0]/100, shapes[name].scaleCap[0]);
    shapes[name].scale[1] = Math.min(shapes[name].scale[1]+shapes[name].scaleSpeed[1]/100, shapes[name].scaleCap[1]);
    c.beginPath();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.lineWidth = shapes[name].lineWidth*innerHeight/1000;
    c.strokeStyle = shapes[name].lineColor;
    c.fillStyle = shapes[name].fillColor;
    //Math.csc(shapes[name].sides);
    var p = shapes[name].position;

    var s = shapes[name].sides;
    var d = shapes[name].rotation;
    var d1 = (-d+180/s)%360;
    var centerL = Math.csc(Math.rad(180/s))/2*shapes[name].lineLength;
    var lastPos = [
      innerHeight*(0.5+p[0]/2-Math.sin(Math.rad(d1))*centerL*shapes[name].scale[0]),
      innerHeight*(0.5-p[1]/2-Math.cos(Math.rad(d1))*centerL*shapes[name].scale[1])
    ];
    c.moveTo(lastPos[0], lastPos[1]);
    for (var i = 0; i < shapes[name].sides; i++) {
      lastPos[0] += Math.sin(Math.PI*2/s*i+Math.rad(d+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[0];
      lastPos[1] -= Math.cos(Math.PI*2/s*i+Math.rad(d+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[1];
      c.lineTo(lastPos[0], lastPos[1]);
    }
    c.scale(shapes[name].scale[0], shapes[name].scale[1]);
    if (shapes[name].filled) {
      c.closePath();
      c.fill();
    }
    c.stroke();
  }
}
defShapeValues = {
  'sides': 3, 'position': [0, 0], 'scale': [1, 1],
  'rotation': 0, 'rotationSpeed': 0,
  'lineLength': 0.1, 'lineWidth': 0.00001, 'lineColor': '#f00',
  'filled': 1, 'fillColor': '#f00',
  'moveDeg': 0, 'degSpeed': 0,
  'moveSpeed': 0, 'accSpeed': 0, 'speedCap': 1e308,
  'scaleSpeed': [0, 0], 'scaleCap': [1e308, 1e308]
};
function pushShape(name, attrObj={}) {
  shapes[name] = {};
  for (var i in defShapeValues) {
    if (attrObj[i] !== undefined) {
      shapes[name][i] = attrObj[i];
    } else {
      shapes[name][i] = defShapeValues[i];
    }
  }
}
function deleteShape(name) {
  delete shapes[name];
}

//other funtions
play();
async function play() {
  playing ^= 1;
  await playMusic()
  //setTimeout( function() {pushShape('p1s0', {'position': [-.8, 0.05], 'rotation': 0, 'sides': 5, 'lineWidth': 10, 'fillColor': '#f00', 'lineColor': '#7cbf3d'})}, 1000);
  setTimeout( function() {pushShape('p1s1', {'position': [0, 0], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d'})}, 1);
  setTimeout( function() {pushShape('p1s-', {'position': [0, 0], 'rotation': 0, 'sides': 7, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d'})}, 1);
  setTimeout( function() {pushShape('name1', {
  'sides': 6, 'position': [0, 0], 'scale': [1, 1],
  'rotation': 0, 'rotationSpeed': 0,
  'lineLength': 0.01, 'lineWidth': 0.00001, 'lineColor': '#f00',
  'filled': 1, 'fillColor': '#f00',
  'moveDeg': 0, 'degSpeed': 0,
  'moveSpeed': 0, 'accSpeed': 0, 'speedCap': 1e308,
  'scaleSpeed': [1, 1], 'scaleCap': [-1, -1]
})}, 0);
  //setTimeout( function() {pushShape('p1s2', {'position': [-.2, 0], 'sides': 4, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d'})}, 1400);
  //setTimeout( function() {pushShape('p1s3', {'position': [0.3, 0], 'sides': 3, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d'})}, 1800);
}
async function playMusic() {
  var audio = await new Audio('MM1.mp3');
  //audio.play();
}


//loop
setInterval( function () {
  canvas.width = innerHeight;
  canvas.height = innerHeight;
  drawCanvas();
}, 20);

//overriding!
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
