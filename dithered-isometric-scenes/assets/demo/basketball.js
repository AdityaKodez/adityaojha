import { THREE, box, cylinder, rod, material, makeRandom } from '../diorama-runtime.js';

// A reconstruction of the bundled Shawn / Small plays reference, not its assets.
// All positions are local to the miniature; the host owns the white stage.
export function buildBasketball() {
  const world = new THREE.Group();
  world.name = 'outdoor-half-court';
  const random = makeRandom(84137);
  const TAU = Math.PI * 2;
  const COURT_Y = 0.066;
  const FLOOR_Y = 0.069;
  const DURATION = 45;
  const DRIBBLE_SECONDS = 0.8;
  const BALL_RADIUS = 0.11;

  const paints = {
    earth: material('#655943'),
    grass: material('#5b7048'),
    concrete: material('#797c6d'),
    asphalt: material('#3c4341'),
    key: material('#2d5367'),
    chalk: material('#bcbba3'),
    steel: material('#283a37'),
    steelEdge: material('#3b4943'),
    board: material('#b5bba8'),
    rust: material('#a85235'),
    net: material('#bdbba4'),
    wood: material('#865b3c'),
    woodLight: material('#a07249'),
    woodDark: material('#6f4e36'),
    bin: material('#354f60'),
    dark: material('#252f2b'),
    ball: material('#be6530', { flatShading: true }),
    ballSeam: material('#4d3828'),
    shoe: material('#c6c4ad'),
    sole: material('#414942'),
    sock: material('#b8bbaa'),
  };

  function mesh(parent, geometry, paint, name) {
    const object = new THREE.Mesh(geometry, paint);
    object.castShadow = object.receiveShadow = true;
    if (name) object.name = name;
    parent.add(object);
    return object;
  }

  // Combine small surface details into ordinary meshes. This keeps the grass
  // inexpensive and compatible with the runtime's geometry/material disposal.
  function triangles(parent, positions, colors, name, shadows = false) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    const paint = material('#ffffff', { vertexColors: true, side: THREE.DoubleSide });
    const object = mesh(parent, geometry, paint, name);
    object.castShadow = shadows;
    return object;
  }

  function triangle(positions, colors, a, b, c, color) {
    positions.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b);
  }

  // The soil slice is only about one percent of the tile's width. A broken
  // perimeter and actual blades replace a perfectly rectangular green border.
  const perimeter = [];
  const edgeSteps = 48;
  for (let i = 0; i < edgeSteps; i++) {
    perimeter.push([-5.05 + (10.1 * i) / edgeSteps, -4.37 - random() * 0.10]);
  }
  for (let i = 0; i < edgeSteps; i++) {
    perimeter.push([5.05 + random() * 0.10, -4.37 + (8.74 * i) / edgeSteps]);
  }
  for (let i = 0; i < edgeSteps; i++) {
    perimeter.push([5.05 - (10.1 * i) / edgeSteps, 4.37 + random() * 0.10]);
  }
  for (let i = 0; i < edgeSteps; i++) {
    perimeter.push([-5.05 - random() * 0.10, 4.37 - (8.74 * i) / edgeSteps]);
  }
  const outline = new THREE.Shape();
  perimeter.forEach(([x, z], index) => {
    if (index === 0) outline.moveTo(x, -z);
    else outline.lineTo(x, -z);
  });
  outline.closePath();
  const ground = mesh(world, new THREE.ExtrudeGeometry(outline, {
    depth: 0.105,
    bevelEnabled: false,
    steps: 1,
  }), [paints.grass, paints.earth], 'thin-irregular-ground');
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.112;

  box(world, [9.24, 0.078, 7.98], [0, -0.012, 0], paints.concrete).name = 'concrete-apron';
  box(world, [8.98, 0.039, 7.76], [0, COURT_Y - 0.0195, 0], paints.asphalt).name = 'asphalt';
  box(world, [3.32, 0.004, 3.43], [0, COURT_Y + 0.002, -1.635], paints.key).name = 'blue-painted-key';

  const grassColors = ['#53663d', '#657a49', '#758653', '#485f3d', '#879265']
    .map(color => new THREE.Color(color));
  const grassPositions = [];
  const grassVertexColors = [];
  const soilPositions = [];
  const soilColors = [];
  const dryEarth = [new THREE.Color('#74664b'), new THREE.Color('#85785a')];
  for (let i = 0; i < 820; i++) {
    const x = (random() - 0.5) * 10.16;
    const z = (random() - 0.5) * 8.80;
    if (Math.abs(x) < 4.65 && Math.abs(z) < 4.02) continue;
    const height = 0.045 + random() * 0.14;
    const width = 0.022 + random() * 0.035;
    const angle = random() * TAU;
    const dx = Math.cos(angle) * width;
    const dz = Math.sin(angle) * width;
    const color = grassColors[Math.floor(random() * grassColors.length)];
    const tip = [x + (random() - 0.5) * 0.065, height, z + (random() - 0.5) * 0.06];
    triangle(grassPositions, grassVertexColors, [x - dx, -0.005, z - dz], [x + dx, -0.005, z + dz], tip, color);
    triangle(grassPositions, grassVertexColors, [x - dz, -0.005, z + dx], [x + dz, -0.005, z - dx], tip, color);
    if (i % 3 === 0) {
      const spread = 0.04 + random() * 0.11;
      triangle(soilPositions, soilColors,
        [x - spread, -0.004, z], [x + spread, -0.004, z - 0.05], [x, -0.004, z + spread], dryEarth[i % 2]);
    }
  }
  triangles(world, soilPositions, soilColors, 'small-dry-earth-patches');
  triangles(world, grassPositions, grassVertexColors, 'rough-grass-blades', true);

  const flecks = [];
  const fleckColors = [];
  const aggregateColors = ['#444b46', '#353c39', '#4a5048', '#3f4641'].map(color => new THREE.Color(color));
  const paintWear = new THREE.Color('#38576a');
  for (let i = 0; i < 530; i++) {
    const x = (random() - 0.5) * 8.87;
    const z = (random() - 0.5) * 7.65;
    const inKey = Math.abs(x) < 1.66 && z > -3.35 && z < 0.08;
    const size = 0.008 + random() * 0.035;
    const y = COURT_Y + (inKey ? 0.0047 : 0.0007);
    triangle(flecks, fleckColors,
      [x, y, z], [x + size, y, z + size * 0.25], [x - size * 0.4, y, z + size],
      inKey ? paintWear : aggregateColors[i % aggregateColors.length]);
  }
  triangles(world, flecks, fleckColors, 'fine-asphalt-and-paint-wear');

  // Flat ribbon geometry makes all court lines the same physical width.
  const linePositions = [];
  const lineY = COURT_Y + 0.006;
  function courtLine(points, width = 0.036) {
    for (let i = 1; i < points.length; i++) {
      const [ax, az] = points[i - 1];
      const [bx, bz] = points[i];
      const length = Math.hypot(bx - ax, bz - az);
      if (length < 0.00001) continue;
      const nx = (-(bz - az) / length) * width / 2;
      const nz = ((bx - ax) / length) * width / 2;
      linePositions.push(
        ax + nx, lineY, az + nz, bx + nx, lineY, bz + nz, bx - nx, lineY, bz - nz,
        ax + nx, lineY, az + nz, bx - nx, lineY, bz - nz, ax - nx, lineY, az - nz,
      );
    }
  }
  function courtArc(x, z, radius, start, end, segments = 64) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = start + ((end - start) * i) / segments;
      points.push([x + Math.cos(angle) * radius, z + Math.sin(angle) * radius]);
    }
    courtLine(points);
  }
  courtLine([[-4.02, -3.35], [4.02, -3.35], [4.02, 3.40], [-4.02, 3.40], [-4.02, -3.35]]);
  courtLine([[-1.66, -3.35], [-1.66, 0.08], [1.66, 0.08], [1.66, -3.35]]);
  courtArc(0, 0.08, 1.15, 0, Math.PI);
  // The back half of the free-throw circle is dashed over the paint.
  for (let i = 0; i < 8; i++) courtArc(0, 0.08, 1.15, Math.PI + i * Math.PI / 8, Math.PI + (i + 0.55) * Math.PI / 8, 5);
  const arcRadius = 3.84;
  const cornerX = 3.66;
  const joinAngle = Math.acos(cornerX / arcRadius);
  const cornerZ = -2.66 + Math.sin(joinAngle) * arcRadius;
  courtLine([[-cornerX, -3.35], [-cornerX, cornerZ]]);
  courtLine([[cornerX, -3.35], [cornerX, cornerZ]]);
  courtArc(0, -2.66, arcRadius, joinAngle, Math.PI - joinAngle, 100);
  courtArc(0, 3.40, 0.73, Math.PI, TAU, 32);
  courtArc(0, -2.66, 0.65, 0, Math.PI, 28);
  for (const z of [-2.65, -2.12, -1.27, -0.70]) {
    courtLine([[-1.66, z], [-1.87, z]], 0.03);
    courtLine([[1.66, z], [1.87, z]], 0.03);
  }
  const markings = new THREE.BufferGeometry();
  markings.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  markings.computeVertexNormals();
  const courtMarkings = mesh(world, markings, paints.chalk, 'cream-court-markings');
  // Ribbons are assembled in XZ order, so show both sides without relying on
  // winding. They receive the same real shadows as the asphalt underneath.
  courtMarkings.material.side = THREE.DoubleSide;
  courtMarkings.castShadow = false;

  // Narrow, broken cracks stay on the apron and outer asphalt, away from play.
  for (const path of [
    [[-4.30, 0.9], [-4.16, 1.1], [-4.26, 1.38], [-4.14, 1.57]],
    [[2.83, 3.66], [2.59, 3.58], [2.38, 3.70], [2.19, 3.63]],
    [[-3.49, -3.62], [-3.22, -3.53], [-3.12, -3.65]],
  ]) {
    for (let i = 1; i < path.length; i++) {
      rod(world, [path[i - 1][0], COURT_Y + 0.001, path[i - 1][1]],
        [path[i][0], COURT_Y + 0.001, path[i][1]], 0.008, paints.dark, 4).castShadow = false;
    }
  }

  // A braced steel post, solid backboard, target square, rim and diamond net.
  const hoop = new THREE.Group();
  hoop.name = 'hoop-and-net';
  world.add(hoop);
  box(hoop, [0.45, 0.075, 0.44], [0, 0.045, -3.64], paints.concrete);
  box(hoop, [0.17, 3.16, 0.17], [0, 1.65, -3.64], paints.steel);
  box(hoop, [0.22, 0.55, 0.23], [0, 0.36, -3.64], paints.steelEdge);
  rod(hoop, [0, 3.08, -3.64], [0, 3.08, -3.04], 0.057, paints.steel);
  rod(hoop, [0, 2.28, -3.64], [0, 2.87, -3.06], 0.042, paints.steel);
  rod(hoop, [-0.05, 2.94, -3.51], [-0.48, 2.94, -3.08], 0.025, paints.steel);
  rod(hoop, [0.05, 2.94, -3.51], [0.48, 2.94, -3.08], 0.025, paints.steel);
  box(hoop, [1.42, 0.84, 0.075], [0, 2.94, -3.045], paints.rust);
  box(hoop, [1.32, 0.74, 0.026], [0, 2.94, -2.994], paints.board);
  const targetZ = -2.975;
  for (const x of [-0.285, 0.285]) box(hoop, [0.025, 0.35, 0.014], [x, 2.805, targetZ], paints.rust);
  for (const y of [2.63, 2.98]) box(hoop, [0.595, 0.025, 0.014], [0, y, targetZ], paints.rust);
  for (const x of [-0.59, 0.59]) {
    for (const y of [2.64, 3.24]) {
      const bolt = cylinder(hoop, [0.022, 0.022, 0.012], [x, y, -2.974], paints.steelEdge, 6);
      bolt.rotation.x = Math.PI / 2;
    }
  }
  const rimY = 2.62;
  const rimZ = -2.66;
  box(hoop, [0.14, 0.055, 0.14], [0, rimY, -2.92], paints.rust);
  const rim = mesh(hoop, new THREE.TorusGeometry(0.255, 0.021, 6, 32), paints.rust, 'rust-orange-rim');
  rim.rotation.x = Math.PI / 2;
  rim.position.set(0, rimY, rimZ);
  const net = new THREE.Group();
  net.name = 'woven-net';
  hoop.add(net);
  const netSegments = 12;
  for (let row = 0; row < 3; row++) {
    const topRadius = 0.238 - row * 0.035;
    const bottomRadius = 0.238 - (row + 1) * 0.035;
    const topY = rimY - 0.018 - row * 0.105;
    const bottomY = topY - 0.105;
    const phase = row * Math.PI / netSegments;
    for (let i = 0; i < netSegments; i++) {
      const angle = (i / netSegments) * TAU + phase;
      for (const direction of [-1, 1]) {
        const next = angle + direction * Math.PI / netSegments;
        rod(net,
          [Math.cos(angle) * topRadius, topY, rimZ + Math.sin(angle) * topRadius],
          [Math.cos(next) * bottomRadius, bottomY, rimZ + Math.sin(next) * bottomRadius],
          0.0065, paints.net, 4);
      }
    }
  }
  const netHem = mesh(net, new THREE.TorusGeometry(0.133, 0.007, 4, 20), paints.net);
  netHem.rotation.x = Math.PI / 2;
  netHem.position.set(0, rimY - 0.333, rimZ);

  const bench = new THREE.Group();
  bench.name = 'slatted-timber-bench';
  bench.position.set(-2.32, 0.005, -4.07);
  world.add(bench);
  for (const x of [-0.80, 0.80]) {
    for (const z of [-0.18, 0.18]) rod(bench, [x, 0.035, z], [x, 0.41, z * 0.8], 0.036, paints.steel);
    rod(bench, [x, 0.34, 0.18], [x, 0.80, -0.27], 0.027, paints.steel);
    box(bench, [0.14, 0.025, 0.45], [x, 0.025, 0], paints.steel);
  }
  rod(bench, [-0.80, 0.20, 0], [0.80, 0.20, 0], 0.026, paints.steel);
  for (let i = 0; i < 4; i++) {
    box(bench, [2.16, 0.065, 0.085], [0, 0.435, -0.16 + i * 0.108], i % 2 ? paints.wood : paints.woodLight);
  }
  for (const y of [0.645, 0.785]) {
    const slat = box(bench, [2.16, 0.106, 0.055], [0, y, -0.26 - (y - 0.645) * 0.15], paints.wood);
    slat.rotation.x = -0.10;
  }
  for (const x of [-0.80, 0.80]) {
    for (const z of [-0.15, 0.17]) {
      cylinder(bench, [0.014, 0.014, 0.007], [x, 0.471, z], paints.woodDark, 5);
    }
  }
  // A folded towel and bottle are small enough to remain subordinate.
  box(bench, [0.30, 0.023, 0.29], [0.43, 0.48, -0.02], paints.chalk);
  box(bench, [0.30, 0.13, 0.022], [0.43, 0.42, 0.125], paints.chalk);
  cylinder(bench, [0.043, 0.046, 0.19], [-0.72, 0.565, 0.03], paints.bin, 8);
  cylinder(bench, [0.030, 0.030, 0.025], [-0.72, 0.674, 0.03], paints.chalk, 8);

  const bin = new THREE.Group();
  bin.name = 'open-courtside-bin';
  bin.position.set(-0.81, 0.007, -4.12);
  world.add(bin);
  mesh(bin, new THREE.CylinderGeometry(0.225, 0.19, 0.51, 10, 1, true), paints.bin).position.y = 0.265;
  cylinder(bin, [0.202, 0.202, 0.012], [0, 0.47, 0], paints.dark, 10);
  const binLip = mesh(bin, new THREE.TorusGeometry(0.222, 0.023, 5, 10), paints.steel);
  binLip.rotation.x = Math.PI / 2;
  binLip.position.y = 0.52;
  for (let i = 0; i < 10; i++) {
    const a = i * TAU / 10;
    rod(bin, [Math.cos(a) * 0.193, 0.055, Math.sin(a) * 0.193],
      [Math.cos(a) * 0.22, 0.49, Math.sin(a) * 0.22], 0.008, paints.steelEdge, 4);
  }
  const bag = new THREE.Group();
  bag.name = 'gym-bag';
  bag.position.set(-0.23, 0.015, -4.12);
  world.add(bag);
  box(bag, [0.41, 0.24, 0.28], [0, 0.12, 0], paints.dark);
  box(bag, [0.29, 0.02, 0.20], [0, 0.247, 0], paints.steelEdge);
  rod(bag, [-0.11, 0.23, 0], [-0.09, 0.34, 0], 0.018, paints.dark);
  rod(bag, [-0.09, 0.34, 0], [0.09, 0.34, 0], 0.018, paints.dark);
  rod(bag, [0.09, 0.34, 0], [0.11, 0.23, 0], 0.018, paints.dark);

  const jointGeometry = new THREE.SphereGeometry(1, 8, 6);
  const headGeometry = new THREE.SphereGeometry(0.113, 10, 8);
  const hairGeometry = new THREE.SphereGeometry(0.116, 10, 5, 0, TAU, 0, Math.PI * 0.49);
  const up = new THREE.Vector3(0, 1, 0);
  const segmentDirection = new THREE.Vector3();

  function segment(parent, radius, paint) {
    return rod(parent, [0, 0, 0], [0, 1, 0], radius, paint, 7);
  }
  function setSegment(object, a, b) {
    segmentDirection.subVectors(b, a);
    const length = segmentDirection.length();
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.scale.y = length;
    object.quaternion.setFromUnitVectors(up, segmentDirection.multiplyScalar(1 / length));
  }
  function joint(parent, radius, paint, name) {
    const object = mesh(parent, jointGeometry, paint, name);
    object.scale.setScalar(radius);
    return object;
  }

  // A true two-bone joint: endpoints touch their targets while the elbow/knee
  // keeps a chosen bend direction. No geometry is allocated during animation.
  const jointDirection = new THREE.Vector3();
  const jointBend = new THREE.Vector3();
  function solveJoint(a, b, upperLength, lowerLength, bend, output) {
    jointDirection.subVectors(b, a);
    const actualDistance = jointDirection.length();
    const distance = Math.max(0.0001, Math.min(actualDistance, upperLength + lowerLength - 0.0001));
    jointDirection.multiplyScalar(1 / Math.max(actualDistance, 0.0001));
    const along = (upperLength * upperLength - lowerLength * lowerLength + distance * distance) / (2 * distance);
    const height = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
    jointBend.copy(bend).addScaledVector(jointDirection, -bend.dot(jointDirection)).normalize();
    output.copy(a).addScaledVector(jointDirection, along).addScaledVector(jointBend, height);
  }

  function jerseyGeometry() {
    const geometry = new THREE.BufferGeometry();
    const corners = [
      [-0.135, -0.17, -0.090], [0.135, -0.17, -0.090], [0.135, -0.17, 0.090], [-0.135, -0.17, 0.090],
      [-0.185, 0.17, -0.105], [0.185, 0.17, -0.105], [0.185, 0.17, 0.105], [-0.185, 0.17, 0.105],
    ];
    const faces = [0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0, 4, 7, 6, 4, 6, 5, 0, 1, 2, 0, 2, 3];
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(faces.flatMap(index => corners[index]), 3));
    geometry.computeVertexNormals();
    return geometry;
  }
  const jerseyShape = jerseyGeometry();
  const numberSegments = {
    3: ['top', 'middle', 'bottom', 'upperRight', 'lowerRight'],
    5: ['top', 'upperLeft', 'middle', 'lowerRight', 'bottom'],
    7: ['top', 'upperRight', 'lowerRight'],
  };
  function jerseyNumber(parent, value, paint) {
    const coordinates = {
      top: [0, 0.075, true], middle: [0, 0.02, true], bottom: [0, -0.035, true],
      upperLeft: [-0.035, 0.048, false], upperRight: [0.035, 0.048, false],
      lowerLeft: [-0.035, -0.008, false], lowerRight: [0.035, -0.008, false],
    };
    for (const side of [-1, 1]) {
      for (const key of numberSegments[value]) {
        const [x, y, horizontal] = coordinates[key];
        box(parent, horizontal ? [0.080, 0.016, 0.012] : [0.016, 0.056, 0.012], [x, y, side * 0.108], paint);
      }
    }
  }

  function makePlayer({ name, x, z, yaw, skin, shirt, shorts, hair, number, stance }) {
    const root = new THREE.Group();
    root.name = name;
    root.position.set(x, FLOOR_Y, z);
    root.rotation.y = yaw;
    world.add(root);
    const skinPaint = material(skin);
    const shirtPaint = material(shirt);
    const shortsPaint = material(shorts);
    const hairPaint = material(hair);
    const body = new THREE.Group();
    body.name = `${name}-upper-body`;
    root.add(body);
    mesh(body, jerseyShape, shirtPaint);
    jerseyNumber(body, number, paints.chalk);
    for (const side of [-1, 1]) {
      const seam = box(body, [0.022, 0.29, 0.188], [side * 0.151, -0.015, 0], paints.chalk);
      seam.rotation.z = -side * 0.13;
    }
    const collar = mesh(body, new THREE.TorusGeometry(0.061, 0.013, 4, 12), paints.chalk);
    collar.rotation.x = Math.PI / 2;
    collar.scale.z = 0.72;
    collar.position.set(0, 0.174, -0.01);
    cylinder(body, [0.043, 0.044, 0.075], [0, 0.204, 0], skinPaint);
    const head = new THREE.Group();
    head.position.set(0, 0.310, -0.014);
    body.add(head);
    const face = mesh(head, headGeometry, skinPaint);
    face.scale.set(0.88, 1, 0.92);
    mesh(head, hairGeometry, hairPaint).position.y = 0.016;
    const nose = joint(head, 0.024, skinPaint);
    nose.position.set(0, -0.009, -0.103);
    nose.scale.set(0.022, 0.026, 0.028);
    for (const side of [-1, 1]) {
      const ear = joint(head, 0.022, skinPaint);
      ear.position.set(side * 0.10, -0.006, 0);
      ear.scale.y = 0.029;
    }
    const waist = box(root, [0.28, 0.105, 0.195], [0, 0.63, 0], shortsPaint);
    const legs = [];
    const arms = [];
    for (const side of [-1, 1]) {
      const footX = side * stance;
      const footZ = side < 0 ? -0.095 : 0.095;
      const shoe = new THREE.Group();
      shoe.position.set(footX, 0, footZ);
      shoe.rotation.y = -side * 0.16;
      root.add(shoe);
      box(shoe, [0.145, 0.025, 0.256], [0, 0.015, -0.036], paints.sole);
      box(shoe, [0.132, 0.068, 0.235], [0, 0.056, -0.036], paints.shoe);
      box(shoe, [0.087, 0.014, 0.072], [0, 0.095, -0.035], paints.sock);
      cylinder(shoe, [0.047, 0.045, 0.115], [0, 0.147, 0], paints.sock);
      shoe.name = `${name}-${side > 0 ? 'right' : 'left'}-shoe`;
      legs.push({
        side, shoe, footX, footZ,
        ankle: new THREE.Vector3(footX, 0.155, footZ),
        hip: new THREE.Vector3(), knee: new THREE.Vector3(), hem: new THREE.Vector3(),
        thigh: segment(root, 0.056, skinPaint), calf: segment(root, 0.043, skinPaint),
        shorts: segment(root, 0.080, shortsPaint), cap: joint(root, 0.055, skinPaint),
      });
      arms.push({
        side,
        shoulder: new THREE.Vector3(), elbow: new THREE.Vector3(), hand: new THREE.Vector3(),
        upper: segment(root, 0.041, skinPaint), lower: segment(root, 0.033, skinPaint),
        cap: joint(root, 0.043, skinPaint), shoulderCap: joint(root, 0.047, skinPaint),
        palm: joint(root, 0.039, skinPaint, `${name}-${side > 0 ? 'right' : 'left'}-palm`),
        bend: new THREE.Vector3(side * 0.7, -0.5, 0.75),
      });
    }
    const kneeBend = new THREE.Vector3(0, 0, -1);
    const leftHand = arms[0].hand;
    const rightHand = arms[1].hand;
    for (const arm of arms) {
      arm.upper.name = `${name}-${arm.side > 0 ? 'right' : 'left'}-upper-arm`;
      arm.lower.name = `${name}-${arm.side > 0 ? 'right' : 'left'}-forearm`;
    }
    function pose(sway, dip, lean, headTurn, headTilt) {
      // Lower the pelvis slightly over a wide planted step rather than
      // stretching a shin to make an unreachable ankle appear connected.
      for (const leg of legs) {
        const dx = leg.shoe.position.x - (sway * 0.6 + leg.side * 0.105);
        const dz = leg.shoe.position.z - 0.01;
        const rise = Math.sqrt(Math.max(0, 0.578 ** 2 - dx * dx - dz * dz));
        dip = Math.min(dip, leg.shoe.position.y + 0.155 + rise - 0.626);
      }
      body.position.set(sway, 0.815 + dip, -0.018);
      body.rotation.set(lean, 0, -sway * 0.48);
      head.rotation.set(headTilt, headTurn, 0);
      waist.position.set(sway * 0.6, 0.626 + dip, 0.01);
      for (const leg of legs) {
        leg.ankle.copy(leg.shoe.position);
        leg.ankle.y += 0.155;
        leg.hip.set(sway * 0.6 + leg.side * 0.105, 0.626 + dip, 0.01);
        solveJoint(leg.hip, leg.ankle, 0.285, 0.295, kneeBend, leg.knee);
        setSegment(leg.thigh, leg.hip, leg.knee);
        setSegment(leg.calf, leg.knee, leg.ankle);
        leg.hem.copy(leg.hip).lerp(leg.knee, 0.66);
        setSegment(leg.shorts, leg.hip, leg.hem);
        leg.cap.position.copy(leg.knee);
      }
      for (const arm of arms) {
        arm.shoulder.set(arm.side * 0.185, 0.125, 0).applyEuler(body.rotation).add(body.position);
        solveJoint(arm.shoulder, arm.hand, 0.27, 0.27, arm.bend, arm.elbow);
        setSegment(arm.upper, arm.shoulder, arm.elbow);
        setSegment(arm.lower, arm.elbow, arm.hand);
        arm.cap.position.copy(arm.elbow);
        arm.shoulderCap.position.copy(arm.shoulder);
        arm.palm.position.copy(arm.hand);
        arm.palm.scale.set(0.038, 0.032, 0.045);
      }
    }
    return { root, leftHand, rightHand, pose, legs, stance, initial: [x, z, yaw] };
  }

  const handler = makePlayer({
    name: 'ball-handler', x: -0.48, z: 0.61, yaw: -0.15,
    skin: '#ad8059', shirt: '#365c4c', shorts: '#2c4137', hair: '#2b3028', number: 3, stance: 0.205,
  });
  const defender = makePlayer({
    name: 'red-defender', x: -1.56, z: -0.18, yaw: -2.25,
    skin: '#76543e', shirt: '#9c4839', shorts: '#313936', hair: '#242a25', number: 7, stance: 0.275,
  });
  const wing = makePlayer({
    name: 'yellow-wing', x: 2.03, z: 1.80, yaw: 1.08,
    skin: '#bf9365', shirt: '#b59843', shorts: '#36576b', hair: '#5b4b31', number: 5, stance: 0.19,
  });
  const ball = new THREE.Group();
  ball.name = 'dribbling-ball';
  // Ownership is authored in world space. Reparenting at a pass would make
  // seeking depend on which frames had already run.
  world.add(ball);
  mesh(ball, new THREE.SphereGeometry(BALL_RADIUS, 16, 10), paints.ball);
  // Three intersecting seams and an offset panel ring read as a basketball
  // even when the whole ball is only a few logical pixels wide.
  const seamGeometry = new THREE.TorusGeometry(0.108, 0.002, 4, 40);
  mesh(ball, seamGeometry, paints.ballSeam);
  mesh(ball, seamGeometry, paints.ballSeam).rotation.y = Math.PI / 2;
  mesh(ball, seamGeometry, paints.ballSeam).rotation.x = Math.PI / 2;
  const panelSeam = mesh(ball, new THREE.TorusGeometry(0.0935, 0.002, 4, 32), paints.ballSeam);
  panelSeam.rotation.y = Math.PI / 2;
  panelSeam.position.x = 0.055;

  const contactPaint = new THREE.MeshBasicMaterial({
    color: '#202d28', transparent: true, opacity: 0.12, depthWrite: false,
  });
  const contactShadow = mesh(world, new THREE.CircleGeometry(0.13, 20), contactPaint, 'ball-contact-shadow');
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.castShadow = contactShadow.receiveShadow = false;

  // Beat sheet: read -> draw the defense -> pass -> gather -> score ->
  // retrieve -> return -> acknowledge -> reset. The final held composition
  // is also the opening pose, so the host can loop the complete story.
  const phases = [
    { start: 0, end: 5.6, label: 'Read the court' },
    { start: 5.6, end: 9.1, label: 'Draw the defender' },
    { start: 9.1, end: 11.6, label: 'Find the open wing' },
    { start: 11.6, end: 17.8, label: 'Step in and set the shot' },
    { start: 17.8, end: 19.38, label: 'Up and through the hoop' },
    { start: 19.38, end: 22.2, label: 'Follow the bounce' },
    { start: 22.2, end: 28.8, label: 'Return the ball' },
    { start: 28.8, end: 35.3, label: 'Good shot' },
    { start: 35.3, end: DURATION, label: 'Reset and settle' },
  ];
  const PASS = 10.2;
  const RECEIVE = 11.05;
  const SHOT = 17.8;
  const SCORE = 19.2;
  const NET_EXIT = 19.38;
  const RETRIEVE = 20.35;
  const RETURN = 26.3;
  const RETURN_CATCH = 27.05;
  const GRAVITY = 7.2;
  const ballFloor = FLOOR_Y + BALL_RADIUS;
  const sideContact = BALL_RADIUS + 0.038;
  const topContact = BALL_RADIUS + 0.032;

  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const u = clamp(value); return u * u * (3 - 2 * u); };
  const progress = (t, start, end) => smooth((t - start) / (end - start));
  const window = (t, start, inEnd, outStart, end) =>
    progress(t, start, inEnd) * (1 - progress(t, outStart, end));
  const lerp = (a, b, u) => a + (b - a) * u;
  const angleLerp = (a, b, u) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * u;

  // All tracks hold their first/last key outside their interval. No events,
  // frame deltas, or previously sampled poses participate in reconstruction.
  function sample(keys, t, output) {
    let previous = keys[0];
    for (let i = 1; i < keys.length; i++) {
      const next = keys[i];
      if (t < next[0]) {
        const u = progress(t, previous[0], next[0]);
        for (let j = 0; j < output.length; j++) output[j] = lerp(previous[1][j], next[1][j], u);
        return output;
      }
      previous = next;
    }
    for (let j = 0; j < output.length; j++) output[j] = previous[1][j];
    return output;
  }

  function pointAt(frame, local, output, y = FLOOR_Y) {
    const c = Math.cos(frame[2]);
    const s = Math.sin(frame[2]);
    return output.set(frame[0] + local[0] * c + local[2] * s, y + local[1],
      frame[1] - local[0] * s + local[2] * c);
  }
  function toLocal(player, point, output) {
    const c = Math.cos(player.root.rotation.y);
    const s = Math.sin(player.root.rotation.y);
    const x = point.x - player.root.position.x;
    const z = point.z - player.root.position.z;
    return output.set(x * c - z * s, point.y - player.root.position.y, x * s + z * c);
  }
  function toCourt(player, local, output) {
    const c = Math.cos(player.root.rotation.y);
    const s = Math.sin(player.root.rotation.y);
    return output.set(player.root.position.x + local[0] * c + local[2] * s,
      player.root.position.y + local[1], player.root.position.z - local[0] * s + local[2] * c);
  }

  const handlerPass = [-0.85, 0.05, Math.atan2(-2.65, -0.50)];
  const wingReceive = [1.8, 0.55, Math.atan2(2.65, 0.50)];
  const wingShoot = [1.1, -0.45, Math.atan2(1.1, 2.21)];
  const handlerReturn = [-0.85, 0.05, -Math.atan2(1.25, 1.45)];
  const defenderReturn = [0.4, -1.4, Math.atan2(1.25, -1.45)];
  const handlerFive = [-0.85, 0.05, Math.atan2(-0.89, -0.15)];
  const wingFive = [0.04, 0.20, Math.atan2(0.89, 0.15)];
  const passFrom = pointAt(handlerPass, [0, 0.95, -0.45], new THREE.Vector3());
  const passTo = pointAt(wingReceive, [0, 0.94, -0.38], new THREE.Vector3());
  const returnFrom = pointAt(defenderReturn, [0, 0.95, -0.45], new THREE.Vector3());
  const returnTo = pointAt(handlerReturn, [0, 0.92, -0.36], new THREE.Vector3());
  const shotFrom = pointAt(wingShoot, [0.04, 1.34, -0.27], new THREE.Vector3(), FLOOR_Y + 0.08);
  const scorePoint = new THREE.Vector3(0, rimY, rimZ);
  const shotLength = SCORE - SHOT;
  const shotVelocity = scorePoint.clone().sub(shotFrom).multiplyScalar(1 / shotLength);
  shotVelocity.y += GRAVITY * shotLength / 2;
  const rimVelocity = shotVelocity.clone();
  rimVelocity.y -= GRAVITY * shotLength;
  // The yielding net brakes the horizontal motion before the ball drops
  // into the paint. Hermite endpoints preserve incoming/outgoing velocity.
  const netExitPoint = new THREE.Vector3(-0.045, 1.95, -2.72);
  const netExitVelocity = new THREE.Vector3(-0.08, -3.5, 0.55);
  const dropLength = (netExitVelocity.y + Math.sqrt(netExitVelocity.y ** 2 +
    2 * GRAVITY * (netExitPoint.y - ballFloor))) / GRAVITY;
  const IMPACT = NET_EXIT + dropLength;
  const groundPoint = netExitPoint.clone().addScaledVector(netExitVelocity, dropLength);
  groundPoint.y = ballFloor;
  const reboundVelocity = netExitVelocity.clone();
  reboundVelocity.y = (GRAVITY * dropLength - netExitVelocity.y) * 0.51;
  const retrievePoint = groundPoint.clone().addScaledVector(reboundVelocity, RETRIEVE - IMPACT);
  retrievePoint.y -= GRAVITY * (RETRIEVE - IMPACT) ** 2 / 2;
  const retrieveYaw = -0.6;
  const retrieveFrame = [retrievePoint.x + 0.36 * Math.sin(retrieveYaw),
    retrievePoint.z + 0.36 * Math.cos(retrieveYaw), retrieveYaw];
  const retrieveHeight = retrievePoint.y - FLOOR_Y;

  // Each move has alternating, world-space foot plants. Supporting feet
  // stay on the court while the body advances; only the swinging shoe lifts.
  // Turns use short pivot steps, rather than rotating both planted feet.
  function footAt(frame, leg) {
    const foot = pointAt(frame, [leg.footX, 0, leg.footZ], new THREE.Vector3());
    return [foot.x, foot.z, frame[2] - leg.side * 0.16];
  }
  function choreograph(player, entries) {
    let from = player.initial;
    player.moves = [];
    player.steps = player.legs.map(leg => ({ leg, initial: footAt(from, leg), events: [] }));
    for (const [start, end, to, count] of entries) {
      player.moves.push({ start, end, from, to });
      const previousFeet = player.steps.map(track => footAt(from, track.leg));
      for (let i = 0; i < count; i++) {
        const index = i % 2;
        const u = smooth(i >= count - 2 ? 1 : (i + 1.5) / count);
        const frame = [lerp(from[0], to[0], u), lerp(from[1], to[1], u), angleLerp(from[2], to[2], u)];
        const destination = footAt(frame, player.steps[index].leg);
        player.steps[index].events.push({
          start: lerp(start, end, i / count), end: lerp(start, end, (i + 1) / count),
          from: previousFeet[index], to: destination,
        });
        previousFeet[index] = destination;
      }
      from = to;
    }
  }
  choreograph(handler, [
    [5.6, 8.0, [-0.85, 0.05, -0.15], 6],
    [8.25, 9.1, handlerPass, 2],
    [23.4, 25.0, handlerReturn, 2],
    [29.0, 30.0, handlerFive, 2],
    [38.0, 39.0, [-0.85, 0.05, -0.15], 2],
    [39.0, 43.0, handler.initial, 4],
  ]);
  choreograph(wing, [
    [5.4, 7.8, wingReceive, 6],
    [11.6, 12.4, [1.8, 0.55, wingShoot[2]], 2],
    [12.4, 14.8, wingShoot, 6],
    [29.0, 31.4, wingFive, 6],
    [35.0, 36.0, [0.04, 0.2, -Math.atan2(1.99, 1.6)], 2],
    [36.0, 41.8, [2.03, 1.8, -Math.atan2(1.99, 1.6)], 10],
    [41.8, 43.2, wing.initial, 2],
  ]);
  choreograph(defender, [
    [5.9, 8.3, [-0.4, -0.55, 2.5], 4],
    [9.4, 12.0, [0.55, -0.55, -1.4], 4],
    [13.3, 15.0, [0.25, -1.35, -2.385], 4],
    [18.9, 20.15, retrieveFrame, 4],
    [22.2, 24.4, defenderReturn, 4],
    [28.8, 29.8, [0.4, -1.4, Math.atan2(0.805, -1.525)], 2],
    [35.3, 36.3, [0.4, -1.4, Math.atan2(1.96, -1.22)], 2],
    [36.3, 41.5, [-1.56, -0.18, Math.atan2(1.96, -1.22)], 10],
    [41.5, 43.2, defender.initial, 2],
  ]);

  function placePlayer(player, t, jump = 0) {
    let x = player.initial[0];
    let z = player.initial[1];
    let yaw = player.initial[2];
    for (const move of player.moves) {
      if (t < move.start) break;
      const u = progress(t, move.start, move.end);
      x = lerp(move.from[0], move.to[0], u);
      z = lerp(move.from[1], move.to[1], u);
      yaw = angleLerp(move.from[2], move.to[2], u);
      if (t < move.end) break;
      yaw = move.to[2];
    }
    player.root.position.set(x, FLOOR_Y + jump, z);
    player.root.rotation.set(0, yaw, 0);
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    for (const track of player.steps) {
      let footX = track.initial[0];
      let footZ = track.initial[1];
      let footYaw = track.initial[2];
      let lift = 0;
      for (const step of track.events) {
        if (t < step.start) break;
        const phase = clamp((t - step.start) / (step.end - step.start));
        const u = smooth(phase);
        footX = lerp(step.from[0], step.to[0], u);
        footZ = lerp(step.from[1], step.to[1], u);
        footYaw = angleLerp(step.from[2], step.to[2], u);
        lift = 0.075 * Math.sin(Math.PI * phase) ** 2;
        if (t < step.end) break;
      }
      track.leg.shoe.position.set((footX - x) * c - (footZ - z) * s, lift,
        (footX - x) * s + (footZ - z) * c);
      track.leg.shoe.rotation.set(0, footYaw - yaw, 0);
    }
  }

  const handlerBall = [
    [0, [0.32, 0.8, -0.2]], [8.1, [0.32, 0.8, -0.2]],
    [9.1, [0, 0.88, -0.32]], [9.7, [0, 0.82, -0.28]], [PASS, [0, 0.95, -0.45]],
  ];
  const wingBall = [
    [RECEIVE, [0, 0.94, -0.38]], [11.7, [0, 0.90, -0.32]],
    [12.4, [0.32, 0.8, -0.2]], [14.8, [0.32, 0.8, -0.2]],
    [15.5, [0, 0.89, -0.32]], [16.4, [0, 0.79, -0.32]],
    [17.1, [0.035, 1.13, -0.23]], [SHOT, [0.04, 1.34, -0.27]],
  ];
  const defenderBall = [
    [RETRIEVE, [0, retrieveHeight, -0.36]], [20.6, [0, retrieveHeight - 0.06, -0.35]],
    [21.2, [0, 0.85, -0.32]], [25.4, [0, 0.85, -0.32]],
    [25.85, [0, 0.81, -0.30]], [RETURN, [0, 0.95, -0.45]],
  ];
  const returnedBall = [
    [RETURN_CATCH, [0, 0.92, -0.36]], [27.7, [0, 0.86, -0.30]],
    [29.0, [-0.24, 0.82, -0.20]], [34.5, [-0.24, 0.82, -0.20]],
    [35.3, [0, 0.86, -0.30]], [36.3, [0.32, 0.8, -0.20]], [DURATION, [0.32, 0.8, -0.20]],
  ];
  const handlerHands = [
    [0, [-0.30, 0.86, -0.24, 0.32, 0.8 + topContact, -0.20]],
    [9.7, [-0.30, 0.86, -0.24, 0.30, 0.86, -0.24]],
    [PASS, [-sideContact, 0.95, -0.45, sideContact, 0.95, -0.45]],
    [10.6, [-0.20, 0.97, -0.47, 0.20, 0.97, -0.47]],
    [11.6, [-0.30, 0.86, -0.24, 0.30, 0.86, -0.24]],
    [24.5, [-0.30, 0.86, -0.24, 0.30, 0.86, -0.24]],
    [25.7, [-sideContact, 0.92, -0.36, sideContact, 0.92, -0.36]],
    [RETURN_CATCH, [-sideContact, 0.92, -0.36, sideContact, 0.92, -0.36]],
    [29.0, [-0.25, 0.85, -0.22, 0.29, 0.96, -0.26]],
    [35.3, [-0.25, 0.85, -0.22, 0.29, 0.96, -0.26]],
    [43.2, [-0.30, 0.86, -0.24, 0.32, 0.8 + topContact, -0.20]],
  ];
  const wingHands = [
    [0, [-0.26, 1.10, -0.23, 0.26, 0.76, -0.22]],
    [3.8, [-0.26, 1.10, -0.23, 0.26, 0.76, -0.22]],
    [4.8, [-0.24, 1.24, -0.21, 0.28, 0.85, -0.24]],
    [7.8, [-0.18, 0.95, -0.36, 0.18, 0.95, -0.36]],
    [RECEIVE, [-sideContact, 0.94, -0.38, sideContact, 0.94, -0.38]],
    [15.5, [-0.26, 0.88, -0.24, 0.30, 0.86, -0.24]],
    [SHOT, [0.04 - sideContact, 1.34, -0.27, 0.04, 1.34 - topContact, -0.27]],
    [18.05, [-0.24, 1.20, -0.15, 0.04, 1.30, -0.28]],
    [19.8, [-0.25, 0.90, -0.20, 0.04, 1.30, -0.28]],
    [21.2, [-0.26, 0.92, -0.23, 0.26, 0.86, -0.22]],
    [35.0, [-0.26, 0.92, -0.23, 0.26, 0.86, -0.22]],
    [43.2, [-0.26, 1.10, -0.23, 0.26, 0.76, -0.22]],
  ];
  const defenderHands = [
    [0, [-0.36, 0.87, -0.23, 0.36, 0.91, -0.23]],
    [12.0, [-0.36, 0.87, -0.23, 0.36, 0.91, -0.23]],
    [16.4, [-0.28, 1.25, -0.27, 0.32, 1.15, -0.25]],
    [18.4, [-0.28, 1.25, -0.27, 0.32, 1.15, -0.25]],
    [19.9, [-0.18, 0.72, -0.32, 0.18, 0.72, -0.32]],
    [RETRIEVE, [-sideContact, retrieveHeight, -0.36, sideContact, retrieveHeight, -0.36]],
    [25.4, [-0.25, 0.88, -0.24, 0.25, 0.88, -0.24]],
    [RETURN, [-sideContact, 0.95, -0.45, sideContact, 0.95, -0.45]],
    [26.65, [-0.20, 0.97, -0.47, 0.20, 0.97, -0.47]],
    [27.6, [-0.26, 0.90, -0.24, 0.26, 0.90, -0.24]],
    [35.0, [-0.26, 0.90, -0.24, 0.26, 0.90, -0.24]],
    [43.2, [-0.36, 0.87, -0.23, 0.36, 0.91, -0.23]],
  ];
  // Pose keys are sway, knee dip, torso lean, head turn, and head pitch.
  const handlerPoses = [
    [0, [0, -0.02, -0.07, 0, 0]], [3.8, [0, -0.02, -0.07, 0, 0]],
    [4.8, [-0.018, -0.025, -0.08, -0.24, 0]],
    [8.0, [0, -0.035, -0.10, -0.1, 0]], [9.7, [0, -0.065, -0.08, 0, 0]],
    [PASS, [0, -0.01, -0.04, 0, 0]], [11.6, [0, -0.02, -0.07, 0, 0]],
    [17.8, [0, -0.02, -0.04, -0.18, -0.24]], [20.2, [0, -0.02, -0.04, -0.18, -0.24]],
    [22.0, [0, -0.02, -0.07, 0, 0]], [RETURN_CATCH, [0, -0.04, -0.10, 0, 0]],
    [29.0, [0, -0.02, -0.07, 0, 0]], [32.5, [0, -0.02, -0.04, 0, 0.08]],
    [33.1, [0, -0.02, -0.04, 0, -0.07]], [34.5, [0, -0.02, -0.07, 0, 0]],
    [43.2, [0, -0.02, -0.07, 0, 0]],
  ];
  const wingPoses = [
    [0, [0, -0.009, -0.045, 0, 0]], [11.7, [0, -0.025, -0.06, 0, 0]],
    [14.8, [0, -0.035, -0.07, 0, 0]], [16.4, [0, -0.10, -0.13, 0, -0.08]],
    [17.1, [0, -0.10, -0.08, 0, -0.18]], [SHOT, [0, -0.01, -0.02, 0, -0.25]],
    [18.18, [0, -0.07, -0.03, 0, -0.25]], [18.7, [0, -0.009, -0.02, 0, -0.25]],
    [20.4, [0, -0.009, -0.02, 0, -0.25]], [21.4, [0, -0.009, -0.045, 0, 0.10]],
    [22.1, [0, -0.009, -0.045, 0, 0]], [32.5, [0, -0.009, -0.045, 0, 0]],
    [33.2, [0, -0.009, -0.045, 0, 0.12]], [34.0, [0, -0.009, -0.045, 0, 0]],
    [43.2, [0, -0.009, -0.045, 0, 0]],
  ];
  const defenderPoses = [
    [0, [0, -0.07, -0.12, 0, 0]], [15.0, [0, -0.07, -0.12, 0, 0]],
    [17.8, [0, -0.025, -0.05, 0, -0.26]], [18.8, [0, -0.025, -0.05, 0, -0.26]],
    [19.9, [0, -0.10, -0.14, 0, 0.12]], [20.6, [0, -0.13, -0.16, 0, 0.12]],
    [21.2, [0, -0.035, -0.06, 0, 0]], [25.85, [0, -0.055, -0.08, 0, 0]],
    [RETURN, [0, -0.01, -0.04, 0, 0]], [27.6, [0, -0.035, -0.06, 0, 0]],
    [31.1, [0, -0.035, -0.06, -0.12, 0.06]], [34.0, [0, -0.035, -0.06, 0, 0]],
    [43.2, [0, -0.07, -0.12, 0, 0]],
  ];
  const spinKeys = [
    [0, [0]], [2.0, [0]], [3.6, [2]], [5.6, [2]], [8.0, [5]],
    [PASS, [5.25]], [RECEIVE, [6]], [12.4, [6]], [14.8, [9]],
    [SHOT, [9.25]], [NET_EXIT, [11.25]], [RETRIEVE, [12]],
    [RETURN, [12]], [RETURN_CATCH, [13]], [43.2, [14]],
  ];
  const localValues = [0, 0, 0];
  const handValues = [0, 0, 0, 0, 0, 0];
  const poseValues = [0, 0, 0, 0, 0];
  const spinValue = [0];
  const localBall = new THREE.Vector3();
  const handTarget = new THREE.Vector3();
  const contactNormal = new THREE.Vector3();
  const meeting = new THREE.Vector3();
  const meetingNormal = new THREE.Vector3();

  // Move the existing net's pivot to its rim without changing its rest shape.
  for (const child of net.children) {
    child.position.y -= rimY;
    child.position.z -= rimZ;
  }
  net.position.set(0, rimY, rimZ);

  function attachment(player, keys, t) {
    sample(keys, t, localValues);
    toCourt(player, localValues, ball.position);
  }
  function dribble(t, start, end) {
    if (t <= start || t >= end) return;
    const cycle = ((t - start) / DRIBBLE_SECONDS) % 1;
    const flight = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2;
    ball.position.y -= (ball.position.y - ballFloor) * flight * flight;
  }
  function ballisticPass(t, start, end, from, to) {
    const u = clamp((t - start) / (end - start));
    ball.position.copy(from).lerp(to, u);
    ball.position.y += GRAVITY * (end - start) ** 2 * u * (1 - u) / 2;
  }
  function fall(from, velocity, elapsed) {
    ball.position.copy(from).addScaledVector(velocity, elapsed);
    ball.position.y -= GRAVITY * elapsed * elapsed / 2;
  }
  function throughNet(t) {
    const length = NET_EXIT - SCORE;
    const u = (t - SCORE) / length;
    const u2 = u * u;
    const u3 = u2 * u;
    ball.position.copy(scorePoint).multiplyScalar(2 * u3 - 3 * u2 + 1)
      .addScaledVector(rimVelocity, (u3 - 2 * u2 + u) * length)
      .addScaledVector(netExitPoint, -2 * u3 + 3 * u2)
      .addScaledVector(netExitVelocity, (u3 - u2) * length);
  }
  function hands(player, keys, t) {
    sample(keys, t, handValues);
    player.leftHand.set(handValues[0], handValues[1], handValues[2]);
    player.rightHand.set(handValues[3], handValues[4], handValues[5]);
  }
  function touch(hand, nx, ny, nz, weight = 1) {
    contactNormal.set(nx, ny, nz).normalize();
    const palmRadius = Math.hypot(0.038 * contactNormal.x, 0.032 * contactNormal.y, 0.045 * contactNormal.z);
    handTarget.copy(localBall).addScaledVector(contactNormal, BALL_RADIUS + palmRadius);
    hand.lerp(handTarget, weight);
  }
  function pose(player, keys, t) {
    sample(keys, t, poseValues);
    player.pose(...poseValues);
  }

  function update(timeSeconds) {
    if (!Number.isFinite(timeSeconds)) throw new TypeError('Basketball scene time must be finite.');
    const t = Math.max(0, Math.min(timeSeconds, DURATION));
    placePlayer(handler, t);
    placePlayer(defender, t);
    placePlayer(wing, t, 0.08 * window(t, 17.35, SHOT, SHOT, 18.18));
    hands(handler, handlerHands, t);
    hands(wing, wingHands, t);
    hands(defender, defenderHands, t);

    if (t < PASS) {
      attachment(handler, handlerBall, t);
      dribble(t, 2.0, 3.6);
      dribble(t, 5.6, 8.0);
      toLocal(handler, ball.position, localBall);
      const gather = progress(t, 8.1, 9.1);
      touch(handler.rightHand, gather, 1 - gather, 0);
      handler.rightHand.y = Math.max(0.59, handler.rightHand.y);
      touch(handler.leftHand, -1, 0, 0, gather);
    } else if (t < RECEIVE) {
      ballisticPass(t, PASS, RECEIVE, passFrom, passTo);
    } else if (t < SHOT) {
      attachment(wing, wingBall, t);
      dribble(t, 12.4, 14.8);
      toLocal(wing, ball.position, localBall);
      const down = window(t, 11.7, 12.4, 14.8, 15.5);
      const shooting = progress(t, 16.4, 17.4);
      touch(wing.rightHand, (1 - down) * (1 - shooting), down - shooting, 0);
      wing.rightHand.y = Math.max(0.59, wing.rightHand.y);
      touch(wing.leftHand, -1, 0, 0, 1 - down);
    } else if (t < SCORE) {
      fall(shotFrom, shotVelocity, t - SHOT);
    } else if (t < NET_EXIT) {
      throughNet(t);
    } else if (t < IMPACT) {
      fall(netExitPoint, netExitVelocity, t - NET_EXIT);
    } else if (t < RETRIEVE) {
      fall(groundPoint, reboundVelocity, t - IMPACT);
    } else if (t < RETURN) {
      attachment(defender, defenderBall, t);
      toLocal(defender, ball.position, localBall);
      touch(defender.leftHand, -1, 0, 0);
      touch(defender.rightHand, 1, 0, 0);
    } else if (t < RETURN_CATCH) {
      ballisticPass(t, RETURN, RETURN_CATCH, returnFrom, returnTo);
    } else {
      attachment(handler, returnedBall, t);
      toLocal(handler, ball.position, localBall);
      const cradle = window(t, 27.7, 29.0, 34.5, 35.3);
      const reset = progress(t, 35.3, 36.3);
      touch(handler.leftHand, -(1 - cradle), -cradle, 0, 1 - reset);
      touch(handler.rightHand, 1 - reset, reset, 0, 1 - cradle);
    }

    const five = window(t, 31.7, 32.5, 33.0, 33.8);
    meeting.copy(handler.root.position).add(wing.root.position).multiplyScalar(0.5);
    meeting.y = 1.16;
    meetingNormal.subVectors(wing.root.position, handler.root.position);
    meetingNormal.y = 0;
    meetingNormal.normalize();
    // Palm faces meet, while the handler keeps the ball in the other hand.
    handTarget.copy(meeting).addScaledVector(meetingNormal, -0.045);
    toLocal(handler, handTarget, contactNormal);
    handler.rightHand.lerp(contactNormal, five);
    handTarget.copy(meeting).addScaledVector(meetingNormal, 0.045);
    toLocal(wing, handTarget, contactNormal);
    wing.rightHand.lerp(contactNormal, five);
    const clap = Math.max(window(t, 30.1, 30.5, 30.65, 31.1), window(t, 32.8, 33.1, 33.3, 33.7));
    handTarget.set(-0.038, 1.01, -0.25);
    defender.leftHand.lerp(handTarget, clap);
    handTarget.x = 0.038;
    defender.rightHand.lerp(handTarget, clap);

    pose(handler, handlerPoses, t);
    pose(wing, wingPoses, t);
    pose(defender, defenderPoses, t);
    sample(spinKeys, t, spinValue);
    ball.rotation.set((spinValue[0] - Math.floor(spinValue[0])) * TAU, 0, 0);
    const swish = window(t, SCORE - 0.025, 19.30, NET_EXIT, 20.2);
    net.scale.set(1 + 0.5 * swish, 1 + 0.16 * swish, 1 + 0.6 * swish);
    net.rotation.x = 0.045 * swish * Math.sin((t - SCORE) * 12);
    const height = Math.max(0, ball.position.y - ballFloor);
    const shadowScale = 0.9 + 0.55 * clamp(height / 1.7);
    contactShadow.position.set(ball.position.x, FLOOR_Y + 0.007, ball.position.z);
    contactShadow.scale.set(shadowScale, shadowScale * 0.8, 1);
    contactPaint.opacity = 0.19 / (1 + height * 2);
  }

  const stillTime = 18.65;
  update(0);
  // A fixed envelope includes the complete shot apex, not just frame zero.
  const bounds = new THREE.Box3(
    new THREE.Vector3(-5.25, -0.14, -4.56),
    new THREE.Vector3(5.25, 4.2, 4.56),
  );
  return { world, update, bounds, target: [0, 0.8, 0], stillTime,
    startTime: 0, duration: DURATION, loop: false, phases };
}
