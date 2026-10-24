import { THREE, box, cylinder, rod, material, makeRandom } from '../diorama-runtime.js';

export function buildRamen() {
  const world = new THREE.Group();
  const rng = makeRandom(17);
  const p = {
    tile: ['#496967', '#60766e', '#a49b78', '#b4a581', '#758278'].map(c => material(c)),
    edge: material('#536e69'), timber: material('#805338'), wood: material('#a56e41'),
    counter: material('#bc8547'), cream: material('#e3d7ad'), red: material('#b24f31'),
    roof: material('#304d48'), roofEdge: material('#3c5c53'), metal: material('#4c5550'),
    white: material('#ece3c8'), skin: material('#cb9c70'), darkSkin: material('#a27555'),
    hair: material('#393d30'), goldHair: material('#d7ad4d'), orange: material('#c87532'),
    green: material('#43584b'), apron: material('#c9c5a3'), black: material('#303c3b'),
    leaf: material('#586e43'), leafLight: material('#7b8a52'), pot: material('#a35b3d'),
    broth: material('#9e7339'), noodle: material('#dfbd6e'), bottle: material('#5d6e43'),
  };

  box(world, [8.2, 0.12, 6.8], [0, -0.07, 0], p.edge);
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 13; j++) {
      const x = -3.87 + i * 0.51;
      const z = -3.1 + j * 0.51;
      box(world, [0.5, 0.045 + rng() * 0.016, 0.5], [x, 0, z], p.tile[Math.floor(rng() * p.tile.length)]);
    }
  }
  // Broken edge chips make the base a slice of a street, rather than a plinth.
  for (let i = 0; i < 75; i++) {
    const x = (rng() - 0.5) * 8.3;
    const z = (rng() < 0.5 ? -1 : 1) * (3.28 + rng() * 0.12);
    box(world, [0.06 + rng() * 0.1, 0.04, 0.05 + rng() * 0.1], [x, -0.025, z], p.tile[i % 5]);
  }

  box(world, [5.0, 0.22, 3.0], [0, 0.17, -1.15], p.timber);
  for (let i = 0; i < 12; i++) box(world, [0.395, 0.04, 2.95], [-2.2 + i * 0.4, 0.305, -1.15], i % 3 ? p.wood : p.counter);
  box(world, [4.8, 2.75, 0.12], [0, 1.7, -2.55], p.wood);
  for (let i = 0; i < 12; i++) box(world, [0.025, 2.7, 0.035], [-2.22 + i * 0.4, 1.7, -2.47], p.timber);
  box(world, [0.1, 2.75, 2.8], [-2.43, 1.7, -1.13], p.wood);
  for (const x of [-2.45, 2.45]) {
    for (const z of [-2.5, 0.4]) box(world, [0.15, 3.2, 0.15], [x, 1.88, z], p.timber);
  }
  box(world, [5.15, 0.17, 0.17], [0, 3.4, 0.45], p.timber);
  box(world, [4.9, 1.15, 0.14], [0, 0.9, 0.3], p.timber);
  for (let i = 0; i < 14; i++) box(world, [0.31, 1.1, 0.04], [-2.24 + i * 0.345, 0.92, 0.395], i % 4 ? p.wood : p.counter);
  box(world, [5.1, 0.14, 0.85], [0, 1.51, 0.42], p.counter);
  box(world, [4.45, 0.11, 0.55], [0, 1.47, -2.0], p.timber);
  box(world, [4.45, 0.11, 0.45], [0, 2.15, -2.12], p.counter);

  const slope = Math.atan2(1.05, 2.1);
  for (const side of [-1, 1]) {
    const roof = box(world, [5.85, 0.1, 2.38], [0, 4.01, -1.05 + side * 1.05], p.roof);
    roof.rotation.x = side * slope;
    for (let i = 0; i < 23; i++) {
      const seam = box(world, [0.035, 0.04, 2.38], [-2.82 + i * 0.255, 4.08, -1.05 + side * 1.05], i % 3 ? p.roof : p.roofEdge);
      seam.rotation.x = side * slope;
    }
    box(world, [5.93, 0.12, 0.12], [0, 3.49, -1.05 + side * 2.1], p.roofEdge);
  }
  box(world, [5.97, 0.1, 0.16], [0, 4.57, -1.05], p.roofEdge);

  // The cream sign and hanging curtain are real scene surfaces.
  function label(text, width, height, color = '#343b2e', background = '#e4d9b5', fontSize = 66) {
    const surface = document.createElement('canvas');
    surface.width = 512; surface.height = 128;
    const ctx = surface.getContext('2d');
    ctx.fillStyle = background; ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${fontSize}px Georgia, serif`; ctx.fillText(text, 256, 67);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
    return mesh;
  }
  box(world, [4.8, 0.55, 0.12], [0, 3.48, 1.28], p.cream);
  const sign = label('RAMEN', 4.25, 0.48);
  sign.position.set(0, 3.48, 1.35); world.add(sign);
  for (let i = 0; i < 7; i++) {
    box(world, [0.55, 0.43, 0.025], [-1.83 + i * 0.61, 2.7, 1.12], i % 3 ? p.red : p.orange);
    box(world, [0.55, 0.035, 0.035], [-1.83 + i * 0.61, 2.49, 1.14], p.cream);
  }
  const sideSign = box(world, [0.63, 1.8, 0.12], [2.85, 1.94, 0.6], p.cream);
  sideSign.rotation.z = -0.035;
  for (let i = 0; i < 3; i++) {
    const mark = label(['R', 'A', 'M'][i], 0.4, 0.44, '#39453a', '#e4d9b5', 78);
    mark.position.set(2.85, 2.48 - i * 0.53, 0.67); world.add(mark);
  }

  for (const x of [-2.63, 2.2]) {
    rod(world, [x, 3.3, 0.5], [x, 2.83, 0.5], 0.017, p.black);
    const lantern = cylinder(world, [0.17, 0.17, 0.52], [x, 2.61, 0.5], material('#d96d36', { emissive: '#77300c', emissiveIntensity: 0.24 }), 10);
    for (const y of [2.39, 2.49, 2.6, 2.71, 2.82]) cylinder(world, [0.174, 0.174, 0.018], [x, y, 0.5], p.red, 10);
    cylinder(world, [0.085, 0.085, 0.07], [x, 2.9, 0.5], p.black);
    lantern.castShadow = false;
  }

  function bowl(x, z) {
    const group = new THREE.Group(); group.position.set(x,0,z); world.add(group);
    cylinder(group, [0.19, 0.11, 0.13], [0, 1.66, 0], p.white, 12);
    cylinder(group, [0.169, 0.169, 0.012], [0, 1.733, 0], p.broth, 12);
    for (let i = 0; i < 7; i++) rod(group, [-0.11 + i * 0.03, 1.746, -0.08], [-0.06 + i * 0.024, 1.746, 0.08], 0.008, p.noodle, 4);
    cylinder(group, [0.045, 0.045, 0.017], [0.06, 1.75, -0.035], p.orange, 8);
    box(group, [0.09, 0.016, 0.045], [-0.06, 1.756, 0.03], p.leaf);
    return group;
  }
  const bowls = [bowl(-1.25, -0.55), bowl(0.75, -0.55)];
  for (const x of [-1.8, -0.1, 1.45]) {
    cylinder(world, [0.055, 0.065, 0.18], [x, 1.67, 0.27], p.bottle);
    cylinder(world, [0.04, 0.04, 0.07], [x, 1.79, 0.27], p.cream);
  }
  for (let i = 0; i < 7; i++) {
    const x = -1.7 + i * 0.55;
    cylinder(world, [0.065, 0.07, 0.22], [x, 2.3, -2.1], i % 2 ? p.bottle : p.white);
    cylinder(world, [0.035, 0.035, 0.07], [x, 2.44, -2.1], p.timber);
  }
  cylinder(world, [0.28, 0.25, 0.23], [1.34, 1.65, -1.92], p.metal, 12);
  rod(world, [1.6, 1.66, -1.92], [1.98, 1.69, -1.92], 0.025, p.black);

  const diners = [];
  function seatedPerson(x, shirt, hair) {
    const g = new THREE.Group();
    g.position.set(x, 0, 1.42); world.add(g);
    cylinder(g, [0.27, 0.27, 0.11], [0, 0.94, 0], p.counter, 10);
    for (const dx of [-0.17, 0.17]) for (const dz of [-0.16, 0.16]) rod(g, [dx, 0.9, dz], [dx * 1.3, 0.07, dz * 1.3], 0.027, p.black);
    rod(g, [-0.18, 0.38, -0.16], [0.18, 0.38, -0.16], 0.02, p.black);
    const body = new THREE.Group(); body.position.set(0, 1.01, -0.04); body.rotation.x = -0.12; g.add(body);
    box(body, [0.4, 0.56, 0.25], [0, 0.28, 0], shirt);
    cylinder(body, [0.115, 0.115, 0.1], [0, 0.58, 0], p.skin);
    box(body, [0.3, 0.31, 0.29], [0, 0.78, -0.025], p.skin);
    box(body, [0.33, 0.13, 0.32], [0, 0.94, -0.015], hair);
    for (let i = 0; i < 6; i++) {
      const spike = box(body, [0.07, 0.13, 0.12], [-0.14 + i * 0.055, 1.02 + rng() * 0.04, 0], hair);
      spike.rotation.z = (rng() - 0.5) * 0.65;
    }
    box(body, [0.31, 0.045, 0.3], [0, 0.86, -0.024], p.black);
    box(body, [0.12, 0.04, 0.016], [0, 0.86, -0.183], p.metal);
    for (const side of [-1, 1]) {
      rod(g, [side * 0.11, 1.04, -0.02], [side * 0.17, 0.93, -0.42], 0.095, shirt);
      rod(g, [side * 0.17, 0.93, -0.42], [side * 0.18, 0.37, -0.38], 0.072, p.black);
      box(g, [0.17, 0.1, 0.3], [side * 0.18, 0.31, -0.47], p.black);
    }
    const supportUpper=rod(body,[0,0,0],[0,1,0],0.068,shirt);
    const supportLower=rod(body,[0,0,0],[0,1,0],0.05,p.skin);
    const supportPalm=box(body,[0.075,0.05,0.09],[0,0,0],p.skin);
    const arm = new THREE.Group(); arm.position.set(0.22, 0.48, 0); body.add(arm);
    rod(arm, [0, 0, 0], [0.1, -0.2, -0.18], 0.065, shirt);
    rod(arm, [0.1, -0.2, -0.18], [0.04, -0.02, -0.41], 0.048, p.skin);
    for (const dx of [-0.013, 0.013]) rod(arm, [0.03 + dx, -0.035, -0.4], [dx, -0.19, -0.63], 0.009, p.counter, 4);
    diners.push({ body, arm, supportUpper, supportLower, supportPalm, phase: x * 0.5, x });
  }
  seatedPerson(-1.25, p.green, p.hair);
  seatedPerson(0.75, p.orange, p.goldHair);

  const cook = new THREE.Group(); cook.position.set(0.4, 0.32, -1.0); world.add(cook);
  box(cook, [0.45, 0.7, 0.3], [0, 1.05, 0], p.cream);
  box(cook, [0.35, 0.52, 0.04], [0, 0.93, 0.17], p.apron);
  box(cook, [0.32, 0.34, 0.3], [0, 1.6, 0], p.skin);
  cylinder(cook, [0.22, 0.21, 0.15], [0, 1.87, 0], p.white, 10);
  const cookArm = new THREE.Group(); cookArm.position.set(0.25, 1.3, 0); cook.add(cookArm);
  rod(cookArm, [0, 0, 0], [0.2, -0.25, 0.1], 0.075, p.cream);
  rod(cookArm, [0.2, -0.25, 0.1], [0.06, -0.3, 0.44], 0.055, p.skin);
  rod(cookArm, [0.06, -0.3, 0.44], [0.1, -0.62, 0.51], 0.018, p.timber);
  rod(cook, [-0.25, 1.3, 0], [-0.38, 0.94, 0.31], 0.068, p.cream);
  const servingArm = new THREE.Group(); cook.add(servingArm);
  const upperServe = rod(servingArm,[0,0,0],[0,1,0],0.07,p.cream);
  const lowerServe = rod(servingArm,[0,0,0],[0,1,0],0.05,p.skin);
  const servingHand = box(servingArm,[0.1,0.065,0.1],[0,0,0],p.skin);
  const up = new THREE.Vector3(0,1,0);
  function segment(mesh,a,b) {
    const av = new THREE.Vector3(...a); const bv = new THREE.Vector3(...b);
    const delta = bv.clone().sub(av);
    mesh.position.copy(av).add(bv).multiplyScalar(0.5);
    mesh.scale.y = delta.length();
    mesh.quaternion.setFromUnitVectors(up,delta.normalize());
  }

  const glow = new THREE.PointLight('#ffae52', 8, 5, 2);
  glow.position.set(0, 2.7, -0.35); world.add(glow);
  for (const x of [-1.2, 1.1]) {
    box(world, [0.35, 0.06, 0.17], [x, 3.1, -0.6], material('#f1c174', { emissive: '#ecac45', emissiveIntensity: 0.25 }));
  }

  function plant(x, z) {
    cylinder(world, [0.2, 0.13, 0.36], [x, 0.22, z], p.pot);
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2;
      const y = 0.7 + rng() * 0.3;
      rod(world, [x, 0.39, z], [x + Math.cos(a) * 0.23, y, z + Math.sin(a) * 0.23], 0.015, p.leaf);
      const leaf = box(world, [0.12, 0.035, 0.25], [x + Math.cos(a) * 0.23, y, z + Math.sin(a) * 0.23], i % 2 ? p.leaf : p.leafLight);
      leaf.rotation.y = a;
      leaf.rotation.z = 0.4;
    }
  }
  plant(3.25, 0.68); plant(-2.9, -1.7);

  const steam = [];
  const steamPaint = material('#b4c2b4', { transparent: true, opacity: 0.32, depthWrite: false });
  for (const x of [-1.25, 0.75]) {
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.05, 0), steamPaint.clone());
      world.add(puff); steam.push({ puff, x, bowlIndex:x < 0 ? 0 : 1, phase: i / 5 });
    }
  }
  const rainCount = 170;
  const rainArray = new Float32Array(rainCount * 6);
  const rainSeeds = Array.from({ length: rainCount }, () => ({ x: (rng() - 0.5) * 8.6, z: (rng() - 0.5) * 7.2, phase: rng(), speed: 0.8 + rng() * 0.5 }));
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainArray, 3));
  const rain = new THREE.LineSegments(rainGeometry, new THREE.LineBasicMaterial({ color: '#aabdb7', transparent: true, opacity: 0.3, depthWrite: false }));
  rain.frustumCulled = false; world.add(rain);

  const smooth = value => {const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
  function update(time) {
    if (!Number.isFinite(time)) throw new TypeError('Ramen scene time must be finite.');
    const t = Math.max(0,Math.min(45,time));
    const eating = smooth((t-19)/1.5) * (1-smooth((t-27)/1.5));
    const conversation = smooth((t-28)/1.5) * (1-smooth((t-34)/1.5));
    const lastBite = smooth((t-34)/1.5) * (1-smooth((t-37)/1.5));
    for (const { body, arm, phase, x } of diners) {
      const lift = (0.5 - 0.5 * Math.cos((t * 0.4 + phase) * Math.PI * 2)) * eating + lastBite * 0.8;
      arm.rotation.x = -lift * 0.62;
      body.rotation.x = -0.12 - lift * 0.055;
      body.rotation.y = conversation * (x < 0 ? -0.24 : 0.24) * (0.9 + 0.1*Math.sin(t));
    }
    const firstServe = smooth((t-12)/3);
    const secondServe = smooth((t-17)/3);
    const clearFirst = smooth((t-40)/1.5);
    const clearSecond = smooth((t-43)/1.5);
    bowls[0].position.z = -0.55 + 1.16 * firstServe * (1-clearFirst);
    bowls[1].position.z = -0.55 + 1.16 * secondServe * (1-clearSecond);
    for(let i=0;i<bowls.length;i++) {
      const lift=smooth((t-34-i*0.55)/1.5)*(1-smooth((t-37-i*0.2)/1.1));
      bowls[i].position.y=lift*0.2;
      bowls[i].position.z+=lift*0.22;
      const diner=diners[i];
      diner.body.updateWorldMatrix(true,false);
      const target=diner.body.worldToLocal(new THREE.Vector3(diner.x-0.14,1.7+bowls[i].position.y,bowls[i].position.z));
      const hand=new THREE.Vector3(-0.12,0.35,-0.5).lerp(target,lift);
      const elbow=[-0.27,0.2+lift*0.09,-0.24];
      segment(diner.supportUpper,[-0.23,0.47,0],elbow);
      segment(diner.supportLower,elbow,hand.toArray());
      diner.supportPalm.position.copy(hand);
    }
    const windowWeight = (start,end) => smooth((t-start)/0.4)*(1-smooth((t-end+0.4)/0.4));
    const serving = Math.max(windowWeight(11.6,15.4),windowWeight(16.6,20.4),windowWeight(39.6,41.8),windowWeight(42.6,44.4));
    const which = t<16 || (t>=38 && t<42) ? 0 : 1;
    // Move the cook along the counter before reaching the next bowl.
    let cookX=0.4;
    if(t>=10 && t<15.4) cookX=0.4 + (-1.5-0.4)*smooth((t-10)/1.5);
    else if(t>=15.4 && t<20.4) cookX=-1.5 + 2.0*smooth((t-15.4)/1.2);
    else if(t>=20.4 && t<22.4) cookX=0.5-0.1*smooth((t-20.4)/2);
    else if(t>=38 && t<41.8) cookX=0.4+(-1.5-0.4)*smooth((t-38)/1.5);
    else if(t>=41.8 && t<44.4) cookX=-1.5+2*smooth((t-41.8)/0.8);
    else if(t>=44.4) cookX=0.5-0.1*smooth((t-44.4)/0.6);
    cook.position.x=cookX;
    const forward=smooth((t-10)/1.5)*(1-smooth((t-20.4)/2)) + smooth((t-38)/1.5)*(1-smooth((t-44.4)/0.6));
    cook.position.z=-1+forward*0.83;
    cookArm.visible=false;
    servingArm.visible=true;
    const activeBowl=bowls[which];
    const stir=Math.sin(t*(16*Math.PI*2/45));
    const resting=[0.14+stir*0.045,1.06,0.44];
    const reaching=[activeBowl.position.x-cook.position.x+0.17,1.36,activeBowl.position.z-cook.position.z];
    const hand=resting.map((v,i)=>v+(reaching[i]-v)*serving);
    const elbow=[0.32,1.12,hand[2]*0.45];
    segment(upperServe,[0.25,1.3,0],elbow);
    segment(lowerServe,elbow,hand);
    servingHand.position.set(...hand);
    for (const { puff, x, bowlIndex, phase } of steam) {
      const age = (t * (17/45) + phase) % 1;
      puff.position.set(x + Math.sin(age * 4 + x) * 0.1, 1.79 + bowls[bowlIndex].position.y + age * 0.72, bowls[bowlIndex].position.z + Math.cos(age * 3) * 0.04);
      puff.scale.setScalar(0.5 + age * 1.4);
      puff.material.opacity = Math.sin(age * Math.PI) * 0.28;
    }
    for (let i = 0; i < rainCount; i++) {
      const seed = rainSeeds[i];
      const cycles=Math.round(seed.speed*22);
      const y = 5.2 * (1 - ((t * cycles/45 + seed.phase) % 1));
      const at = i * 6;
      // Rain behind the roof or in the open foreground, never inside the stall.
      const sheltered = Math.abs(seed.x) < 2.9 && seed.z > -3.2 && seed.z < 1.1 && y < 4.6;
      const dropY = sheltered ? -0.3 : y;
      rainArray.set([seed.x, dropY, seed.z, seed.x + 0.025, dropY + 0.13, seed.z - 0.012], at);
    }
    rainGeometry.attributes.position.needsUpdate = true;
  }
  update(1.2);
  return {
    world, update, target: [0, 1.8, -0.3], stillTime: 24, startTime:0, duration:45, loop:false,
    phases:[
      {start:0,end:5,label:'Rain outside'}, {start:5,end:12,label:'A little preparation'},
      {start:12,end:20,label:'Two bowls, freshly served'}, {start:20,end:28,label:'The first bite'},
      {start:28,end:34,label:'A quiet conversation'}, {start:34,end:38,label:'One last sip'},
      {start:38,end:45,label:'The counter settles'},
    ],
    bounds: new THREE.Box3(new THREE.Vector3(-4.4, -0.32, -3.6), new THREE.Vector3(4.4, 5.35, 3.6)),
  };
}
