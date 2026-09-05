export const GitSkeleton = () => {
  // 53 weeks to roughly cover a year
  const weeks = Array.from({ length: 53 });
  // 7 days per week
  const days = Array.from({ length: 7 });

  return (
    <div className="border-t border-dashed p-2 overflow-x-auto overflow-y-hidden animate-pulse">
      <div className="flex flex-col gap-2">
        {/* Month Labels Skeleton */}
        <div className="flex w-full justify-between gap-2 mb-1 h-4 relative">
          {/* Render a few monthly labels skeletons */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-3 w-6 rounded-md bg-muted" />
          ))}
        </div>

        {/* Weeks Grid Skeleton */}
        <div className="flex gap-0.5">
          {weeks.map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {days.map((_, j) => (
                <div key={j} className="w-3 h-3 rounded-xs bg-muted" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-2 justify-center flex gap-1 text-[10px] items-center">
        <div className="h-3 w-6 rounded-md bg-muted" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-[1px] bg-muted" />
          ))}
        </div>
        <div className="h-3 w-6 rounded-md bg-muted" />
      </div>
    </div>
  );
};
