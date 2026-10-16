export const VisitorCounterSkeleton = () => {
  // Matches the odometer pill (28px digit cell plus the pill padding) so the
  // footer does not shift when the streamed count replaces this.
  return (
    <div
      aria-hidden="true"
      className="h-10 w-52 animate-pulse rounded-full bg-muted"
    />
  );
};
