export const VisitorCounterSkeleton = () => {
  // Matches the odometer row height (40px digit cells) so the footer does
  // not shift when the streamed count replaces this.
  return (
    <div
      aria-hidden="true"
      className="flex h-10 items-center justify-center animate-pulse"
    >
      <div className="h-3 w-44 rounded-md bg-muted" />
    </div>
  );
};
