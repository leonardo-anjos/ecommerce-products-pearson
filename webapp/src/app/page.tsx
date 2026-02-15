import { getProducts } from "@/services/api";
import { ProductList } from "@/components/ProductList";

/**
 * Home Page — SSR: fetches product data on the server for every request.
 * `dynamic = 'force-dynamic'` ensures this page is never statically cached
 * and always renders with fresh data from the API.
 *
 * The fetched data is passed as `initialData` to the client-side
 * ProductList component, which handles subsequent interactions (CSR).
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
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

  return <ProductList initialData={initialData} />;
}
