import { THREE, box, cylinder, rod, material, makeRandom } from '../diorama-runtime.js';

// ALDER HALT: a branch-line ticket inspection, rather than a train on an endless track.
// All dimensions are in model metres. +X is the arriving railcar's forward direction.
export function buildStation() {
  const world = new THREE.Group();
  world.name = 'Alder Halt / the branch-line inspection';
  const random = makeRandom(73109);
  const trackZ = -0.72;
  const platformY = 0.44;
  const hiddenX = -5.17;
  const p = {
    earth: material('#9a8c75'), cut: material('#756d60'), ground: material('#a59d8c'),
    stone: material('#b1a28c'), stoneLight: material('#c4b7a0'), stoneDark: material('#948977'),
    brick: material('#946452'), brickDark: material('#805b4e'), brickLight: material('#a77a62'),
    brickMortar: material('#aa9782'), tunnel: material('#494747', { side: THREE.DoubleSide }),
    dark: material('#383b3e'), ballast: material('#8b8982'), steel: material('#626368'),
    railTop: material('#aaa9a2'), sleeper: material('#64584b'), concrete: material('#b7ad9a'),
    edge: material('#d6cbb5'), paving: material('#bdb19c'), mortar: material('#a39784'),
    iron: material('#44464a'), roof: material('#48494c'), roofSeam: material('#686a6b'),
    railcar: material('#835452'), carLine: material('#c0ae92'), cream: material('#ddd5bd'),
    timber: material('#82664f'), seat: material('#a1815d'), window: material('#43515c'),
    windowLight: material('#778087'), rust: material('#a4644d'),
    leaf: material('#657955'), leafLight: material('#85926a'), leafDark: material('#4e654b'),
    bark: material('#716b55'), skin: material('#c39b76'), skinLight: material('#d3ad85'),
    coat: material('#495667'), trousers: material('#494b50'), traveler: material('#7d818a'),
    bag: material('#a79971'), strap: material('#716449'), paper: material('#e4ddc5'),
    lamp: material('#e8cc8c'), red: material('#ad674e'), black: material('#303135'),
  };
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitStone = new THREE.IcosahedronGeometry(1, 0);
  const unitRod = new THREE.CylinderGeometry(1, 1, 1, 7);
  const tempObject = new THREE.Object3D();

  function mesh(geometry, paint, parent = world) {
    const object = new THREE.Mesh(geometry, paint);
    object.castShadow = object.receiveShadow = true;
    parent.add(object);
    return object;
  }

  function blocks(name, entries, paint, geometry = unitBox) {
    const batch = new THREE.InstancedMesh(geometry, paint, entries.length);
    batch.name = name;
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      tempObject.position.set(e[0], e[1], e[2]);
      tempObject.scale.set(e[3], e[4], e[5]);
      tempObject.rotation.set(e[6] || 0, e[7] || 0, e[8] || 0);
      tempObject.updateMatrix();
      batch.setMatrixAt(i, tempObject.matrix);
    }
    batch.castShadow = batch.receiveShadow = true;
    batch.instanceMatrix.needsUpdate = true;
    batch.computeBoundingBox();
    batch.computeBoundingSphere();
    world.add(batch);
    return batch;
  }

  // A thin, irregular slice of ground. This is not a rectangular display plinth.
  function slab(outline, top, bottom, topPaint, sidePaint, parent = world) {
    const contour = outline.map(v => new THREE.Vector2(v[0], v[1]));
    const triangles = THREE.ShapeUtils.triangulateShape(contour, []);
    const positions = [];
    for (const face of triangles) {
      const a = outline[face[0]], b = outline[face[1]], c = outline[face[2]];
      const area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
      const vertices = area > 0 ? [a, c, b] : [a, b, c];
      for (const v of vertices) positions.push(v[0], top, v[1]);
    }
    const topCount = positions.length / 3;
    const ccw = THREE.ShapeUtils.area(contour) > 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length];
      const vertices = ccw
        ? [[a[0], top, a[1]], [b[0], bottom, b[1]], [a[0], bottom, a[1]],
          [a[0], top, a[1]], [b[0], top, b[1]], [b[0], bottom, b[1]]]
        : [[a[0], top, a[1]], [a[0], bottom, a[1]], [b[0], bottom, b[1]],
          [a[0], top, a[1]], [b[0], bottom, b[1]], [b[0], top, b[1]]];
      for (const v of vertices) positions.push(...v);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addGroup(0, topCount, 0);
    geometry.addGroup(topCount, positions.length / 3 - topCount, 1);
    geometry.computeVertexNormals();
    return mesh(geometry, [topPaint, sidePaint], parent);
  }

  const perimeter = [
    [-6.65, -1.80], [-6.27, -2.47], [-4.83, -2.68], [-3.10, -2.52],
    [-1.37, -2.17], [2.55, -2.07], [4.91, -1.60], [5.64, -0.63],
    [5.47, 1.47], [4.97, 2.44], [3.16, 2.98], [-0.57, 3.04],
    [-2.78, 2.29], [-5.91, 1.23], [-6.64, 0.30],
  ];
  slab(perimeter, -0.015, -0.22, p.ground, p.cut).name = 'weathered gravel and compacted station forecourt';
  const rim = [];
  for (let i = 0; i < perimeter.length; i++) {
    const a = perimeter[i], b = perimeter[(i + 1) % perimeter.length];
    const count = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.17);
    for (let j = 0; j < count; j++) {
      const u = j / count;
      rim.push([a[0] + (b[0] - a[0]) * u, -0.028 - random() * 0.025,
        a[1] + (b[1] - a[1]) * u, 0.08 + random() * 0.11, 0.045, 0.07 + random() * 0.08,
        0, random() * Math.PI, 0]);
    }
  }
  blocks('broken gravel edge', rim, p.earth, unitStone);

  // Ballast has tapered shoulders; rail heads, webs, sleepers and chairs are separate scales.
  slab([[-6.49, -1.45], [4.97, -1.45], [5.08, -1.28], [5.08, -0.12],
    [4.96, 0.03], [-6.49, 0.03]], 0.035, -0.01, p.ballast, p.ballast);
  const sleepers = [], chairs = [], ballast = [];
  for (let x = -6.34; x <= 4.95; x += 0.29) {
    sleepers.push([x, 0.065, trackZ, 0.115, 0.075, 1.21, 0, (random() - 0.5) * 0.035, 0]);
    for (const z of [trackZ - 0.37, trackZ + 0.37]) chairs.push([x, 0.109, z, 0.13, 0.023, 0.15]);
  }
  blocks('creosoted sleepers', sleepers, p.sleeper);
  blocks('cast rail chairs', chairs, p.dark);
  for (const z of [trackZ - 0.37, trackZ + 0.37]) {
    box(world, [11.48, 0.050, 0.038], [-0.75, 0.127, z], p.steel);
    box(world, [11.48, 0.019, 0.066], [-0.75, 0.162, z], p.railTop);
  }
  for (let i = 0; i < 290; i++) {
    const x = -6.35 + random() * 11.28;
    const z = trackZ + (random() - 0.5) * 1.43;
    if (Math.abs(z - (trackZ - 0.37)) < 0.075 || Math.abs(z - (trackZ + 0.37)) < 0.075) continue;
    ballast.push([x, 0.047, z, 0.035 + random() * 0.035, 0.025, 0.04 + random() * 0.035,
      random(), random() * 4, random()]);
  }
  blocks('small angular ballast', ballast, p.stoneDark, unitStone);

  // Full-depth covered tunnel. The car parks inside it, never beyond the framed world.
  const tunnelFront = -3.48, tunnelBack = -6.58, archY = 1.35, archRadius = 0.86;
  const archVertices = [];
  const archColors = [];
  const archPaint = material('#ffffff', { vertexColors: true });
  function coloredTriangle(a, b, c, color) {
    archVertices.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) archColors.push(color.r, color.g, color.b);
  }
  const stones = ['#985f4c', '#a36b54', '#875947', '#a2775e'].map(c => new THREE.Color(c));
  const keystoneColor = new THREE.Color('#c4b7a0');
  for (let i = 0; i < 17; i++) {
    const a = i * Math.PI / 17 + 0.009;
    const b = (i + 1) * Math.PI / 17 - 0.009;
    const r = archRadius + (i === 8 ? 0.265 : 0.21);
    const at = (x, theta, radius) => [x, archY + Math.sin(theta) * radius, trackZ + Math.cos(theta) * radius];
    const ai = at(tunnelFront + 0.075, a, archRadius), bi = at(tunnelFront + 0.075, b, archRadius);
    const ao = at(tunnelFront + 0.075, a, r), bo = at(tunnelFront + 0.075, b, r);
    const aib = at(tunnelFront - 0.16, a, archRadius), bib = at(tunnelFront - 0.16, b, archRadius);
    const aob = at(tunnelFront - 0.16, a, r), bob = at(tunnelFront - 0.16, b, r);
    const c = i === 8 ? keystoneColor : stones[i % stones.length];
    coloredTriangle(ai, bi, ao, c); coloredTriangle(ao, bi, bo, c);
    coloredTriangle(ai, bi, aib, c); coloredTriangle(bi, bib, aib, c);
    coloredTriangle(ao, aob, bo, c); coloredTriangle(bo, aob, bob, c);
  }
  const archGeometry = new THREE.BufferGeometry();
  archGeometry.setAttribute('position', new THREE.Float32BufferAttribute(archVertices, 3));
  archGeometry.setAttribute('color', new THREE.Float32BufferAttribute(archColors, 3));
  archGeometry.computeVertexNormals();
  mesh(archGeometry, archPaint).name = 'brick arch with a limestone keystone';

  // A railway headwall, with a real arched opening, running-bond courses and a stone
  // coping. The lower engineered silhouette takes precedence over the rock behind it.
  const portalShape = new THREE.Shape();
  portalShape.moveTo(-1.34, 0); portalShape.lineTo(-archRadius, 0);
  portalShape.lineTo(-archRadius, archY);
  portalShape.absarc(0, archY, archRadius, Math.PI, 0, true);
  portalShape.lineTo(archRadius, 0); portalShape.lineTo(1.34, 0);
  portalShape.lineTo(1.34, 2.43); portalShape.lineTo(-1.34, 2.43); portalShape.closePath();
  const portalGeometry = new THREE.ExtrudeGeometry(portalShape, { depth: 0.18, bevelEnabled: false, curveSegments: 24 });
  portalGeometry.rotateY(Math.PI / 2);
  const portalWall = mesh(portalGeometry, p.brickMortar);
  portalWall.position.set(tunnelFront - 0.18, 0, trackZ);
  portalWall.name = 'coursed brick railway portal';
  const portalCourses = [[], [], []];
  for (let row = 0; row < 21; row++) {
    const bottom = row * 0.115 + 0.006, top = bottom + 0.105;
    const halfOpening = bottom <= archY ? archRadius : bottom < archY + archRadius
      ? Math.sqrt(archRadius * archRadius - (bottom - archY) ** 2) : 0;
    for (let col = -6; col <= 6; col++) {
      const left = Math.max(-1.325, col * 0.25 + (row % 2) * 0.125);
      const right = Math.min(1.325, col * 0.25 + (row % 2) * 0.125 + 0.238);
      if (right <= left) continue;
      for (const side of [-1, 1]) {
        const a = side < 0 ? left : Math.max(left, halfOpening + 0.008);
        const b = side < 0 ? Math.min(right, -halfOpening - 0.008) : right;
        if (b - a > 0.025) portalCourses[(row + col + 18) % 3].push([
          tunnelFront + 0.022, (bottom + top) / 2, trackZ + (a + b) / 2,
          0.035, top - bottom, b - a,
        ]);
      }
    }
  }
  for (let i = 0; i < 3; i++) blocks(`running-bond portal bricks ${i + 1}`, portalCourses[i],
    [p.brick, p.brickDark, p.brickLight][i]);
  box(world, [0.29, 0.065, 2.77], [tunnelFront - 0.04, 2.415, trackZ], p.stoneDark);
  box(world, [0.35, 0.10, 2.88], [tunnelFront - 0.04, 2.49, trackZ], p.stoneLight);
  const liner = [];
  for (let i = 0; i < 18; i++) {
    const a = i * Math.PI / 18, b = (i + 1) * Math.PI / 18;
    const za = trackZ + archRadius * Math.cos(a), zb = trackZ + archRadius * Math.cos(b);
    const ya = archY + archRadius * Math.sin(a), yb = archY + archRadius * Math.sin(b);
    liner.push(tunnelBack, ya, za, tunnelFront, ya, za, tunnelFront, yb, zb,
      tunnelBack, ya, za, tunnelFront, yb, zb, tunnelBack, yb, zb);
  }
  const linerGeometry = new THREE.BufferGeometry();
  linerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(liner, 3));
  linerGeometry.computeVertexNormals();
  mesh(linerGeometry, p.tunnel).name = 'continuous barrel vault';
  for (const side of [-1, 1]) {
    box(world, [3.1, 1.35, 0.24], [-5.03, 0.675, trackZ + side * 0.98], p.brickDark);
    for (let row = 0; row < 4; row++) {
      box(world, [0.26, 0.318, 0.30], [tunnelFront + 0.025, 0.172 + row * 0.333,
        trackZ + side * 1.00], row % 2 ? p.brick : p.brickDark);
    }
    // Splayed retaining wings anchor the portal into the bank.
    const wing = box(world, [0.90, 0.62, 0.20], [-3.12, 0.30, trackZ + side * 1.17], p.brickDark);
    wing.rotation.y = side * -0.48;
    const cap = box(world, [0.94, 0.065, 0.25], [-3.12, 0.635, trackZ + side * 1.17], p.stone);
    cap.rotation.y = wing.rotation.y;
  }
  box(world, [0.14, 2.35, 2.3], [-6.60, 1.16, trackZ], p.tunnel);

  // Exposed cut rock covers the original full-depth scenic mask. Its shallow ridge is
  // below the station roof; there is no turf blanket or ornamental planting on the crown.
  const rockSections = [
    [-6.62, [-2.14, 0.02, -1.72, 1.94, -0.72, 2.43, 0.27, 1.94, 0.76, 0.02]],
    [-5.82, [-2.38, 0.02, -1.72, 1.94, -0.72, 2.48, 0.27, 1.94, 0.93, 0.02]],
    [-4.69, [-2.30, 0.02, -1.72, 1.94, -0.72, 2.45, 0.27, 1.94, 1.18, 0.02]],
    [-3.60, [-2.07, 0.02, -1.72, 1.94, -0.72, 2.44, 0.27, 1.94, 0.85, 0.02]],
  ];
  const rockPositions = [], rockColor = [];
  const rockTones = [new THREE.Color('#9a9387'), new THREE.Color('#898780'), new THREE.Color('#a59a88')];
  for (let i = 0; i < rockSections.length - 1; i++) {
    const [xa, a] = rockSections[i], [xb, b] = rockSections[i + 1];
    for (let j = 0; j < 4; j++) {
      const va = [xa, a[j * 2 + 1], a[j * 2]], vb = [xb, b[j * 2 + 1], b[j * 2]];
      const vc = [xb, b[j * 2 + 3], b[j * 2 + 2]], vd = [xa, a[j * 2 + 3], a[j * 2 + 2]];
      rockPositions.push(...va, ...vc, ...vb, ...va, ...vd, ...vc);
      const color = rockTones[(i + j) % 3];
      for (let k = 0; k < 6; k++) rockColor.push(color.r, color.g, color.b);
    }
  }
  const rockGeometry = new THREE.BufferGeometry();
  rockGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rockPositions, 3));
  rockGeometry.setAttribute('color', new THREE.Float32BufferAttribute(rockColor, 3));
  rockGeometry.computeVertexNormals();
  mesh(rockGeometry, material('#ffffff', { vertexColors: true, side: THREE.DoubleSide })).name = 'low exposed rock over the railway tunnel';
  // The rear cap and the near-side wedge close the scenic mask, not a visibility toggle.
  box(world, [0.11, 2.35, 1.98], [-6.57, 1.17, trackZ], p.stoneDark);

  const platformOutline = [[-2.20, 0.14], [4.52, 0.14], [4.64, 0.39], [4.52, 2.55],
    [3.95, 2.78], [-0.78, 2.78], [-2.20, 2.23]];
  slab(platformOutline, platformY, 0.015, p.paving, p.stoneDark).name = 'raised stone platform';
  const edgeBlocks = [], pavingJoints = [], fasciaStones = [];
  for (let x = -2.055; x < 4.45; x += 0.29) {
    edgeBlocks.push([x, platformY + 0.013, 0.255, 0.278, 0.034, 0.22]);
    fasciaStones.push([x, 0.23, 0.139, 0.28, 0.29, 0.026]);
  }
  blocks('individual platform coping slabs', edgeBlocks, p.edge);
  blocks('platform edge masonry', fasciaStones, p.stone);
  for (let x = -1.90; x < 4.45; x += 0.48) pavingJoints.push([x, 0.441, 1.45, 0.012, 0.003, 2.18]);
  for (let z = 0.55; z < 2.5; z += 0.46) pavingJoints.push([1.13, 0.442, z, 6.50, 0.003, 0.012]);
  blocks('fine paving joints', pavingJoints, p.mortar);
  box(world, [6.66, 0.008, 0.045], [1.13, 0.467, 0.428], p.cream);
  // Three shallow end steps meet the gravel forecourt.
  for (let i = 0; i < 3; i++) box(world, [0.29, (i + 1) * 0.11, 0.88],
    [4.62 + (2 - i) * 0.22, (i + 1) * 0.055, 1.66], p.stone);

  // A shallow railway gable, standing-seam charcoal sheet and exposed iron trusses.
  const roofProfile = [[1.20, 2.52], [1.55, 2.65], [1.99, 2.80], [2.40, 2.67], [2.79, 2.52]];
  const roofGroup = new THREE.Group(); world.add(roofGroup); roofGroup.name = 'charcoal gabled railway canopy';
  for (let i = 0; i < roofProfile.length - 1; i++) {
    const [za, ya] = roofProfile[i], [zb, yb] = roofProfile[i + 1];
    const width = Math.hypot(zb - za, yb - ya);
    const strip = box(roofGroup, [3.74, 0.052, width + 0.018], [2.88, (ya + yb) / 2, (za + zb) / 2], p.roof);
    strip.rotation.x = -Math.atan2(yb - ya, zb - za);
    const underside = box(roofGroup, [3.69, 0.015, width], [2.88, (ya + yb) / 2 - 0.040, (za + zb) / 2], p.cream);
    underside.rotation.x = strip.rotation.x;
  }
  const roofSeams = [];
  for (let x = 1.08; x < 4.72; x += 0.26) {
    for (let i = 0; i < roofProfile.length - 1; i++) {
      const [za, ya] = roofProfile[i], [zb, yb] = roofProfile[i + 1];
      roofSeams.push([x, (ya + yb) / 2 + 0.032, (za + zb) / 2,
        0.018, 0.022, Math.hypot(zb - za, yb - ya), -Math.atan2(yb - ya, zb - za)]);
    }
  }
  blocks('standing roof seams', roofSeams, p.roofSeam);
  for (const x of [1.42, 4.34]) {
    box(world, [0.28, 0.10, 0.32], [x, 0.49, 2.03], p.concrete);
    cylinder(world, [0.040, 0.063, 1.88], [x, 1.48, 2.03], p.iron, 8);
    rod(world, [x, 1.92, 2.03], [x, 2.47, 1.28], 0.029, p.iron);
    rod(world, [x, 1.92, 2.03], [x, 2.47, 2.72], 0.029, p.iron);
    rod(world, [x, 2.41, 1.28], [x, 2.41, 2.72], 0.022, p.iron);
    rod(world, [x, 2.41, 1.28], [x, 2.73, 1.99], 0.022, p.iron);
    rod(world, [x, 2.73, 1.99], [x, 2.41, 2.72], 0.022, p.iron);
    rod(world, [x, 2.41, 1.99], [x, 2.73, 1.99], 0.020, p.iron);
    for (const z of [1.25, 2.76]) box(world, [0.11, 0.06, 0.12], [x, 2.48, z], p.iron);
  }
  box(world, [3.78, 0.075, 0.065], [2.88, 2.52, 2.80], p.roofSeam);
  box(world, [3.77, 0.070, 0.062], [2.88, 2.52, 1.19], p.roofSeam);
  box(world, [3.80, 0.048, 0.075], [2.88, 2.81, 1.99], p.roofSeam);
  cylinder(world, [0.025, 0.025, 2.03], [4.57, 1.44, 2.79], p.iron, 7);
  // Slats share one instanced batch. Both end supports include seat-to-ground legs.
  const benchSlats = [];
  for (let i = 0; i < 5; i++) benchSlats.push([2.90, 0.826, 2.00 + i * 0.091, 2.24, 0.055, 0.077]);
  for (let i = 0; i < 3; i++) benchSlats.push([2.90, 1.02 + i * 0.105, 2.43, 2.24, 0.075, 0.048]);
  blocks('oak bench slats', benchSlats, p.seat);
  for (const x of [1.99, 3.81]) {
    for (const z of [2.06, 2.37]) rod(world, [x, 0.45, z], [x, 0.80, z - 0.035], 0.033, p.steel);
    rod(world, [x, 0.73, 2.38], [x, 1.29, 2.46], 0.027, p.steel);
    rod(world, [x, 0.99, 1.99], [x, 1.01, 2.40], 0.026, p.steel);
  }

  // Geometric enamel lettering, merged into one mesh per sign. No font, canvas or asset fetch.
  const glyphs = {
    A: [[0,0,0.5,1],[0.5,1,1,0],[0.23,0.43,0.77,0.43]],
    L: [[0,1,0,0],[0,0,0.9,0]], D: [[0,0,0,1],[0,1,0.62,1],[0.62,1,1,0.78],[1,0.78,1,0.22],[1,0.22,0.62,0],[0.62,0,0,0]],
    E: [[0,0,0,1],[0,1,1,1],[0,0.5,0.78,0.5],[0,0,1,0]],
    R: [[0,0,0,1],[0,1,0.8,1],[0.8,1,1,0.8],[1,0.8,0.8,0.55],[0.8,0.55,0,0.55],[0.48,0.55,1,0]],
    H: [[0,0,0,1],[1,0,1,1],[0,0.5,1,0.5]], T: [[0,1,1,1],[0.5,1,0.5,0]],
    '0': [[0,0.18,0,0.82],[0,0.82,0.2,1],[0.2,1,0.8,1],[0.8,1,1,0.82],[1,0.82,1,0.18],[1,0.18,0.8,0],[0.8,0,0.2,0],[0.2,0,0,0.18]],
    '7': [[0,1,1,1],[1,1,0.25,0]],
  };
  function lettering(parent, text, height, centerX, centerY, z, paint) {
    const positions = [], advance = height * 0.77, glyphWidth = height * 0.53;
    const total = text.length * advance - (advance - glyphWidth);
    for (let i = 0; i < text.length; i++) {
      for (const line of glyphs[text[i]] || []) {
        const ax = centerX - total / 2 + i * advance + line[0] * glyphWidth;
        const ay = centerY - height / 2 + line[1] * height;
        const bx = centerX - total / 2 + i * advance + line[2] * glyphWidth;
        const by = centerY - height / 2 + line[3] * height;
        const length = Math.hypot(bx - ax, by - ay), half = height * 0.048;
        const nx = -(by - ay) / length * half, ny = (bx - ax) / length * half;
        positions.push(ax + nx, ay + ny, z, ax - nx, ay - ny, z, bx + nx, by + ny, z,
          ax - nx, ay - ny, z, bx - nx, by - ny, z, bx + nx, by + ny, z);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    const sign = mesh(geometry, paint, parent);
    sign.name = text;
    return sign;
  }
  box(world, [2.34, 0.39, 0.08], [-0.86, 1.95, 2.14], p.iron);
  box(world, [2.22, 0.30, 0.014], [-0.86, 1.95, 2.188], p.cream);
  lettering(world, 'ALDER HALT', 0.205, -0.86, 1.95, 2.199, p.dark);
  for (const x of [-1.87, 0.15]) {
    cylinder(world, [0.025, 0.032, 1.35], [x, 1.13, 2.14], p.iron, 7);
    cylinder(world, [0.048, 0.048, 0.055], [x, 0.47, 2.14], p.steel, 8);
  }
  box(world, [1.63, 0.24, 0.055], [3.05, 2.39, 2.80], p.cream);
  lettering(world, 'ALDER', 0.145, 3.05, 2.39, 2.832, p.dark);

  const clock = new THREE.Group(); clock.position.set(4.26, 1.99, 2.10); world.add(clock);
  const clockRim = cylinder(clock, [0.205, 0.205, 0.058], [0, 0, 0], p.dark, 24);
  clockRim.rotation.x = Math.PI / 2;
  const clockFace = cylinder(clock, [0.179, 0.179, 0.013], [0, 0, 0.038], p.cream, 24);
  clockFace.rotation.x = Math.PI / 2;
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6;
    const tick = box(clock, [0.013, i % 3 ? 0.020 : 0.035, 0.012],
      [Math.sin(a) * 0.151, Math.cos(a) * 0.151, 0.05], p.dark);
    tick.rotation.z = -a;
  }
  rod(clock, [0, 0, 0.06], [0.095, -0.055, 0.06], 0.010, p.dark, 5);
  rod(clock, [0, 0, 0.061], [-0.038, 0.078, 0.061], 0.013, p.dark, 5);
  rod(world, [4.26, 2.02, 2.11], [4.34, 2.02, 2.03], 0.025, p.steel);
  const bin = cylinder(world, [0.14, 0.115, 0.39], [4.18, 0.645, 1.20], p.iron, 12);
  cylinder(world, [0.15, 0.15, 0.045], [4.18, 0.857, 1.20], p.dark, 12);
  box(world, [0.115, 0.014, 0.070], [4.18, 0.884, 1.20], p.black);
  bin.name = 'platform litter bin';
  // A cream timetable with real panel thickness and restrained graphic rules.
  box(world, [0.35, 0.48, 0.07], [1.46, 1.47, 2.13], p.iron);
  box(world, [0.28, 0.39, 0.012], [1.46, 1.47, 2.173], p.paper);
  for (let i = 0; i < 5; i++) box(world, [0.19 - (i % 2) * 0.05, 0.010, 0.005], [1.45, 1.59 - i * 0.056, 2.183], p.stoneDark);

  // End-of-line buffer. There is deliberately no unexplained second exit.
  for (const z of [trackZ - 0.37, trackZ + 0.37]) {
    rod(world, [4.35, 0.12, z], [4.78, 0.60, z], 0.055, p.steel);
    rod(world, [4.94, 0.12, z], [4.78, 0.60, z], 0.055, p.steel);
  }
  box(world, [0.17, 0.20, 1.13], [4.75, 0.59, trackZ], p.timber);
  for (const z of [trackZ - 0.32, trackZ + 0.32]) {
    const pad = cylinder(world, [0.11, 0.11, 0.055], [4.63, 0.59, z], p.dark, 12);
    pad.rotation.z = Math.PI / 2;
  }
  const fencePosts = [];
  for (let x = -2.42; x < 4.35; x += 0.74) fencePosts.push([x, 0.31, -1.76, 0.055, 0.65, 0.060]);
  blocks('weathered boundary posts', fencePosts, p.timber);
  for (const y of [0.28, 0.51]) rod(world, [-2.45, y, -1.76], [4.30, y, -1.76], 0.012, p.steel, 5);

  // Deliberate clumps, with all grass blades sharing one geometry and one draw call.
  const grassGeometry = new THREE.BufferGeometry();
  grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -0.06,0,0, 0.015,0.20,0.018, 0.018,0,0.02,
    0,0,-0.05, -0.03,0.145,0.03, 0.025,0,0.06,
    0.04,0,-0.015, 0.10,0.12,0.025, 0.075,0,0.03,
  ], 3));
  grassGeometry.computeVertexNormals();
  const tufts = [];
  const patches = [[-1.4,-1.96,0.42,0.10], [2.5,-1.96,0.60,0.06],
    [4.98,0.34,0.18,0.42], [-0.75,2.90,0.35,0.05]];
  for (const [x,z,dx,dz] of patches) for (let i = 0; i < 10; i++) {
    const scale = 0.46 + random() * 0.60;
    tufts.push([x + (random() - 0.5) * dx * 2, 0.002, z + (random() - 0.5) * dz * 2,
      scale, scale, scale, 0, random() * 6.28, 0]);
  }
  blocks('sparse grass at the gravel boundary', tufts, material('#81896a', { side: THREE.DoubleSide }), grassGeometry);

  function tree(x, z, size) {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.scale.setScalar(size); world.add(group);
    rod(group, [0,0,0], [0.06,1.65,-0.02], 0.055, p.bark, 7);
    const crowns = [
      [-0.31,1.92,0.08,0.43,0.59,0.40], [0.16,2.23,-0.12,0.48,0.66,0.41],
      [0.45,1.83,0.12,0.41,0.53,0.36], [-0.02,1.72,0.37,0.42,0.43,0.35],
      [-0.10,2.58,-0.07,0.34,0.47,0.32], [0.29,2.47,0.09,0.32,0.44,0.32],
    ];
    crowns.forEach((c, i) => {
      rod(group, [0.025,1.14,0], [c[0],c[1],c[2]], 0.022, p.bark, 6);
      const crown = mesh(unitStone, [p.leaf,p.leafLight,p.leafDark][i % 3], group);
      crown.position.set(c[0],c[1],c[2]); crown.scale.set(c[3],c[4],c[5]); crown.rotation.set(0.2,i * 1.7,0.15);
    });
    return group;
  }
  tree(4.98, 0.62, 0.76).name = 'one small alder at the station boundary';

  // Compact, chamfered, double-ended railbus. Dark glazing is opaque model glazing;
  // the functioning platform-side doorway is an actual opening through the sidewall.
  const train = new THREE.Group(); train.name = 'railcar'; train.position.z = trackZ; world.add(train);
  const bodyPlan = [[-1.38,-0.37],[-1.20,-0.57],[1.17,-0.57],[1.38,-0.37],
    [1.38,0.37],[1.17,0.57],[-1.20,0.57],[-1.38,0.37]];
  slab(bodyPlan, 0.49, 0.405, p.dark, p.railcar, train);
  box(train, [2.33,0.12,0.83], [0,0.365,0], p.dark);
  // Near-side panels leave a clear 0.56m doorway centred on -0.48m.
  for (const [x,w] of [[-1.01,0.40],[0.54,1.48]]) {
    box(train, [w,0.42,0.050], [x,0.705,0.556], p.railcar);
    box(train, [w,0.065,0.065], [x,0.947,0.555], p.cream);
    box(train, [w,0.055,0.067], [x,0.835,0.557], p.carLine);
  }
  box(train, [2.38,0.42,0.052], [0,0.705,-0.556], p.railcar);
  box(train, [2.40,0.060,0.066], [0,0.947,-0.557], p.cream);
  box(train, [2.40,0.055,0.067], [0,0.835,-0.557], p.carLine);
  for (const z of [-0.555,0.555]) {
    for (const [x,w] of z > 0 ? [[-1.00,0.34],[0.08,0.39],[0.56,0.39],[1.00,0.29]]
      : [[-1.00,0.31],[-0.57,0.36],[-0.10,0.36],[0.37,0.36],[0.87,0.43]]) {
      box(train, [w,0.43,0.025], [x,1.232,z], p.window);
      box(train, [0.022,0.42,0.035], [x - w / 2 - 0.016,1.232,z], p.cream);
      box(train, [w,0.018,0.029], [x,1.04,z + Math.sign(z) * 0.004], p.windowLight);
    }
    const sideRails=z>0 ? [[-1.01,0.40],[0.54,1.48]] : [[0,2.40]];
    for (const [x,w] of sideRails) {
      box(train, [w,0.095,0.075], [x,1.505,z], p.cream);
      box(train, [w,0.046,0.075], [x,1.000,z], p.cream);
    }
  }
  for (const x of [-1.29,1.29]) {
    box(train, [0.16,0.43,0.80], [x,0.705,0], p.railcar);
    box(train, [0.063,0.12,0.94], [x * 1.045,0.965,0], p.cream);
    box(train, [0.044,0.45,0.82], [x * 1.046,1.233,0], p.window);
    box(train, [0.065,0.44,0.035], [x * 1.067,1.233,0], p.cream);
    box(train, [0.13,0.095,0.92], [x,1.505,0], p.cream);
    box(train, [0.14,0.11,0.28], [x * 1.13,0.335,0], p.dark);
    for (const z of [-0.36,0.36]) {
      const lampCase = cylinder(train, [0.077,0.077,0.035], [x * 1.065,0.73,z], p.dark, 12);
      lampCase.rotation.z = Math.PI / 2;
    }
    rod(train, [x * 1.065,1.05,-0.19], [x * 1.065,1.24,0.02], 0.009, p.dark, 5);
  }
  const arrivalLamp = material('#e8cc8c'), departureLamp = material('#aa6850');
  for (const side of [-1,1]) for (const z of [-0.36,0.36]) {
    const lamp = cylinder(train, [0.052,0.052,0.018], [side * 1.397,0.73,z], side > 0 ? arrivalLamp : departureLamp, 12);
    lamp.rotation.z = Math.PI / 2;
  }
  // Rolled roof section, not a box lid. One shallow eight-facet curve spans the car.
  const roofVertices = [];
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 8, b = a + Math.PI / 8;
    const za = Math.sin(a) * 0.62, zb = Math.sin(b) * 0.62;
    const ya = 1.55 + Math.cos(a) * 0.235, yb = 1.55 + Math.cos(b) * 0.235;
    roofVertices.push(-1.43,ya,za, 1.43,yb,zb, 1.43,ya,za, -1.43,ya,za, -1.43,yb,zb, 1.43,yb,zb);
    for (const end of [-1,1]) roofVertices.push(end*1.43,1.55,0, end*1.43,ya,za, end*1.43,yb,zb);
  }
  const carRoofGeometry = new THREE.BufferGeometry();
  carRoofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roofVertices, 3));
  carRoofGeometry.computeVertexNormals();
  mesh(carRoofGeometry, material('#46474b', { side: THREE.DoubleSide }), train);
  for (const x of [-0.76,0.68]) {
    box(train, [0.28,0.065,0.28], [x,1.798,0], p.roofSeam);
    for (let i = 0; i < 4; i++) box(train, [0.018,0.010,0.21], [x - 0.085 + i * 0.056,1.836,0], p.dark);
  }
  box(train, [0.25,0.18,0.024], [0.84,0.686,0.591], p.cream);
  lettering(train, '07', 0.126, 0.84, 0.686, 0.607, p.dark);
  const wheelSpinners = [];
  for (const x of [-0.88,0.88]) {
    rod(train, [x,0.352,-0.47], [x,0.352,0.47], 0.045, p.dark, 8);
    for (const z of [-0.37,0.37]) {
      const wheelAxle = new THREE.Group(); wheelAxle.position.set(x,0.352,z); wheelAxle.rotation.x = Math.PI / 2; train.add(wheelAxle);
      const wheel = cylinder(wheelAxle, [0.18,0.18,0.095], [0,0,0], p.dark, 16);
      wheelSpinners.push(wheel);
      cylinder(wheelAxle, [0.10,0.10,0.103], [0,0,0], p.steel, 12);
      box(train, [0.25,0.075,0.12], [x,0.48,z], p.dark);
    }
  }
  const doorLeaves = [];
  for (const side of [-1,1]) {
    const leaf = new THREE.Group(); leaf.position.set(-0.48 + side * 0.134,0,0.578); train.add(leaf);
    box(leaf, [0.262,1.02,0.047], [0,1.00,0], p.cream);
    box(leaf, [0.192,0.40,0.018], [0,1.263,0.033], p.window);
    box(leaf, [0.204,0.026,0.020], [0,1.046,0.035], p.cream);
    box(leaf, [0.025,0.11,0.030], [-side * 0.075,0.995,0.04], p.dark);
    doorLeaves.push(leaf);
  }
  box(train, [0.65,0.063,0.12], [-0.48,1.555,0.57], p.cream);
  const step = new THREE.Group(); step.position.set(-0.48,0.448,0.559); train.add(step);
  box(step, [0.57,0.036,0.24], [0,0,0.10], p.steel);
  for (let i = 0; i < 3; i++) box(step, [0.50,0.008,0.012], [0,0.022,0.025 + i * 0.065], p.railTop);

  // Persistent two-bone limbs. IK updates transforms only; no geometry or vector allocation.
  const up = new THREE.Vector3(0,1,0);
  const ikDirection = new THREE.Vector3(), ikPole = new THREE.Vector3(), ikJoint = new THREE.Vector3();
  const rodDelta = new THREE.Vector3();
  function placeRod(object, a, b, radius) {
    rodDelta.subVectors(b,a);
    const length = rodDelta.length();
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.scale.set(radius,Math.max(0.0001,length),radius);
    object.quaternion.setFromUnitVectors(up,rodDelta.multiplyScalar(1 / Math.max(0.0001,length)));
  }
  function twoBone(a,b,pole,l1,l2,upper,lower,radius) {
    ikDirection.subVectors(b,a);
    const d = Math.max(0.0001,ikDirection.length());
    ikDirection.multiplyScalar(1/d);
    ikPole.copy(pole).addScaledVector(ikDirection,-pole.dot(ikDirection)).normalize();
    const along = Math.max(0,Math.min(l1,(l1*l1-l2*l2+d*d)/(2*d)));
    const bend = Math.sqrt(Math.max(0,l1*l1-along*along));
    ikJoint.copy(a).addScaledVector(ikDirection,along).addScaledVector(ikPole,bend);
    placeRod(upper,a,ikJoint,radius);
    placeRod(lower,ikJoint,b,radius * 0.85);
  }
  function person(name, coat, capped) {
    const root = new THREE.Group(); root.name = name; world.add(root);
    const body = new THREE.Group(); root.add(body);
    const jacket = cylinder(body, [0.125,0.151,0.33], [0,0.19,0], coat, 8);
    jacket.rotation.y = Math.PI / 8;
    box(body, [0.18,0.075,0.16], [0,0.015,0], p.trousers);
    box(body, [0.027,0.18,0.014], [0,0.255,0.129], p.cream);
    const head = new THREE.Group(); head.position.set(0,0.445,0); body.add(head);
    cylinder(head, [0.042,0.046,0.06], [0,-0.045,0], p.skin, 8);
    const face = mesh(new THREE.IcosahedronGeometry(0.115,1), capped ? p.skin : p.skinLight, head);
    face.scale.set(0.85,1.07,0.86); face.position.y = 0.061;
    const hair = mesh(new THREE.SphereGeometry(0.112,8,5,0,Math.PI*2,0,Math.PI/2), capped ? p.dark : p.timber, head);
    hair.position.y = 0.094; hair.scale.set(0.90,0.65,0.88);
    if (capped) {
      cylinder(head, [0.119,0.106,0.065], [0,0.163,0], p.coat, 10);
      box(head, [0.145,0.022,0.085], [0,0.145,0.089], p.dark);
      box(body, [0.08,0.035,0.025], [-0.065,0.28,0.13], p.cream);
    } else {
      const scarf = cylinder(body, [0.075,0.082,0.065], [0,0.38,0], p.cream, 8);
      scarf.rotation.z = 0.08;
      box(body, [0.068,0.21,0.035], [0.06,0.245,0.144], p.cream);
      const satchel = box(body, [0.095,0.225,0.21], [0.192,0.035,0.015], p.bag);
      satchel.rotation.z = -0.08;
      box(body, [0.022,0.19,0.034], [0.244,0.03,0.015], p.strap);
      rod(body, [-0.11,0.345,0.13], [0.19,0.025,0.13], 0.016,p.strap,5);
    }
    const arms = [], legs = [], hands = [], shoes = [];
    for (const side of [-1,1]) {
      const upperArm = mesh(unitRod,coat,root), lowerArm = mesh(unitRod,coat,root);
      const hand = mesh(new THREE.IcosahedronGeometry(0.043,0),capped ? p.skin : p.skinLight,root);
      hands.push(hand); arms.push([upperArm,lowerArm]);
      const thigh = mesh(unitRod,p.trousers,root), shin = mesh(unitRod,p.trousers,root);
      const shoe = box(root,[0.090,0.075,0.165],[0,0,0],p.dark);
      shoes.push(shoe); legs.push([thigh,shin]);
    }
    return {root,body,head,hands,shoes,arms,legs,
      shoulders:[new THREE.Vector3(),new THREE.Vector3()], hips:[new THREE.Vector3(),new THREE.Vector3()],
      handTargets:[new THREE.Vector3(),new THREE.Vector3()], feet:[new THREE.Vector3(),new THREE.Vector3()],
      armPole:[new THREE.Vector3(-0.3,-1,0.1),new THREE.Vector3(0.3,-1,0.1)],
      legPole:new THREE.Vector3(0,0,1), hip:0.53, walk:null};
  }
  const attendant = person('attendant',p.coat,true);
  const traveler = person('passenger',p.traveler,false);
  const ticket = box(traveler.hands[0],[0.083,0.012,0.115],[0,0.035,0.047],p.paper);
  ticket.name = 'ticket stays in the passenger hand';
  box(ticket,[0.045,0.005,0.014],[0,0.009,0.010],p.rust);
  const punch = new THREE.Group(); attendant.hands[0].add(punch);
  punch.name = 'ticket punch';
  box(punch,[0.055,0.018,0.10],[0,0,0.025],p.steel);
  box(punch,[0.055,0.045,0.018],[0,0.022,-0.016],p.dark);
  const punchJaw = new THREE.Group(); punchJaw.position.set(0,0.040,-0.016); punch.add(punchJaw);
  punchJaw.name = 'hinged ticket punch jaw';
  box(punchJaw,[0.050,0.015,0.095],[0,0,0.040],p.steel);
  const paddle = new THREE.Group(); attendant.hands[1].add(paddle);
  rod(paddle,[0,0,0],[0,0.24,0],0.013,p.timber,6);
  const disc = cylinder(paddle,[0.098,0.098,0.023],[0,0.27,0],p.cream,16); disc.rotation.x = Math.PI / 2;
  const discCenter = cylinder(paddle,[0.041,0.041,0.026],[0,0.27,0.003],p.rust,12); discCenter.rotation.x = Math.PI / 2;

  const clamp01 = x => Math.max(0,Math.min(1,x));
  const ease = x => { const u=clamp01(x); return u*u*(3-2*u); };
  const ramp = (t,a,b) => ease((t-a)/(b-a));
  const mix = (a,b,u) => a+(b-a)*u;
  const angleMix = (a,b,u) => a + Math.atan2(Math.sin(b-a),Math.cos(b-a))*u;
  const pulse = (t,a,b,c,d) => ramp(t,a,b)*(1-ramp(t,c,d));

  // Walking paths are resampled at construction. During stance each foot stays at a fixed
  // world-space path contact, while its other foot swings to the next contact with clearance.
  const pathScratch = new THREE.Vector3(), footScratch = new THREE.Vector3();
  function walkPath(points,start,end,startYaw,endYaw) {
    const curve = new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)),false,'centripetal');
    const samples = curve.getSpacedPoints(160);
    let length=0;
    for(let i=1;i<samples.length;i++) length+=samples[i].distanceTo(samples[i-1]);
    const cycles=Math.max(1,Math.round(length/0.46));
    return {samples,length,start,end,startYaw,endYaw,stride:length/(cycles*2)};
  }
  function pathAt(path,distance,out) {
    const n=path.samples.length-1, f=clamp01(distance/path.length)*n;
    const i=Math.min(n-1,Math.floor(f));
    out.copy(path.samples[i]).lerp(path.samples[i+1],f-i);
    const a=path.samples[Math.max(0,i-1)],b=path.samples[Math.min(n,i+2)];
    let yaw=Math.atan2(b.x-a.x,b.z-a.z);
    yaw=angleMix(path.startYaw,yaw,ease(distance/0.26));
    return angleMix(yaw,path.endYaw,ease((distance-(path.length-0.26))/0.26));
  }
  const outOfCar=walkPath([[-0.48,0.49,-1.00],[-0.48,0.47,-0.20],[-0.48,0.44,0.58],
    [0.52,0.44,1.02]],12.4,18.1,0,0);
  const backToCar=walkPath([[0.52,0.44,1.02],[-0.48,0.44,0.58],[-0.48,0.47,-0.20],
    [-0.48,0.49,-1.00]],24.0,28.6,Math.PI,Math.PI);
  const masterToCheck=walkPath([[2.92,platformY,2.20],[2.05,platformY,1.42],[0.52,platformY,1.68]],5.6,9.8,Math.PI,Math.PI);
  const masterToSignal=walkPath([[0.52,platformY,1.68],[1.31,platformY,1.18],[1.80,platformY,0.73]],28.7,31.4,Math.PI,Math.PI*1.22);
  const masterToBench=walkPath([[1.80,platformY,0.73],[2.92,platformY,1.20],[2.92,platformY,2.20]],36.4,40.6,Math.PI*1.22,Math.PI);

  function standing(actor,x,y,z,yaw,sit=0) {
    actor.root.position.set(x,y,z); actor.root.rotation.set(0,yaw,0); actor.walk=null;
    actor.hip=mix(0.53,0.43,sit);
    for(let i=0;i<2;i++) actor.feet[i].set(i ? 0.085 : -0.085,0.05,sit*0.30);
  }
  function walking(actor,path,t) {
    const progress=ramp(t,path.start,path.end),distance=progress*path.length;
    const yaw=pathAt(path,distance,pathScratch);
    actor.root.position.copy(pathScratch); actor.root.rotation.set(0,yaw,0); actor.hip=0.53; actor.walk=path;
    const stride=path.stride,cycleLength=2*stride;
    for(let i=0;i<2;i++) {
      const shifted=distance-(i ? stride : 0);
      const cycle=Math.max(0,Math.floor(shifted/cycleLength));
      const local=Math.max(0,shifted-cycle*cycleLength);
      const from=cycle*cycleLength;
      const to=Math.min(path.length,from+cycleLength);
      const swing=shifted>=0 && local<stride;
      const u=swing ? ease(local/stride) : 1;
      // End contacts collapse onto the final stance; the root never drags a planted shoe.
      const contact=shifted<0 ? 0 : mix(from,to,u);
      const footYaw=pathAt(path,contact,footScratch);
      const side=i ? 0.085 : -0.085;
      footScratch.x+=Math.cos(footYaw)*side; footScratch.z-=Math.sin(footYaw)*side;
      footScratch.y+=0.05+(swing ? Math.sin(Math.PI*local/stride)*0.105 : 0);
      const dx=footScratch.x-actor.root.position.x,dz=footScratch.z-actor.root.position.z;
      actor.feet[i].set(Math.cos(yaw)*dx-Math.sin(yaw)*dz,footScratch.y-actor.root.position.y,
        Math.sin(yaw)*dx+Math.cos(yaw)*dz);
    }
    actor.gait=distance/stride*Math.PI;
  }
  function localPoint(actor,x,y,z,out) {
    const yaw=actor.root.rotation.y,dx=x-actor.root.position.x,dz=z-actor.root.position.z;
    out.set(Math.cos(yaw)*dx-Math.sin(yaw)*dz,y-actor.root.position.y,Math.sin(yaw)*dx+Math.cos(yaw)*dz);
  }
  function pose(actor,sit,headTurn) {
    actor.body.position.set(0,actor.hip,0);
    actor.body.rotation.set(0,0,0);
    actor.head.rotation.set(0,headTurn,0);
    for(let i=0;i<2;i++) {
      const side=i ? 1 : -1;
      actor.shoulders[i].set(side*0.145,actor.hip+0.285,0);
      actor.hips[i].set(side*0.077,actor.hip,0);
      actor.handTargets[i].set(side*0.18,actor.hip-0.055+sit*0.075,0.045+sit*0.22);
      if(actor.walk) actor.handTargets[i].z+=side*Math.sin(actor.gait)*0.085;
    }
  }
  function finishPose(actor) {
    for(let i=0;i<2;i++) {
      actor.hands[i].position.copy(actor.handTargets[i]);
      twoBone(actor.shoulders[i],actor.handTargets[i],actor.armPole[i],0.215,0.225,
        actor.arms[i][0],actor.arms[i][1],0.038);
      twoBone(actor.hips[i],actor.feet[i],actor.legPole,0.272,0.272,actor.legs[i][0],actor.legs[i][1],0.046);
      actor.shoes[i].position.copy(actor.feet[i]); actor.shoes[i].position.z+=0.031;
      actor.shoes[i].position.y-=0.0125;
      actor.shoes[i].rotation.set(0,0,0);
    }
  }

  const handScratch=new THREE.Vector3(), punchScratch=new THREE.Vector3();
  const warmColor=new THREE.Color('#e8cc8c'), tailColor=new THREE.Color('#aa6850');
  const phases=[
    {start:0,end:4,label:'A quiet halt; the attendant hears the branch train'},
    {start:4,end:10.6,label:'Railcar emerges from the stone tunnel and brakes'},
    {start:10.6,end:14.4,label:'Doors slide apart; the passenger steps onto the platform'},
    {start:14.4,end:19.6,label:'Passenger approaches and presents a ticket'},
    {start:19.6,end:24,label:'The attendant clips the ticket; a small nod'},
    {start:24,end:29.5,label:'Passenger returns aboard and the doorway closes'},
    {start:29.5,end:34,label:'A raised paddle clears the returning branch service'},
    {start:34,end:40.6,label:'Railcar retreats into the tunnel; the attendant walks back'},
    {start:40.6,end:45,label:'The attendant sits; the little station settles'},
  ];

  function update(timeSeconds) {
    if(!Number.isFinite(timeSeconds)) throw new TypeError('Station time must be a finite number of seconds.');
    const t=Math.max(0,Math.min(45,timeSeconds));
    const arrival=ramp(t,2.6,10.6),departure=ramp(t,32.3,39.7);
    const carX=mix(hiddenX,0,arrival)+hiddenX*departure;
    train.position.set(carX,0,trackZ);
    for(const wheel of wheelSpinners) wheel.rotation.y=-carX/0.18;
    const doorOpen=ramp(t,10.9,12.3)*(1-ramp(t,28.65,30.15));
    doorLeaves[0].position.x=-0.614-doorOpen*0.286;
    doorLeaves[1].position.x=-0.346+doorOpen*0.286;
    step.rotation.x=(1-doorOpen)*-Math.PI/2;
    const reverseLights=pulse(t,30.5,31.1,40.0,40.5);
    arrivalLamp.color.copy(warmColor).lerp(tailColor,reverseLights);
    departureLamp.color.copy(tailColor).lerp(warmColor,reverseLights);

    let sit=1-ramp(t,4.1,5.6)+ramp(t,40.6,42.1);
    sit=clamp01(sit);
    if(t<5.6) standing(attendant,2.92,platformY,2.20,Math.PI,sit);
    else if(t<9.8) walking(attendant,masterToCheck,t);
    else if(t<28.7) standing(attendant,0.52,platformY,1.68,Math.PI);
    else if(t<31.4) walking(attendant,masterToSignal,t);
    else if(t<36.4) standing(attendant,1.80,platformY,0.73,Math.PI*1.22);
    else if(t<40.6) walking(attendant,masterToBench,t);
    else standing(attendant,2.92,platformY,2.20,Math.PI,sit);
    const headTurn=-0.48*pulse(t,1.3,3.5,9.5,11.0)+0.28*pulse(t,32.0,33.0,37.0,38.2);
    pose(attendant,sit,headTurn);

    if(t<12.4) standing(traveler,carX-0.48,0.49,trackZ-0.28,0);
    else if(t<18.1) walking(traveler,outOfCar,t);
    else if(t<24.0) standing(traveler,0.52,platformY,1.02,angleMix(0,Math.PI,ramp(t,23.15,24.0)));
    else if(t<28.6) walking(traveler,backToCar,t);
    else standing(traveler,carX-0.48,0.49,trackZ-0.28,Math.PI*(1-ramp(t,40.1,42.0)));
    // A modest knee bend clears the low railcar lintel; stand upright once the head
    // is outside the door. The same spatial track works in either travel direction.
    traveler.hip-=0.15*(1-ramp(traveler.root.position.z,-0.08,0.30));
    pose(traveler,0,0);
    const present=pulse(t,18.0,19.6,22.7,23.3);
    localPoint(traveler,0.49,1.115,1.282,handScratch);
    traveler.handTargets[0].lerp(handScratch,present);
    traveler.head.rotation.x=0.12*pulse(t,21.9,22.25,22.6,23.0);
    traveler.head.rotation.y=0;
    finishPose(traveler);

    // The ticket never changes owner. The punch approaches its actual upper surface,
    // closes there, and withdraws. This keeps both contacts independent of seek order.
    const inspect=pulse(t,19.7,20.6,21.7,22.35);
    traveler.root.updateMatrixWorld(true);
    ticket.localToWorld(handScratch.set(0,-0.006,0.015));
    const attendantYaw=attendant.root.rotation.y;
    localPoint(attendant,handScratch.x-Math.sin(attendantYaw)*0.055,handScratch.y-0.009,
      handScratch.z-Math.cos(attendantYaw)*0.055,punchScratch);
    attendant.handTargets[0].lerp(punchScratch,inspect);
    punchJaw.rotation.x=mix(-0.18,0.16,pulse(t,20.85,21.12,21.36,21.62));
    const signal=pulse(t,30.8,32.0,35.4,36.3);
    attendant.handTargets[1].lerp(handScratch.set(0.28,0.91,0.10),signal);
    finishPose(attendant);
    // A minute bell and paddle motion at departure, subordinate to the actual train story.
    paddle.rotation.set(0,0,-0.15*signal+0.055*Math.sin((t-31.4)*7)*pulse(t,31.4,31.6,32.0,32.3));
  }

  update(0);
  // Includes the entire parked car, the continuous tunnel and all standing/raised poses.
  const bounds=new THREE.Box3(new THREE.Vector3(-6.90,-0.27,-2.90),new THREE.Vector3(5.95,3.00,3.30));
  return {world,update,bounds,target:[-0.40,0.90,0.10],stillTime:20.95,startTime:0,duration:45,loop:false,phases};
}
