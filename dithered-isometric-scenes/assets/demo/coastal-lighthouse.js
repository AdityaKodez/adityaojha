import { THREE, material, cylinder, makeRandom } from '../diorama-runtime.js';

/**
 * The winding keeper. A finite 45-second visit, with a continuous optional seam.
 * All animation is reconstructed from absolute time; the host owns the stage.
 * Warm sandstone, chalk plaster, slate roofing, blue water. Green is foliage.
 */
export function buildCoastalLighthouse() {
  const world = new THREE.Group();
  world.name = 'coastal-lighthouse';
  const random = makeRandom(60823);
  const TAU = Math.PI * 2;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const mix = (a, b, u) => a + (b - a) * u;
  const angleMix = (a, b, u) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * u;
  const paint = {
    stone: ['#b6a88d', '#a79983', '#c4b79e', '#948a7b', '#d0c3ab'].map(c => material(c, { flatShading: true })),
    gravel: material('#c5b99f'), sand: material('#d5c9ae'), chalk: material('#e1dbc8'),
    plaster: material('#c9c1ac'), worn: material('#b9ad95'), roof: material('#4c5966'),
    roofLight: material('#64707a'), roofDark: material('#3d4954'), rust: material('#a9634a'),
    rustLight: material('#bb7d59'), sea: material('#557f8e'), seaEdge: material('#456b7a'),
    shallows: material('#7899a2'), ripple: material('#8daab1'), foam: material('#bacbca'),
    timber: material('#85705a'), timberLight: material('#aa9272'), timberDark: material('#645648'),
    metal: material('#3e494e'), iron: material('#636b6b'), brass: material('#b3945b'),
    glass: material('#718c98'), lamp: material('#e8bd73', { emissive: '#ce9d4c', emissiveIntensity: 0.45 }),
    leaf: material('#667458'), leafLight: material('#87906a'), grass: material('#939371'),
    skin: material('#c29a79'), trousers: material('#424f5a'), boot: material('#343e43'),
    scarf: material('#e1d4b4'), rope: material('#bcaa87'), boat: material('#647c89'),
  };
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitRod = new THREE.CylinderGeometry(1, 1, 1, 6);
  const pebble = new THREE.IcosahedronGeometry(1, 0);
  const headGeometry = new THREE.SphereGeometry(1, 8, 6);
  const up = new THREE.Vector3(0, 1, 0);
  const dummy = new THREE.Object3D();
  const delta = new THREE.Vector3();

  function mesh(parent, geometry, mat, name = '') {
    const object = new THREE.Mesh(geometry, mat);
    object.name = name;
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function cube(parent, size, position, mat, name = '') {
    const object = mesh(parent, unitBox, mat, name);
    object.scale.set(...size);
    object.position.set(...position);
    return object;
  }
  function link(parent, a, b, radius, mat, name = '') {
    const object = mesh(parent, unitRod, mat, name);
    setLink(object, new THREE.Vector3(...a), new THREE.Vector3(...b), radius);
    return object;
  }
  function setLink(object, a, b, radius) {
    delta.subVectors(b, a);
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.scale.set(radius, Math.max(delta.length(), 0.00001), radius);
    object.quaternion.setFromUnitVectors(up, delta.normalize());
  }
  function instances(parent, geometry, mat, records, name) {
    const object = new THREE.InstancedMesh(geometry, mat, records.length);
    object.name = name;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      dummy.position.set(...record.p);
      dummy.rotation.set(...(record.r || [0, 0, 0]));
      dummy.scale.set(...record.s);
      dummy.updateMatrix();
      object.setMatrixAt(i, dummy.matrix);
    }
    object.instanceMatrix.needsUpdate = true;
    object.castShadow = object.receiveShadow = true;
    object.computeBoundingBox();
    object.computeBoundingSphere();
    parent.add(object);
    return object;
  }
  function polygon(points, y, mat, name = '') {
    const points2 = points.map(([x, z]) => new THREE.Vector2(x, z));
    const faces = THREE.ShapeUtils.triangulateShape(points2, []);
    const vertices = [];
    for (const face of faces) {
      // Reverse the x/z contour's normal so every horizontal cap faces up.
      for (const index of [face[2], face[1], face[0]]) vertices.push(points[index][0], y, points[index][1]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return mesh(world, geometry, mat, name);
  }
  function terrace(points, bottom, top, inset, name, cap = paint.gravel) {
    const vertices = [];
    const groups = [];
    const center = points.reduce((sum, p) => [sum[0] + p[0] / points.length, sum[1] + p[1] / points.length], [0, 0]);
    const ring = points.map(([x, z]) => [mix(x, center[0], inset), mix(z, center[1], inset)]);
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const a = [points[i][0], bottom, points[i][1]];
      const b = [points[j][0], bottom, points[j][1]];
      const c = [ring[j][0], top, ring[j][1]];
      const d = [ring[i][0], top, ring[i][1]];
      vertices.push(...a, ...c, ...b, ...a, ...d, ...c);
      groups.push([i * 6, 6, i % paint.stone.length]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    for (const group of groups) geometry.addGroup(...group);
    geometry.computeVertexNormals();
    mesh(world, geometry, paint.stone, name);
    polygon(ring, top, cap, `${name}-surface`);
    return ring;
  }
  const seaOutline = [
    [-4.3, -1.95], [-3.35, -3.08], [-1.65, -3.3], [0.5, -3.05], [2.5, -2.4],
    [4.18, -1.1], [4.95, 0.25], [5.06, 1.8], [4.6, 3.35], [3.24, 4.08],
    [1.1, 4.28], [-0.92, 3.8], [-2.92, 2.58], [-4.25, 1.12], [-4.48, -0.4],
  ];
  // An opaque, explicitly cut inlet. No transparent plane or surrounding floor.
  terrace(seaOutline, -0.18, 0.025, 0, 'finite-inlet-edge', paint.sea);
  const toe = [
    [-4.05, -1.7], [-3.4, -2.85], [-2.08, -3.02], [-0.65, -2.48], [0.31, -1.8],
    [0.64, -0.75], [0.43, 0.31], [0.02, 1.23], [-0.42, 1.75], [-1.43, 2.02],
    [-2.87, 1.86], [-3.83, 0.88], [-4.24, -0.52],
  ];
  const middle = [
    [-3.96, -1.65], [-3.42, -2.66], [-2.18, -2.89], [-0.82, -2.35], [0.1, -1.7],
    [0.32, -0.84], [0.01, 0.2], [-0.66, 1.14], [-1.62, 1.29], [-2.69, 1.28],
    [-3.54, 0.64], [-3.94, -0.2],
  ];
  const summit = [
    [-3.73, -1.5], [-3.23, -2.48], [-2.14, -2.72], [-0.96, -2.23], [-0.25, -1.69],
    [-0.11, -0.84], [-0.12, -0.05], [-0.75, 0.39], [-1.4, 0.32], [-2.12, 0.12],
    [-2.8, 0.43], [-3.35, 0.06], [-3.69, -0.65],
  ];
  terrace(toe, -0.05, 0.46, 0.015, 'wave-cut-rock');
  terrace(middle, 0.38, 1.23, 0.018, 'fractured-middle-ledge');
  terrace(summit, 1.15, 2.03, 0.012, 'upper-headland');
  // Long seams and tapered buttresses follow geology instead of voxel courses.
  const strata = [];
  for (let i = 0; i < middle.length; i++) {
    const a = middle[i], b = middle[(i + 1) % middle.length];
    if (i > 3 && i < 10) {
      const x = mix(a[0], b[0], 0.48), z = mix(a[1], b[1], 0.48);
      strata.push({ p: [x, 0.77, z], s: [0.19, 0.51, 0.17], r: [0.09, i * 0.5, -0.15] });
    }
  }
  instances(world, pebble, paint.stone[3], strata, 'fractured-sandstone-fins');
  const talus = [];
  for (const [cx, cz, cy] of [[-3.6, 1.25, 0.38], [-2.9, 2.02, 0.09], [0.59, -0.45, 0.13], [-0.12, 1.35, 0.19]]) {
    for (let i = 0; i < 8; i++) {
      const r = 0.055 + random() * 0.12;
      talus.push({ p: [cx + (random() - 0.5) * 0.55, cy + r * 0.32, cz + (random() - 0.5) * 0.4], s: [r * 1.35, r * 0.65, r], r: [random(), random() * TAU, random()] });
    }
  }
  instances(world, pebble, paint.stone[2], talus, 'eroded-shore-stones');
  polygon([[-3.4, -1.97], [-2.83, -2.37], [-2.25, -2.46], [-1.8, -2.13], [-2.1, -1.85], [-2.84, -1.9]], 2.037, paint.leafLight, 'back-grass-patch');
  polygon([[-0.85, -2.13], [-0.39, -1.72], [-0.28, -1.0], [-0.46, -0.64], [-0.7, -0.95]], 2.038, paint.grass, 'wind-burnt-grass');

  // A clearly usable jetty and two perpendicular, hand-cut flights of steps.
  const jetty = new THREE.Group();
  jetty.name = 'timber-jetty';
  world.add(jetty);
  const deck = [];
  for (let i = 0; i < 15; i++) deck.push({ p: [-0.82 + i * 0.158, 0.51, 1.81], s: [0.15, 0.08, 0.62] });
  instances(jetty, unitBox, paint.timberLight, deck, 'individual-jetty-planks');
  for (const z of [1.58, 2.04]) cube(jetty, [2.48, 0.11, 0.1], [0.28, 0.39, z], paint.timberDark);
  for (const x of [-0.67, 0.5, 1.42]) {
    for (const z of [1.55, 2.06]) {
      cylinder(jetty, [0.065, 0.08, 0.84], [x, 0.29, z], paint.timberDark, 7);
      cylinder(jetty, [0.083, 0.083, 0.045], [x, 0.73, z], paint.timberLight, 7);
    }
  }
  const cleat = new THREE.Vector3(0.62, 0.615, 1.84);
  cube(jetty, [0.2, 0.038, 0.04], cleat.toArray(), paint.metal, 'jetty-cleat');
  cube(jetty, [0.035, 0.06, 0.04], [cleat.x, 0.57, cleat.z], paint.metal);
  const nailRecords = deck.flatMap(d => [1.57, 2.04].map(z => ({ p: [d.p[0], 0.554, z], s: [0.016, 0.006, 0.016] })));
  instances(jetty, unitBox, paint.iron, nailRecords, 'jetty-nail-heads');
  cube(world, [0.61, 0.16, 0.54], [-0.27, 0.47, 1.58], paint.stone[1], 'bottom-stair-landing');
  const ascent = [[0.75, 0.55, 1.91], [0.42, 0.55, 1.72], [0.08, 0.55, 1.61], [-0.29, 0.55, 1.58]];
  for (let i = 0; i < 8; i++) {
    const x = -0.39 - (i + 0.5) * 0.205;
    const top = 0.55 + (i + 1) * 0.75 / 8;
    cube(world, [0.214, top - 0.40, 0.53], [x, (top + 0.40) / 2, 1.58], paint.stone[(i + 2) % 5], `lower-tread-${i}`);
    ascent.push([x, top, 1.58]);
  }
  cube(world, [0.55, 0.17, 0.53], [-2.03, 1.215, 1.58], paint.stone[2], 'switchback-landing');
  ascent.push([-2.03, 1.30, 1.58]);
  for (let i = 0; i < 7; i++) {
    const z = 1.37 - (i + 0.5) * 0.205;
    const top = 1.30 + (i + 1) * 0.73 / 7;
    cube(world, [0.53, top - 1.18, 0.214], [-2.03, (top + 1.18) / 2, z], paint.stone[(i + 1) % 5], `upper-tread-${i}`);
    ascent.push([-2.03, top, z]);
  }
  ascent.push([-1.79, 2.03, -0.16], [-1.52, 2.03, -0.28], [-1.35, 2.03, -0.28]);
  // Thin iron safety rail follows the exposed lower flight, leaving the action visible.
  for (let i = 0; i < 5; i++) {
    const x = -0.34 - i * 0.43, y = 0.58 + i * 0.19;
    link(world, [x, y, 1.90], [x, y + 0.38, 1.90], 0.017, paint.iron);
  }
  link(world, [-0.34, 0.96, 1.9], [-2.06, 1.72, 1.9], 0.02, paint.iron);
  for (let i = 0; i < 5; i++) {
    const z = 1.38 - i * 0.32, y = 1.38 + i * 0.16;
    link(world, [-2.32, y, z], [-2.32, y + 0.36, z], 0.017, paint.iron);
  }
  link(world, [-2.32, 1.74, 1.38], [-2.32, 2.38, 0.1], 0.02, paint.iron);

  // Salt-weathered keeper's cottage: plaster, patched slate, timber, a squat flue.
  const cottage = new THREE.Group();
  cottage.position.set(-2.87, 2.03, -1.0);
  world.add(cottage);
  cube(cottage, [1.44, 0.14, 1.23], [0, 0.07, 0], paint.stone[1]);
  cube(cottage, [1.28, 0.94, 1.08], [0, 0.60, 0], paint.plaster);
  for (const x of [-0.61, 0.61]) {
    for (const z of [-0.51, 0.51]) {
      for (let i = 0; i < 5; i++) cube(cottage, [0.16, 0.09, 0.15], [x, 0.25 + i * 0.16, z], i % 2 ? paint.chalk : paint.worn);
    }
  }
  const gableGeometry = new THREE.BufferGeometry();
  gableGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -0.64, 1.07, 0.54, 0.64, 1.07, 0.54, 0, 1.48, 0.54,
    0.64, 1.07, -0.54, -0.64, 1.07, -0.54, 0, 1.48, -0.54,
  ], 3));
  gableGeometry.computeVertexNormals();
  // Roof ridge runs along z; front and rear gables remain visibly distinct.
  mesh(cottage, gableGeometry, paint.plaster);
  const roofAngle = Math.atan2(0.46, 0.79);
  for (const side of [-1, 1]) {
    const roof = cube(cottage, [0.96, 0.065, 1.43], [side * 0.385, 1.275, 0], paint.roof);
    roof.rotation.z = -side * roofAngle;
  }
  const slates = [];
  for (const side of [-1, 1]) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 7; col++) {
        const x = side * (0.13 + row * 0.195);
        slates.push({ p: [x, 1.51 - Math.abs(x) * 0.58, -0.61 + col * 0.20 + (row % 2) * 0.018], s: [0.232, 0.023, 0.193], r: [0, 0, -side * roofAngle] });
      }
    }
  }
  instances(cottage, unitBox, paint.roofLight, slates.filter((_, i) => i % 4 === 0), 'repaired-slate-tiles');
  cube(cottage, [0.11, 0.08, 1.5], [0, 1.52, 0], paint.roofDark);
  cube(cottage, [0.23, 0.63, 0.25], [-0.30, 1.48, -0.31], paint.stone[1]);
  cube(cottage, [0.31, 0.07, 0.31], [-0.30, 1.83, -0.31], paint.stone[3]);
  cube(cottage, [0.15, 0.015, 0.16], [-0.30, 1.875, -0.31], paint.metal);
  cube(cottage, [0.37, 0.77, 0.045], [0.16, 0.52, 0.565], paint.timberDark);
  for (let i = 0; i < 4; i++) cube(cottage, [0.075, 0.70, 0.024], [0.035 + i * 0.082, 0.53, 0.598], paint.rust);
  cube(cottage, [0.43, 0.07, 0.07], [0.16, 0.93, 0.59], paint.chalk);
  cube(cottage, [0.49, 0.08, 0.24], [0.16, 0.18, 0.66], paint.stone[2]);
  cube(cottage, [0.035, 0.035, 0.03], [0.27, 0.54, 0.63], paint.brass);
  cube(cottage, [0.28, 0.33, 0.04], [-0.39, 0.69, 0.57], paint.roofDark);
  cube(cottage, [0.23, 0.27, 0.014], [-0.39, 0.69, 0.6], paint.glass);
  cube(cottage, [0.025, 0.28, 0.025], [-0.39, 0.69, 0.62], paint.chalk);
  cube(cottage, [0.24, 0.025, 0.025], [-0.39, 0.69, 0.62], paint.chalk);
  for (const x of [-0.60, -0.18]) cube(cottage, [0.10, 0.32, 0.04], [x, 0.69, 0.60], paint.rust);
  cube(cottage, [0.33, 0.05, 0.15], [-0.39, 0.51, 0.62], paint.chalk);
  const plasterChips = [];
  for (let i = 0; i < 17; i++) plasterChips.push({ p: [-0.55 + random() * 1.08, 0.22 + random() * 0.15, 0.545], s: [0.04 + random() * 0.11, 0.025 + random() * 0.05, 0.013] });
  instances(cottage, unitBox, paint.worn, plasterChips, 'salt-worn-plaster');
  cylinder(world, [0.14, 0.17, 0.36], [-3.57, 2.23, -0.37], paint.timber, 10);
  for (const y of [2.12, 2.35]) cylinder(world, [0.174, 0.174, 0.026], [-3.57, y, -0.37], paint.iron, 10);

  // Cream taper, masonry foot, rust band, a real lantern gallery and eight ribs.
  const tower = new THREE.Group();
  tower.position.set(-1.35, 2.03, -1.55);
  tower.name = 'cream-masonry-lighthouse';
  world.add(tower);
  cylinder(tower, [0.66, 0.74, 0.17], [0, 0.085, 0], paint.stone[2], 12);
  cylinder(tower, [0.43, 0.59, 2.39], [0, 1.365, 0], paint.chalk, 16);
  cylinder(tower, [0.595, 0.61, 0.12], [0, 0.23, 0], paint.plaster, 16);
  cylinder(tower, [0.472, 0.497, 0.37], [0, 1.825, 0], paint.rust, 16);
  cylinder(tower, [0.53, 0.445, 0.10], [0, 2.55, 0], paint.plaster, 16);
  cylinder(tower, [0.70, 0.56, 0.12], [0, 2.66, 0], paint.stone[2], 16);
  cylinder(tower, [0.70, 0.70, 0.045], [0, 2.735, 0], paint.iron, 16);
  const gallery = [];
  for (let i = 0; i < 16; i++) {
    const a = i * TAU / 16;
    gallery.push({ p: [Math.sin(a) * 0.65, 2.94, Math.cos(a) * 0.65], s: [0.022, 0.39, 0.022] });
  }
  instances(tower, unitBox, paint.metal, gallery, 'lantern-gallery-balusters');
  for (const y of [2.90, 3.13]) {
    const ring = mesh(tower, new THREE.TorusGeometry(0.65, 0.018, 4, 32), paint.metal);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
  }
  cylinder(tower, [0.405, 0.405, 0.055], [0, 2.825, 0], paint.roofDark, 8);
  cylinder(tower, [0.415, 0.415, 0.055], [0, 3.465, 0], paint.metal, 8);
  const ribs = [];
  for (let i = 0; i < 8; i++) {
    const a = i * TAU / 8;
    ribs.push({ p: [Math.sin(a) * 0.385, 3.15, Math.cos(a) * 0.385], s: [0.035, 0.64, 0.035] });
  }
  instances(tower, unitBox, paint.metal, ribs, 'eight-lantern-ribs');
  // Rear panes are opaque blue-grey; the front is open to the miniature lamp.
  for (let i = 3; i < 7; i++) {
    const a = (i + 0.5) * TAU / 8;
    const pane = cube(tower, [0.28, 0.55, 0.018], [Math.sin(a) * 0.362, 3.15, Math.cos(a) * 0.362], paint.glass);
    pane.rotation.y = a;
  }
  const beacon = new THREE.Group();
  beacon.name = 'rotating-beacon';
  beacon.position.y = 3.15;
  tower.add(beacon);
  cylinder(beacon, [0.075, 0.11, 0.35], [0, -0.08, 0], paint.brass, 8);
  const bulb = mesh(beacon, headGeometry, paint.lamp, 'beacon-lens');
  bulb.scale.set(0.115, 0.19, 0.115);
  const reflector = cube(beacon, [0.33, 0.35, 0.055], [0, 0.01, -0.17], paint.brass);
  reflector.rotation.x = -0.12;
  const lampLight = new THREE.PointLight('#eac58c', 0.5, 1.65, 2);
  lampLight.position.set(0, 0, 0.09);
  beacon.add(lampLight);
  cylinder(tower, [0.07, 0.57, 0.34], [0, 3.66, 0], paint.roofDark, 8);
  cylinder(tower, [0.07, 0.07, 0.15], [0, 3.91, 0], paint.iron, 8);
  cylinder(tower, [0.12, 0.06, 0.07], [0, 4.02, 0], paint.roofDark, 8);
  link(tower, [0, 4.03, 0], [0, 4.24, 0], 0.014, paint.metal);
  link(tower, [-0.18, 4.16, 0], [0.18, 4.16, 0], 0.013, paint.metal);
  const vane = mesh(tower, new THREE.ConeGeometry(0.075, 0.15, 3), paint.metal);
  vane.position.set(0.18, 4.16, 0);
  vane.rotation.z = -Math.PI / 2;
  // Small recessed windows, not an unbroken toy cylinder.
  for (const [y, radius] of [[0.83, 0.555], [2.16, 0.46]]) {
    const frame = cylinder(tower, [0.105, 0.105, 0.035], [0.07, y, radius], paint.plaster, 12);
    frame.rotation.x = Math.PI / 2;
    const glass = cylinder(tower, [0.073, 0.073, 0.038], [0.07, y, radius + 0.018], paint.roofDark, 12);
    glass.rotation.x = Math.PI / 2;
  }

  // The winding mechanism is at ground level and can actually be reached.
  const cabinet = new THREE.Group();
  cabinet.name = 'beacon-winding-cabinet';
  cabinet.position.set(-1.35, 2.76, -0.945);
  world.add(cabinet);
  cube(cabinet, [0.51, 0.57, 0.19], [0, 0, 0], paint.roofDark);
  cube(cabinet, [0.44, 0.49, 0.025], [0, 0, 0.111], paint.timberDark);
  cube(cabinet, [0.58, 0.055, 0.29], [0, -0.31, 0.055], paint.stone[2]);
  const dial = cylinder(cabinet, [0.13, 0.13, 0.026], [-0.1, 0.01, 0.14], paint.brass, 12);
  dial.rotation.x = Math.PI / 2;
  const crank = new THREE.Group();
  crank.position.set(-0.1, 0.01, 0.18);
  crank.name = 'winding-crank';
  cabinet.add(crank);
  cube(crank, [0.155, 0.033, 0.025], [0.064, 0, 0], paint.iron);
  const crankHandle = cylinder(crank, [0.025, 0.025, 0.11], [0.13, 0, 0.058], paint.timberLight, 8);
  crankHandle.rotation.x = Math.PI / 2;
  const crankContact = new THREE.Object3D();
  crankContact.name = 'crank-hand-contact';
  crankContact.position.set(0.13, 0, 0.10);
  crank.add(crankContact);
  const door = new THREE.Group();
  door.position.set(-0.267, 0, 0.13);
  door.name = 'hinged-winding-cabinet-door';
  cabinet.add(door);
  cube(door, [0.515, 0.57, 0.045], [0.258, 0, 0.025], paint.rust);
  cube(door, [0.37, 0.025, 0.018], [0.26, 0.19, 0.058], paint.rustLight);
  cube(door, [0.37, 0.025, 0.018], [0.26, -0.19, 0.058], paint.rustLight);
  const latch = new THREE.Object3D();
  latch.name = 'cabinet-latch-contact';
  latch.position.set(0.455, -0.015, 0.083);
  door.add(latch);
  cube(door, [0.035, 0.075, 0.025], latch.position.toArray(), paint.brass);

  // Vegetation is deliberately confined to a few salt-swept coastal clumps.
  const shrubs = [], grass = [], pebbles = [];
  for (const [cx, cz] of [[-3.34, -2.0], [-2.33, -2.4], [-0.45, -1.67], [-0.50, -0.53]]) {
    for (let i = 0; i < 7; i++) {
      const a = random() * TAU, r = random() * 0.22;
      shrubs.push({ p: [cx + Math.cos(a) * r - 0.06, 2.11 + random() * 0.13, cz + Math.sin(a) * r], s: [0.17 + random() * 0.10, 0.10 + random() * 0.12, 0.14 + random() * 0.08], r: [0, random() * TAU, -0.22] });
    }
    for (let i = 0; i < 23; i++) {
      const a = random() * TAU, r = 0.16 + random() * 0.21;
      grass.push({ p: [cx + Math.cos(a) * r, 2.035, cz + Math.sin(a) * r], s: [0.035, 0.08 + random() * 0.11, 0.035], r: [-0.2, a, -0.30] });
    }
  }
  instances(world, pebble, paint.leaf, shrubs, 'wind-sheared-coastal-shrubs');
  const grassGeometry = new THREE.BufferGeometry();
  grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, -0.55, 1, 0, 0, 0, -0.5, 0, 0, 0.5, -0.3, 0.85, 0], 3));
  grassGeometry.computeVertexNormals();
  const grassMaterial = material('#999877', { side: THREE.DoubleSide });
  instances(world, grassGeometry, grassMaterial, grass, 'fine-marram-grass');
  for (let i = 0; i < 24; i++) {
    const a = random() * TAU;
    pebbles.push({ p: [-2.5 + Math.cos(a) * 0.5, 2.047, -2.13 + Math.sin(a) * 0.29], s: [0.025 + random() * 0.03, 0.015, 0.022 + random() * 0.02] });
  }
  instances(world, pebble, paint.stone[3], pebbles, 'summit-gravel');

  // Water detail is sparse, matte and bounded. Everything is built once.
  const waterMarks = [];
  for (let i = 0; i < 43; i++) {
    const x = 0.85 + random() * 3.40, z = -1.20 + random() * 4.50;
    waterMarks.push({ p: [x, 0.032, z], s: [0.10 + random() * 0.34, 0.007, 0.012 + random() * 0.009], r: [0, -0.18, 0] });
  }
  const ripples = instances(world, unitBox, paint.ripple, waterMarks, 'inlet-current-ribbons');
  ripples.castShadow = false;
  const foamRecords = [];
  for (let i = 4; i < toe.length - 1; i++) {
    const a = toe[i], b = toe[i + 1];
    for (let j = 0; j < 4; j++) {
      const u = (j + 0.4) / 4;
      const x = mix(a[0], b[0], u), z = mix(a[1], b[1], u);
      foamRecords.push({ p: [x + 0.08, 0.04, z + 0.06], s: [0.12 + random() * 0.07, 0.008, 0.028], r: [0, Math.atan2(b[0] - a[0], b[1] - a[1]) + Math.PI / 2, 0] });
    }
  }
  const foam = instances(world, unitBox, paint.foam, foamRecords, 'broken-shore-foam');
  foam.castShadow = false;
  const buoy = new THREE.Group();
  buoy.name = 'channel-buoy';
  buoy.position.set(4.06, 0.045, 0.48);
  world.add(buoy);
  cylinder(buoy, [0.09, 0.17, 0.21], [0, 0.05, 0], paint.chalk, 8);
  cylinder(buoy, [0.04, 0.09, 0.12], [0, 0.215, 0], paint.rust, 8);
  link(buoy, [0, 0.27, 0], [0, 0.43, 0], 0.014, paint.metal);

  // A curved, open clinker skiff. Gunwale and ribs follow the hull stations.
  const boat = new THREE.Group();
  boat.name = 'keeper-skiff';
  world.add(boat);
  const stations = [[-0.89, 0.03], [-0.72, 0.25], [-0.36, 0.355], [0.18, 0.355], [0.66, 0.235], [0.94, 0.018]];
  const hullVertices = [], hullGroups = [];
  for (const side of [-1, 1]) {
    for (let band = 0; band < 3; band++) {
      for (let i = 0; i < stations.length - 1; i++) {
        const [za, wa] = stations[i], [zb, wb] = stations[i + 1];
        const ys = [-0.11, 0.055, 0.23, 0.39];
        const widths = [0.30, 0.79, 0.99, 1];
        const a = [wa * widths[band] * side, ys[band], za];
        const b = [wb * widths[band] * side, ys[band], zb];
        const c = [wb * widths[band + 1] * side, ys[band + 1], zb];
        const d = [wa * widths[band + 1] * side, ys[band + 1], za];
        const offset = hullVertices.length / 3;
        if (side === 1) hullVertices.push(...a, ...b, ...c, ...a, ...c, ...d);
        else hullVertices.push(...a, ...c, ...b, ...a, ...d, ...c);
        hullGroups.push([offset, 6, band === 0 ? 0 : band === 1 ? 1 : 2]);
      }
    }
  }
  const hullGeometry = new THREE.BufferGeometry();
  hullGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hullVertices, 3));
  hullGeometry.computeVertexNormals();
  for (const group of hullGroups) hullGeometry.addGroup(...group);
  const hullPaint = [paint.roofDark.clone(), paint.boat.clone(), paint.chalk.clone()];
  for (const mat of hullPaint) mat.side = THREE.DoubleSide;
  mesh(boat, hullGeometry, hullPaint, 'curved-clinker-hull');
  const hullRibs = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < stations.length - 1; i++) {
      const a = stations[i], b = stations[i + 1];
      link(boat, [side * a[1], 0.405, a[0]], [side * b[1], 0.405, b[0]], 0.026, paint.timberLight);
      for (const y of [0.066, 0.235]) link(boat, [side * a[1] * (y < 0.1 ? 0.81 : 1), y, a[0]], [side * b[1] * (y < 0.1 ? 0.81 : 1), y, b[0]], 0.009, paint.roofDark);
    }
  }
  for (let i = 0; i < 5; i++) hullRibs.push({ p: [-0.22 + i * 0.11, 0.158, -0.05], s: [0.102, 0.035, 1.17] });
  instances(boat, unitBox, paint.timber, hullRibs, 'skiff-floorboards');
  cube(boat, [0.64, 0.06, 0.15], [0, 0.38, -0.05], paint.timberLight, 'rowing-thwart');
  cube(boat, [0.47, 0.05, 0.15], [0, 0.37, 0.53], paint.timberLight);
  cube(boat, [0.43, 0.055, 0.18], [0, 0.37, -0.63], paint.timberLight);
  for (let i = 0; i < 4; i++) {
    const coil = mesh(boat, new THREE.TorusGeometry(0.075 + i * 0.017, 0.011, 4, 18), paint.rope);
    coil.rotation.x = Math.PI / 2;
    coil.position.set(-0.02, 0.408 + i * 0.002, 0.55);
  }
  cylinder(boat, [0.074, 0.08, 0.17], [0.16, 0.255, 0.31], paint.rust, 8);
  cube(boat, [0.10, 0.025, 0.025], [0.16, 0.36, 0.31], paint.iron);
  const oars = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.34, 0.40, -0.22);
    pivot.name = side < 0 ? 'port-oar' : 'starboard-oar';
    boat.add(pivot);
    link(pivot, [-side * 0.25, 0, 0], [side * 0.87, 0, 0], 0.018, paint.timberLight);
    cube(pivot, [0.25, 0.027, 0.105], [side * 0.78, 0, 0], paint.timber);
    const grip = new THREE.Object3D();
    grip.name = side < 0 ? 'port-oar-hand-contact' : 'starboard-oar-hand-contact';
    grip.position.set(-side * 0.235, 0, 0);
    pivot.add(grip);
    cylinder(boat, [0.027, 0.027, 0.10], [side * 0.34, 0.39, -0.22], paint.iron, 6);
    oars.push({ pivot, grip, side });
  }
  const painterAnchor = new THREE.Vector3(0.15, 0.405, 0.65);
  const ropeGeometry = new THREE.BufferGeometry();
  const ropePositions = new Float32Array(25 * 3);
  ropeGeometry.setAttribute('position', new THREE.BufferAttribute(ropePositions, 3));
  const painter = new THREE.Line(ropeGeometry, new THREE.LineBasicMaterial({ color: '#baa886' }));
  painter.name = 'continuous-skiff-painter';
  painter.frustumCulled = false;
  world.add(painter);

  // Persistent articulated keeper. IK transforms rods, never creates per-frame meshes.
  const keeper = new THREE.Group();
  keeper.name = 'lighthouse-keeper';
  world.add(keeper);
  const upperBody = new THREE.Group();
  upperBody.name = 'keeper-upper-body';
  upperBody.position.y = 0.52;
  keeper.add(upperBody);
  const coatGeometry = new THREE.CylinderGeometry(0.175, 0.195, 0.39, 8);
  const coat = mesh(upperBody, coatGeometry, paint.rust);
  coat.position.y = 0.15;
  coat.scale.z = 0.75;
  cylinder(upperBody, [0.064, 0.07, 0.12], [0, 0.40, 0], paint.skin, 8);
  const head = mesh(upperBody, headGeometry, paint.skin);
  head.position.set(0, 0.49, 0.015);
  head.scale.set(0.105, 0.125, 0.10);
  cube(upperBody, [0.045, 0.045, 0.055], [0, 0.48, 0.11], paint.skin);
  cylinder(upperBody, [0.105, 0.115, 0.1], [0, 0.60, 0], paint.trousers, 10);
  cube(upperBody, [0.19, 0.025, 0.08], [0, 0.56, 0.083], paint.roofDark);
  cube(upperBody, [0.20, 0.05, 0.17], [0, 0.365, 0], paint.scarf);
  cube(upperBody, [0.07, 0.20, 0.025], [-0.06, 0.23, 0.145], paint.scarf);
  const buttons = [0.06, 0.15, 0.24].map(y => ({ p: [0.035, y, 0.148], s: [0.018, 0.018, 0.01] }));
  instances(upperBody, unitBox, paint.brass, buttons, 'raincoat-buttons');
  const limbs = [];
  for (const [side, label] of [[-1, 'left'], [1, 'right']]) {
    const upperArm = mesh(keeper, unitRod, paint.rust, `keeper-${label}-upper-arm`);
    const forearm = mesh(keeper, unitRod, paint.rust, `keeper-${label}-forearm`);
    const hand = mesh(keeper, headGeometry, paint.skin, `keeper-${label}-hand`);
    hand.scale.set(0.042, 0.047, 0.044);
    const thigh = mesh(keeper, unitRod, paint.trousers, `keeper-${label}-thigh`);
    const shin = mesh(keeper, unitRod, paint.trousers, `keeper-${label}-shin`);
    const boot = new THREE.Group();
    boot.name = `keeper-${label}-boot`;
    keeper.add(boot);
    cube(boot, [0.105, 0.10, 0.19], [0, 0.055, 0.025], paint.boot);
    cube(boot, [0.11, 0.025, 0.20], [0, 0.0125, 0.025], paint.roofDark);
    limbs.push({ side, upperArm, forearm, hand, thigh, shin, boot,
      shoulder: new THREE.Vector3(), elbow: new THREE.Vector3(), hip: new THREE.Vector3(),
      knee: new THREE.Vector3(), ankle: new THREE.Vector3(), handTarget: new THREE.Vector3() });
  }

  // Footfall tracks store every support point at construction time. A foot stays
  // planted between steps; only the swing foot clears the riser in a small arc.
  function footPair(point, yaw) {
    return [-1, 1].map(side => new THREE.Vector3(point[0] + Math.cos(yaw) * side * 0.09, point[1], point[2] - Math.sin(yaw) * side * 0.09));
  }
  function walkingTrack(points, firstYaw, lastYaw, initialFeet) {
    let feet = initialFeet ? initialFeet.map(v => v.clone()) : footPair(points[0], firstYaw);
    let yaw = firstYaw;
    const steps = [];
    for (let i = 1; i < points.length + 1; i++) {
      const atEnd = i === points.length;
      const point = points[Math.min(i, points.length - 1)];
      const next = points[Math.min(i + 1, points.length - 1)];
      const previous = points[Math.max(0, Math.min(i - 1, points.length - 2))];
      const nextYaw = i >= points.length - 1 ? lastYaw : Math.atan2(next[0] - previous[0], next[2] - previous[2]);
      const side = (i - 1) % 2;
      const pair = footPair(point, nextYaw);
      const end = feet.map(v => v.clone());
      end[side].copy(pair[side]);
      steps.push({ from: feet, to: end, side, yaw, nextYaw });
      feet = end.map(v => v.clone());
      yaw = nextYaw;
      if (atEnd) break;
    }
    return { steps, finalFeet: feet, firstYaw, lastYaw };
  }
  const walkUp = walkingTrack(ascent, -2.09, Math.PI);
  const walkDown = walkingTrack([...ascent].reverse(), Math.PI, 0);
  const seatedFeet = [new THREE.Vector3(0.88, 0.210, 2.69), new THREE.Vector3(0.88, 0.210, 2.51)];
  const crossing = [[0.88, 0.210, 2.60], [0.85, 0.445, 2.255], [0.79, 0.55, 2.03], ascent[0]];
  const walkOff = walkingTrack(crossing, Math.PI, -2.09, seatedFeet);
  const walkOn = walkingTrack([...crossing].reverse(), 0, Math.PI / 2, walkDown.finalFeet);
  const feetWorld = [new THREE.Vector3(), new THREE.Vector3()];
  const root = new THREE.Vector3();
  let yaw = 0, lean = 0, gait = 0;
  const footYaws = [0, 0];
  function walk(track, progress) {
    const count = track.steps.length;
    const index = Math.min(count - 1, Math.floor(clamp(progress) * count));
    const u = clamp(progress) >= 1 ? 1 : clamp(progress) * count - index;
    const step = track.steps[index], w = ease(u);
    let floor = 0;
    for (let side = 0; side < 2; side++) {
      feetWorld[side].lerpVectors(step.from[side], step.to[side], side === step.side ? w : 0);
      floor += feetWorld[side].y / 2;
      if (side === step.side) feetWorld[side].y += Math.sin(Math.PI * u) * (0.10 + Math.abs(step.to[side].y - step.from[side].y) * 0.3);
      footYaws[side] = angleMix(step.yaw, step.nextYaw, w);
    }
    root.copy(feetWorld[0]).add(feetWorld[1]).multiplyScalar(0.5);
    root.y = floor;
    yaw = angleMix(step.yaw, step.nextYaw, w);
    gait = Math.sin(Math.PI * u) * (step.side ? 1 : -1);
    lean = 0.045;
  }
  const ikDirection = new THREE.Vector3(), ikBend = new THREE.Vector3();
  function joint(a, b, firstLength, secondLength, preferred, output) {
    ikDirection.subVectors(b, a);
    const distance = Math.max(0.00001, ikDirection.length());
    ikDirection.multiplyScalar(1 / distance);
    const d = Math.min(distance, firstLength + secondLength - 0.00001);
    const along = (firstLength * firstLength - secondLength * secondLength + d * d) / (2 * d);
    const height = Math.sqrt(Math.max(0, firstLength * firstLength - along * along));
    ikBend.copy(preferred).addScaledVector(ikDirection, -preferred.dot(ikDirection));
    if (ikBend.lengthSq() < 0.00001) ikBend.set(1, 0, 0);
    ikBend.normalize();
    output.copy(a).addScaledVector(ikDirection, along).addScaledVector(ikBend, height);
  }
  const bendArm = new THREE.Vector3(), bendKnee = new THREE.Vector3(0, 0, 1);
  const contactCrank = new THREE.Vector3(), contactLatch = new THREE.Vector3();
  const brace = new THREE.Vector3(), boatPoint = new THREE.Vector3(), ropeEnd = new THREE.Vector3();
  const ropeStart = new THREE.Vector3(), coilPoint = new THREE.Vector3(), temp = new THREE.Vector3();
  const handWorld = [new THREE.Vector3(), new THREE.Vector3()];
  const rowContacts = [new THREE.Vector3(), new THREE.Vector3()];
  const inbound = new THREE.CubicBezierCurve3(new THREE.Vector3(3.2, 0, 1.15), new THREE.Vector3(3.6, 0, 2.3), new THREE.Vector3(2.15, 0, 2.6), new THREE.Vector3(0.55, 0, 2.6));
  const outbound = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.55, 0, 2.6), new THREE.Vector3(1.5, 0, 2.93), new THREE.Vector3(2.8, 0, 3.05),
    new THREE.Vector3(3.72, 0, 2.43), new THREE.Vector3(3.68, 0, 1.65), new THREE.Vector3(3.2, 0, 1.15),
  ], false, 'centripetal');
  const startTangent = inbound.getTangent(0);
  const startYaw = Math.atan2(startTangent.x, startTangent.z);
  const endTangent = outbound.getTangent(1);
  const endYaw = Math.atan2(endTangent.x, endTangent.z);
  const state = { time: 0, activity: '', planted: [false, false], winding: false, rowing: false };
  world.userData.coastal = { state, seaOutline, ascent: ascent.map(p => [...p]), palette: 'warm sandstone / cream masonry / slate roof / blue inlet / rust workwear' };

  function update(timeSeconds) {
    if (!Number.isFinite(timeSeconds)) throw new TypeError('Coastal sequence time must be finite.');
    const t = Math.max(0, Math.min(45, timeSeconds));
    state.time = t;
    state.winding = t >= 17.6 && t <= 22.2;
    const rowWeight = ramp(t, 0, 0.85) * (1 - ramp(t, 4.45, 5.5)) + ramp(t, 34, 35) * (1 - ramp(t, 40.2, 41.5));
    state.rowing = rowWeight > 0.001;
    let boatYaw;
    if (t <= 5.5) {
      const u = ramp(t, 0, 5.5);
      inbound.getPoint(u, boatPoint);
      inbound.getTangent(u, temp);
      boatYaw = Math.atan2(temp.x, temp.z);
    } else if (t < 34) {
      boatPoint.set(0.55, 0, 2.6);
      boatYaw = -Math.PI / 2;
    } else if (t <= 39.8) {
      const u = ramp(t, 34, 39.8);
      outbound.getPoint(u, boatPoint);
      outbound.getTangent(u, temp);
      const heading = Math.atan2(temp.x, temp.z);
      // Back away from the berth first; differential rowing turns the skiff out.
      boatYaw = angleMix(-Math.PI / 2, heading, ramp(t, 34.25, 35.65));
    } else {
      boatPoint.set(3.2, 0, 1.15);
      boatYaw = angleMix(endYaw, startYaw, ramp(t, 39.8, 41.5));
    }
    const afloat = 1 - ramp(t, 5.0, 5.5) + ramp(t, 34, 34.5);
    boat.position.set(boatPoint.x, 0.035 + Math.sin(TAU * t / 5) * 0.012 * afloat, boatPoint.z);
    boat.rotation.set(0, boatYaw, Math.sin(TAU * t / 5) * 0.009 * afloat);
    const stroke = TAU * t / 1.35;
    for (const oar of oars) {
      oar.pivot.rotation.set(0, oar.side * (Math.sin(stroke) * 0.40 * rowWeight - Math.PI / 2 * (1 - rowWeight)), oar.side * Math.cos(stroke) * 0.10 * rowWeight);
    }
    boat.updateMatrixWorld(true);
    // The keeper faces the stern when rowing, with feet and hands on the boat.
    function seated() {
      root.set(0, -0.055, -0.05);
      boat.localToWorld(root);
      yaw = boatYaw + Math.PI;
      lean = Math.sin(stroke) * 0.075 * rowWeight;
      gait = 0;
      for (let i = 0; i < 2; i++) {
        // A seated rower faces opposite the hull: anatomical sides are reversed.
        feetWorld[i].set((i ? -1 : 1) * 0.09, 0.175, -0.33);
        boat.localToWorld(feetWorld[i]);
        footYaws[i] = yaw;
      }
    }
    if (t <= 5.5 || t >= 34) seated();
    else if (t < 6.2) {
      seated();
      const u = ramp(t, 5.5, 6.2);
      root.x = mix(0.60, 0.88, u);
      root.y = mix(-0.020, 0.210, u);
      root.z = 2.6;
      yaw = angleMix(Math.PI / 2, Math.PI, u);
      lean = 0.045 * u + Math.sin(Math.PI * u) * 0.17;
      footYaws.fill(yaw);
    } else if (t < 7.6) walk(walkOff, (t - 6.2) / 1.4);
    else if (t < 15.8) walk(walkUp, (t - 7.6) / 8.2);
    else if (t < 23.5) {
      const final = walkUp.finalFeet;
      feetWorld[0].copy(final[0]); feetWorld[1].copy(final[1]);
      root.copy(final[0]).add(final[1]).multiplyScalar(0.5);
      yaw = Math.PI;
      lean = 0.045 + 0.10 * ramp(t, 15.8, 16.3) * (1 - ramp(t, 23.1, 23.5));
      gait = 0;
      footYaws.fill(yaw);
    } else if (t < 31.7) walk(walkDown, (t - 23.5) / 8.2);
    else if (t < 33.3) walk(walkOn, (t - 31.7) / 1.6);
    else {
      const u = ramp(t, 33.3, 34);
      for (let i = 0; i < 2; i++) feetWorld[i].copy(walkOn.finalFeet[i]);
      root.set(mix(0.88, 0.60, u), mix(0.210, -0.020, u), 2.6);
      yaw = Math.PI / 2;
      lean = 0.045 * (1 - u) + Math.sin(Math.PI * u) * 0.17;
      gait = 0;
      footYaws.fill(yaw);
    }
    keeper.position.copy(root);
    keeper.rotation.set(0, yaw, 0);
    upperBody.rotation.x = lean;
    keeper.updateMatrixWorld(true);

    door.rotation.y = -1.55 * ramp(t, 16.3, 17.3) * (1 - ramp(t, 22.5, 23.1));
    crank.rotation.z = -TAU * 3 * ramp(t, 17.6, 22.2);
    cabinet.updateMatrixWorld(true);
    crankContact.getWorldPosition(contactCrank);
    latch.getWorldPosition(contactLatch);
    brace.set(0.20, -0.08, 0.22); cabinet.localToWorld(brace);
    for (let i = 0; i < 2; i++) oars[1 - i].grip.getWorldPosition(rowContacts[i]);
    for (let i = 0; i < 2; i++) {
      const limb = limbs[i], side = limb.side;
      temp.set(side * 0.205, 0.48, 0.055 + gait * side * 0.10);
      keeper.localToWorld(temp);
      handWorld[i].copy(temp);
      if (t <= 5.5 || t >= 34) handWorld[i].copy(rowContacts[i]);
      else if (t < 6.2) handWorld[i].lerpVectors(rowContacts[i], temp, ramp(t, 5.5, 6.2));
      else if (t >= 33.3) handWorld[i].lerp(rowContacts[i], ramp(t, 33.3, 34));
      if (i === 0 && t >= 15.8 && t <= 23.5) {
        if (t < 16.3) handWorld[i].lerp(contactLatch, ramp(t, 15.8, 16.3));
        else if (t < 17.3) handWorld[i].copy(contactLatch);
        else if (t < 17.6) handWorld[i].lerpVectors(contactLatch, brace, ramp(t, 17.3, 17.6));
        else if (t < 22.2) handWorld[i].copy(brace);
        else if (t < 22.5) handWorld[i].lerpVectors(brace, contactLatch, ramp(t, 22.2, 22.5));
        else if (t < 23.1) handWorld[i].copy(contactLatch);
        else handWorld[i].lerpVectors(contactLatch, temp, ramp(t, 23.1, 23.5));
      }
      if (i === 1 && t >= 17.1 && t <= 22.65) {
        const weight = ramp(t, 17.1, 17.6) * (1 - ramp(t, 22.2, 22.65));
        handWorld[i].lerp(contactCrank, weight);
      }
      limb.handTarget.copy(handWorld[i]); keeper.worldToLocal(limb.handTarget);
      limb.shoulder.set(side * 0.17, 0.52 + Math.cos(lean) * 0.28, Math.sin(lean) * 0.28);
      bendArm.set(side * 0.7, -0.3, -0.45);
      joint(limb.shoulder, limb.handTarget, 0.295, 0.285, bendArm, limb.elbow);
      setLink(limb.upperArm, limb.shoulder, limb.elbow, 0.055);
      setLink(limb.forearm, limb.elbow, limb.handTarget, 0.046);
      limb.hand.position.copy(limb.handTarget);
      limb.hip.set(side * 0.095, 0.52, 0);
      limb.ankle.copy(feetWorld[i]); keeper.worldToLocal(limb.ankle);
      limb.boot.position.copy(limb.ankle);
      limb.boot.rotation.y = footYaws[i] - yaw;
      limb.ankle.y += 0.10;
      joint(limb.hip, limb.ankle, 0.30, 0.30, bendKnee, limb.knee);
      setLink(limb.thigh, limb.hip, limb.knee, 0.062);
      setLink(limb.shin, limb.knee, limb.ankle, 0.052);
      state.planted[i] = Math.abs(feetWorld[i].y - root.y) < 0.002;
    }

    // A painter travels continuously from its coil to the boarding hand, to the
    // cleat, and back. Sag is geometry, not a switching attachment/visibility flag.
    ropeStart.copy(painterAnchor); boat.localToWorld(ropeStart);
    coilPoint.set(-0.02, 0.42, 0.55); boat.localToWorld(coilPoint);
    ropeEnd.copy(coilPoint);
    if (t >= 5.5 && t < 6.2) ropeEnd.lerp(handWorld[0], ramp(t, 5.5, 6.2));
    else if (t >= 6.2 && t < 7.1) ropeEnd.copy(handWorld[0]);
    else if (t >= 7.1 && t < 7.6) ropeEnd.lerpVectors(handWorld[0], cleat, ramp(t, 7.1, 7.6));
    else if (t >= 7.6 && t < 31.7) ropeEnd.copy(cleat);
    else if (t >= 31.7 && t < 32.1) ropeEnd.lerpVectors(cleat, handWorld[0], ramp(t, 31.7, 32.1));
    else if (t >= 32.1 && t < 33.3) ropeEnd.copy(handWorld[0]);
    else if (t >= 33.3 && t < 34) ropeEnd.lerpVectors(handWorld[0], coilPoint, ramp(t, 33.3, 34));
    for (let i = 0; i < 25; i++) {
      const u = i / 24, sag = Math.min(0.19, ropeStart.distanceTo(ropeEnd) * 0.10);
      ropePositions[i * 3] = mix(ropeStart.x, ropeEnd.x, u);
      ropePositions[i * 3 + 1] = Math.max(0.07, mix(ropeStart.y, ropeEnd.y, u) - Math.sin(Math.PI * u) * sag);
      ropePositions[i * 3 + 2] = mix(ropeStart.z, ropeEnd.z, u);
    }
    ropeGeometry.attributes.position.needsUpdate = true;
    beacon.rotation.y = TAU * (t / 9 + 2 * ramp(t, 17.6, 22.2));
    const gleam = 0.5 + Math.cos(TAU * t / 5) * 0.5;
    paint.lamp.emissiveIntensity = 0.32 + gleam * 0.38;
    lampLight.intensity = 0.30 + gleam * 0.35;
    buoy.position.y = 0.045 + Math.sin(TAU * t / 5) * 0.018;
    buoy.rotation.z = Math.sin(TAU * t / 9) * 0.055;
    ripples.position.x = Math.sin(TAU * t / 5) * 0.045;
    ripples.position.z = Math.cos(TAU * t / 5) * 0.022;
    foam.position.y = Math.sin(TAU * t / 5) * 0.006;
    world.updateMatrixWorld(true);
  }

  const phases = [
    { start: 0, end: 5.5, label: 'Row into the sheltered inlet' },
    { start: 5.5, end: 7.6, label: 'Stow oars and step onto the jetty' },
    { start: 7.6, end: 15.8, label: 'Climb the two coastal stairways' },
    { start: 15.8, end: 22.2, label: 'Open the cabinet and wind the beacon' },
    { start: 22.2, end: 23.5, label: 'Close and latch the winding cabinet' },
    { start: 23.5, end: 31.7, label: 'Descend to the waiting skiff' },
    { start: 31.7, end: 34, label: 'Recover the painter and board' },
    { start: 34, end: 41.5, label: 'Row out and turn beside the buoy' },
    { start: 41.5, end: 45, label: 'Settle into the starting composition' },
  ];
  update(0);
  // Static full-story envelope. Includes oar sweep, lantern finial and water edge.
  const bounds = new THREE.Box3(new THREE.Vector3(-4.65, -0.24, -3.46), new THREE.Vector3(5.22, 6.43, 4.43));
  return { world, update, bounds, target: [0.10, 1.85, 0.35], stillTime: 20.0, startTime: 0, duration: 45, loop: false, phases };
}
