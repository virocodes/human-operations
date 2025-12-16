export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="h-9 bg-muted rounded w-24"></div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border shadow-sm p-6 relative overflow-hidden"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 border-t md:border-t-2 border-l md:border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 border-t md:border-t-2 border-r md:border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 md:w-3 md:h-3 border-b md:border-b-2 border-l md:border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 md:w-3 md:h-3 border-b md:border-b-2 border-r md:border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-7 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
