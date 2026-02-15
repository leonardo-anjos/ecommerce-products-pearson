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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex justify-between items-center pt-3">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded-lg flex-1" />
                <div className="h-9 bg-gray-200 rounded-lg flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
