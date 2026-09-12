import * as React from 'react';

type MascotGaze = 'up' | 'down' | 'left' | 'right';

// Static, standalone mascot. Colors match the selected brand identity.
// Same interaction contract as AIMascot: blink, gaze shift while awake,
// and a gentle wobble standing in for the blob morph.
export default function BitBlob({
  awake = false,
  gaze,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { awake?: boolean; gaze?: MascotGaze }) {
  const eyeShift = !awake
    ? 'translate(0.5px, -0.5px)'
    : gaze === 'down'
      ? 'translate(0.5px, 2px)'
      : gaze === 'left'
        ? 'translate(-2px, -0.5px)'
        : gaze === 'right'
          ? 'translate(2px, -0.5px)'
          : 'translate(0.5px, -2px)';

  return (<svg {...props} viewBox="0 0 128 128" role="img" aria-label="Bit" fill="oklch(0.9 0.13 92)" xmlns="http://www.w3.org/2000/svg" width={props.width ?? 128} height={props.height ?? 128} className={className}><style>{`
        @keyframes bit-blink {
          0%, 42%, 46%, 100% { transform: scaleY(1); }
          44% { transform: scaleY(.12); }
        }
        @keyframes bit-wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          33% { transform: rotate(-1.2deg) scale(1.015); }
          66% { transform: rotate(1deg) scale(.99); }
        }
        .bit-eye { transform-box: fill-box; transform-origin: center; animation: bit-blink 6.5s infinite; }
        .bit-body { transform-box: fill-box; transform-origin: center; animation: bit-wobble 9s ease-in-out infinite; }
      `}</style><g fill="oklch(0.9 0.13 92)"><path className="bit-body" fill="oklch(0.9 0.13 92)" d="M19 67C14 47 29 32 44 34C43 15 66 12 77 32C96 18 112 37 104 53C123 66 113 84 99 86C104 108 80 118 65 100C46 120 25 106 30 91C14 90 10 77 19 67Z"/><g style={{ transform: eyeShift, transition: 'transform 300ms ease' }}><g transform="rotate(-16 64 60) translate(0 0)" fill="oklch(0.18 0.008 260)"><rect className="bit-eye" x="44" y="52" width="9" height="18" rx="4.5" fill="oklch(0.18 0.008 260)"/><rect className="bit-eye" x="77" y="52" width="9" height="18" rx="4.5" fill="oklch(0.18 0.008 260)"/></g></g></g></svg>);
}
