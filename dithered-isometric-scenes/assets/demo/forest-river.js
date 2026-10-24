import { THREE, box, cylinder, rod, material, makeRandom } from '../diorama-runtime.js';

/**
 * Original alpine miniature: "Water for the way back".
 * The host owns lighting, the white stage, ordered dithering, and playback.
 * All tracks below reconstruct absolute time, including the optional 45s seam.
 * No browser, renderer, texture loader, dependency, or event timer is created here.
 */
export function buildForestRiver() {
  const world = new THREE.Group();
  world.name = 'Forest river - water for the way back';
  const random = makeRandom(73041);
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const mix = (a, b, u) => a + (b - a) * u;
  const ease = x => { const u = clamp(x); return u * u * (3 - 2 * u); };
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const pulse = (t, a, b, c, d) => ramp(t, a, b) * (1 - ramp(t, c, d));
  const turn = (a, b, u) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * u;
  const v = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const up = v(0, 1, 0);
  const transform = new THREE.Object3D();
  const geometry = {
    cube: new THREE.BoxGeometry(1, 1, 1),
    pole: new THREE.CylinderGeometry(1, 1, 1, 6),
    trunk: new THREE.CylinderGeometry(0.62, 1, 1, 7),
    sphere: new THREE.IcosahedronGeometry(1, 1),
    stone: new THREE.IcosahedronGeometry(1, 0),
    disc: new THREE.CylinderGeometry(1, 1, 1, 9),
  };
  const paint = {
    soil: material('#645e48', { flatShading: true }),
    soilLight: material('#8b8062', { flatShading: true }),
    grass: material('#758263', { vertexColors: true, flatShading: true }),
    pine: material('#526b55', { vertexColors: true, flatShading: true }),
    pineDark: material('#3a594b', { vertexColors: true, flatShading: true }),
    pineLight: material('#637b5a', { vertexColors: true, flatShading: true }),
    bark: material('#665344'),
    darkWood: material('#675342'),
    wood: material('#9b7b53'),
    endWood: material('#c0a17a'),
    roof: material('#4a625f'),
    stone: material('#899187', { flatShading: true }),
    paleStone: material('#a4aa98', { flatShading: true }),
    moss: material('#657956'),
    path: material('#a49c7d', { vertexColors: true }),
    water: material('#4d7e7b', { vertexColors: true, side: THREE.DoubleSide }),
    deepWater: material('#3d666b', { side: THREE.DoubleSide }),
    current: material('#8daf9e'),
    foam: material('#ced6bf'),
    reed: material('#7e8b56'),
    seed: material('#60533d'),
    jacket: material('#b56941'),
    jacketDark: material('#8f5138'),
    trousers: material('#4b5653'),
    boots: material('#3d4542'),
    sole: material('#797c66'),
    skin: material('#c7a37f'),
    hat: material('#c6bea0'),
    pack: material('#6e7956'),
    webbing: material('#414d43'),
    metal: material('#adb7a9'),
    bottle: material('#59766e'),
    black: material('#354441'),
    cream: material('#d3ccb1'),
  };

  function mesh(parent, geo, mat, position, scale, name) {
    const result = new THREE.Mesh(geo, mat);
    if (position) result.position.set(...position);
    if (scale) result.scale.set(...scale);
    result.castShadow = result.receiveShadow = true;
    if (name) result.name = name;
    parent.add(result);
    return result;
  }

  function batch(name, geo, mat, entries) {
    const result = new THREE.InstancedMesh(geo, mat, entries.length);
    result.name = name;
    result.castShadow = result.receiveShadow = true;
    const color = new THREE.Color();
    entries.forEach((item, i) => {
      transform.position.set(...item.p);
      transform.rotation.set(...(item.r || [0, 0, 0]));
      transform.scale.set(...(item.s || [1, 1, 1]));
      transform.updateMatrix();
      result.setMatrixAt(i, transform.matrix);
      if (item.c) result.setColorAt(i, color.set(item.c));
    });
    result.instanceMatrix.needsUpdate = true;
    if (result.instanceColor) result.instanceColor.needsUpdate = true;
    world.add(result);
    return result;
  }

  function triangles(name, positions, mat, colors) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    if (colors) g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    const result = mesh(world, g, mat, null, null, name);
    return result;
  }

  // Two banks form an actual open river channel. The visible cut is only 0.5m
  // deep across an eleven-metre footprint; this is terrain, not a plinth.
  const channel = [
    [-0.87, -4.44, 1.26], [-0.54, -3.26, 1.40], [-0.10, -2.05, 1.53],
    [0.28, -0.82, 1.62], [0.54, 0.36, 1.55], [0.70, 1.65, 1.82],
    [1.04, 2.65, 1.69], [1.28, 3.08, 1.43], [1.45, 3.48, 1.63],
    [1.53, 4.26, 1.52],
  ];
  const bankLeft = channel.map(([x, z, w]) => [x - w / 2, z]);
  const bankRight = channel.map(([x, z, w]) => [x + w / 2, z]);
  const westBank = [
    ...bankLeft,
    [0.28, 4.49], [-0.57, 4.13], [-1.80, 4.39], [-2.56, 3.83],
    [-3.19, 3.16], [-3.39, 2.71], [-4.47, 2.38], [-4.18, 1.06],
    [-5.12, -0.21], [-4.85, -1.62], [-5.03, -2.65], [-4.32, -3.79],
    [-2.87, -4.52], [-1.73, -4.60],
  ];
  const eastBank = [
    ...bankRight.slice().reverse(),
    [1.33, -4.62], [2.78, -4.12], [3.88, -3.34], [4.42, -2.14],
    [4.76, -0.72], [4.43, 0.70], [4.84, 1.95], [4.08, 2.85],
    [3.65, 3.56], [2.80, 4.22], [2.35, 4.40],
  ];

  function ground(x, z) {
    return 0.31 + 0.105 * ease((-z - 0.5) / 3.8)
      + 0.095 * ease((Math.abs(x) - 2.6) / 2.4)
      + 0.018 * Math.sin(x * 1.3 + z * 0.73);
  }

  function inPolygon(x, z, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a[1] > z) !== (b[1] > z)
        && x < (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  }

  function terrain(name, polygon) {
    const contour = polygon.map(([x, z]) => new THREE.Vector2(x, z));
    const faces = THREE.ShapeUtils.triangulateShape(contour, []);
    const positions = [], colors = [], sides = [], seams = [];
    const baseColor = new THREE.Color();
    function face(a, b, c, depth) {
      if (depth) {
        const mid = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
        face(a, b, mid, depth - 1); face(b, c, mid, depth - 1); face(c, a, mid, depth - 1);
        return;
      }
      if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0) [b, c] = [c, b];
      baseColor.set('#ffffff').multiplyScalar(0.91 + random() * 0.13);
      for (const p of [a, b, c]) {
        positions.push(p[0], ground(...p), p[1]);
        colors.push(baseColor.r, baseColor.g, baseColor.b);
      }
    }
    faces.forEach(([a, b, c]) => face(polygon[a], polygon[b], polygon[c], 2));
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i], b = polygon[(i + 1) % polygon.length];
      const ay = ground(...a), by = ground(...b);
      const bottom = -0.225;
      sides.push(a[0], ay, a[1], b[0], by, b[1], b[0], bottom, b[1],
        a[0], ay, a[1], b[0], bottom, b[1], a[0], bottom, a[1]);
      const seam = 0.035;
      seams.push(a[0], ay - seam, a[1], b[0], by - seam, b[1], b[0], by - 0.105, b[1],
        a[0], ay - seam, a[1], b[0], by - 0.105, b[1], a[0], ay - 0.105, a[1]);
    }
    triangles(`${name} meadow surface`, positions, paint.grass, colors);
    const cut = triangles(`${name} irregular earth cut`, sides, paint.soil);
    cut.material.side = THREE.DoubleSide;
    const seam = triangles(`${name} shallow root layer`, seams, paint.soilLight);
    seam.material.side = THREE.DoubleSide;
  }
  terrain('West bank', westBank);
  terrain('East bank', eastBank);

  function riverSample(z) {
    let k = 0;
    while (k < channel.length - 2 && z > channel[k + 1][1]) k++;
    const a = channel[k], b = channel[k + 1];
    const u = clamp((z - a[1]) / (b[1] - a[1]));
    return { x: mix(a[0], b[0], u), width: mix(a[2], b[2], u) };
  }

  function waterY(z) {
    return z < 3.08 ? 0.211 : mix(0.211, -0.126, ease((z - 3.08) / 0.40));
  }

  const waterVertices = [], waterColors = [];
  const waterColor = new THREE.Color();
  // Fine longitudinal bands make opaque, softly faceted water; no glossy plane.
  for (let i = 0; i < 82; i++) {
    const za = mix(-4.44, 4.26, i / 82), zb = mix(-4.44, 4.26, (i + 1) / 82);
    const a = riverSample(za), b = riverSample(zb);
    for (let band = 0; band < 5; band++) {
      const l = band / 5 - 0.5, r = (band + 1) / 5 - 0.5;
      const p = [
        [a.x + a.width * l, waterY(za), za], [b.x + b.width * l, waterY(zb), zb],
        [b.x + b.width * r, waterY(zb), zb], [a.x + a.width * r, waterY(za), za],
      ];
      waterColor.set('#ffffff').multiplyScalar(0.87 + band * 0.025 + random() * 0.055);
      for (const n of [0, 1, 3, 1, 2, 3]) {
        waterVertices.push(...p[n]);
        waterColors.push(waterColor.r, waterColor.g, waterColor.b);
      }
    }
  }
  triangles('Serpentine river and shallow rock cascade', waterVertices, paint.water, waterColors);

  const streamCurve = new THREE.CatmullRomCurve3(channel.map(([x, z]) => v(x, waterY(z), z)), false, 'centripetal');
  const rippleGeometry = new THREE.RingGeometry(0.86, 1, 24);
  rippleGeometry.rotateX(-Math.PI / 2);
  const waterGlints = new THREE.InstancedMesh(geometry.cube, paint.current, 46);
  waterGlints.name = 'Forty-six small current ribbons';
  waterGlints.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  waterGlints.frustumCulled = false;
  waterGlints.receiveShadow = true;
  world.add(waterGlints);
  const fallGlints = new THREE.InstancedMesh(geometry.cube, paint.foam, 13);
  fallGlints.name = 'Cascade threads';
  fallGlints.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  fallGlints.frustumCulled = false;
  world.add(fallGlints);
  const fillRipples = [], diveRipples = [];
  for (let i = 0; i < 3; i++) {
    const ring = mesh(world, rippleGeometry, material('#8daf9e', { transparent: true, opacity: 0, depthWrite: false }), [1.557, 0.218, 1.67], [0, 1, 0], `Canteen ripple ${i}`);
    ring.castShadow = false;
    fillRipples.push(ring);
    const dive = mesh(world, rippleGeometry, material('#ced6bf', { transparent: true, opacity: 0, depthWrite: false }), [1.77, 0.219, 2.54], [0, 1, 0], `Dipper splash ring ${i}`);
    dive.castShadow = false;
    diveRipples.push(dive);
  }

  // Thin stone shelves, worn water-edge stones and moss share geometry.
  const rocks = [], paleRocks = [], mosses = [];
  function stone(x, z, sx, sy, sz, y = ground(x, z) - 0.01, pale = false) {
    (pale ? paleRocks : rocks).push({ p: [x, y + sy * 0.38, z], s: [sx, sy, sz], r: [0.08, random() * TAU, 0.1] });
    if (sy > 0.18 && random() > 0.38) mosses.push({ p: [x - sx * 0.12, y + sy * 1.03, z], s: [sx * 0.58, 0.016, sz * 0.61] });
  }
  for (let i = 0; i < 41; i++) {
    const z = -4.27 + i * 0.205;
    const river = riverSample(z), side = i % 2 ? -1 : 1;
    const x = river.x + side * (river.width * 0.5 + 0.025 + random() * 0.11);
    const size = 0.12 + random() * 0.16;
    stone(x, z, size * 1.2, size * 0.65, size, ground(x, z) - 0.07, i % 4 === 0);
  }
  [
    [-1.27, -3.67, 0.36, 0.39, 0.42], [0.04, -2.95, 0.20, 0.20, 0.29],
    [0.76, -1.96, 0.32, 0.33, 0.44], [-0.47, 1.27, 0.34, 0.37, 0.46],
    [0.22, 2.82, 0.43, 0.37, 0.51], [2.15, 3.02, 0.45, 0.42, 0.54],
    [1.82, 3.42, 0.36, 0.28, 0.36], [0.79, 3.51, 0.30, 0.32, 0.38],
    [2.48, -2.24, 0.52, 0.34, 0.41], [-4.31, 1.63, 0.57, 0.27, 0.47],
    [-2.49, 3.46, 0.61, 0.38, 0.45], [3.74, -0.10, 0.49, 0.34, 0.57],
  ].forEach(([x, z, sx, sy, sz], i) => stone(x, z, sx, sy, sz, ground(x, z) - 0.04, i % 3 === 0));
  const cascadeFoam = [];
  for (let i = 0; i < 23; i++) {
    const x = 0.78 + random() * 1.38, z = 3.43 + random() * 0.24;
    cascadeFoam.push({ p: [x, waterY(z) + 0.013, z], s: [0.04 + random() * 0.13, 0.012, 0.025 + random() * 0.08], r: [0, -0.28, 0] });
  }
  batch('Broken foam below the rock ledge', geometry.cube, paint.foam, cascadeFoam).castShadow = false;

  // Small roof, lap siding, exposed rafter tails and a genuine gable silhouette.
  const cabin = new THREE.Group();
  cabin.name = 'Larch trail cabin';
  cabin.position.set(-3.01, 0.45, -2.64);
  world.add(cabin);
  const boards = [], shingles = [], foundation = [], porchBoards = [], rafters = [];
  box(cabin, [2.02, 1.32, 1.60], [0, 0.72, 0], paint.darkWood);
  // Recessed front door and side window are physical, matte inset pieces.
  box(cabin, [0.56, 1.10, 0.045], [-0.49, 0.60, 0.815], paint.bark);
  box(cabin, [0.045, 1.16, 0.07], [-0.80, 0.61, 0.84], paint.endWood);
  box(cabin, [0.045, 1.16, 0.07], [-0.18, 0.61, 0.84], paint.endWood);
  box(cabin, [0.65, 0.05, 0.07], [-0.49, 1.20, 0.84], paint.endWood);
  cylinder(cabin, [0.028, 0.028, 0.06], [-0.27, 0.63, 0.87], paint.metal, 7).rotation.x = Math.PI / 2;
  box(cabin, [0.045, 0.60, 0.71], [1.027, 0.88, -0.02], paint.black);
  box(cabin, [0.05, 0.46, 0.57], [1.055, 0.88, -0.02], material('#a6ae97'));
  box(cabin, [0.068, 0.05, 0.65], [1.09, 0.88, -0.02], paint.darkWood);
  box(cabin, [0.068, 0.55, 0.045], [1.09, 0.88, -0.02], paint.darkWood);
  for (let row = 0; row < 10; row++) {
    const y = 0.57 + row * 0.132;
    for (const x of [-4.05, -1.97]) boards.push({ p: [x, y, -2.64], s: [0.064, 0.118, 1.64], c: row % 3 ? '#a1845e' : '#937751' });
    boards.push({ p: [-3.01, y, -3.46], s: [2.08, 0.118, 0.06], c: row % 3 ? '#987b55' : '#ad9069' });
    // Front laps leave the doorway and route board clear.
    boards.push({ p: [-2.39, y, -1.817], s: [0.78, 0.118, 0.06], c: row % 3 ? '#a1845e' : '#937751' });
  }
  for (const x of [-3.94, -2.10]) for (const z of [-3.34, -1.96]) {
    foundation.push({ p: [x, 0.427, z], s: [0.33, 0.18, 0.31], r: [0, random(), 0] });
  }
  for (let i = 0; i < 18; i++) porchBoards.push({ p: [-4.11 + i * 0.13, 0.428, -1.48], s: [0.123, 0.064, 0.95], c: i % 4 ? '#a68b64' : '#b49870' });
  batch('Cabin overlapping larch siding', geometry.cube, material('#ffffff'), boards);
  batch('Cabin stone piers', geometry.stone, paint.stone, foundation);
  batch('Cabin porch boards', geometry.cube, material('#ffffff'), porchBoards);
  box(world, [2.38, 0.105, 0.18], [-3.00, 0.366, -1.035], paint.darkWood);
  // Faceted gables (front and back), with a ridge along the cabin depth.
  const gablePositions = [];
  for (const z of [-3.47, -1.81]) {
    gablePositions.push(-4.05, 1.83, z, -1.97, 1.83, z, -3.01, 2.62, z);
  }
  const gables = triangles('Timber gables', gablePositions, paint.wood);
  gables.material.side = THREE.DoubleSide;
  const roofAngle = Math.atan2(0.83, 1.23), slopeLength = Math.hypot(0.83, 1.23);
  for (const side of [-1, 1]) {
    const roof = box(world, [slopeLength, 0.075, 2.02], [-3.01 + side * 0.615, 2.205, -2.64], paint.roof);
    roof.rotation.z = -side * roofAngle;
    for (let row = 0; row < 7; row++) for (let col = 0; col < 12; col++) {
      const u = (row + 0.5) / 7;
      shingles.push({
        p: [-3.01 + side * 1.23 * u, 2.668 - 0.83 * u, -3.61 + col * 0.174 + (row % 2) * 0.015],
        s: [slopeLength / 7 + 0.045, 0.033, 0.166], r: [0, 0, -side * roofAngle],
        c: ['#536a64', '#4b615d', '#5b7168', '#617366'][(row * 3 + col) % 4],
      });
    }
    for (let i = 0; i < 5; i++) rafters.push({ p: [-3.01 + side * 0.62, 2.13, -3.55 + i * 0.46], s: [slopeLength + 0.12, 0.075, 0.072], r: [0, 0, -side * roofAngle] });
    rod(world, [-3.01, 2.68, -3.68], [-3.01 + side * 1.26, 1.82, -3.68], 0.035, paint.darkWood);
    rod(world, [-3.01, 2.68, -1.60], [-3.01 + side * 1.26, 1.82, -1.60], 0.035, paint.darkWood);
  }
  batch('Individual muted slate shingles', geometry.cube, material('#ffffff'), shingles);
  batch('Exposed rafter tails', geometry.cube, paint.darkWood, rafters);
  box(world, [0.105, 0.08, 2.12], [-3.01, 2.692, -2.64], paint.roof);
  const chimney = [];
  for (let row = 0; row < 5; row++) for (let col = 0; col < 2; col++) {
    chimney.push({ p: [-3.69 + col * 0.17, 2.31 + row * 0.145, -2.93], s: [0.165, 0.139, 0.31], c: row % 2 ? '#899084' : '#9ca08d' });
  }
  batch('Dry stone chimney courses', geometry.cube, material('#ffffff'), chimney);
  box(world, [0.43, 0.075, 0.40], [-3.61, 3.02, -2.93], paint.paleStone);
  box(world, [0.25, 0.012, 0.19], [-3.61, 3.064, -2.93], paint.black);

  // A tiny topographic board: real linework, not a font/canvas or invented text.
  const routeBoard = new THREE.Group();
  routeBoard.name = 'Trail map under the eaves';
  routeBoard.position.set(-2.50, 1.47, -1.748);
  world.add(routeBoard);
  box(routeBoard, [0.63, 0.45, 0.06], [0, 0, 0], paint.darkWood);
  box(routeBoard, [0.54, 0.36, 0.015], [0, 0, 0.038], paint.cream);
  const mapInk = material('#6f806b');
  const mapLines = [
    [[-0.22, -0.07], [-0.12, 0.10], [-0.03, -0.03]],
    [[-0.09, -0.02], [0.02, 0.14], [0.13, -0.01]],
    [[0.05, -0.12], [0.19, 0.05], [0.24, -0.02]],
    [[-0.20, -0.12], [-0.07, -0.08], [0.04, -0.12], [0.15, -0.07]],
  ];
  mapLines.forEach(points => points.slice(1).forEach((p, i) => rod(routeBoard, [...points[i], 0.05], [...p, 0.05], 0.008, mapInk, 4)));
  box(world, [0.52, 0.055, 0.30], [-3.03, 1.045, -1.64], paint.wood);
  rod(world, [-3.24, 1.02, -1.79], [-3.24, 0.84, -1.50], 0.022, paint.darkWood);
  rod(world, [-2.82, 1.02, -1.79], [-2.82, 0.84, -1.50], 0.022, paint.darkWood);

  // Arched footbridge: individual tread planks, two stringers and low open rails.
  const bridgeMin = -1.09, bridgeMax = 2.12, bridgeZ = 0.18;
  const deckY = x => 0.47 + 0.13 * Math.sin(Math.PI * clamp((x - bridgeMin) / (bridgeMax - bridgeMin)));
  const bridgePlanks = [], bridgeBeam = [], railPosts = [], railBeams = [], ironPins = [];
  for (let i = 0; i < 24; i++) {
    const x = mix(bridgeMin, bridgeMax, (i + 0.5) / 24);
    const slope = 0.13 * Math.PI / (bridgeMax - bridgeMin) * Math.cos(Math.PI * (x - bridgeMin) / (bridgeMax - bridgeMin));
    bridgePlanks.push({ p: [x, deckY(x) - 0.032, bridgeZ], s: [0.128, 0.064, 0.84], r: [0, 0, Math.atan(slope)], c: ['#ab9168', '#a38a62', '#b39a73', '#97825d'][i % 4] });
    for (const z of [-0.155, 0.515]) ironPins.push({ p: [x, deckY(x) + 0.002, z], s: [0.014, 0.009, 0.014] });
  }
  function span(entries, a, b, width, height) {
    const delta = v(...b).sub(v(...a));
    const object = new THREE.Object3D();
    object.quaternion.setFromUnitVectors(v(1, 0, 0), delta.clone().normalize());
    const e = new THREE.Euler().setFromQuaternion(object.quaternion);
    entries.push({ p: v(...a).add(v(...b)).multiplyScalar(0.5).toArray(), s: [delta.length(), height, width], r: [e.x, e.y, e.z] });
  }
  for (const z of [bridgeZ - 0.35, bridgeZ + 0.35]) {
    for (let i = 0; i < 12; i++) {
      const xa = mix(bridgeMin - 0.04, bridgeMax + 0.04, i / 12), xb = mix(bridgeMin - 0.04, bridgeMax + 0.04, (i + 1) / 12);
      span(bridgeBeam, [xa, deckY(xa) - 0.11, z], [xb, deckY(xb) - 0.11, z], 0.09, 0.13);
      span(railBeams, [xa, deckY(xa) + 0.59, z], [xb, deckY(xb) + 0.59, z], 0.053, 0.052);
    }
    for (let i = 0; i < 5; i++) {
      const x = mix(bridgeMin, bridgeMax, i / 4);
      railPosts.push({ p: [x, deckY(x) + 0.27, z], s: [0.055, 0.66, 0.055] });
    }
  }
  for (const x of [bridgeMin, bridgeMax]) {
    stone(x, bridgeZ, 0.34, 0.20, 0.62, 0.27, true);
    rod(world, [x, 0.28, -0.16], [x, 0.67, 0.51], 0.045, paint.darkWood);
  }
  batch('Twenty-four worn bridge treads', geometry.cube, material('#ffffff'), bridgePlanks);
  batch('Bridge bowed timber stringers', geometry.cube, paint.darkWood, bridgeBeam);
  batch('Open bridge balusters', geometry.cube, paint.darkWood, railPosts);
  batch('Continuous curved handrails', geometry.cube, paint.wood, railBeams);
  batch('Bridge nail heads', geometry.cube, paint.black, ironPins);

  const trail = new THREE.CatmullRomCurve3([
    v(-2.68, 0, -1.13), v(-2.24, 0, -0.61), v(-1.53, 0, -0.04),
    v(-1.08, 0, bridgeZ), v(-0.40, 0, bridgeZ), v(0.70, 0, bridgeZ),
    v(1.66, 0, bridgeZ), v(2.16, 0, 0.30), v(2.44, 0, 0.78),
    v(2.38, 0, 1.27), v(2.08, 0, 1.66),
  ], false, 'centripetal');
  trail.arcLengthDivisions = 500;
  trail.updateArcLengths();
  function walkingSurface(x, z) {
    let y = ground(x, z) + 0.012;
    const onBridge = ease((x + 1.68) / 0.59) * (1 - ease((x - 2.12) / 0.53))
      * (1 - ease((Math.abs(z - bridgeZ) - 0.31) / 0.15));
    y = mix(y, deckY(x), onBridge);
    const porch = (1 - ease((z + 1.06) / 0.54)) * (1 - ease((x + 1.90) / 0.14));
    y = mix(y, 0.46, porch);
    const restStone = ease((z - 1.10) / 0.23) * (1 - ease((Math.hypot(x - 2.13, z - 1.62) - 0.30) / 0.22));
    return mix(y, 0.383, restStone);
  }
  const trailVertices = [], trailColors = [];
  const p0 = v(), p1 = v(), tangent0 = v(), tangent1 = v();
  for (let i = 0; i < 110; i++) {
    trail.getPointAt(i / 110, p0); trail.getPointAt((i + 1) / 110, p1);
    trail.getTangentAt(i / 110, tangent0); trail.getTangentAt((i + 1) / 110, tangent1);
    if (p0.x > -1.11 && p0.x < 2.11 && Math.abs(p0.z - bridgeZ) < 0.34) continue;
    const points = [];
    for (const [p, tangent, side] of [[p0, tangent0, -1], [p1, tangent1, -1], [p1, tangent1, 1], [p0, tangent0, 1]]) {
      const x = p.x + tangent.z * 0.245 * side, z = p.z - tangent.x * 0.245 * side;
      points.push([x, walkingSurface(x, z) - 0.004, z]);
    }
    const shade = 0.95 + random() * 0.08;
    for (const n of [0, 1, 3, 1, 2, 3]) { trailVertices.push(...points[n]); trailColors.push(shade, shade, shade); }
  }
  triangles('Worn trail from porch to river stone', trailVertices, paint.path, trailColors);
  // Flat authored stone makes the crouch a real contact, not an irregular boulder top.
  const restOutline = [[1.69, 1.38], [1.96, 1.24], [2.44, 1.38], [2.57, 1.71], [2.28, 1.98], [1.84, 1.91]];
  const restFaces = THREE.ShapeUtils.triangulateShape(restOutline.map(p => new THREE.Vector2(...p)), []);
  const restTop = [], restSides = [];
  restFaces.forEach(([a, b, c]) => [c, b, a].forEach(i => restTop.push(restOutline[i][0], 0.383, restOutline[i][1])));
  for (let i = 0; i < restOutline.length; i++) {
    const a = restOutline[i], b = restOutline[(i + 1) % restOutline.length];
    restSides.push(a[0], 0.383, a[1], b[0], 0.383, b[1], a[0], 0.291, a[1],
      b[0], 0.383, b[1], b[0], 0.291, b[1], a[0], 0.291, a[1]);
  }
  triangles('Flat river-side drinking stone', restTop, paint.paleStone).material.side = THREE.DoubleSide;
  triangles('Drinking stone broken edges', restSides, paint.stone).material.side = THREE.DoubleSide;

  // Five uneven, pointed branch skirts per mature pine. Three reusable crowns
  // and instancing preserve the fine silhouette without hundreds of tree meshes.
  function crown(seed) {
    const r = makeRandom(seed), positions = [], colors = [];
    const count = 9, ring = [];
    for (let i = 0; i < count; i++) {
      const a = i / count * TAU;
      const radius = 0.79 + r() * 0.21;
      ring.push([Math.cos(a) * radius, 0.06 + r() * 0.12, Math.sin(a) * radius]);
      const valley = a + TAU / count * 0.48;
      ring.push([Math.cos(valley) * radius * 0.70, 0.23 + r() * 0.13, Math.sin(valley) * radius * 0.70]);
    }
    const tip = [0.08 - r() * 0.16, 1, 0.08 - r() * 0.16];
    for (let i = 0; i < ring.length; i++) {
      const next = (i + 1) % ring.length, shade = 0.86 + r() * 0.23;
      for (const point of [ring[next], ring[i], tip, ring[i], ring[next], [0, 0.10, 0]]) {
        positions.push(...point); colors.push(shade, shade, shade);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }
  const pineCrowns = [crown(12), crown(103), crown(307)];
  const pineEntries = [[], [], []], trunks = [], roots = [], branchEntries = [];
  const trees = [
    [-4.29, -3.21, 3.24, 0.71], [-2.92, -4.01, 3.64, 0.73],
    [-1.76, -3.56, 3.03, 0.59], [0.66, -3.83, 3.13, 0.70],
    [2.05, -3.30, 3.78, 0.78], [3.37, -2.29, 3.34, 0.73],
    [4.00, -0.63, 2.77, 0.64], [-4.28, -0.99, 2.75, 0.65],
    [-3.99, 1.04, 2.06, 0.55], [-2.99, 2.93, 2.66, 0.69],
    [-1.68, 3.54, 1.50, 0.43], [4.18, 1.83, 2.09, 0.58],
    [3.00, -3.89, 2.65, 0.55], [-3.63, 3.01, 1.37, 0.37],
  ];
  trees.forEach(([x, z, h, radius], treeIndex) => {
    const y = ground(x, z), lean = (random() - 0.5) * 0.075;
    trunks.push({ p: [x, y + h * 0.445, z], s: [0.066 + h * 0.011, h * 0.89, 0.066 + h * 0.011], r: [0, 0, lean] });
    for (let i = 0; i < 5; i++) {
      const fraction = i / 4, crownRadius = radius * (1 - fraction * 0.77);
      pineEntries[(treeIndex + i) % 3].push({
        p: [x + lean * h * fraction, y + h * (0.17 + fraction * 0.55), z + Math.sin(treeIndex * 2 + i) * 0.035],
        s: [crownRadius, h * (0.35 - fraction * 0.07), crownRadius * (0.86 + random() * 0.19)],
        r: [0.015 * Math.sin(i), treeIndex * 1.61 + i * 0.84, lean * 0.3],
      });
    }
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * TAU + treeIndex;
      span(roots, [x, y + 0.08, z], [x + Math.cos(a) * 0.22, y + 0.01, z + Math.sin(a) * 0.22], 0.055, 0.07);
      span(branchEntries, [x, y + h * 0.34, z], [x + Math.cos(a) * radius * 0.75, y + h * 0.29, z + Math.sin(a) * radius * 0.75], 0.025, 0.033);
    }
  });
  batch('Fourteen tapered pine trunks', geometry.trunk, paint.bark, trunks);
  pineEntries.forEach((entries, i) => batch(`Asymmetric fir bough family ${i}`, pineCrowns[i], [paint.pineDark, paint.pine, paint.pineLight][i], entries));
  batch('Pine root flares', geometry.cube, paint.bark, roots);
  batch('Visible lower pine branches', geometry.cube, paint.bark, branchEntries);

  // Ground cover grows in clearings and along contours, never over the hero path.
  const grassPositions = [], grassColors = [];
  for (let blade = 0; blade < 5; blade++) {
    const angle = blade * 2.399, x = Math.cos(angle) * 0.24, z = Math.sin(angle) * 0.24;
    const h = 0.55 + (blade % 3) * 0.15;
    grassPositions.push(x - 0.045, 0, z, x + 0.045, 0, z, x * 1.45, h, z * 1.45);
    for (const shade of [0.86, 0.86, 1.1]) grassColors.push(shade, shade, shade);
  }
  const grassGeometry = new THREE.BufferGeometry();
  grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(grassPositions, 3));
  grassGeometry.setAttribute('color', new THREE.Float32BufferAttribute(grassColors, 3));
  grassGeometry.computeVertexNormals();
  const groundCover = [], mossPatches = [], tinyStones = [], ferns = [];
  const pathSamples = Array.from({ length: 90 }, (_, i) => trail.getPointAt(i / 89));
  for (let i = 0; i < 570; i++) {
    const x = -4.85 + random() * 9.5, z = -4.37 + random() * 8.6;
    if (!inPolygon(x, z, westBank) && !inPolygon(x, z, eastBank)) continue;
    if (x > -4.31 && x < -1.66 && z > -3.78 && z < -0.93) continue;
    const nearPath = pathSamples.some(p => Math.hypot(p.x - x, p.z - z) < 0.40);
    if (nearPath || (x > 1.55 && x < 2.75 && z > 1.15 && z < 2.05)) continue;
    const size = 0.14 + random() * 0.13;
    groundCover.push({ p: [x, ground(x, z) - 0.015, z], s: [size, size * (0.65 + random() * 0.6), size], r: [0, random() * TAU, 0] });
    if (i % 9 === 0) mossPatches.push({ p: [x, ground(x, z) + 0.008, z], s: [size * 1.9, 0.016, size * 1.1], r: [0, random() * TAU, 0] });
    if (i % 6 === 0) tinyStones.push({ p: [x + 0.13, ground(x, z), z], s: [0.06, 0.045, 0.09], r: [0, random() * TAU, 0] });
    if (i % 17 === 0) ferns.push({ p: [x, ground(x, z), z], s: [0.30, 0.26, 0.30], r: [0, random() * TAU, 0] });
  }
  const grassMat = material('#71815b', { vertexColors: true, side: THREE.DoubleSide });
  batch('Clearing grasses - shared fine blades', grassGeometry, grassMat, groundCover);
  batch('Low moss islands', geometry.disc, paint.moss, mossPatches);
  batch('Trailside gravel', geometry.stone, paint.paleStone, tinyStones);
  batch('Fern fans', grassGeometry, material('#536e50', { vertexColors: true, side: THREE.DoubleSide }), ferns);
  batch('Eroded river and hillside rocks', geometry.stone, paint.stone, rocks);
  batch('Pale granite families', geometry.stone, paint.paleStone, paleRocks);
  batch('Moss caps on larger rocks', geometry.disc, paint.moss, mosses);

  const reeds = [], reedHeads = [];
  for (const [cx, cz, count] of [[-0.67, 2.04, 13], [2.83, 2.69, 14], [-1.65, -2.56, 9], [0.36, -3.75, 8]]) {
    for (let i = 0; i < count; i++) {
      const x = cx + (random() - 0.5) * 0.43, z = cz + (random() - 0.5) * 0.52;
      const y = ground(x, z), h = 0.30 + random() * 0.24;
      reeds.push({ p: [x, y + h / 2, z], s: [0.012, h, 0.012], r: [0.10, random(), -0.06] });
      if (i % 3 === 0) reedHeads.push({ p: [x - h * 0.03, y + h, z + 0.025], s: [0.026, 0.11, 0.026], r: [0.10, 0, -0.06] });
    }
  }
  batch('Bank-side reeds', geometry.pole, paint.reed, reeds);
  batch('Dark reed seed heads', geometry.pole, paint.seed, reedHeads);

  // Fallen larch on the west bank, with an exposed pale end and broken branch.
  const logA = [-2.78, ground(-2.78, 1.78) + 0.12, 1.78];
  const logB = [-1.42, ground(-1.42, 2.15) + 0.12, 2.15];
  rod(world, logA, logB, 0.145, paint.bark, 9);
  rod(world, [logB[0] - 0.012, logB[1], logB[2]], [logB[0] + 0.014, logB[1], logB[2] + 0.006], 0.122, paint.endWood, 9);
  rod(world, [-2.23, 0.49, 1.92], [-2.24, 0.79, 1.82], 0.040, paint.bark);
  const firewood = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 4 - row; col++) {
    firewood.push({ p: [-4.18, 0.51 + row * 0.13, -2.90 + col * 0.15 + row * 0.075], s: [0.064, 0.59, 0.064], r: [0, 0, Math.PI / 2] });
  }
  batch('Stacked split logs under the eave', geometry.pole, paint.endWood, firewood);
  const sign = new THREE.Group();
  sign.position.set(-1.95, ground(-1.95, -0.13), -0.13);
  world.add(sign);
  cylinder(sign, [0.033, 0.042, 0.68], [0, 0.34, 0], paint.bark, 6);
  box(sign, [0.50, 0.13, 0.065], [0.08, 0.61, 0], paint.wood);
  const arrow = triangles('Carved trail arrow', [0.22, 0.66, -0.091, 0.40, 0.61, -0.091, 0.22, 0.56, -0.091], paint.cream);
  // Reuse the world-space triangle as a local sign face.
  world.remove(arrow); sign.add(arrow); arrow.position.z = 0.13;
  arrow.material.side = THREE.DoubleSide;

  // Persistent canteen: shelf -> hand -> stream -> mouth -> shelf. Its lid is
  // tethered, and all contacts are authored in world space, without reparenting.
  const canteen = new THREE.Group();
  canteen.name = 'Canteen';
  world.add(canteen);
  cylinder(canteen, [0.086, 0.081, 0.235], [0, -0.012, 0], paint.bottle, 9);
  cylinder(canteen, [0.044, 0.069, 0.045], [0, 0.127, 0], paint.bottle, 9);
  cylinder(canteen, [0.042, 0.042, 0.052], [0, 0.166, 0], paint.metal, 9);
  cylinder(canteen, [0.032, 0.032, 0.008], [0, 0.194, 0], paint.black, 9);
  const grip = new THREE.Object3D(); grip.name = 'Canteen grip contact'; grip.position.set(0.087, -0.008, 0); canteen.add(grip);
  const rim = new THREE.Object3D(); rim.name = 'Canteen rim contact'; rim.position.set(0, 0.194, 0); canteen.add(rim);
  const cap = new THREE.Group(); cap.name = 'Tethered lid'; canteen.add(cap);
  cylinder(cap, [0.052, 0.052, 0.045], [0, 0, 0], paint.metal, 9);
  const lidContact = new THREE.Object3D(); lidContact.name = 'Lid contact'; cap.add(lidContact);
  const tether = mesh(canteen, geometry.pole, paint.webbing, null, null, 'Canteen lid tether');

  // Articulated hiker, 1.43m tall in this miniature. Dynamic rods share one
  // cylinder. Joint solving changes transforms, never geometry or mesh count.
  const hiker = new THREE.Group(); hiker.name = 'Hiker'; world.add(hiker);
  const body = new THREE.Group(); body.name = 'Hiker upper body'; hiker.add(body);
  box(body, [0.37, 0.41, 0.235], [0, 0.18, 0], paint.jacket);
  box(body, [0.27, 0.065, 0.245], [0, -0.01, 0], paint.jacketDark);
  box(body, [0.018, 0.33, 0.012], [0.02, 0.21, 0.125], paint.endWood);
  box(body, [0.10, 0.11, 0.022], [-0.094, 0.22, 0.13], paint.jacketDark);
  cylinder(body, [0.062, 0.064, 0.09], [0, 0.435, 0.025], paint.skin, 7);
  const head = new THREE.Group(); head.name = 'Hiker head'; head.position.set(0, 0.54, 0.018); body.add(head);
  mesh(head, geometry.sphere, paint.skin, [0, 0.012, 0], [0.125, 0.145, 0.115]);
  box(head, [0.066, 0.044, 0.040], [0, -0.002, 0.115], paint.skin);
  cylinder(head, [0.123, 0.143, 0.12], [0, 0.142, -0.009], paint.hat, 9);
  cylinder(head, [0.186, 0.186, 0.029], [0, 0.097, 0.008], paint.hat, 11);
  cylinder(head, [0.135, 0.145, 0.022], [0, 0.105, -0.009], paint.webbing, 9);
  const mouth = new THREE.Object3D(); mouth.name = 'Hiker mouth contact'; mouth.position.set(0, -0.012, 0.149); head.add(mouth);
  mesh(body, geometry.cube, paint.pack, [0, 0.235, -0.22], [0.31, 0.43, 0.20], 'Canvas rucksack');
  box(body, [0.29, 0.085, 0.22], [0, 0.43, -0.23], paint.webbing);
  cylinder(body, [0.078, 0.078, 0.35], [0, 0.50, -0.23], paint.hat, 8).rotation.z = Math.PI / 2;
  for (const x of [-0.125, 0.125]) {
    box(body, [0.036, 0.36, 0.025], [x, 0.22, 0.133], paint.webbing);
    box(body, [0.041, 0.13, 0.23], [x, 0.40, -0.015], paint.webbing).rotation.x = -0.26;
  }
  const armPieces = [], legPieces = [], hands = [], boots = [], soles = [];
  for (const side of [-1, 1]) {
    armPieces.push([
      mesh(hiker, geometry.pole, paint.jacket, null, null, side < 0 ? 'Left sleeve' : 'Right sleeve'),
      mesh(hiker, geometry.pole, paint.jacketDark, null, null, side < 0 ? 'Left forearm' : 'Right forearm'),
    ]);
    hands.push(mesh(hiker, geometry.sphere, paint.skin, null, [0.050, 0.052, 0.050], side < 0 ? 'Left hand contact' : 'Right hand contact'));
    legPieces.push([
      mesh(hiker, geometry.pole, paint.trousers, null, null, side < 0 ? 'Left thigh' : 'Right thigh'),
      mesh(hiker, geometry.pole, paint.trousers, null, null, side < 0 ? 'Left shin' : 'Right shin'),
    ]);
    const boot = new THREE.Group(); boot.name = side < 0 ? 'Left boot' : 'Right boot'; hiker.add(boot);
    box(boot, [0.125, 0.085, 0.225], [0, 0.0475, 0.027], paint.boots);
    box(boot, [0.129, 0.018, 0.23], [0, 0.009, 0.027], paint.sole);
    const sole = new THREE.Object3D(); sole.name = side < 0 ? 'Left sole contact' : 'Right sole contact'; boot.add(sole);
    soles.push(sole); boots.push(boot);
  }

  // Dipper on a crooked branch: one complete dive rewards the riverside pause.
  const perch = v(3.03, 1.09, 2.49);
  rod(world, [3.16, ground(3.16, 2.63), 2.63], [3.09, 0.99, 2.53], 0.056, paint.bark, 7);
  rod(world, [3.09, 0.89, 2.53], [2.81, 1.04, 2.43], 0.028, paint.bark);
  rod(world, [2.94, 1.044, 2.49], [3.11, 1.044, 2.49], 0.021, paint.bark);
  const bird = new THREE.Group(); bird.name = 'White-throated dipper'; world.add(bird);
  mesh(bird, geometry.sphere, paint.black, [0, 0.054, 0], [0.105, 0.115, 0.145]);
  mesh(bird, geometry.sphere, paint.cream, [0, 0.061, 0.093], [0.077, 0.075, 0.061]);
  mesh(bird, geometry.sphere, paint.black, [0, 0.161, 0.065], [0.076, 0.074, 0.075]);
  const beak = cylinder(bird, [0.005, 0.028, 0.075], [0, 0.157, 0.159], paint.seed, 5);
  beak.rotation.x = Math.PI / 2;
  rod(bird, [-0.031, -0.026, 0], [-0.031, 0.02, 0.015], 0.011, paint.seed, 4);
  rod(bird, [0.031, -0.026, 0], [0.031, 0.02, 0.015], 0.011, paint.seed, 4);
  const wings = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Group(); wing.position.set(side * 0.077, 0.075, -0.015); bird.add(wing);
    mesh(wing, geometry.sphere, paint.black, [side * 0.066, 0, -0.037], [0.115, 0.026, 0.092]);
    wings.push(wing);
  }
  const flight = new THREE.CatmullRomCurve3([
    perch.clone(), v(2.85, 1.40, 2.32), v(2.24, 0.74, 2.42), v(1.77, 0.232, 2.54),
    v(1.49, 0.81, 2.87), v(2.08, 1.65, 3.09), v(2.79, 1.38, 2.85), perch.clone(),
  ], false, 'centripetal');

  // Fixed scratch objects: update performs no geometry/mesh/material allocation.
  const rootPoint = v(), pathDirection = v(), footPoint = v(), footDirection = v();
  const footWorld = [v(), v()], footLocal = [v(), v()], footYaw = [0, 0];
  const shoulder = [v(), v()], elbows = [v(), v()], handLocal = [v(), v()];
  const hips = [v(), v()], knees = [v(), v()], ankles = [v(), v()];
  const handWorld = [v(), v()], restHand = [v(), v()];
  const mouthWorld = v(), capWorld = v(), gripWorld = v();
  const bottleCarry = v(), bottleFill = v(1.70, 0.326, 1.67), bottleDrink = v();
  const shelfPosition = v(-3.03, 1.202, -1.59);
  const shelfRotation = new THREE.Quaternion();
  const carryRotation = new THREE.Quaternion(), fillRotation = new THREE.Quaternion();
  const drinkRotation = new THREE.Quaternion(), bottleRotation = new THREE.Quaternion();
  const yawRotation = new THREE.Quaternion();
  const fillTilt = new THREE.Quaternion().setFromAxisAngle(v(0, 0, 1), 2.25);
  const carryTilt = new THREE.Quaternion().setFromAxisAngle(v(0, 0, 1), -0.08);
  const drinkTilt = new THREE.Quaternion().setFromAxisAngle(v(1, 0, 0), -1.24);
  const bottleAxis = v(), elbowBend = v(), legBend = v(0, 0, 1);
  const jointDelta = v(), jointNormal = v(), jointAlong = v(), rodDelta = v();
  const birdPosition = v(), birdDirection = v(), currentPoint = v(), currentTangent = v();
  const tetherA = v(0, 0.172, 0), tetherB = v();
  const mapTouch = v(), currentGrip = v();
  const start = trail.getPointAt(0), end = trail.getPointAt(1);
  const finalTangent = trail.getTangentAt(1), firstTangent = trail.getTangentAt(0);
  const finalYaw = Math.atan2(finalTangent.x, finalTangent.z);
  const firstYaw = Math.atan2(firstTangent.x, firstTangent.z);
  const returnYaw = Math.atan2(-finalTangent.x, -finalTangent.z);
  const birdLookYaw = 0.79;
  const reach = { maxArm: 0, maxLeg: 0 };

  function setRod(object, a, b, radius) {
    rodDelta.subVectors(b, a);
    const length = rodDelta.length();
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.quaternion.setFromUnitVectors(up, rodDelta.multiplyScalar(1 / Math.max(length, 1e-9)));
    object.scale.set(radius, length, radius);
  }

  function joint(a, b, bend, upperLength, lowerLength, output) {
    jointDelta.subVectors(b, a);
    const distance = Math.max(jointDelta.length(), 1e-8);
    jointAlong.copy(jointDelta).multiplyScalar(1 / distance);
    jointNormal.copy(bend).addScaledVector(jointAlong, -bend.dot(jointAlong));
    if (jointNormal.lengthSq() < 1e-8) jointNormal.set(1, 0, 0).addScaledVector(jointAlong, -jointAlong.x);
    jointNormal.normalize();
    const along = clamp((upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance), 0, upperLength);
    const offset = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
    output.copy(a).addScaledVector(jointAlong, along).addScaledVector(jointNormal, offset);
  }

  // A foot holds its plant throughout the stance portion. Alternate swings
  // advance along arc length, with both feet landing at the authored endpoints.
  const halfSteps = 24;
  function walkingFeet(progress, backwards) {
    const w = progress * halfSteps;
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      const offset = i;
      let u = 0, lift = 0;
      if (w > offset) {
        const cycle = Math.floor((w - offset) / 2);
        const local = w - offset - cycle * 2;
        const from = cycle === 0 ? 0 : (offset + cycle * 2) / halfSteps;
        const to = Math.min(1, (offset + cycle * 2 + 2) / halfSteps);
        const swing = clamp(local / 0.82);
        u = mix(from, to, ease(swing));
        lift = 0.075 * Math.sin(Math.PI * swing) ** 2;
      }
      if (progress >= 1) { u = 1; lift = 0; }
      const onPath = backwards ? 1 - u : u;
      trail.getPointAt(onPath, footPoint); trail.getTangentAt(onPath, footDirection);
      if (backwards) footDirection.negate();
      footWorld[i].set(footPoint.x + footDirection.z * 0.111 * side, 0, footPoint.z - footDirection.x * 0.111 * side);
      footWorld[i].y = walkingSurface(footWorld[i].x, footWorld[i].z) + lift;
      footYaw[i] = Math.atan2(footDirection.x, footDirection.z);
    }
  }

  function standingFeet(point, heading, pivot = 0) {
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      const localPivot = clamp(pivot * 2 - i);
      footWorld[i].set(point.x + Math.cos(heading) * 0.111 * side, 0, point.z - Math.sin(heading) * 0.111 * side);
      footWorld[i].y = walkingSurface(footWorld[i].x, footWorld[i].z) + 0.045 * Math.sin(Math.PI * localPivot) ** 2;
      footYaw[i] = heading;
    }
  }

  const phases = [
    { start: 0, end: 3.3, label: 'Read the trail map beneath the cabin eaves' },
    { start: 3.3, end: 5.8, label: 'Collect the canteen from the porch shelf' },
    { start: 5.8, end: 14.5, label: 'Follow the trail and cross the arched timber bridge' },
    { start: 14.5, end: 20.5, label: 'Crouch on the river stone, uncap and refill' },
    { start: 20.5, end: 24.6, label: 'Stand, lift the canteen and take a drink' },
    { start: 24.6, end: 28.0, label: 'Close the lid and watch a dipper dive for food' },
    { start: 28.0, end: 37.5, label: 'Return over the bridge to the trail cabin' },
    { start: 37.5, end: 41.8, label: 'Put the canteen back on its shelf' },
    { start: 41.8, end: 45, label: 'Check the route once more and settle' },
  ];

  function update(seconds) {
    if (!Number.isFinite(seconds)) throw new TypeError('Forest river time must be a finite number of seconds.');
    const t = clamp(seconds, 0, 45);
    const outward = ramp(t, 5.8, 14.5), homeward = ramp(t, 28, 37.5);
    const walkingOut = t >= 5.8 && t < 14.5;
    const walkingHome = t >= 28 && t < 37.5;
    const crouch = pulse(t, 14.7, 16.7, 20.0, 21.7);
    const fill = pulse(t, 17.25, 18.15, 20.0, 21.6);
    const drink = pulse(t, 21.8, 22.55, 23.45, 24.25);
    const trace = pulse(t, 0.5, 1.1, 2.25, 3.05) + pulse(t, 42.0, 42.6, 43.55, 44.4);
    const capOpen = pulse(t, 16.0, 17.0, 24.6, 25.5);
    let yaw = Math.PI, walkPhase = 0;
    rootPoint.copy(start);
    if (walkingOut) {
      trail.getPointAt(outward, rootPoint); trail.getTangentAt(outward, pathDirection);
      const travelYaw = Math.atan2(pathDirection.x, pathDirection.z);
      yaw = travelYaw;
      yaw = turn(yaw, -Math.PI / 2, ramp(t, 13.8, 14.5));
      walkingFeet(outward, false); walkPhase = outward * halfSteps;
    } else if (t >= 14.5 && t < 28) {
      rootPoint.copy(end);
      yaw = turn(-Math.PI / 2, birdLookYaw, ramp(t, 24.6, 25.65));
      yaw = turn(yaw, returnYaw, ramp(t, 27.2, 28));
      let feetHeading = finalYaw;
      feetHeading = turn(feetHeading, birdLookYaw, ramp(t, 24.65, 25.8));
      feetHeading = turn(feetHeading, returnYaw, ramp(t, 27.2, 28));
      const pivot = t < 26 ? ramp(t, 24.65, 25.8) : ramp(t, 27.2, 28);
      standingFeet(end, feetHeading, pivot);
    } else if (walkingHome) {
      trail.getPointAt(1 - homeward, rootPoint); trail.getTangentAt(1 - homeward, pathDirection);
      yaw = Math.atan2(-pathDirection.x, -pathDirection.z);
      walkingFeet(homeward, true); walkPhase = homeward * halfSteps;
    } else {
      if (t >= 37.5) {
        yaw = turn(firstYaw + Math.PI, Math.PI, ramp(t, 37.5, 38.35));
        standingFeet(start, yaw, ramp(t, 37.5, 38.35));
      } else {
        yaw = turn(Math.PI, firstYaw, ramp(t, 5.2, 5.8));
        standingFeet(start, yaw, ramp(t, 5.2, 5.8));
      }
    }
    rootPoint.y = walkingSurface(rootPoint.x, rootPoint.z);
    hiker.position.copy(rootPoint); hiker.rotation.set(0, yaw, 0);
    const strideWeight = (walkingOut || walkingHome) ? Math.sin(Math.PI * clamp((walkingOut ? outward : homeward))) : 0;
    hiker.updateMatrixWorld(true);
    let hipHeight = 0.696 - crouch * 0.432 - 0.012 * Math.sin(walkPhase * Math.PI) ** 2 * strideWeight;
    // Lower the pelvis on uneven bridge approaches so neither leg stretches.
    // Each boot still follows its planted world position and actual surface.
    for (let i = 0; i < 2; i++) {
      footLocal[i].copy(footWorld[i]); hiker.worldToLocal(footLocal[i]);
      const side = i === 0 ? -1 : 1;
      const horizontal2 = (footLocal[i].x - side * 0.102) ** 2 + footLocal[i].z ** 2;
      const ceiling = footLocal[i].y + 0.088 + Math.sqrt(Math.max(0, 0.718 ** 2 - horizontal2));
      hipHeight = Math.min(hipHeight, ceiling);
    }
    body.position.set(0, hipHeight, 0);
    body.rotation.set(0.57 * crouch + 0.035 * trace, 0.012 * Math.sin(TAU * t / 5), 0);
    head.rotation.set(-0.13 * drink + 0.075 * trace, 0.09 * Math.sin(TAU * t / 9) * (1 - crouch), 0);
    hiker.updateMatrixWorld(true);

    for (let i = 0; i < 2; i++) {
      footLocal[i].copy(footWorld[i]); hiker.worldToLocal(footLocal[i]);
      boots[i].position.copy(footLocal[i]); boots[i].rotation.set(0, footYaw[i] - yaw, 0);
      const side = i === 0 ? -1 : 1;
      hips[i].set(side * 0.102, hipHeight, 0);
      ankles[i].copy(footLocal[i]); ankles[i].y += 0.088;
      legBend.set(side * 0.14, 0, 1);
      joint(hips[i], ankles[i], legBend, 0.365, 0.365, knees[i]);
      setRod(legPieces[i][0], hips[i], knees[i], 0.076);
      setRod(legPieces[i][1], knees[i], ankles[i], 0.059);
    }

    // Bottle tracks blend only at matched ownership points. It is on the shelf
    // until 4.4s and again from 40.1s, with the grip held through each transfer.
    yawRotation.setFromAxisAngle(up, yaw);
    bottleCarry.set(0.305, 0.62, 0.15).applyQuaternion(yawRotation).add(rootPoint);
    carryRotation.copy(yawRotation).multiply(carryTilt);
    fillRotation.copy(fillTilt);
    mouth.getWorldPosition(mouthWorld);
    drinkRotation.copy(yawRotation).multiply(drinkTilt);
    bottleAxis.copy(up).applyQuaternion(drinkRotation);
    bottleDrink.copy(mouthWorld).addScaledVector(bottleAxis, -0.194);
    currentGrip.copy(bottleCarry).lerp(bottleFill, fill).lerp(bottleDrink, drink);
    bottleRotation.copy(carryRotation).slerp(fillRotation, fill).slerp(drinkRotation, drink);
    const pickedUp = ramp(t, 4.4, 5.75) * (1 - ramp(t, 38.6, 40.1));
    canteen.position.copy(shelfPosition).lerp(currentGrip, pickedUp);
    canteen.quaternion.copy(shelfRotation).slerp(bottleRotation, pickedUp);
    cap.position.set(0, 0.212 + capOpen * 0.055, -capOpen * 0.145);
    cap.rotation.set(capOpen * 1.72, Math.sin(t * TAU * 2) * 0.12 * pulse(t, 16, 16.3, 16.6, 17), 0);
    tetherB.copy(cap.position); setRod(tether, tetherA, tetherB, 0.008);
    canteen.updateMatrixWorld(true);
    grip.getWorldPosition(gripWorld); lidContact.getWorldPosition(capWorld);

    const held = ramp(t, 3.35, 4.4) * (1 - ramp(t, 40.1, 41.1));
    const twist = pulse(t, 15.55, 16.0, 17.0, 17.4) + pulse(t, 24.25, 24.6, 25.5, 25.8);
    mapTouch.set(-2.50 + 0.065 * Math.sin(TAU * t / 3), 1.43 + 0.048 * Math.cos(TAU * t / 3), -1.689);
    restHand[0].set(-0.29, 0.73 - crouch * 0.24, 0.04 + crouch * 0.17).applyQuaternion(yawRotation).add(rootPoint);
    restHand[1].set(0.29, 0.73 - crouch * 0.24, 0.04).applyQuaternion(yawRotation).add(rootPoint);
    handWorld[0].copy(restHand[0]).lerp(mapTouch, trace).lerp(capWorld, twist);
    handWorld[1].copy(restHand[1]).lerp(gripWorld, held);
    reach.maxArm = 0; reach.maxLeg = 0;
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      shoulder[i].set(side * 0.211, 0.345, 0);
      body.localToWorld(shoulder[i]); hiker.worldToLocal(shoulder[i]);
      handLocal[i].copy(handWorld[i]); hiker.worldToLocal(handLocal[i]);
      elbowBend.set(side * 0.86, -0.35, -0.38);
      joint(shoulder[i], handLocal[i], elbowBend, 0.334, 0.334, elbows[i]);
      setRod(armPieces[i][0], shoulder[i], elbows[i], 0.064);
      setRod(armPieces[i][1], elbows[i], handLocal[i], 0.048);
      hands[i].position.copy(handLocal[i]);
      reach.maxArm = Math.max(reach.maxArm, shoulder[i].distanceTo(handLocal[i]));
      reach.maxLeg = Math.max(reach.maxLeg, hips[i].distanceTo(ankles[i]));
    }

    // The local water subcycles divide 45 exactly; their invisible wrap points
    // scale down before resetting. No narrative prop wraps or changes parent.
    for (let i = 0; i < 46; i++) {
      const u = (t / 9 + i * 0.61803398875) % 1;
      streamCurve.getPointAt(u, currentPoint); streamCurve.getTangentAt(u, currentTangent);
      const lateral = Math.sin(i * 9.17) * 0.46;
      const taper = ease(u / 0.06) * ease((1 - u) / 0.06);
      transform.position.set(currentPoint.x + lateral, waterY(currentPoint.z) + 0.012, currentPoint.z);
      transform.rotation.set(0, Math.atan2(currentTangent.x, currentTangent.z), 0);
      transform.scale.set((0.022 + i % 3 * 0.007) * taper, 0.008, (0.08 + i % 5 * 0.025) * taper);
      transform.updateMatrix(); waterGlints.setMatrixAt(i, transform.matrix);
    }
    waterGlints.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < 13; i++) {
      const u = (t / 3 + i * 0.27183) % 1;
      const taper = Math.sin(Math.PI * u) ** 2;
      const z = mix(3.075, 3.48, u);
      transform.position.set(0.78 + i * 0.09, waterY(z) + 0.016, z);
      transform.rotation.set(-0.68, 0, -0.11);
      transform.scale.set(0.018 * taper, 0.014, 0.10 * taper);
      transform.updateMatrix(); fallGlints.setMatrixAt(i, transform.matrix);
    }
    fallGlints.instanceMatrix.needsUpdate = true;
    const rippling = pulse(t, 18.15, 18.4, 19.7, 20.1);
    for (let i = 0; i < 3; i++) {
      const phase = (t / 1.5 + i / 3) % 1;
      const fade = Math.sin(Math.PI * phase) ** 2 * rippling;
      fillRipples[i].scale.set(0.34 * phase, 1, 0.22 * phase);
      fillRipples[i].material.opacity = fade * 0.65;
      fillRipples[i].visible = fade > 0.0001;
      const age = (t - 26.61 - i * 0.105) / 0.82;
      const size = clamp(age) * 0.35 * (1 - ramp(t, 28.3, 28.6));
      diveRipples[i].scale.set(size, 1, size * 0.76);
      diveRipples[i].material.opacity = age > 0 && age < 1 ? Math.sin(Math.PI * age) ** 2 * 0.75 : 0;
      diveRipples[i].visible = age > 0 && age < 1;
    }

    const flightTime = clamp((t - 25.3) / 2.9);
    const flightEase = ease(flightTime);
    flight.getPoint(flightEase, birdPosition); flight.getTangent(flightEase, birdDirection);
    const flying = pulse(t, 25.3, 25.50, 27.98, 28.2);
    const flightYaw = Math.atan2(birdDirection.x, birdDirection.z);
    bird.position.copy(birdPosition);
    bird.rotation.set(-0.22 * birdDirection.y * flying, turn(-2.25, flightYaw, flying), 0);
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      wings[i].rotation.z = side * (0.18 + flying * (0.62 + 0.62 * Math.sin((t - 25.3) * TAU * 4)));
    }
    world.updateMatrixWorld(true);
  }

  // Conservative union for every phase, including the dive and all tree tips.
  // It is intentionally static so camera fitting never follows the visitor.
  const bounds = new THREE.Box3(v(-5.36, -0.30, -4.95), v(5.12, 4.36, 4.66));
  world.userData.forestRiver = {
    title: 'Water for the way back',
    palette: 'Larch timber, deep fir, granite, sage and opaque blue-green water',
    contactSchedule: {
      held: [4.4, 40.1], fill: [18.15, 20.0], drink: [22.55, 23.45],
      shelf: [[0, 4.4], [40.1, 45]],
    },
    // These scalar diagnostics do not control the animation.
    reach,
    walkingSurface,
  };
  update(0);
  return {
    world, update, bounds, target: [-0.15, 0.98, 0.08],
    stillTime: 18.7, startTime: 0, duration: 45, loop: false, phases,
  };
}
