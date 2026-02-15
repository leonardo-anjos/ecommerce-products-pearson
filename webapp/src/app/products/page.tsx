import { getProducts } from "@/services/api";
import { ProductList } from "@/components/ProductList";
import { RenderingBadge } from "@/components/RenderingBadge";

/**
 * Products Page — SSR (Server-Side Rendering)
 *
 * `dynamic = 'force-dynamic'` ensures this page is never statically cached
 * and always renders with fresh data from the .NET backend API on every
 * request. The fetched data is passed as `initialData` to the client-side
 * ProductList component, which handles subsequent CRUD interactions (CSR).
 */
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let initialData;
  let serverError: string | null = null;

  try {
    initialData = await getProducts(1, 10);
  } catch (err) {
    serverError =
      err instanceof Error ? err.message : "Failed to connect to the API";
    initialData = {
      items: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <RenderingBadge
          type="SSR"
          description="Fresh data fetched per request"
        />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">
              Failed to load products from the server
            </p>
            <p className="text-xs text-red-600 mt-1">{serverError}</p>
            <p className="text-xs text-red-500 mt-1">
              Make sure the backend API is running at{" "}
              <code className="bg-red-100 px-1 rounded">localhost:5079</code>{" "}
              and try refreshing the page.
            </p>
          </div>
        </div>
      )}

      <ProductList initialData={initialData} />
    </div>
  );
}
