function drawRoundedRect(gc, x, y, w, h, r) {
  gc.beginPath();
  gc.moveTo(x + r, y);
  gc.lineTo(x + w - r, y);
  gc.lineTo(x + w, y + r);
  gc.lineTo(x + w, y + h - r);
  gc.lineTo(x + w - r, y + h);
  gc.lineTo(x + r, y + h);
  gc.lineTo(x, y + h - r);
  gc.lineTo(x, y + r);
  gc.closePath();
  gc.fill();
  gc.stroke();
}

const SIZE = 24;
const GAP = 6;
const R = 4;

const SG = SIZE + GAP;

function drawKey(active, gc, label, x, y, w, h) {
  gc.fillStyle = active ? 'white' : 'transparent';
  gc.strokeStyle = active ? '#ddd' : 'rgba(255, 255, 255, .2)';
  gc.lineWidth = 4;
  drawRoundedRect(gc, x, y, w, h, R);
  // Text
  gc.fillStyle = active ? 'black' : 'rgba(255, 255, 255, .2)';
  gc.textAlign = 'center';
  gc.font = '20px Consolas';
  gc.save();
  gc.translate(w / 2, h / 2 + GAP);
  gc.fillText(label, x, y);
  gc.restore();
}

function draw(gc, keys, w, h) {
  const up = keys['ArrowUp'] || keys['KeyW'];
  const down = keys['ArrowDown'] || keys['KeyS'];
  const shoot = keys['Space'];

  drawKey(up, gc, '↑', w - SG * 2, h - SG * 3, SIZE, SIZE);
  drawKey(down, gc, '↓', w - SG * 2, h - SG * 2, SIZE, SIZE);
  drawKey(shoot, gc, 'FIRE', w - SG * 3, h - SG, SG * 3 - GAP, SIZE);
}

export default { draw };
