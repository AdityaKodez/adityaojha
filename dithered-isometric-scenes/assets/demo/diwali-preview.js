const host = document.querySelector('#stage');
const play = document.querySelector('#play');
const label = document.querySelector('#play-label');
let stage;

function motionState(playing) {
  label.textContent = playing ? 'Pause' : 'Play';
  play.dataset.paused = String(!playing);
  play.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
}

function showError(message) {
  const loading = document.querySelector('#loading');
  if (loading) {
    loading.textContent = message;
    loading.setAttribute('role', 'alert');
  }
}

try {
  const [{ createDiorama }, { buildDiwali }] = await Promise.all([
    import('../diorama-runtime.js'), import('./diwali.js'),
  ]);
  stage = createDiorama(host, {
    label: 'A Diwali courtyard with a visitor walking and waving a sparkler, a person placing rangoli petals, swaying lanterns and a watchful cat.',
    pixelSize: 1.6, levels: 12, dither: 0.8, transparent: true,
    onPlayingChange: motionState,
  });
  const settings = buildDiwali();
  stage.setWorld(settings.world, settings);
  document.querySelector('#loading').remove();
  play.disabled = false;
  play.addEventListener('click', () => stage.setPlaying(!stage.playing));
  window.addEventListener('pagehide', () => stage.dispose(), { once: true });
  window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
} catch (error) {
  console.error(error);
  stage?.dispose();
  showError('The courtyard could not load. Please reload with WebGL2 graphics enabled.');
}

export { stage };
