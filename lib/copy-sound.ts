const COPY_SOUND_SRC = "/keyboard-click.mp3";

let copyAudio: HTMLAudioElement | null = null;

export function playCopySound() {
  if (typeof window === "undefined") return;

  try {
    if (!copyAudio) {
      copyAudio = new Audio(COPY_SOUND_SRC);
      copyAudio.preload = "auto";
      copyAudio.volume = 0.35;
    }

    copyAudio.currentTime = 0;
    void copyAudio.play().catch(() => {});
  } catch {
    // Audio is optional feedback; clipboard success must not depend on it.
  }
}
