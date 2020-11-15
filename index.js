//init
canvas = document.querySelector('#canvas');
c = canvas.getContext('2d');
shapes = {};
afterimageArr = [];
for (var i = 0; i < 10; i++) afterimageArr.push(c);
playing = 0;

//canvas related
canvasSetting = {
  'position': [0, 0], 'scale': 1,
  'backColor': '#222',
  'rotate': 50, 'rotateSpeed': 0,
  'graysclae': 0,
  'focusEffect': 0, 'afterimageEffect': 5
}
function drawCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.rect(0, 0, canvas.width, canvas.height);
  c.fillStyle = canvasSetting.backColor;
  c.fill();

  canvasSetting.rotate = (canvasSetting.rotate+canvasSetting.rotateSpeed)%360;

  for (var z = 0; z < 10; z++) {
    for (var name in shapes) {
      if (shapes[name].zIndex != z) continue;
      shapes[name].rotation = (shapes[name].rotation+shapes[name].rotationSpeed)%360;
      shapes[name].moveDeg += shapes[name].degSpeed;
      if (shapes[name].spanPer != 0) {
        var per = [shapes[name].spanPer, 1];
        shapes[name].position[0] = (shapes[name].position[0]*per[0]+shapes[name].spanMove[0]*per[1])/(per[0]+per[1]);
        shapes[name].position[1] = (shapes[name].position[1]*per[0]+shapes[name].spanMove[1]*per[1])/(per[0]+per[1]);
      }
      shapes[name].position[0] += shapes[name].moveSpeed*Math.sin(Math.rad(shapes[name].moveDeg))/100;
      shapes[name].position[1] -= shapes[name].moveSpeed*Math.cos(Math.rad(shapes[name].moveDeg))/100;
      shapes[name].scale[0] = Math.min(shapes[name].scale[0]+shapes[name].scaleSpeed[0]/100, shapes[name].scaleCap[0]);
      shapes[name].scale[1] = Math.min(shapes[name].scale[1]+shapes[name].scaleSpeed[1]/100, shapes[name].scaleCap[1]);
      c.beginPath();
      //c.setTransform(Math.cos(Math.rad(canvasSetting.rotate)), Math.sin(Math.rad(canvasSetting.rotate)), -Math.sin(Math.rad(canvasSetting.rotate)), Math.cos(Math.rad(canvasSetting.rotate)), innerHeight/2, innerHeight/2);
      c.lineWidth = Math.abs(shapes[name].lineWidth*innerHeight/1000*canvasSetting.scale);
      c.globalAlpha = shapes[name].alpha;
      c.strokeStyle = shapes[name].lineColor;
      c.fillStyle = shapes[name].fillColor;
      //Math.csc(shapes[name].sides);
      var p = shapes[name].position;
      var s = shapes[name].sides;
      var d = shapes[name].rotation;
      var d1 = (-d+180/s)%360;
      var centerL = Math.csc(Math.rad(180/s))/2*shapes[name].lineLength;
      var lastPos = [
        innerHeight*(-canvasSetting.position[0]/2*canvasSetting.scale+0.5+p[0]/2*canvasSetting.scale-Math.sin(Math.rad(d1))*centerL*shapes[name].scale[0]*canvasSetting.scale),
        innerHeight*(canvasSetting.position[1]/2*canvasSetting.scale+0.5-p[1]/2*canvasSetting.scale-Math.cos(Math.rad(d1))*centerL*shapes[name].scale[1]*canvasSetting.scale)
      ];
      c.moveTo(lastPos[0], lastPos[1]);
      for (var i = 0; i < shapes[name].sides; i++) {
        lastPos[0] += Math.sin(Math.PI*2/s*i+Math.rad(d+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[0]*canvasSetting.scale;
        lastPos[1] -= Math.cos(Math.PI*2/s*i+Math.rad(d+90))*(innerHeight*shapes[name].lineLength)*shapes[name].scale[1]*canvasSetting.scale;
        c.lineTo(lastPos[0], lastPos[1]);
      }
      c.scale(shapes[name].scale[0], shapes[name].scale[1]);
      if (shapes[name].filled) {
        c.closePath();
        c.fill();
      }
      c.stroke();
      shapes[name].tickDelete = Math.max(shapes[name].tickDelete-1, -1);
      if (Math.abs(shapes[name].position[0]) > Math.abs(shapes[name].deleltePos[0]) || Math.abs(shapes[name].position[1]) > Math.abs(shapes[name].deleltePos[1]) || shapes[name].tickDelete == 0) {
        delete shapes[name];
        continue;
      }
    }
  }

  //focusEffect
  if (canvasSetting.focusEffect > 0) {
    resetCanvasEff();
    var grd = c.createRadialGradient(innerHeight/2,innerHeight/2,innerHeight*(1-canvasSetting.focusEffect),innerHeight/2,innerHeight/2,innerHeight);
    grd.addColorStop(0,"rgba(0,0,0,0)");
    grd.addColorStop(1,"#fff");
    c.fillStyle = grd;
    c.fillRect(0, 0, innerHeight, innerHeight);
  }

  //afterimageEffect
}
defShapeValues = {
  'sides': 3, 'position': [0, 0], 'scale': [1, 1],
  'rotation': 0, 'rotationSpeed': 0,
  'lineLength': 0.1, 'lineWidth': 0.00001, 'lineColor': '#f00',
  'filled': 1, 'fillColor': '#f00',
  'moveDeg': 0, 'degSpeed': 0,
  'moveSpeed': 0, 'spanMove': [0, 0], 'spanPer': 0,
  'scaleSpeed': [0, 0], 'scaleCap': [1e308, 1e308],
  'alpha' : 1, 'zIndex': 4,
  'deleltePos': [1e308, 1e308], 'tickDelete' : -1
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
pushShape('p1s1', {'position': [0.5, 0.5], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d'})
pushShape('p1s2', {'position': [-0.5, 0.5], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#34b1eb', 'lineColor': '#3d94bf'})
pushShape('p1s3', {'position': [-0.5, -0.5], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#d15252', 'lineColor': '#bf3d3d'})
pushShape('p1s4', {'position': [0.5, -0.5], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#a952d1', 'lineColor': '#a53dbf'})

//other funtions
play();
async function play() {
  playing ^= 1;
  await playMusic()
  //setTimeout( function() {pushShape('p1s1', {'position': [0, 0], 'rotation': 0, 'rotationSpeed': 2, 'sides': 7, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d', 'spanMove': [1, 1], 'spanPer': 20})}, 1);
}
async function playMusic() {
  var audio = await new Audio('MM1.mp3');
  //audio.play();
}

//effects functions
function hexagonBgSpan(name, l=0.2, dPx=0, dPy=0) {
  //name length(between) degPlusX degPlusY
  for (var i = 0; i < 3/l; i++) {
    for (var j = 0; j < 3/l; j++) {
      pushShape(name + '-' + i + ', ' + j, {'position': [20, 1.5-l*j], 'rotation': dPx*i+dPy*j, 'sides': 6, 'lineWidth': 10, 'fillColor': '#8fd152', 'lineColor': '#7cbf3d', 'spanMove': [-1.5+l*i, 1.5-l*j], 'spanPer': j+i*4+1})
    }
  }
}
async function chromaticAberration(p=0.1, pP=-0.001, c=2, name='(.*)+', ts=20, td=p/(-pP)) {
  //power(length from shape) powerPlus(per tick) colorCount(r, g, b) name(regex) tickSpeed(ms) tickCountToDelete(tickCount)
  if (c > 3) c = 3;
  for (var pShape in shapes) {
    if (pShape.includes('CAEffectShape')) continue;
    if (!pShape.replace(new RegExp(name,''), 'DoNe').includes('DoNe')) continue;
    for (var i = 0; i < c; i++) {
      var tempAttr = deepCopy(shapes[pShape]);
      var colThis;
      if (tempAttr.fillColor.length == 7) {
        colThis = tempAttr.fillColor.substr(1+i*2, 2);
      } else {
        colThis = tempAttr.fillColor.substr(1+i, 1).repeat(2);
      }
      tempAttr.fillColor = '#' + ('0').repeat(i*2) + colThis + ('0').repeat(4-i*2);
      var colThis;
      if (tempAttr.lineColor.length == 7) {
        colThis = tempAttr.lineColor.substr(1+i*2, 2);
      } else {
        colThis = tempAttr.lineColor.substr(1+i, 1).repeat(2);
      }
      tempAttr.lineColor = '#' + ('0').repeat(i*2) + colThis + ('0').repeat(4-i*2);
      var degToGo = (90+360/c*i)%360;
      tempAttr.position[0] += p*Math.sin(Math.rad(degToGo));
      tempAttr.position[1] -= p*Math.cos(Math.rad(degToGo));
      tempAttr.tickDelete = Math.max(2, ts/20);
      tempAttr.alpha /= 2;
      tempAttr.zIndex--;
      pushShape(`CAEffectShape-${pShape}-${new Date().getTime()}-c${i}`, tempAttr);
    }
  }
  if (td > 1) {
    await timer(ts)
    chromaticAberration(p+pP, pP, c, ts, name, td-1);
  }
}
async function focusEffectSpan(range=[0, 0.3], per=12, l=200, ts=20) {
  //range(from, to) per(1/per) loopCount
}
async function cameraSpan(pos=[0, 0], scale=1, per=1, l=100, ts=20, eb=1) {
  //position(x, y) scale(screen scale) per(1/per) l(loopCount) earlyBreak(0 to remove small offset)
  canvasSetting.position[0] = (pos[0]+canvasSetting.position[0]*per)/(per+1);
  canvasSetting.position[1] = (pos[1]+canvasSetting.position[1]*per)/(per+1);
  canvasSetting.scale = (scale+canvasSetting.scale*per)/(per+1);
  await timer(20);
  if (l<=1 || (eb && Math.abs(canvasSetting.position[0]-pos[0]) < 0.01 && Math.abs(canvasSetting.position[1]-pos[1]) < 0.01 && Math.abs(canvasSetting.scale-scale) < 0.01)) return;
  cameraSpan(pos, scale, per, l-1);
}
function spreadShapes(name, count=100, pos=[0,0], range=[[-1,1],[-1,1]]) {
  for (var i = 0; i < count; i++) {
    pushShape(`${name}s${i}`, {'position': [0, 0], 'spanPer': 20, 'spanMove': [Math.random()*(range[0][1]-range[0][0])+range[0][0], Math.random()*(range[1][1]-range[1][0])+range[1][0]], 'rotationSpeed': Math.random()*5, 'sides': Math.floor(3+Math.random()*6), 'lineWidth': Math.random()*1+0.5, 'fillColor': `#${Math.floor(12+Math.random()*4).toString(16)}${Math.floor(12+Math.random()*4).toString(16)}${Math.floor(12+Math.random()*4).toString(16)}`, 'lineColor': `#${Math.floor(12+Math.random()*4).toString(16)}${Math.floor(12+Math.random()*4).toString(16)}${Math.floor(12+Math.random()*4).toString(16)}`, 'lineLength': Math.random()*0.03+0.02})
  }
}

//loop
setInterval( function () {
  canvas.width = innerHeight;
  canvas.height = innerHeight;
  drawCanvas();
}, 20);

//basic functions
const timer = ms => new Promise(res => setTimeout(res, ms))
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function resetCanvasEff() {
  c.lineWidth = 1;
  c.globalAlpha = 1;
  c.strokeStyle = '#000';
  c.fillStyle = '#f00';
}

//overriding!
Math.rad = function(degrees) {
  return degrees * Math.PI / 180;
};
Math.csc = function(radian) {
  return 1/Math.sin(radian);
};
