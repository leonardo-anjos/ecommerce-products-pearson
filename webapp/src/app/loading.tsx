/**
 * Loading — displayed automatically by Next.js while the SSR page
 * is fetching data on the server.
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Toolbar skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-36 bg-gray-200" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-14" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-8 bg-gray-200 rounded-lg flex-1" />
                <div className="h-8 bg-gray-200 rounded-lg flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
