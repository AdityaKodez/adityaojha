/**
 * Inner column for the /components route.
 *
 * Same shell the other routes use: the root layout draws the frame and the
 * gutters, this just supplies the scrolling column.
 */
export function ComponentsShell({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="components"
      className="relative flex min-h-dvh w-full flex-col gap-y-4 overflow-x-clip border-x border-b-2 bg-background pt-[env(safe-area-inset-top)] pb-[calc(60px+env(safe-area-inset-bottom))]"
    >
      {children}
    </main>
  );
}
