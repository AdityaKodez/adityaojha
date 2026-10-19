export function GitSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-t border-dashed p-2 motion-safe:animate-pulse"
    >
      <div className="flex w-max pb-1">
        {Array.from({ length: 53 }, (_, week) => (
          <div key={week} className="w-[13px]">
            <div className="mb-2 h-4" />
            {Array.from({ length: 7 }, (_, day) => (
              <div
                key={day}
                className="flex size-[13px] items-center justify-center"
              >
                <div className="size-[9px] rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex h-4 items-center justify-center">
        <div className="h-2 w-24 rounded-md bg-muted" />
      </div>
    </div>
  );
}
