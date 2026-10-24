import {THREE,createDiorama} from '../diorama-runtime.js';
import {loadScene} from './scene-catalog.js';

const id=new URLSearchParams(location.search).get('scene')||'forest';
const checks=[];
function check(name,pass,detail='') {
  checks.push({name,pass:Boolean(pass),detail});
  const row=document.createElement('li');row.className=pass?'pass':'fail';row.textContent=`${pass?'PASS':'FAIL'} ${name}${detail?': '+detail:''}`;document.querySelector('#results').append(row);
}
const maxDifference=(a,b,strictAppearance=true)=>{
  if(a.values.length!==b.values.length)return Infinity;
  let max=0;
  for(let i=0;i<a.values.length;i++){
    if(!a.mask[i]&&!b.mask[i])continue;
    if(a.mask[i]!==b.mask[i]){if(strictAppearance)return Infinity;continue;}
    max=Math.max(max,Math.abs(a.values[i]-b.values[i]));
  }
  return max;
};
function snapshot(world) {
  const values=[],mask=[],names=[];world.updateMatrixWorld(true);
  function visit(node,parentVisible){
    const paints=Array.isArray(node.material)?node.material:node.material?[node.material]:[];
    const visible=parentVisible&&node.visible&&(!paints.length||paints.some(p=>p.opacity>0.0001));
    if(node.geometry||node.isLight){
      const state=[...node.matrixWorld.elements];
      for(const p of paints){state.push(p.opacity);if(p.color)state.push(p.color.r,p.color.g,p.color.b);}
      if(node.instanceMatrix)state.push(...node.instanceMatrix.array);
      if(node.geometry?.attributes.position?.version>0)state.push(...node.geometry.attributes.position.array);
      for(const value of state){values.push(value);mask.push(Boolean(visible));names.push(node.name||node.type);}
    }
    for(const child of node.children)visit(child,visible);
  }
  visit(world,true);return {values,mask,names};
}
const versions=new WeakMap();
function visibleBounds(world) {
  const combined=new THREE.Box3();world.updateMatrixWorld(true);
  function visit(node) {
    if(!node.visible) return;
    if(node.geometry) {
      const source=node.isInstancedMesh?node:node.geometry;
      const version=`${node.geometry.attributes.position?.version||0}/${node.instanceMatrix?.version||0}`;
      if(!source.boundingBox || versions.get(source)!==version){source.computeBoundingBox();versions.set(source,version);}
      if(source.boundingBox)combined.union(source.boundingBox.clone().applyMatrix4(node.matrixWorld));
    }
    for(const child of node.children)visit(child);
  }
  visit(world);return combined;
}

let stage;
try {
  const {entry,settings:s}=await loadScene(id);
  document.querySelector('#title').textContent=`${entry.name}: 45-second scene checks`;
  check('Explicit finite story contract',s.duration===45&&s.loop===false&&s.startTime===0);
  check('Timeline phases cover beginning to ending',s.phases?.length>=5&&s.phases[0].start===0&&s.phases.at(-1).end===45&&s.phases.every((p,i)=>p.end>p.start&&(!i||Math.abs(p.start-s.phases[i-1].end)<0.001)));
  let finite=true;let contained=true;let escaped=0;const measured=new THREE.Box3();
  const times=Array.from({length:181},(_,i)=>i*0.25);
  for(const phase of s.phases)times.push(phase.start,Math.max(0,phase.start-0.00001),Math.min(45,phase.start+0.00001));
  const envelope=s.bounds.clone().expandByScalar(0.03);
  for(const t of times) {
    s.update(t);
    s.world.traverse(n=>{if(![...n.position,...n.quaternion,...n.scale].every(Number.isFinite))finite=false;});
    const box=visibleBounds(s.world);measured.union(box);
    if(!envelope.containsBox(box)){contained=false;escaped++;}
  }
  check('Transforms stay finite over the entire story',finite,`${times.length} sampled times`);
  check('Complete visible scene fits declared bounds',contained,`${escaped} escaping samples`);
  document.querySelector('#details').textContent=JSON.stringify({measured:{min:measured.min.toArray(),max:measured.max.toArray()},declared:{min:s.bounds.min.toArray(),max:s.bounds.max.toArray()}},null,2);
  s.update(23.174);const direct=snapshot(s.world);s.update(43.1);s.update(2.4);s.update(23.174);const reseek=snapshot(s.world);
  check('Forward and backward seeking reconstruct identical state',maxDifference(direct,reseek)<0.000001);
  s.update(0);const first=snapshot(s.world);s.update(45);const last=snapshot(s.world);
  const seam=maxDifference(first,last);check('Full-sequence loop returns to starting pose',seam<0.001,`max visible transform/material difference ${seam}`);
  let jump=0;const boundaries=[];for(const p of s.phases){s.update(Math.max(0,p.start-0.00001));const a=snapshot(s.world);s.update(Math.min(45,p.start+0.00001));const b=snapshot(s.world);const difference=maxDifference(a,b,false);jump=Math.max(jump,difference);if(difference>0.04){let worst=0;for(let i=0;i<a.values.length;i++)if(a.mask[i]&&b.mask[i]&&Math.abs(a.values[i]-b.values[i])>Math.abs(a.values[worst]-b.values[worst]))worst=i;boundaries.push({at:p.start,node:a.names[worst],difference});}}
  check('Story transitions preserve continuity',jump<0.04,`max boundary difference ${jump}`);
  if(boundaries.length)document.querySelector('#details').textContent+='\n'+JSON.stringify({boundaries},null,2);
  const diversity=[];for(const t of [3,10,18,26,34,42]){s.update(t);diversity.push(snapshot(s.world));}
  check('Authored poses change across the long timeline',diversity.slice(1).filter((v,i)=>maxDifference(v,diversity[i])>0.08).length>=4);
  stage=createDiorama(document.querySelector('#stage'),{label:entry.label,pixelSize:1.8,levels:9,dither:0.85});
  stage.setPlaying(false);stage.setWorld(s.world,s);stage.seek(s.stillTime);
  check('Scene renders a named, low-resolution canvas',Boolean(document.querySelector('canvas[role="img"]')));
  stage.seek(45);check('Finite ending is held by the runtime',stage.ended&&!stage.playing&&stage.currentTime===45);
  stage.seek(12.5);check('Paused seek moves back from the ending',!stage.ended&&!stage.playing&&stage.currentTime===12.5);
  stage.seek(s.stillTime);
} catch(error) {check('Scene creation and rendering',false,String(error.stack||error));stage?.dispose();}
const failed=checks.filter(c=>!c.pass).length;
document.querySelector('#status').textContent=`${checks.length-failed}/${checks.length} checks passed.`;
document.body.dataset.complete='true';document.body.dataset.failed=String(failed);
