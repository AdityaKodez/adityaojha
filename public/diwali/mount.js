let stage;
function notify(status) {
  if (parent !== window) parent.postMessage({ type: 'diwali-scene', status }, location.origin);
}
try {
  const [{ createDiorama }, { buildDiwali }] = await Promise.all([
    import('./runtime.js'), import('./scene.js'),
  ]);
  const host = document.querySelector('#stage');
  stage = createDiorama(host, {
    label: 'A Diwali courtyard with a visitor walking and waving a sparkler, a person placing rangoli petals, swaying lanterns and a watchful cat.',
    pixelSize: 1, levels: 12, dither: 0.8, transparent: true,
    onError: () => notify('error'),
  });
  const settings = buildDiwali();
  stage.setWorld(settings.world, settings);
  const visibilityChanged = (event) => {
    if (
      event.source !== parent ||
      event.origin !== location.origin ||
      event.data?.type !== 'diwali-visibility' ||
      typeof event.data.visible !== 'boolean'
    ) return;
    stage.setVisible(event.data.visible);
  };
  window.addEventListener('message', visibilityChanged);
  host.querySelector('canvas').addEventListener('webglcontextrestored', () => notify('ready'));
  notify('ready');
  window.addEventListener('pagehide', () => {
    window.removeEventListener('message', visibilityChanged);
    stage.dispose();
  }, { once: true });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) location.reload();
  });
} catch (error) {
  console.error('The Diwali scene could not load.', error);
  stage?.dispose();
  notify('error');
}
export { stage };
