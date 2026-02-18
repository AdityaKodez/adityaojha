"use client";

import { ComponentType, PropsWithChildren, useEffect, useState } from "react";

type LenisComponent = ComponentType<
  PropsWithChildren<{
    root?: boolean;
    options?: {
      lerp?: number;
      duration?: number;
      smoothWheel?: boolean;
      wheelMultiplier?: number;
      touchMultiplier?: number;
      syncTouch?: boolean;
    };
  }>
>;

const importModule = (specifier: string) =>
  new Function("modulePath", "return import(modulePath)")(
    specifier
  ) as Promise<{ ReactLenis?: LenisComponent }>;

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  const [ReactLenis, setReactLenis] = useState<LenisComponent | null>(null);

  useEffect(() => {
    let isMounted = true;

    void importModule("lenis/react")
      .then((module) => {
        if (isMounted && module.ReactLenis) {
          setReactLenis(module.ReactLenis);
        }
      })
      .catch(() => {
        // Lenis may be unavailable in restricted environments.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ReactLenis) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        duration: 1.05,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 0.9,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
