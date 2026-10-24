import { createDiorama, THREE, box, material } from '../diorama-runtime.js';
import { buildRamen } from './ramen.js';

const results = [];
const fixture = document.querySelector('#fixture');
const settle = ms => new Promise(resolve => setTimeout(resolve, ms));
const check = (name, ok, detail = '') => {
  results.push({name, pass:Boolean(ok), detail});
  const li = document.createElement('li'); li.className = ok ? 'pass' : 'fail';
  li.textContent = `${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ': ' + detail : ''}`;
  document.querySelector('#results').append(li);
};
let stage;
let updates = 0;

try {
  stage = createDiorama(fixture, {label:'Runtime test miniature'});
  const group = new THREE.Group();
  const cube = box(group, [1,1,1], [0,0.5,0], material('#60794e'));
  let disposedGeometry = 0;
  cube.geometry.addEventListener('dispose', () => disposedGeometry++);
  stage.setWorld(group, { update(t) { updates++; cube.rotation.y = t * 0.3; }, bounds:new THREE.Box3(new THREE.Vector3(-1,0,-1),new THREE.Vector3(1,1,1)) });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  check('Initial motion preference', stage.playing === !reduced, `reduced=${reduced}, playing=${stage.playing}`);
  stage.setPlaying(true);
  await settle(180);
  const first = updates;
  await settle(180);
  check('Animation advances', updates > first, `${first} -> ${updates}`);
  stage.setPlaying(false);
  const pausedUpdates = updates;
  const pausedRotation = cube.rotation.y;
  await settle(180);
  check('Pause stops updates and freezes pose', updates === pausedUpdates && cube.rotation.y === pausedRotation);
  stage.setPlaying(true);
  await settle(50);
  check('Resume has no long elapsed-time jump', Math.abs(cube.rotation.y - pausedRotation) < 0.1);
  stage.setPlaying(false);

  const canvas = fixture.querySelector('canvas');
  check('Single low-resolution canvas with accessible description', fixture.querySelectorAll('canvas').length === 1 && canvas.width < fixture.clientWidth && canvas.getAttribute('aria-label') === 'Runtime test miniature', `${canvas.width} logical / ${fixture.clientWidth} CSS pixels`);
  fixture.style.width = '280px';
  fixture.style.height = '310px';
  await settle(100);
  check('Container resize updates logical resolution', canvas.width === Math.round(fixture.clientWidth / 2) && canvas.height === Math.round(fixture.clientHeight / 2), `${canvas.width} x ${canvas.height}`);

  const firstGeometry = cube.geometry;
  const next = new THREE.Group(); box(next,[1,1,1],[0,0,0],material('#ba7749'));
  stage.setWorld(next, { update() {updates++;} });
  check('Scene replacement disposes geometry and keeps one canvas', disposedGeometry === 1 && fixture.querySelectorAll('canvas').length === 1);
  stage.setPlaying(true);
  fixture.style.transform = 'translateY(3000px)';
  await settle(140);
  const offscreenUpdates = updates;
  await settle(150);
  check('Offscreen stage stops frame updates', updates === offscreenUpdates);
  fixture.style.transform = '';
  await settle(150);
  check('Visible stage resumes frame updates', updates > offscreenUpdates);
  stage.setPlaying(false);

  const gl = canvas.getContext('webgl2');
  const ext = gl.getExtension('WEBGL_lose_context');
  if (ext) {
    ext.loseContext(); await settle(150);
    check('Context loss shows a fallback and hides canvas', !fixture.querySelector('[role="status"]').hidden && getComputedStyle(canvas).display === 'none');
    ext.restoreContext(); await settle(350);
    check('Context recovery restores the stage', fixture.querySelector('[role="status"]').hidden && getComputedStyle(canvas).display !== 'none');
  } else check('Context loss extension available', false);

  const ramen = buildRamen();
  const textured = [];
  ramen.world.traverse(node => { if (node.material?.map) textured.push(node); });
  check('Ramen includes real readable sign textures', textured.length === 4 && textured.every(node => {
    const ctx = node.material.map.image.getContext('2d');
    const px = ctx.getImageData(0,0,512,128).data;
    let dark = 0; for (let i=0;i<px.length;i+=4) if (px[i]<100 && px[i+1]<100 && px[i+2]<100) dark++;
    return dark > 100;
  }), `${textured.length} texture planes`);
  ramen.world.updateMatrixWorld(true);
  const signCenter = textured[0].getWorldPosition(new THREE.Vector3());
  const eye = new THREE.Vector3(...ramen.target).add(new THREE.Vector3(12,10,12));
  const signRay = new THREE.Raycaster(eye, signCenter.clone().sub(eye).normalize());
  const signHits = signRay.intersectObjects(ramen.world.children,true).filter(hit=>hit.object.isMesh && !hit.object.material.transparent);
  check('Front sign faces the camera without being occluded', signHits[0]?.object === textured[0], signHits.slice(0,2).map(hit=>JSON.stringify({position:hit.object.position.toArray(),type:hit.object.geometry.type})).join(', '));
  stage.setWorld(ramen.world, ramen);
  let finite = true;
  let ramenInside = true;
  const ramenMeasured = new THREE.Box3();
  for (let sample=0;sample<=450;sample++) {
    ramen.update(sample * 0.1);
    ramen.world.traverse(node => {
      if (![...node.position,...node.quaternion,...node.scale].every(Number.isFinite)) finite=false;
    });
    ramen.world.updateMatrixWorld(true);
    // The rain attribute changes in-place; keep its measured bounds current.
    ramen.world.traverse(node => { if (node.isLineSegments) node.geometry.computeBoundingBox(); });
    const sampleBounds = new THREE.Box3().setFromObject(ramen.world);
    ramenMeasured.union(sampleBounds);
    if (!ramen.bounds.clone().expandByScalar(0.02).containsBox(sampleBounds)) ramenInside=false;
  }
  check('Ramen animation stays finite across the whole 45-second story', finite);
  check('Ramen motion fits its framing envelope across 45 seconds', ramenInside, JSON.stringify({min:ramenMeasured.min.toArray(),max:ramenMeasured.max.toArray()}));

  const ramenOnly=new URLSearchParams(location.search).get('scene')==='ramen';
  const basketball = ramenOnly?null:await import('./basketball.js');
  const game = basketball?.buildBasketball();
  if(game) stage.setWorld(game.world, game);
  let inside = true;
  let worst = 0;
  for (let sample=0;game && sample<=450;sample++) {
    game.update(sample * 0.1); game.world.updateMatrixWorld(true);
    const measured = new THREE.Box3().setFromObject(game.world);
    const padded = game.bounds.clone().expandByScalar(0.02);
    if (!padded.containsBox(measured)) {inside=false; worst++;}
  }
  if(game) check('Basketball motion fits its framing envelope across 45 seconds', inside, `${worst} escaping samples`);
  const snapshot = scene => {
    const values=[];
    scene.world.updateMatrixWorld(true);
    // Matrix comparisons treat q and -q, and full-turn Euler wraps, as the
    // identical visible pose they represent.
    scene.world.traverse(node=>values.push(...node.matrixWorld.elements,Number(node.visible)));
    return values;
  };
  for(const [name,data] of [['Ramen',ramen],...(game?[['Basketball',game]]:[])]) {
    check(`${name} has a finite 45-second sequence with distinct phases`,data.duration===45 && data.loop===false && data.phases?.length>=5);
    data.update(23.17);const direct=snapshot(data);
    data.update(41.5);data.update(2);data.update(23.17);const roundTrip=snapshot(data);
    check(`${name} seeking is deterministic in both directions`,direct.every((v,i)=>Math.abs(v-roundTrip[i])<0.0000001));
    data.update(0);const start=snapshot(data);
    data.update(45);const end=snapshot(data);
    const seamError=Math.max(...start.map((v,i)=>Math.abs(v-end[i])));
    check(`${name} full-sequence loop returns to its starting pose`,seamError<0.001,`max transform difference ${seamError}`);
    let continuous=true;let jump=0;
    for(const phase of data.phases||[]) {
      data.update(Math.max(0,phase.start-0.00001));const before=snapshot(data);
      data.update(phase.start+0.00001);const after=snapshot(data);
      const diff=Math.max(...before.map((v,i)=>Math.abs(v-after[i])));
      jump=Math.max(jump,diff);if(diff>0.03) continuous=false;
    }
    check(`${name} phase boundaries keep transforms continuous`,continuous,`max boundary difference ${jump}`);
  }

  let completed=0;
  const tiny=new THREE.Group();const tinyBox=box(tiny,[1,1,1],[0,0.5,0],material('#61754e'));
  stage.setWorld(tiny,{duration:0.3,loop:false,update(t){tinyBox.position.x=t;updates++;},onComplete(){completed++;}});
  stage.setPlaying(true);
  await settle(650);
  const endedUpdates=updates;
  check('Finite playback reaches its end once and stops',stage.ended && !stage.playing && stage.currentTime===0.3 && completed===1);
  await settle(120);
  check('Ending holds without continuous callbacks',updates===endedUpdates);
  stage.seek(0.1);const sought=tinyBox.position.x;
  check('Paused seek restores an earlier pose without playing',sought===0.1 && !stage.playing && !stage.ended);
  stage.seek(0.3);
  check('Seek to ending does not fire completion',completed===1 && stage.ended);
  stage.replay();await settle(70);
  check('Replay restarts the master timeline',stage.playing && !stage.ended && stage.currentTime<0.2);
  stage.setLoop(true);stage.seek(0.28);await settle(130);
  check('Explicit loop wraps the entire duration without completing',stage.playing && !stage.ended && stage.currentTime<0.28 && completed===1);
  stage.setPlaying(false);
  let badSeek=false;try{stage.seek(NaN);}catch{badSeek=true;}
  check('Invalid seek is rejected explicitly',badSeek);
  const longWorld=new THREE.Group();const longBox=box(longWorld,[0.5,0.5,0.5],[0,0,0],material('#596e54'));
  stage.setWorld(longWorld,{duration:180,startTime:0,stillTime:90,loop:false,bounds:new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(2,1,1)),update(t){longBox.position.x=t/180;updates++;}});
  stage.seek(125.5);
  check('Master timeline supports scenes longer than a minute',stage.duration===180&&stage.currentTime===125.5&&Math.abs(longBox.position.x-125.5/180)<0.0000001);
  stage.seek(180);
  check('Long sequence clamps and holds its own ending',stage.ended&&!stage.playing&&stage.currentTime===180);
  stage.setPlaying(true);
  await settle(80);
  stage.dispose();
  const afterDispose = updates;
  await settle(120);
  check('Disposal removes canvas and stops callbacks', fixture.querySelectorAll('canvas').length === 0 && updates === afterDispose);
} catch (error) {
  check('Uncaught runtime error', false, String(error.stack || error));
  stage?.dispose();
}

const failed = results.filter(r=>!r.pass).length;
document.querySelector('#status').textContent = `${results.length - failed}/${results.length} checks passed (${matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced motion' : 'normal motion'}).`;
document.body.dataset.complete = 'true';
document.body.dataset.failed = String(failed);
