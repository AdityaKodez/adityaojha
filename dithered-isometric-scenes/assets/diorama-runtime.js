import * as THREE from 'three';

export { THREE };

export const material = (color, options = {}) => new THREE.MeshLambertMaterial({ color, ...options });

export function box(parent, size, position, paint) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), paint);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function cylinder(parent, size, position, paint, segments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(...size, segments), paint);
  mesh.position.set(...position);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function rod(parent, from, to, radius, paint, segments = 6) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const delta = b.clone().sub(a);
  const mesh = cylinder(parent, [radius, radius, delta.length()], a.add(b).multiplyScalar(0.5).toArray(), paint, segments);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return mesh;
}

export function makeRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function disposeWorld(world) {
  const geometries = new Set();
  const paints = new Set();
  const textures = new Set();
  world.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    for (const paint of Array.isArray(node.material) ? node.material : node.material ? [node.material] : []) {
      paints.add(paint);
      for (const value of Object.values(paint)) if (value?.isTexture) textures.add(value);
    }
  });
  for (const geometry of geometries) geometry.dispose();
  for (const texture of textures) texture.dispose();
  for (const paint of paints) paint.dispose();
}

const fragmentShader = /* glsl */ `
  uniform sampler2D tScene;
  uniform float levels;
  uniform float dither;
  varying vec2 vUv;

  float bayer(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    if (y == 0) {
      if (x == 0) return 0.0; if (x == 1) return 8.0;
      if (x == 2) return 2.0; return 10.0;
    }
    if (y == 1) {
      if (x == 0) return 12.0; if (x == 1) return 4.0;
      if (x == 2) return 14.0; return 6.0;
    }
    if (y == 2) {
      if (x == 0) return 3.0; if (x == 1) return 11.0;
      if (x == 2) return 1.0; return 9.0;
    }
    if (x == 0) return 15.0; if (x == 1) return 7.0;
    if (x == 2) return 13.0; return 5.0;
  }

  vec3 toSRGB(vec3 linearColor) {
    vec3 low = linearColor * 12.92;
    vec3 high = 1.055 * pow(max(linearColor, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(high, low, lessThanEqual(linearColor, vec3(0.0031308)));
  }

  void main() {
    vec3 color = clamp(toSRGB(texture2D(tScene, vUv).rgb), 0.0, 1.0);
    if (min(min(color.r, color.g), color.b) > 0.999) {
      gl_FragColor = vec4(1.0);
      return;
    }
    float threshold = ((bayer(gl_FragCoord.xy) + 0.5) / 16.0 - 0.5) * dither;
    color = floor(color * levels + 0.5 + threshold) / levels;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

/** Mount into a sized HTML element. World geometry belongs exclusively to this stage. */
export function createDiorama(container, options = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch (error) {
    options.onError?.('This browser could not start WebGL2. Please use a browser with graphics support.');
    throw error;
  }
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', options.label || 'An animated isometric miniature scene.');
  Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' });
  container.append(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#ffffff');
  scene.add(new THREE.HemisphereLight('#f8f1df', '#8b9992', 1.8));
  const key = new THREE.DirectionalLight('#fff4df', 2.5);
  key.position.set(-5, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 0.1, far: 40 });
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.025;
  scene.add(key);

  const camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 100);
  const target = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
  target.texture.generateMipmaps = false;
  const post = new THREE.Scene();
  const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const pass = new THREE.ShaderMaterial({
    uniforms: { tScene: { value: target.texture }, levels: { value: 8 }, dither: { value: 0.85 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pass);
  post.add(quad);

  let world = null;
  let update = () => {};
  let bounds = null;
  let targetPoint = new THREE.Vector3(0, 0.6, 0);
  let pixelSize = 2;
  let time = 1.2;
  let duration = Infinity;
  let loop = false;
  let ended = false;
  let completionNotified = false;
  let completeWorld = null;
  let frame = 0;
  let last = 0;
  let visible = true;
  let lost = false;
  let disposed = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !motion.matches;
  let requestedPlaying = playing;
  let userChoseMotion = false;
  const clamp = (value, min, max, fallback) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;

  function fit() {
    if (!world || !bounds) return;
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const aspect = width / height;
    camera.position.copy(targetPoint).add(new THREE.Vector3(12, 10, 12));
    camera.lookAt(targetPoint);
    camera.updateMatrixWorld(true);
    const viewBounds = new THREE.Box3();
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          viewBounds.expandByPoint(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
        }
      }
    }
    const size = viewBounds.getSize(new THREE.Vector3());
    const center = viewBounds.getCenter(new THREE.Vector3());
    const halfHeight = Math.max(size.y / 2, size.x / (2 * aspect), 0.1) / 0.86;
    camera.left = center.x - halfHeight * aspect;
    camera.right = center.x + halfHeight * aspect;
    camera.top = center.y + halfHeight;
    camera.bottom = center.y - halfHeight;
    camera.updateProjectionMatrix();
    const logicalWidth = Math.max(1, Math.round(width / pixelSize));
    const logicalHeight = Math.max(1, Math.round(height / pixelSize));
    renderer.setSize(logicalWidth, logicalHeight, false);
    target.setSize(logicalWidth, logicalHeight);
  }

  function render() {
    if (disposed || lost || !world) return;
    update(time);
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(post, postCamera);
    options.onTimeChange?.({ time, duration, ended });
  }

  function cancel() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }

  function tick(now) {
    frame = 0;
    if (disposed || lost || !playing || !visible || document.hidden) { last = 0; return; }
    if (last) time += Math.min((now - last) / 1000, 0.05);
    last = now;
    if (Number.isFinite(duration) && time >= duration) {
      if (loop) time %= duration;
      else {
        time = duration;
        ended = true;
        playing = false;
        last = 0;
        options.onPlayingChange?.(false);
      }
    }
    render();
    if (ended && !completionNotified) {
      completionNotified = true;
      completeWorld?.();
      options.onComplete?.();
    }
    schedule();
  }

  function schedule() {
    if (!frame && !disposed && !lost && playing && visible && !document.hidden && world) frame = requestAnimationFrame(tick);
  }

  function visibilityChanged() {
    cancel();
    if (visible && !document.hidden) { render(); schedule(); }
  }

  const resize = new ResizeObserver(() => { fit(); render(); });
  resize.observe(container);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    visibilityChanged();
  });
  intersection.observe(container);
  document.addEventListener('visibilitychange', visibilityChanged);

  function motionChanged() {
    if (userChoseMotion) return;
    playing = !motion.matches;
    requestedPlaying = playing;
    cancel();
    options.onPlayingChange?.(playing);
    render();
    schedule();
  }
  motion.addEventListener('change', motionChanged);

  const fallback = document.createElement('p');
  fallback.setAttribute('role', 'status');
  fallback.textContent = 'The graphics connection was interrupted. Restoring the miniature...';
  fallback.hidden = true;
  container.append(fallback);
  function contextLost(event) {
    event.preventDefault();
    lost = true;
    cancel();
    fallback.hidden = false;
    canvas.hidden = true;
    canvas.style.display = 'none';
    options.onError?.(fallback.textContent);
  }
  function contextRestored() {
    lost = false;
    fallback.hidden = true;
    canvas.hidden = false;
    canvas.style.display = 'block';
    fit();
    render();
    schedule();
  }
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);

  const api = {
    get playing() { return playing; },
    get currentTime() { return time; },
    get duration() { return duration; },
    get loop() { return loop; },
    get ended() { return ended; },
    setWorld(next, settings = {}) {
      if (disposed) throw new Error('Cannot replace a disposed diorama.');
      if (!next?.isObject3D) throw new TypeError('The miniature world must be a Three.js Object3D.');
      const nextDuration = settings.duration ?? Infinity;
      if (!(nextDuration === Infinity || (Number.isFinite(nextDuration) && nextDuration > 0))) {
        throw new TypeError('Sequence duration must be a positive finite number, or omitted for ambient content.');
      }
      if (settings.loop && !Number.isFinite(nextDuration)) throw new TypeError('A looping sequence needs a finite duration.');
      for (const name of ['startTime', 'stillTime']) {
        if (settings[name] !== undefined && !Number.isFinite(settings[name])) throw new TypeError(`${name} must be finite.`);
      }
      cancel();
      if (world) { scene.remove(world); disposeWorld(world); }
      world = next;
      update = settings.update || (() => {});
      duration = nextDuration;
      loop = Boolean(settings.loop);
      ended = false;
      completionNotified = false;
      completeWorld = settings.onComplete || null;
      playing = requestedPlaying;
      const initialTime = motion.matches && !playing ? settings.stillTime ?? 1.2 : settings.startTime ?? (Number.isFinite(duration) ? 0 : settings.stillTime ?? 1.2);
      time = Math.max(0, Math.min(initialTime, duration));
      ended = !loop && time >= duration;
      if (ended) playing = false;
      targetPoint = new THREE.Vector3(...(settings.target || [0, 0.6, 0]));
      update(time);
      world.updateMatrixWorld(true);
      bounds = settings.bounds?.clone() || new THREE.Box3().setFromObject(world);
      if (bounds.isEmpty()) throw new Error('The miniature needs visible geometry.');
      scene.add(world);
      fit();
      render();
      options.onPlayingChange?.(playing);
      schedule();
    },
    setPlaying(value) {
      if (disposed) return;
      userChoseMotion = true;
      playing = Boolean(value);
      requestedPlaying = playing;
      if (playing && ended) { time = 0; ended = false; completionNotified = false; }
      cancel();
      options.onPlayingChange?.(playing);
      render();
      schedule();
    },
    seek(seconds) {
      if (disposed) return;
      if (!Number.isFinite(seconds)) throw new TypeError('Seek position must be finite.');
      cancel();
      time = Math.max(0, Math.min(seconds, duration));
      ended = !loop && time >= duration;
      completionNotified = false;
      if (ended && playing) { playing = false; options.onPlayingChange?.(false); }
      render();
      schedule();
    },
    setLoop(value) {
      if (disposed) return;
      if (value && !Number.isFinite(duration)) throw new TypeError('A looping sequence needs a finite duration.');
      cancel();
      loop = Boolean(value);
      ended = !loop && time >= duration;
      if (loop && time >= duration) time = 0;
      if (ended && playing) { playing = false; options.onPlayingChange?.(false); }
      completionNotified = false;
      render();
      schedule();
    },
    replay() {
      if (disposed) return;
      cancel();
      userChoseMotion = true;
      time = 0;
      ended = false;
      completionNotified = false;
      playing = true;
      requestedPlaying = true;
      options.onPlayingChange?.(true);
      render();
      schedule();
    },
    setStyle(values = {}) {
      pixelSize = clamp(values.pixelSize ?? pixelSize, 1, 4, 2);
      pass.uniforms.levels.value = clamp(values.levels ?? pass.uniforms.levels.value, 3, 24, 8);
      pass.uniforms.dither.value = clamp(values.dither ?? pass.uniforms.dither.value, 0, 1.5, 0.85);
      fit();
      render();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancel();
      resize.disconnect();
      intersection.disconnect();
      motion.removeEventListener('change', motionChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      if (world) disposeWorld(world);
      key.shadow.map?.dispose();
      target.dispose();
      quad.geometry.dispose();
      pass.dispose();
      renderer.dispose();
      canvas.remove();
      fallback.remove();
    },
  };
  api.setStyle(options);
  options.onPlayingChange?.(playing);
  return api;
}
