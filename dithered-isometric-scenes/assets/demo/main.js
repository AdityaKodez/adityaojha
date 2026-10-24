import { createDiorama } from '../diorama-runtime.js';
import { sceneCatalog,loadScene } from './scene-catalog.js';

const host = document.querySelector('#stage');
const play = document.querySelector('#play');
const timeline = document.querySelector('#timeline');
const loopButton = document.querySelector('#loop');
const picker=document.querySelector('#scene-select');
const params=new URLSearchParams(location.search);
const initial=sceneCatalog.some(scene=>scene.id===params.get('scene'))?params.get('scene'):'ramen';
for(const entry of sceneCatalog.filter(scene=>scene.ready!==false||scene.id===initial)) { const option=document.createElement('option');option.value=entry.id;option.textContent=entry.name;picker.append(option); }
let stage;
let active = initial;
let changing = false;
let sequence = null;
let scrubbing = false;

const clock = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;

function timeState({time,duration,ended}) {
  const finite=Number.isFinite(duration);
  timeline.disabled=!finite;
  timeline.max=finite?duration:45;
  if(!scrubbing) timeline.value=String(time);
  document.querySelector('#time').textContent=finite?`${clock(time)} / ${clock(duration)}`:'Ambient';
  const phase=sequence?.phases?.find(p=>time>=p.start && time<p.end) || sequence?.phases?.at(-1);
  document.querySelector('#phase').textContent=ended?'A moment to keep.':phase?.label || '';
  play.textContent=ended?'Replay':stage?.playing?'Pause':'Play';
  play.setAttribute('aria-label',ended?'Replay sequence':stage?.playing?'Pause animation':'Play animation');
}

function motionState(playing) {
  const ended=stage?.ended;
  play.textContent = ended?'Replay':playing ? 'Pause' : 'Play';
  play.setAttribute('aria-label', ended?'Replay sequence':playing ? 'Pause animation' : 'Play animation');
}

function showError(error) {
  console.error(error);
  let text = host.querySelector('.failure');
  if (!text) { text = document.createElement('p'); text.className = 'failure'; text.setAttribute('role','alert'); host.append(text); }
  text.textContent = 'This miniature could not be displayed. Please reload in a browser with WebGL2 graphics enabled.';
}

async function selectScene(name) {
  if (changing || (active === name && host.querySelector('canvas'))) return;
  changing = true;
  try {
    const {entry:data,settings}=await loadScene(name);
    sequence=settings;
    stage.setWorld(settings.world, settings);
    host.querySelector('.failure')?.remove();
    loopButton.setAttribute('aria-pressed','false');loopButton.textContent='Loop off';
    host.querySelector('canvas').setAttribute('aria-label', data.label);
    active = name;
    picker.value=name;
    for (const key of ['number','title']) document.querySelector(`#${key}`).textContent = data[key];
    document.querySelector('#scene-description').textContent = data.description;
  } catch (error) { picker.value=active;showError(error); }
  finally { changing = false; }
}

try {
  const first=await loadScene(initial);
  stage = createDiorama(host, { label:first.entry.label, pixelSize:1.8, levels:9, dither:0.85, onPlayingChange:motionState,onTimeChange:timeState });
  const settings = first.settings;
  sequence=settings;
  stage.setWorld(settings.world, settings);
  picker.value=initial;
  for(const key of ['number','title']) document.querySelector(`#${key}`).textContent=first.entry[key];
  document.querySelector('#scene-description').textContent=first.entry.description;
  if(params.has('time')&&Number.isFinite(Number(params.get('time')))) {stage.setPlaying(false);stage.seek(Number(params.get('time')));}
  play.addEventListener('click', () => stage.ended?stage.replay():stage.setPlaying(!stage.playing));
  timeline.addEventListener('input',()=>{scrubbing=true;stage.seek(Number(timeline.value));scrubbing=false;});
  loopButton.addEventListener('click',()=>{stage.setLoop(!stage.loop);loopButton.setAttribute('aria-pressed',String(stage.loop));loopButton.textContent=stage.loop?'Loop on':'Loop off';});
  picker.addEventListener('change',()=>selectScene(picker.value));
  window.addEventListener('pagehide', () => stage.dispose(), {once:true});
} catch (error) { showError(error); play.disabled = true; }
