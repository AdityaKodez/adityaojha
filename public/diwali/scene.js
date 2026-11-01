import { THREE, material, cylinder, rod, makeRandom } from './runtime.js';

// Indigo limewash, blue sandstone and teal leaves; clay, saffron and rose accents.
// A 20-second loop: approach, celebrate with a sparkler, return, and settle.
export function buildDiwali() {
  const world = new THREE.Group();
  world.name = 'A courtyard full of light';
  const random = makeRandom(108);
  const tau = Math.PI * 2;
  const paints = {
    plaster: material('#7878ad'), plasterLight: material('#a19ac0'),
    indigo: material('#333d73'), trim: material('#c3a28c'),
    stone: material('#454a67'), edge: material('#343b5a'),
    clay: material('#b45f46'), clayRim: material('#e1975f'),
    oil: material('#402537'), gold: material('#dfab51'),
    wood: material('#705063'), dark: material('#292b46'),
    leaf: material('#35666f'), leafLight: material('#4d8791'),
    leafDark: material('#284d61'), pink: material('#d46d9c'),
    saffron: material('#ed9a35'), marigold: material('#d97525'),
    cream: material('#e3cfac'), rose: material('#cc6682'),
    turquoise: material('#579ba1'), skin: material('#c58b6d'),
    hair: material('#302a40'), cat: material('#ce986a'),
    warm: material('#ffc76a', { emissive: '#ff9d37', emissiveIntensity: 0.65 }),
    window: material('#ffc071', { emissive: '#ffa341', emissiveIntensity: 0.7 }),
    whitePowder: material('#d8cebd', { emissive: '#918b83', emissiveIntensity: 0.13 }),
    pinkPowder: material('#dd779f', { emissive: '#a04873', emissiveIntensity: 0.18 }),
    bluePowder: material('#6cbbb5', { emissive: '#397c8b', emissiveIntensity: 0.18 }),
    yellowPowder: material('#f2b358', { emissive: '#aa7033', emissiveIntensity: 0.18 }),
  };
  const shapes = new Map();
  function mesh(parent, geometry, paint, position, scale) {
    const object = new THREE.Mesh(geometry, paint);
    object.position.set(...position);
    if (scale) object.scale.set(...scale);
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function softBox(parent, size, position, paint, bevel = 0.055) {
    const [w, h, d] = size;
    const b = Math.min(bevel, w / 4, h / 4, d / 4);
    const key = `${w},${h},${d},${b}`;
    if (!shapes.has(key)) {
      const s = new THREE.Shape();
      s.moveTo(-w / 2 + b, -h / 2 + b);
      s.lineTo(w / 2 - b, -h / 2 + b);
      s.lineTo(w / 2 - b, h / 2 - b);
      s.lineTo(-w / 2 + b, h / 2 - b);
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, {
        depth: d - 2 * b, bevelEnabled: true, bevelSize: b,
        bevelThickness: b, bevelSegments: 1, curveSegments: 1, steps: 1,
      });
      g.translate(0, 0, -d / 2 + b);
      shapes.set(key, g);
    }
    return mesh(parent, shapes.get(key), paint, position);
  }
  const pebbleGeometry = new THREE.IcosahedronGeometry(1, 1);
  function pebble(parent, position, scale, paint) {
    return mesh(parent, pebbleGeometry, paint, position, scale);
  }
  function path(parent, points, radius, paint) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return mesh(parent, new THREE.TubeGeometry(curve, 36, radius, 5, false), paint, [0, 0, 0]);
  }
  function flatShape(parent, shape, position, paint, rotation = 0) {
    const object = mesh(parent, new THREE.ShapeGeometry(shape, 24), paint, position);
    object.rotation.x = -Math.PI / 2;
    object.rotation.z = rotation;
    object.castShadow = false;
    return object;
  }
  function ring(parent, radius, width, position, paint) {
    const object = mesh(parent, new THREE.RingGeometry(radius - width, radius, 64), paint, position);
    object.rotation.x = -Math.PI / 2;
    object.castShadow = false;
    return object;
  }
  function arch(parent, width, height, depth, position, paint) {
    const r = width / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-r, 0);
    shape.lineTo(r, 0);
    shape.lineTo(r, height - r);
    shape.absarc(0, height - r, r, 0, Math.PI, false);
    shape.lineTo(-r, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSize: 0.025,
      bevelThickness: 0.025, bevelSegments: 1, curveSegments: 16,
    });
    return mesh(parent, geometry, paint, position);
  }

  // A thin slice of a sandstone courtyard, rather than a thick floating island.
  softBox(world, [10.2, 0.22, 8.2], [0, -0.05, 0], paints.edge, 0.09);
  softBox(world, [10.05, 0.12, 8.05], [0, 0.09, 0], paints.stone, 0.045);
  const tileGeometry = new THREE.BoxGeometry(0.65, 0.035, 0.62);
  const tiles = new THREE.InstancedMesh(tileGeometry, material('#ffffff'), 180);
  const dummy = new THREE.Object3D();
  const tileColors = ['#55546c', '#5c5974', '#646078', '#4a4f6a', '#69617a'];
  let tileIndex = 0;
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 15; col++) {
      dummy.position.set(-4.65 + col * 0.665, 0.16, -3.65 + row * 0.66);
      dummy.rotation.set(0, (random() - 0.5) * 0.018, 0);
      dummy.updateMatrix();
      tiles.setMatrixAt(tileIndex, dummy.matrix);
      tiles.setColorAt(tileIndex++, new THREE.Color(tileColors[Math.floor(random() * tileColors.length)]));
    }
  }
  tiles.receiveShadow = true;
  tiles.instanceMatrix.needsUpdate = true;
  tiles.instanceColor.needsUpdate = true;
  world.add(tiles);

  // A squat, hand-shaped haveli with a terrace, inset arched door and jali windows.
  const house = new THREE.Group();
  house.position.set(-1.2, 0.18, -1.95);
  world.add(house);
  softBox(house, [5.25, 0.28, 3.3], [0, 0.14, 0], paints.trim, 0.09);
  softBox(house, [4.95, 3.05, 2.75], [0, 1.74, -0.13], paints.plaster, 0.12);
  softBox(house, [5.1, 0.15, 2.92], [0, 0.46, -0.13], paints.indigo);
  softBox(house, [5.25, 0.22, 3.02], [0, 3.3, -0.13], paints.trim);
  softBox(house, [4.98, 0.12, 2.78], [0, 3.47, -0.13], paints.indigo);
  for (const x of [-2.42, 2.42]) {
    softBox(house, [0.18, 3, 0.2], [x, 1.9, 1.22], paints.plasterLight);
    softBox(house, [0.25, 0.36, 2.85], [x, 3.64, -0.13], paints.plasterLight);
  }
  for (const z of [-1.45, 1.22]) {
    softBox(house, [4.93, 0.35, 0.2], [0, 3.64, z], paints.plasterLight);
    softBox(house, [5.15, 0.1, 0.28], [0, 3.85, z], paints.trim);
  }
  for (let i = 0; i < 11; i++) {
    arch(house, 0.26, 0.37, 0.07, [-2.1 + i * 0.42, 3.87, 1.18], paints.plasterLight);
  }
  for (const x of [-2.42, 2.42]) {
    cylinder(house, [0.2, 0.24, 0.22], [x, 4.0, 1.2], paints.trim, 8);
    pebble(house, [x, 4.2, 1.2], [0.17, 0.22, 0.17], paints.gold);
  }
  arch(house, 1.8, 2.65, 0.13, [-0.5, 0.45, 1.27], paints.trim);
  arch(house, 1.5, 2.42, 0.035, [-0.5, 0.47, 1.42], paints.dark);
  arch(house, 1.29, 2.28, 0.025, [-0.5, 0.47, 1.47], paints.window);
  // Two ajar shutters reveal the warm interior without a flat glowing rectangle.
  for (const side of [-1, 1]) {
    const door = new THREE.Group();
    door.position.set(-0.5 + side * 0.65, 0.5, 1.55);
    door.rotation.y = side * -0.3;
    house.add(door);
    softBox(door, [0.49, 1.72, 0.1], [-side * 0.2, 0.87, 0], paints.indigo);
    for (const y of [0.43, 1.23]) {
      softBox(door, [0.31, 0.51, 0.035], [-side * 0.2, y, 0.065], paints.wood, 0.025);
    }
    pebble(door, [-side * 0.37, 0.91, 0.1], [0.035, 0.035, 0.035], paints.gold);
  }
  softBox(house, [2.35, 0.17, 0.68], [-0.5, 0.28, 1.7], paints.trim);
  softBox(house, [2.7, 0.12, 0.48], [-0.5, 0.11, 2.02], paints.plasterLight);
  for (const x of [-1.78, 1.4]) {
    arch(house, 0.86, 1.42, 0.1, [x, 1.08, 1.28], paints.trim);
    arch(house, 0.66, 1.21, 0.03, [x, 1.14, 1.41], paints.window);
    for (let i = 0; i < 4; i++) {
      rod(house, [x - 0.24 + i * 0.16, 1.19, 1.48], [x - 0.24 + i * 0.16, 2.05, 1.48], 0.022, paints.indigo);
    }
    for (let i = 0; i < 4; i++) {
      rod(house, [x - 0.32, 1.35 + i * 0.2, 1.48], [x + 0.32, 1.35 + i * 0.2, 1.48], 0.018, paints.indigo);
    }
    softBox(house, [1.02, 0.12, 0.35], [x, 1.04, 1.45], paints.trim);
    softBox(house, [1.09, 0.12, 0.49], [x, 2.61, 1.45], paints.clay);
  }
  // A right-facing window gives the house volume from the fixed camera.
  const sideWindow = new THREE.Group();
  sideWindow.position.set(2.49, 0, -0.55);
  sideWindow.rotation.y = Math.PI / 2;
  house.add(sideWindow);
  arch(sideWindow, 0.93, 1.57, 0.08, [0, 1.06, 0], paints.trim);
  arch(sideWindow, 0.7, 1.33, 0.025, [0, 1.13, 0.1], paints.window);
  for (let i = 0; i < 4; i++) rod(sideWindow, [-0.26 + i * 0.17, 1.16, 0.16], [-0.26 + i * 0.17, 2.13, 0.16], 0.025, paints.indigo);
  softBox(sideWindow, [1.12, 0.15, 0.36], [0, 1.02, 0.08], paints.trim);

  function flowersAlong(points, count, parent = world) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    for (let i = 0; i <= count; i++) {
      const point = curve.getPoint(i / count);
      pebble(parent, point.toArray(), [0.09, 0.085, 0.09], i % 3 ? paints.saffron : paints.marigold);
    }
  }
  for (let i = 0; i < 3; i++) {
    const left = -2.25 + i * 1.5;
    flowersAlong([[left, 2.97, 1.57], [left + 0.75, 2.65, 1.65], [left + 1.5, 2.97, 1.57]], 18, house);
  }
  for (const x of [-1.46, 0.46]) {
    flowersAlong([[x, 2.85, 1.57], [x - 0.02, 1.8, 1.6], [x, 0.59, 1.6]], 22, house);
  }
  for (let i = 0; i < 8; i++) {
    const leaf = pebble(house, [-2.0 + i * 0.55, 2.85, 1.66], [0.055, 0.16, 0.028], paints.leafLight);
    leaf.rotation.z = (i % 2 ? -1 : 1) * 0.3;
  }

  // A rangoli made from nested powder-petal silhouettes, laid on the pavers.
  const rangoli = new THREE.Group();
  rangoli.position.set(0.35, 0.198, 1.8);
  world.add(rangoli);
  ring(rangoli, 1.46, 0.025, [0, 0.001, 0], paints.whitePowder);
  ring(rangoli, 1.24, 0.035, [0, 0.002, 0], paints.yellowPowder);
  function petal(length, width) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(width, length * 0.25, width * 0.65, length * 0.75, 0, length);
    shape.bezierCurveTo(-width * 0.65, length * 0.75, -width, length * 0.25, 0, 0);
    return shape;
  }
  for (let i = 0; i < 12; i++) {
    const a = i * tau / 12;
    flatShape(rangoli, petal(1.17, 0.31), [0, 0.004, 0], paints.whitePowder, a);
    flatShape(rangoli, petal(1.07, 0.24), [0, 0.007, 0], i % 2 ? paints.pinkPowder : paints.bluePowder, a);
    const dot = cylinder(rangoli, [0.045, 0.045, 0.004], [Math.sin(a) * 1.35, 0.006, Math.cos(a) * 1.35], paints.yellowPowder, 8);
    dot.castShadow = false;
  }
  ring(rangoli, 0.5, 0.075, [0, 0.015, 0], paints.yellowPowder);
  ring(rangoli, 0.35, 0.075, [0, 0.018, 0], paints.pinkPowder);

  const haloCanvas = document.createElement('canvas');
  haloCanvas.width = haloCanvas.height = 64;
  const context = haloCanvas.getContext('2d');
  if (!context) throw new Error('A 2D canvas is required for the lamp texture.');
  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,194,74,0.5)');
  gradient.addColorStop(0.22, 'rgba(255,155,40,0.16)');
  gradient.addColorStop(1, 'rgba(255,120,20,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const haloTexture = new THREE.CanvasTexture(haloCanvas);
  haloTexture.colorSpace = THREE.SRGBColorSpace;
  const haloPaint = new THREE.SpriteMaterial({ map: haloTexture, transparent: true, depthWrite: false });
  const flamePaint = new THREE.MeshBasicMaterial({ color: '#ffb744' });
  const corePaint = new THREE.MeshBasicMaterial({ color: '#fff0b0' });
  const bowlGeometry = new THREE.LatheGeometry([
    [0.01, 0], [0.09, 0.01], [0.16, 0.055], [0.2, 0.13],
    [0.175, 0.14], [0.14, 0.075], [0.04, 0.055],
  ].map(p => new THREE.Vector2(...p)), 12);
  const flameGeometry = new THREE.LatheGeometry([
    [0.001, 0], [0.046, 0.025], [0.057, 0.075], [0.03, 0.15], [0.001, 0.25],
  ].map(p => new THREE.Vector2(...p)), 7);
  const lamps = [];
  function diya(parent, position, size = 1, phase = random() * tau) {
    const group = new THREE.Group();
    group.position.set(...position);
    group.scale.setScalar(size);
    group.rotation.y = phase;
    parent.add(group);
    mesh(group, bowlGeometry, paints.clay, [0, 0, 0], [1, 1, 0.8]);
    cylinder(group, [0.155, 0.155, 0.012], [0, 0.09, 0], paints.oil, 12).scale.z = 0.8;
    const rim = mesh(group, new THREE.TorusGeometry(0.177, 0.018, 4, 12), paints.clayRim, [0, 0.12, 0]);
    rim.rotation.x = Math.PI / 2;
    rim.scale.y = 0.8;
    rod(group, [0.06, 0.13, 0], [0.15, 0.17, 0], 0.012, paints.cream);
    const flame = mesh(group, flameGeometry, flamePaint, [0.11, 0.16, 0]);
    flame.castShadow = false;
    const core = mesh(flame, flameGeometry, corePaint, [0, 0, 0], [0.5, 0.64, 0.5]);
    core.castShadow = false;
    const halo = new THREE.Sprite(haloPaint);
    halo.position.set(0.11, 0.29, 0);
    halo.scale.set(0.9, 0.9, 1);
    group.add(halo);
    lamps.push({ flame, halo, phase });
    return group;
  }
  diya(world, [0.35, 0.22, 1.8], 1.8, 0.4);
  for (let i = 0; i < 13; i++) diya(world, [-4.48 + i * 0.74, 0.19, 3.65], 0.73);
  for (let i = 0; i < 9; i++) diya(world, [4.6, 0.19, -3.3 + i * 0.75], 0.73);
  for (let i = 0; i < 5; i++) diya(world, [-4.6, 0.19, -0.1 + i * 0.77], 0.73);
  for (const x of [-1.5, -0.5, 0.5]) diya(house, [x, 0.38, 1.87], 0.73);
  for (let i = 0; i < 9; i++) diya(house, [-2.1 + i * 0.52, 3.94, 1.3], 0.71);
  for (let i = 0; i < 5; i++) diya(house, [2.43, 3.94, 0.67 - i * 0.47], 0.65);
  for (const x of [-1.78, 1.4]) diya(house, [x, 1.12, 1.5], 0.69);

  const localLights = [];
  function light(position, power, distance, color = '#ffb558') {
    const l = new THREE.PointLight(color, power, distance, 2);
    l.position.set(...position);
    world.add(l);
    localLights.push({ light: l, power });
  }
  light([-1.7, 1.65, 0.5], 6, 5);
  light([0.35, 0.8, 1.8], 4.5, 4);
  light([2.8, 1.4, 0.1], 8, 4);
  light([0.5, 4.4, -0.6], 8, 5);

  // Hand-cut paper lanterns hang from a sagging cable across the open right side.
  const cablePoints = [[-3.6, 4.65, -2.25], [0.3, 4.05, -1.2], [4.25, 4.45, 0.35]];
  path(world, cablePoints, 0.018, paints.dark);
  rod(world, [4.25, 0.2, 0.35], [4.25, 4.65, 0.35], 0.07, paints.wood, 8);
  pebble(world, [4.25, 4.7, 0.35], [0.11, 0.12, 0.11], paints.gold);
  const cable = new THREE.CatmullRomCurve3(cablePoints.map(p => new THREE.Vector3(...p)));
  const lanterns = [];
  for (let i = 0; i < 5; i++) {
    const point = cable.getPoint(0.12 + i * 0.18);
    const lantern = new THREE.Group();
    lantern.position.copy(point);
    world.add(lantern);
    rod(lantern, [0, 0, 0], [0, -0.23, 0], 0.012, paints.gold);
    cylinder(lantern, [0.12, 0.25, 0.24], [0, -0.35, 0], i % 2 ? paints.rose : paints.warm, 4).rotation.y = Math.PI / 4;
    cylinder(lantern, [0.25, 0.12, 0.26], [0, -0.6, 0], i % 2 ? paints.warm : paints.saffron, 4).rotation.y = Math.PI / 4;
    for (const [x, z] of [[-0.14, 0], [0.14, 0], [0, -0.14], [0, 0.14]]) {
      rod(lantern, [x, -0.73, z], [x, -1.0, z], 0.016, i % 2 ? paints.rose : paints.gold);
    }
    cylinder(lantern, [0.13, 0.13, 0.045], [0, -0.22, 0], paints.gold, 8);
    lanterns.push(lantern);
  }
  // Tiny warm bulbs, without a full-scene bloom pass.
  for (let i = 0; i <= 22; i++) {
    const p = cable.getPoint(i / 22);
    pebble(world, [p.x, p.y - 0.055, p.z], [0.034, 0.055, 0.034], paints.warm);
  }

  function planter(position, scale = 1, flowers = false) {
    const g = new THREE.Group();
    g.position.set(...position);
    g.scale.setScalar(scale);
    world.add(g);
    cylinder(g, [0.32, 0.22, 0.52], [0, 0.26, 0], paints.clay, 9);
    cylinder(g, [0.35, 0.35, 0.08], [0, 0.52, 0], paints.clayRim, 9);
    cylinder(g, [0.28, 0.28, 0.02], [0, 0.565, 0], paints.dark, 9);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      const tip = [Math.cos(a) * 0.35, 0.85 + random() * 0.34, Math.sin(a) * 0.35];
      rod(g, [0, 0.56, 0], tip, 0.022, paints.leaf);
      const leaf = pebble(g, tip, [0.13, 0.27, 0.1], i % 2 ? paints.leaf : paints.leafLight);
      leaf.rotation.z = -Math.cos(a) * 0.5;
      if (flowers) pebble(g, [tip[0], tip[1] + 0.21, tip[2]], [0.15, 0.13, 0.15], i % 2 ? paints.saffron : paints.marigold);
    }
  }
  planter([1.93, 0.2, -1.18], 0.94, true);
  planter([-3.9, 0.2, -0.4], 0.85, true);
  planter([3.75, 0.2, -2.6], 1.15);
  planter([3.8, 0.2, -1.65], 0.72, true);

  // Asymmetric faceted tree silhouettes frame the courtyard, leaving its heart open.
  const tree = new THREE.Group();
  tree.position.set(-4.05, 0.18, -2.6);
  world.add(tree);
  rod(tree, [0, 0, 0], [0.08, 2.6, 0], 0.15, paints.wood, 7);
  for (const [x, y, z] of [[-0.55, 2.9, 0.05], [0.62, 3.6, -0.1], [-0.2, 3.9, -0.3]]) {
    rod(tree, [0, 1.7, 0], [x, y, z], 0.08, paints.wood, 6);
    pebble(tree, [x, y + 0.14, z], [0.78, 0.78, 0.68], paints.leafDark);
    pebble(tree, [x - 0.18, y + 0.52, z + 0.17], [0.64, 0.53, 0.61], paints.leaf);
    pebble(tree, [x + 0.22, y + 0.25, z + 0.47], [0.5, 0.45, 0.41], paints.leafLight);
  }
  for (let i = 0; i < 16; i++) {
    pebble(tree, [-0.6 + random() * 1.4, 2.8 + random() * 1.4, 0.35 + random() * 0.35], [0.09, 0.09, 0.09], paints.pink);
  }

  // Persistent joint segments keep hands, props, and grounded feet connected.
  const up = new THREE.Vector3(0, 1, 0);
  const direction = new THREE.Vector3();
  function segment(parent, paint, radius) {
    return cylinder(parent, [radius, radius, 1], [0, 0, 0], paint, 7);
  }
  function connect(object, from, to) {
    direction.set(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    object.position.set((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2);
    object.scale.y = direction.length();
    object.quaternion.setFromUnitVectors(up, direction.normalize());
  }
  function arm(parent, shoulder, sleeve) {
    const upper = segment(parent, sleeve, 0.095);
    const lower = segment(parent, paints.skin, 0.07);
    const hand = new THREE.Group();
    pebble(hand, [0, 0, 0], [0.09, 0.075, 0.085], paints.skin);
    parent.add(hand);
    return { upper, lower, hand, shoulder };
  }
  function poseArm(limb, elbow, hand) {
    connect(limb.upper, limb.shoulder, elbow);
    connect(limb.lower, elbow, hand);
    limb.hand.position.set(...hand);
  }

  const visitor = new THREE.Group();
  visitor.name = 'Sparkler visitor';
  world.add(visitor);
  const legs = [];
  for (const x of [-0.15, 0.15]) {
    const upper = segment(visitor, paints.cream, 0.085);
    const lower = segment(visitor, paints.cream, 0.075);
    const foot = softBox(visitor, [0.2, 0.12, 0.3], [x, 0.07, 0.075], paints.wood);
    legs.push({ x, upper, lower, foot });
  }
  cylinder(visitor, [0.25, 0.34, 0.72], [0, 0.78, 0], paints.turquoise, 7);
  softBox(visitor, [0.08, 0.57, 0.05], [0.02, 0.82, 0.26], paints.gold, 0.015);
  const head = new THREE.Group();
  head.position.set(0, 1.43, 0);
  visitor.add(head);
  pebble(head, [0, 0, 0], [0.27, 0.3, 0.25], paints.skin);
  pebble(head, [0, 0.15, -0.065], [0.29, 0.2, 0.25], paints.hair);
  pebble(head, [0, -0.025, 0.247], [0.045, 0.05, 0.045], paints.skin);
  for (const x of [-0.1, 0.1]) pebble(head, [x, 0.025, 0.231], [0.026, 0.035, 0.019], paints.dark);
  const leftArm = arm(visitor, [-0.26, 1.05, 0], paints.turquoise);
  const rightArm = arm(visitor, [0.26, 1.05, 0], paints.turquoise);
  diya(leftArm.hand, [0, 0.03, 0.035], 0.72);
  const sparkler = new THREE.Group();
  rightArm.hand.add(sparkler);
  rod(sparkler, [0, 0, 0], [0, 0.56, 0], 0.018, paints.cream, 5);
  const sparkTip = pebble(sparkler, [0, 0.56, 0], [0.075, 0.075, 0.075], corePaint);
  sparkTip.castShadow = false;
  const sparkHalo = new THREE.Sprite(haloPaint);
  sparkHalo.position.set(0, 0.56, 0);
  sparkHalo.scale.set(1.25, 1.25, 1);
  sparkler.add(sparkHalo);
  const sparkGeometry = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(64 * 3);
  sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  const sparkPaint = new THREE.PointsMaterial({ color: '#ffe1a0', size: 1.3, sizeAttenuation: false, depthWrite: false });
  const sparks = new THREE.Points(sparkGeometry, sparkPaint);
  sparks.frustumCulled = false;
  sparkler.add(sparks);
  const sparkSeeds = Array.from({ length: 64 }, () => ({
    phase: random(), angle: random() * tau, speed: 0.55 + random() * 0.9,
  }));

  // A seated figure in rose clothes arranges petals beside the rangoli.
  const seated = new THREE.Group();
  seated.name = 'Rangoli maker';
  seated.position.set(-1.69, 0.2, 1.8);
  seated.rotation.y = 1.0;
  world.add(seated);
  pebble(seated, [0, 0.2, 0], [0.43, 0.2, 0.4], paints.rose);
  const seatedBody = new THREE.Group();
  seatedBody.position.y = 0.3;
  seated.add(seatedBody);
  cylinder(seatedBody, [0.2, 0.3, 0.56], [0, 0.26, -0.08], paints.rose, 8);
  pebble(seatedBody, [0, 0.78, -0.04], [0.25, 0.29, 0.24], paints.skin);
  pebble(seatedBody, [0, 0.91, -0.12], [0.265, 0.22, 0.22], paints.hair);
  pebble(seatedBody, [0, 0.89, -0.34], [0.14, 0.14, 0.13], paints.hair);
  pebble(seatedBody, [0, 0.92, -0.43], [0.09, 0.07, 0.04], paints.saffron);
  const scarf = softBox(seatedBody, [0.15, 0.65, 0.06], [-0.13, 0.27, 0.2], paints.gold);
  scarf.rotation.z = -0.12;
  const petalArm = arm(seatedBody, [0.2, 0.46, 0], paints.rose);
  const restingArm = arm(seatedBody, [-0.2, 0.45, 0], paints.rose);
  poseArm(restingArm, [-0.35, 0.11, 0.3], [-0.17, 0.01, 0.49]);
  const heldPetals = pebble(petalArm.hand, [0, -0.025, 0], [0.1, 0.04, 0.09], paints.saffron);
  const fallingPetals = Array.from({ length: 8 }, () => pebble(seated, [0, 0, 0], [0.045, 0.018, 0.03], paints.saffron));
  cylinder(seated, [0.26, 0.2, 0.07], [-0.28, 0.1, 0.74], paints.gold, 12);
  for (let i = 0; i < 9; i++) pebble(seated, [-0.4 + random() * 0.25, 0.16, 0.64 + random() * 0.2], [0.04, 0.025, 0.04], paints.saffron);

  const cat = new THREE.Group();
  cat.position.set(2.9, 0.19, 2.92);
  cat.rotation.y = -0.7;
  world.add(cat);
  const catBody = pebble(cat, [0, 0.17, 0], [0.39, 0.19, 0.25], paints.cat);
  const catHead = new THREE.Group();
  catHead.position.set(0.27, 0.24, 0.04);
  cat.add(catHead);
  pebble(catHead, [0, 0, 0], [0.2, 0.2, 0.2], paints.cat);
  for (const z of [-0.085, 0.14]) {
    mesh(catHead, new THREE.ConeGeometry(0.095, 0.19, 4), paints.cat, [0.01, 0.19, z - 0.04]);
    rod(catHead, [0.11, 0.03, z - 0.04], [0.15, 0.015, z - 0.005], 0.013, paints.dark, 4);
  }
  const tail = new THREE.Group();
  tail.position.set(-0.3, 0.17, -0.06);
  cat.add(tail);
  path(tail, [[0, 0, 0], [-0.2, 0.01, 0.11], [-0.13, 0, 0.36], [0.15, -0.02, 0.4]], 0.065, paints.cat);

  // Petals sit where people have been decorating, rather than uniform confetti.
  for (let i = 0; i < 34; i++) {
    const a = random() * tau;
    const r = 1.5 + random() * 0.7;
    const x = 0.35 + Math.sin(a) * r;
    const z = 1.8 + Math.cos(a) * r;
    if (z < 3.45 && x < 3.8) pebble(world, [x, 0.21, z], [0.035, 0.015, 0.025], i % 3 ? paints.marigold : paints.pink);
  }

  const smooth = (value) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  const handTarget = new THREE.Vector3();
  // 0-3 approach; 3-4 turn; 4-11 sparkler; 11-14 lower/turn;
  // 14-17 walk back; 17-20 settle. Petal placement repeats beneath that story.
  function update(time) {
    const t = time % 20;
    const cycle = t * tau / 20;
    for (const { flame, halo, phase } of lamps) {
      const f = Math.sin(cycle * 19 + phase) * 0.08 + Math.sin(cycle * 31 + phase * 2) * 0.04;
      flame.scale.set(1 - f * 0.45, 1 + f, 1 - f * 0.3);
      flame.rotation.z = Math.sin(cycle * 13 + phase) * 0.1;
      halo.scale.setScalar(0.9 + f * 0.23);
    }
    for (let i = 0; i < lanterns.length; i++) {
      lanterns[i].rotation.z = Math.sin(cycle * 4 + i * 0.7) * 0.14;
      lanterns[i].rotation.x = Math.sin(cycle * 4 + i * 0.7 + 0.4) * 0.06;
    }
    for (let i = 0; i < localLights.length; i++) {
      const { light: l, power } = localLights[i];
      l.intensity = power * (1 + Math.sin(cycle * 19 + i) * 0.025);
    }
    const outward = smooth(t / 3);
    const homeward = smooth((t - 14) / 3);
    const travel = outward - homeward;
    visitor.position.set(mix(2.15, 2.85, travel), 0.2, mix(0.55, 2.2, travel));
    const heading = Math.atan2(0.7, 1.65);
    visitor.rotation.y = heading + (-0.9 - heading) * smooth((t - 3) / 1)
      + (heading - Math.PI + 0.9) * smooth((t - 12.5) / 1.5)
      + Math.PI * smooth((t - 17) / 2);
    const walking = Math.sin(Math.PI * (t < 3 ? outward : t >= 14 && t < 17 ? homeward : 0));
    const distance = (t < 14 ? outward : homeward) * Math.hypot(0.7, 1.65);
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const phase = (distance / 0.65 + i * 0.5) % 1;
      const swing = Math.max(0, (phase - 0.6) / 0.4);
      const z = walking * (phase < 0.6 ? 0.65 * (0.3 - phase) : mix(-0.195, 0.195, smooth(swing)));
      const lift = Math.sin(swing * Math.PI) * 0.17 * walking;
      connect(leg.upper, [leg.x, 0.52, 0], [leg.x, 0.3 + lift * 0.4, z * 0.5 + 0.07]);
      connect(leg.lower, [leg.x, 0.3 + lift * 0.4, z * 0.5 + 0.07], [leg.x, 0.12 + lift, z]);
      leg.foot.position.set(leg.x, 0.07 + lift, z + 0.075);
    }
    const celebrate = smooth((t - 3.5) / 1.2) * (1 - smooth((t - 10.5) / 1.5));
    const wave = Math.sin((t - 4) * tau / 2) * celebrate;
    poseArm(leftArm, [-0.36, 0.83, 0.22], [-0.18, 0.92, 0.43]);
    poseArm(rightArm, [0.4, mix(0.83, 1.13, celebrate), 0.2],
      [0.28 + celebrate * 0.3 + wave * 0.24, 0.92 + celebrate * 0.55, 0.4 + celebrate * 0.06]);
    sparkler.rotation.z = -0.3 + wave * 0.45;
    sparks.visible = sparkHalo.visible = sparkTip.visible = celebrate > 0.1;
    for (let i = 0; i < sparkSeeds.length; i++) {
      const seed = sparkSeeds[i];
      const age = (t * 2 + seed.phase) % 1;
      const radius = age * seed.speed;
      sparkPositions[i * 3] = Math.cos(seed.angle) * radius;
      sparkPositions[i * 3 + 1] = 0.56 + Math.sin(seed.angle) * radius - age * age * 0.65;
      sparkPositions[i * 3 + 2] = Math.sin(seed.angle * 3) * radius * 0.45;
    }
    sparkGeometry.attributes.position.needsUpdate = true;
    sparkHalo.scale.setScalar(1.15 + Math.sin(t * 21) * 0.12);
    head.rotation.set(-celebrate * 0.12, wave * 0.14, -0.06);

    const petalTime = t % 5;
    const reach = smooth(petalTime / 1.8) * (1 - smooth((petalTime - 2.9) / 1.6));
    seatedBody.rotation.x = reach * 0.3;
    poseArm(petalArm, [0.34, mix(0.25, 0.13, reach), 0.3],
      [mix(-0.21, 0.38, reach), mix(-0.05, 0.02, reach), mix(0.67, 0.94, reach)]);
    heldPetals.visible = petalTime < 2.2;
    seated.updateMatrixWorld(true);
    handTarget.copy(petalArm.hand.position);
    seatedBody.localToWorld(handTarget);
    seated.worldToLocal(handTarget);
    for (let i = 0; i < fallingPetals.length; i++) {
      const age = (petalTime - 2.2 - i * 0.035) / 0.65;
      const petal = fallingPetals[i];
      petal.visible = age >= 0 && age <= 1;
      petal.position.set(handTarget.x + Math.sin(i * 2.4) * age * 0.15,
        Math.max(0.025, handTarget.y - age * age * 0.38), handTarget.z + Math.cos(i * 2.4) * age * 0.14);
      petal.rotation.z = age * 3 + i;
    }
    catBody.scale.y = 0.19 * (1 + Math.sin(cycle * 5) * 0.035);
    const attention = smooth((t - 5) / 1) * (1 - smooth((t - 10) / 2));
    catHead.position.y = 0.24 + attention * 0.14;
    catHead.rotation.y = -attention * 0.5;
    tail.rotation.y = Math.sin(cycle * 5) * 0.35;
    tail.rotation.x = attention * -0.3;
  }
  return {
    world, duration: 20, loop: true, stillTime: 0, update,
    target: [0, 1.8, 0],
    bounds: new THREE.Box3(new THREE.Vector3(-5.5, -0.2, -4.2), new THREE.Vector3(5.25, 5.25, 4.2)),
    lighting: { sky: '#8eafff', ground: '#423756', fill: 0.9, key: '#a9c3ff', intensity: 1.5, position: [-3, 9, -5] },
  };
}
