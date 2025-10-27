const canvas = document.getElementById("brain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// --- New SVG Path Data (from <path id="path180">) ---
const svgPathData = `M827.9,1289.92c-3.12-2.09-7.02-6.42-8.66-9.61-1.64-3.19-8.61-32.1-15.48-64.25-6.88-32.15-13.06-58.95-13.74-59.55-.68-.61-7.26-3.67-14.62-6.81-17.99-7.67-31.03-16.53-45.51-30.95-21.37-21.27-40.11-54.36-48.03-84.83-8.53-32.8-9.17-54.34-2.58-85.88l3.05-14.6-5.83-9.61c-3.21-5.29-6.27-9.62-6.81-9.62s-9.7,4.44-20.36,9.86c-21.78,11.08-40.3,17.97-63.69,23.69-13.46,3.29-20.35,3.9-45.14,3.95-27.54.06-30.05-.2-42.76-4.49-24.24-8.18-43.86-25.44-52.42-46.11-1.6-3.86-5.02-6.82-12.4-10.75-24.55-13.05-43.89-39.94-45.8-63.67-.49-6.13-1.17-11.14-1.5-11.14s-4.18,2.55-8.55,5.66c-4.37,3.11-14.34,8.86-22.16,12.78-59.36,29.72-120.36,29.98-181.4.77-19.71-9.43-35.12-21.33-48.32-37.28-8.97-10.84-12.31-13.6-20.49-16.92-19.91-8.1-41.99-22.99-54.97-37.1-20.03-21.77-28.25-41.77-30.8-75.04-1.09-14.14-2.52-20.52-7.36-32.81-15.58-39.59-14.69-91,2.39-137.81,6.08-16.65,7.17-21.75,8.34-39.2,3.65-54.27,20.82-93.45,56.69-129.32,12.41-12.41,14.12-14.97,21.04-31.49,28.72-68.55,72.32-115.03,142.93-152.4,22.28-11.79,47.62-22.04,64.45-26.08,10.15-2.43,13.66-4.34,24.26-13.18,27.84-23.21,49.38-34.46,83.83-43.76,9.55-2.58,18.83-6.57,26.77-11.52,16.97-10.58,32.83-17.46,51.38-22.29,21.45-5.59,64.34-7.09,90.11-3.15l17.36,2.66,14.41-6.49c25.68-11.56,48.08-16.98,83.55-20.23,36.42-3.33,86.05,3.18,123.92,16.27,16.61,5.74,18.83,6.09,39.34,6.2,13.71.09,24.12.95,28.2,2.38,4.24,1.49,9.71,1.9,15.88,1.22,22.06-2.46,54.34,5.83,74.93,19.25,5.84,3.8,15.48,11.64,21.44,17.42,10.14,9.84,12,10.9,29.53,16.67,45.11,14.87,80.88,34.64,120.56,66.63,19.16,15.45,58.19,55.1,75.31,76.5,10.58,13.23,15.88,18.12,29.8,27.54,70.55,47.72,106.66,108.39,122.01,204.99l3.54,22.23,19.57,19.23c46.18,45.38,62.69,85.23,62.67,151.3,0,42.75-6.63,73.06-23.52,107.73-8.25,16.94-10.96,20.76-23.76,33.49-15.92,15.82-29.07,23.76-50.4,30.42-10.49,3.28-16.15,3.91-34.71,3.91s-22.03.35-21.2,2.51c8.68,22.54,7.27,65.61-3.15,96.17-5.65,16.57-8.86,22.49-32.58,60.16-17.69,28.09-23.61,36.01-37.01,49.5-23.93,24.08-47.45,36.36-81.6,42.59-19.95,3.64-71.49,4.69-124.97,2.55-63.38-2.54-105.48-5.07-113.27-6.79-4.68-1.03-6.27-.85-6.27.73,0,1.17,9.03,42.78,20.06,92.48,11.03,49.7,20.06,92.02,20.06,94.06,0,5.24-6.2,14.63-11.45,17.32-2.44,1.25-8.57,3.11-13.63,4.12-17.3,3.48-83.69,13.58-89.25,13.58-3.06,0-8.11-1.72-11.24-3.82h0Z`;

// Build a Path2D scaled to canvas size
let brainPath;
function rebuildBrainPath() {
  const scale = Math.min(canvas.width / 1466.27, canvas.height / 1894.23)* 0.9;
  const offsetX = (canvas.width - 1466.27 * scale) / 2;
  const offsetY = (canvas.height - 1894.23 * scale) / 2;
  brainPath = new Path2D();
  const tmp = new Path2D(svgPathData);
  brainPath.addPath(tmp, new DOMMatrix([scale, 0, 0, scale, offsetX, offsetY]));
}
rebuildBrainPath();
window.addEventListener("resize", rebuildBrainPath);

function insideBrain(x, y) {
  return ctx.isPointInPath(brainPath, x, y);
}

// --- Particle system ---
const NUM = 25;
const particles = [];

function randomPointInBrain() {
  let x, y;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
  } while (!insideBrain(x, y));
  return { x, y };
}

for (let i = 0; i < NUM; i++) {
  const p = randomPointInBrain();
  particles.push({
    x: p.x,
    y: p.y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    r: 1 + Math.random() * 2
  });
}

let mouse = { x: -999, y: -999 };
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Brain outline
  ctx.strokeStyle = "rgba(200,200,255,0.25)";
  ctx.lineWidth = 2;
  ctx.stroke(brainPath);

  // Clip region
  ctx.save();
  ctx.clip(brainPath);

  // Connections
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 100 * 100) {
        const alpha = 1 - d2 / (100 * 100);
        ctx.strokeStyle = `rgba(180,210,255,${alpha * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Particles
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#aaf";
    ctx.fill();
  }

  ctx.restore();
}

function update() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 100 * 100) {
      const d = Math.sqrt(d2);
      const f = (1 - d / 100) * 0.03;
      p.vx += dx * f;
      p.vy += dy * f;
    }

    if (!insideBrain(p.x, p.y)) {
      p.vx *= -1;
      p.vy *= -1;
      p.x += p.vx * 2;
      p.y += p.vy * 2;
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();