/** Header — Server Component (SSG) */

export function Header({ onNewProduct }: { onNewProduct?: () => void }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Manage your product catalog
          </p>
        </div>
      </div>
    </header>
  );
}
