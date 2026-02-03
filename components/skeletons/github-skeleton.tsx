import { Skeleton } from "../ui/skeleton";

export const GitSkeleton = () => {
  // 53 weeks to roughly cover a year
  const weeks = Array.from({ length: 53 });
  // 7 days per week
  const days = Array.from({ length: 7 });

  return (
    <div className="p-4 border-y border-dashed overflow-x-auto overflow-y-hidden">
      <div className="flex flex-col gap-2">
        {/* Month Labels Skeleton */}
        <div className="flex w-full justify-between gap-2 mb-1 h-4 relative">
          {/* Render a few monthly labels skeletons */}
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-6" />
          ))}
        </div>

        {/* Weeks Grid Skeleton */}
        <div className="flex gap-0.5">
          {weeks.map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {days.map((_, j) => (
                <Skeleton key={j} className="w-3 h-3 rounded-xs" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className="mt-2 justify-center flex gap-1 text-[10px] items-center">
        <Skeleton className="h-3 w-6" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-2 h-2 rounded-[1px]" />
          ))}
        </div>
        <Skeleton className="h-3 w-6" />
      </div>
    </div>
  );
};
