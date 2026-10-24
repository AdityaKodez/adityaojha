import {createDiorama} from '../diorama-runtime.js';
import {sceneCatalog,loadScene} from './scene-catalog.js';

const requested=new URLSearchParams(location.search).get('scene');
const name=sceneCatalog.some(scene=>scene.id===requested)?requested:'ramen';
const {settings}=await loadScene(name);
document.querySelector('#title').textContent=`${name}: full ${settings.duration}-second playthrough`;
const points=[0,...settings.phases.slice(1).map(phase=>phase.start+(phase.end-phase.start)*0.4),settings.duration];
const host=document.querySelector('#stage');
const started=performance.now();
let frames=0;
let ticks=0;
let lastTime=-1;
let reversals=0;
let completions=0;
let previousTime=0;
const phaseNames=new Set();
const runtime=createDiorama(host,{
  pixelSize:1.5,levels:9,dither:0.85,
  onTimeChange({time,ended}) {
    if(time<lastTime) reversals++;
    lastTime=time;
    if(time>previousTime) ticks++;
    previousTime=time;
    const phase=settings.phases.find(p=>time>=p.start&&time<p.end)||settings.phases.at(-1);
    phaseNames.add(phase.label);
    document.querySelector('#status').textContent=`${time.toFixed(2)} / ${settings.duration}s - ${phase.label}`;
    while(frames<points.length && time>=points[frames]) {
      const figure=document.createElement('figure');
      const img=document.createElement('img');
      img.alt=`${name} at ${time.toFixed(1)} seconds: ${phase.label}`;
      img.src=host.querySelector('canvas').toDataURL('image/png');
      img.dataset.time=String(time);
      const caption=document.createElement('figcaption');caption.textContent=img.alt;
      figure.append(img,caption);document.querySelector('#frames').append(figure);frames++;
    }
    if(ended) document.querySelector('#status').textContent='Finished at the authored ending. Holding the final frame.';
  },
  onComplete() {
    completions++;
    const atEnd=ticks;
    setTimeout(()=>{
      const audit={scene:name,duration:settings.duration,wallSeconds:(performance.now()-started)/1000,frames:ticks,recordedStoryFrames:frames,phasesSeen:[...phaseNames],reversals,completions,ended:runtime.ended,playing:runtime.playing,currentTime:runtime.currentTime,stoppedAtEnding:ticks===atEnd};
      document.querySelector('#audit').textContent=JSON.stringify(audit,null,2);
      document.body.dataset.complete='true';
    },150);
  },
});
runtime.setPlaying(true);
runtime.setWorld(settings.world,settings);
runtime.replay();
window.addEventListener('pagehide',()=>runtime.dispose(),{once:true});
