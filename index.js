//init
canvas = document.querySelector('#canvas');
c = canvas.getContext('2d');
univScale = 1;
absPos = [0, 0];
shapes = {};

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
    c.beginPath();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.lineWidth = shapes[name].lineWidth*innerHeight/1000;
    c.strokeStyle = shapes[name].lineColor;
    c.fillStyle = shapes[name].fillColor;
    //Math.csc(shapes[name].sides)
    var lastPos = [
      innerHeight*(0.5+shapes[name].position[0]/2+Math.cos(Math.rad(180/shapes[name].sides))/2*Math.csc(Math.rad(180/shapes[name].sides))*shapes[name].lineLength*shapes[name].scale[0]),
      innerHeight*(0.5-shapes[name].position[1]/2-Math.sin(Math.rad(180/shapes[name].sides))/2*Math.csc(Math.rad(180/shapes[name].sides))*shapes[name].lineLength*shapes[name].scale[1])
    ];
    c.moveTo(lastPos[0], lastPos[1]);
    for (var i = 0; i < shapes[name].sides; i++) {
      lastPos[0] += Math.sin(Math.PI*2/shapes[name].sides*i+Math.rad(shapes[name].rotation+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[0];
      lastPos[1] -= Math.cos(Math.PI*2/shapes[name].sides*i+Math.rad(shapes[name].rotation+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[1];
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
  'position': [0, 0],
  'rotation': 0,
  'scale': [1, 1],
  'sides': 3,
  'lineLength': 0.1,
  'lineWidth': 0.00001,
  'lineColor': '#f00',
  'filled': 1,
  'fillColor': '#f00'
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

//loop
setInterval( function () {
  canvas.width = innerHeight;
  canvas.height = innerHeight;
  drawCanvas();
}, 50);
pushShape('name', {
  'position': [0, 0],
  'rotation': 90,
  'scale': [1, 1],
  'sides': 7,
  'lineLength': 0.1,
  'lineWidth': 10,
  'lineColor': '#88c22b',
  'filled': 1,
  'fillColor': '#bdff52'
})
pushShape('name2', {
  'position': [0, 0],
  'rotation': 90,
  'scale': [1, 1],
  'sides': 6,
  'lineLength': 0.000001,
  'lineWidth': 10,
  'lineColor': '#88c22b',
  'filled': 1,
  'fillColor': '#bdff52'
})

//overriding!
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
