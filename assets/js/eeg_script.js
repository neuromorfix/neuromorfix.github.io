const canvas = document.getElementById('eegCanvas');
const ctx = canvas.getContext('2d');

const BASE_W = 800;
const BASE_H = 350;
const BASE_OFFSET_X = 50;
const BASE_OFFSET_Y = 175;
const BASE_PLOT_W = 700;
const BASE_Y_SCALE = 1.2;

let animationId = null; // store current animation frame ID

function cancelAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function generateN170(strength) {
  const points = [];
  for (let t = 0; t <= 500; t += 2) {
    const deflection = Math.exp(-Math.pow((t - 170) / 40, 2)) * -strength;
    const noise = (Math.random() - 0.5) * 4;
    points.push({ t, amp: deflection + noise });
  }
  return points;
}

function computeAxes() {
  canvas.width = Math.round(canvas.clientWidth * devicePixelRatio);
  canvas.height = Math.round(canvas.clientHeight * devicePixelRatio);
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const sx = canvas.clientWidth / BASE_W;
  const sy = canvas.clientHeight / BASE_H;

  const offsetX = BASE_OFFSET_X * sx;
  const offsetY = BASE_OFFSET_Y * sy;
  const xScale = (BASE_PLOT_W / 500) * sx;
  const yScale = BASE_Y_SCALE * sy;

  return { offsetX, offsetY, xScale, yScale, sx, sy };
}

function drawAxes(axes) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  const { offsetX, offsetY, xScale, yScale } = axes;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#888';
  ctx.fillStyle = '#333';
  ctx.font = `${Math.max(12, Math.round(canvas.clientHeight * 0.04))}px Arial`;

  ctx.beginPath();
  ctx.moveTo(offsetX, canvas.clientHeight * 0.14);
  ctx.lineTo(offsetX, canvas.clientHeight * 0.86);
  ctx.moveTo(offsetX, offsetY);
  ctx.lineTo(offsetX + (xScale * 500), offsetY);
  ctx.stroke();

  ctx.fillText('Amplitude (µV)', 8, Math.max(20, canvas.clientHeight * 0.05));
  ctx.fillText('Time (ms)', canvas.clientWidth - 80, offsetY + 50);

  for (let i = 0; i <= 500; i += 100) {
    const x = offsetX + i * xScale;
    // Skip the label if i == 0
    if (i !== 0) {
      ctx.fillText(i.toString(), x - 10, offsetY + 20);
    }
    ctx.beginPath();
    ctx.moveTo(x, offsetY - 6);
    ctx.lineTo(x, offsetY + 6);
    ctx.stroke();
  }

  for (let a = -100; a <= 100; a += 50) {
    const y = offsetY - a * yScale;
    ctx.fillText(a.toString(), 12, y + 4);
    ctx.beginPath();
    ctx.moveTo(offsetX - 6, y);
    ctx.lineTo(offsetX + 6, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSignal(points, color, axes, callback) {
  const { offsetX, offsetY, xScale, yScale } = axes;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  let i = 0;

  function animate() {
    if (i >= points.length) {
      ctx.restore();
      if (callback) callback();
      return;
    }
    const x = offsetX + points[i].t * xScale;
    const y = offsetY - points[i].amp * yScale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    ctx.stroke();
    i++;
    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);
}

function drawBoth() {
  cancelAnimation();
  const axes = computeAxes();
  drawAxes(axes);
  const plant = generateN170(40);
  const face = generateN170(80);
  drawSignal(plant, 'green', axes, () => drawSignal(face, 'red', axes));
}

function drawFaceOnly() {
  cancelAnimation();
  const axes = computeAxes();
  drawAxes(axes);
  const face = generateN170(80);
  drawSignal(face, 'red', axes);
}

function drawPlantOnly() {
  cancelAnimation();
  const axes = computeAxes();
  drawAxes(axes);
  const plant = generateN170(40);
  drawSignal(plant, 'green', axes);
}

document.getElementById('btnFace').addEventListener('click', drawFaceOnly);
document.getElementById('btnPlant').addEventListener('click', drawPlantOnly);
document.getElementById('btnBoth').addEventListener('click', drawBoth);

let resizeTimer;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawBoth, 80);
}
window.addEventListener('resize', onResize);

requestAnimationFrame(drawBoth);