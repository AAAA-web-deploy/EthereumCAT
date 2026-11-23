/**
 * Registered watercolor-pencil reveal. The source color and ink files share
 * exactly the same 576×438 geometry; neither is rescaled separately.
 * The underlying ink IMG stays visible without JavaScript or when painting fails.
 * This is a brush-mask reveal of raster artwork (not traced individual SVG strokes).
 */
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const easeInOut = t => t*t*(3-2*t);
const limit = v => Math.max(0,Math.min(1,v));
async function loadArtwork(path){
  const img=new Image();img.decoding='async';img.src=path;
  if(img.decode)await img.decode();else await new Promise((ok,fail)=>{img.onload=ok;img.onerror=fail});
  return img;
}
function makeCanvas(w,h){const el=document.createElement('canvas');el.width=w;el.height=h;return el}

class HeroPainter {
  constructor(){
    this.container=document.getElementById('hero-illustration');
    this.inkCanvas=this.container.querySelector('.ink-animation');
    this.colorCanvas=this.container.querySelector('.color-animation');
    this.inkCtx=this.inkCanvas.getContext('2d');this.colorCtx=this.colorCanvas.getContext('2d');
    this.width=576;this.height=438;
    this.mask=makeCanvas(this.width,this.height);this.maskCtx=this.mask.getContext('2d');
    this.buffer=makeCanvas(this.width,this.height);this.bufferCtx=this.buffer.getContext('2d');
    this.inkBuffer=makeCanvas(this.width,this.height);this.inkBufferCtx=this.inkBuffer.getContext('2d');
    this.ready=false;this.mode='pending';this.request=0;this.startTime=0;
  }
  async init(){
    try{
      [this.inkSource,this.colorSource]=await Promise.all([
        loadArtwork(this.container.dataset.ink),loadArtwork(this.container.dataset.color)
      ]);
      if(this.inkSource.naturalWidth!==this.colorSource.naturalWidth || this.inkSource.naturalHeight!==this.colorSource.naturalHeight)throw Error('ink and color art are not registered');
      this.ready=true;
      if(REDUCED_MOTION.matches)this.finish();else this.start();
    }catch(error){
      console.warn('Pencil artwork remains visible; animation unavailable',error);
      this.mode='fallback';this.container.classList.remove('is-drawing');
    }
  }
  drawInk(progress){
    const ctx=this.inkCtx;ctx.clearRect(0,0,this.width,this.height);
    if(progress>=1){ctx.drawImage(this.inkSource,0,0);return}
    const mask=this.maskCtx;mask.clearRect(0,0,this.width,this.height);
    const step=9.8,total=Math.ceil(this.height/step),position=progress*total;
    mask.strokeStyle='#fff';mask.lineWidth=15;mask.lineCap='round';mask.lineJoin='round';
    for(let i=0;i<Math.ceil(position);i++){
      const portion=limit(position-i);if(portion<=0)continue;
      const y=i*step+3,reverse=i%2===1;
      const x0=reverse?this.width+9:-9;
      const x1=reverse?-9:this.width+9;
      mask.beginPath();mask.moveTo(x0,y);
      const segments=Math.ceil(portion*32);
      for(let j=1;j<=segments;j++){
        const t=(portion*j)/segments;
        mask.lineTo(x0+(x1-x0)*t,y+1.75*Math.sin(t*38+i*1.35));
      }
      mask.stroke();
    }
    const b=this.inkBufferCtx;b.clearRect(0,0,this.width,this.height);
    b.globalCompositeOperation='source-over';b.drawImage(this.inkSource,0,0);
    b.globalCompositeOperation='destination-in';b.drawImage(this.mask,0,0);
    b.globalCompositeOperation='source-over';ctx.drawImage(this.inkBuffer,0,0);
  }
  drawColor(progress){
    const ctx=this.colorCtx;ctx.clearRect(0,0,this.width,this.height);
    if(progress<=0)return;
    if(progress>=1){ctx.drawImage(this.colorSource,0,0);return}
    const mask=this.maskCtx;mask.clearRect(0,0,this.width,this.height);
    // Soft irregular edge moves across the entire precisely aligned source.
    const frontier=progress*(this.width+30)-15;
    mask.fillStyle='#fff';mask.beginPath();mask.moveTo(0,0);mask.lineTo(0,this.height);
    for(let y=this.height;y>=0;y-=3){
      const x=frontier+11*Math.sin(y*.035+progress*13)+5.5*Math.sin(y*.129+progress*9)+2*Math.sin(y*.41);
      mask.lineTo(Math.min(this.width+15,Math.max(-15,x)),y);
    }
    mask.closePath();mask.fill();
    // Brush flecks at the advancing pigment boundary, still clipped by the source.
    mask.globalAlpha=.55;
    for(let i=0;i<120;i++){
      const y=(i*47)%this.height;
      const x=frontier+10*Math.sin(y*.035+progress*13)+((i*31)%31)-15;
      mask.beginPath();mask.ellipse(x,y,(i%5)+2,(i%3)+1,i*.17,0,2*Math.PI);mask.fill();
    }
    mask.globalAlpha=1;
    const b=this.bufferCtx;b.clearRect(0,0,this.width,this.height);
    b.globalCompositeOperation='source-over';b.drawImage(this.colorSource,0,0);
    b.globalCompositeOperation='destination-in';b.drawImage(this.mask,0,0);
    b.globalCompositeOperation='source-over';ctx.drawImage(this.buffer,0,0);
  }
  start(){
    if(!this.ready)return;
    cancelAnimationFrame(this.request);
    this.container.classList.remove('pencil-only');this.container.classList.add('is-drawing');
    this.inkCtx.clearRect(0,0,this.width,this.height);this.colorCtx.clearRect(0,0,this.width,this.height);
    this.mode='playing';this.startTime=performance.now();
    const inkDuration=2500,colorDuration=4000;
    const tick=now=>{
      if(this.mode!=='playing')return;
      const elapsed=now-this.startTime;
      if(elapsed<inkDuration){this.drawInk(easeInOut(limit(elapsed/inkDuration)))}
      else if(elapsed<inkDuration+colorDuration){
        this.container.classList.remove('is-drawing');
        this.inkCtx.clearRect(0,0,this.width,this.height);
        this.drawColor(easeInOut(limit((elapsed-inkDuration)/colorDuration)));
      }else{this.finish();return}
      this.request=requestAnimationFrame(tick);
    };
    this.request=requestAnimationFrame(tick);
  }
  finish(){
    if(!this.ready)return;
    cancelAnimationFrame(this.request);
    this.mode='finished';this.container.classList.remove('is-drawing','pencil-only');
    this.inkCtx.clearRect(0,0,this.width,this.height);this.drawColor(1);
  }
  pencil(){
    if(!this.ready)return;
    cancelAnimationFrame(this.request);this.mode='pencil';
    this.container.classList.remove('is-drawing');this.container.classList.add('pencil-only');
    this.inkCtx.clearRect(0,0,this.width,this.height);this.colorCtx.clearRect(0,0,this.width,this.height);
  }
  toggle(){if(this.mode==='pencil')this.finish();else this.pencil()}
}

function paintGallery(visible){document.querySelectorAll('.paint-pair').forEach(pair=>pair.classList.toggle('revealed',visible))}
function setupGalleryPainting(){
  if(REDUCED_MOTION.matches){paintGallery(true);return}
  if(!('IntersectionObserver' in window)){paintGallery(true);return}
  const observer=new IntersectionObserver(entries=>{
    for(const item of entries){if(item.isIntersecting){item.target.classList.add('revealed');observer.unobserve(item.target)}}
  },{threshold:.10,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.paint-pair').forEach(pair=>observer.observe(pair));
}
