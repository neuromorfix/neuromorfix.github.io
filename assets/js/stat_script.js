const canvas = document.getElementById('curve');
const ctx = canvas.getContext('2d');

const MATERIAL_COLORS = [
  '#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5',
  '#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50',
  '#8BC34A','#CDDC39','#FFC107','#FF9800','#FF5722'
];

let currentMaterial = MATERIAL_COLORS[Math.floor(Math.random()*MATERIAL_COLORS.length)];

function resize(){
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth*dpr;
  canvas.height = canvas.clientHeight*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

// ---------------- Utilities ----------------
function xToPx(x,bounds,width){ return (x-bounds.xMin)/(bounds.xMax-bounds.xMin)*width; }
function yToPx(y,bounds,height){ return height-(y-bounds.yMin)/(bounds.yMax-bounds.yMin)*height; }

// ---------------- Generate Points ----------------
function genData(n=15){
  const x=[], y=[];
  for(let i=0;i<n;i++){
    const xi = Math.random()*10;
    const yi = 2 + Math.random()*5 + Math.sin(xi)+Math.random()*2;
    x.push(xi); y.push(yi);
  }
  return {x,y};
}

// ---------------- Polynomial Fit ----------------
function polyFit(x, y, order){
  const n = x.length;
  const X = [];
  for(let i=0;i<n;i++){
    const row=[];
    for(let j=0;j<=order;j++) row.push(Math.pow(x[i],j));
    X.push(row);
  }
  const XT_X = [];
  for(let i=0;i<=order;i++){
    XT_X[i] = [];
    for(let j=0;j<=order;j++){
      let s=0; for(let k=0;k<n;k++) s+=X[k][i]*X[k][j]; XT_X[i][j]=s;
    }
  }
  const XT_y=[];
  for(let i=0;i<=order;i++){ let s=0; for(let k=0;k<n;k++) s+=X[k][i]*y[k]; XT_y[i]=s; }
  return gaussianElim(XT_X,XT_y);
}

// Gaussian elimination
function gaussianElim(A,b){
  const n=b.length;
  const M=A.map(r=>r.slice());
  const bb=b.slice();
  for(let k=0;k<n;k++){
    let maxRow=k;
    for(let i=k+1;i<n;i++) if(Math.abs(M[i][k])>Math.abs(M[maxRow][k])) maxRow=i;
    [M[k],M[maxRow]]=[M[maxRow],M[k]];
    [bb[k],bb[maxRow]]=[bb[maxRow],bb[k]];
    for(let i=k+1;i<n;i++){
      const f=M[i][k]/M[k][k];
      for(let j=k;j<n;j++) M[i][j]-=f*M[k][j];
      bb[i]-=f*bb[k];
    }
  }
  const x=Array(n).fill(0);
  for(let i=n-1;i>=0;i--){
    let s=bb[i];
    for(let j=i+1;j<n;j++) s-=M[i][j]*x[j];
    x[i]=s/M[i][i];
  }
  return x;
}

// Evaluate polynomial
function polyEval(beta,x){ return beta.reduce((sum,b,i)=>sum+b*Math.pow(x,i),0); }

// ---------------- Draw Grid ----------------
function drawGrid(w,h){
  ctx.strokeStyle='rgba(200,200,200,0.5)';
  ctx.lineWidth=1;
  const nx=40, ny=15;
  for(let i=0;i<=nx;i++){ const x=i/nx*w; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let j=0;j<=ny;j++){ const y=j/ny*h; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
}

// ---------------- Animate Curve Once ----------------
const data = genData();
const order = 1 + Math.floor(Math.random()*3);
const beta = polyFit(data.x,data.y,order);
const xMin=0, xMax=10;
const yMin=Math.min(...data.y)-1, yMax=Math.max(...data.y)+1;
const bounds={xMin,xMax,yMin,yMax};

let startTime=null;
function animate(time){
  if(!startTime) startTime=time;
  const t = Math.min((time-startTime)/5000,1); // 5 sec
  const w=canvas.clientWidth,h=canvas.clientHeight;
  ctx.clearRect(0,0,w,h);

  drawGrid(w,h);

  // draw curve progressively
  ctx.strokeStyle=currentMaterial;
  ctx.lineWidth=2;
  ctx.beginPath();
  const steps = 100;
  for(let i=0;i<=steps*t;i++){
    const p = i/steps;
    const x = xMin + p*(xMax-xMin);
    const y = polyEval(beta,x);
    const px=xToPx(x,bounds,w);
    const py=yToPx(y,bounds,h);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.stroke();

  // draw points
  ctx.fillStyle=currentMaterial;
  for(let i=0;i<data.x.length;i++){
    const px=xToPx(data.x[i],bounds,w);
    const py=yToPx(data.y[i],bounds,h);
    ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2); ctx.fill();
  }

  if(t<1) requestAnimationFrame(animate);
}

requestAnimationFrame(animate);