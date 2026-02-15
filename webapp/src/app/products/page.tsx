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

  try {
    initialData = await getProducts(1, 10);
  } catch {
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
      <ProductList initialData={initialData} />
    </div>
  );
}
