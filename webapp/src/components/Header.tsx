/** Navbar — Server Component (SSG): static navigation shell */

import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Product Manager
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink href="/" label="Home" badge="SSG" badgeColor="purple" />
            <NavLink
              href="/products"
              label="Products"
              badge="SSR"
              badgeColor="blue"
            />
            <NavLink
              href="/ai-query"
              label="AI Query"
              badge="CSR"
              badgeColor="green"
            />
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  badge,
  badgeColor,
}: {
  href: string;
  label: string;
  badge: string;
  badgeColor: "blue" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {label}
      <span
        className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${colors[badgeColor]}`}
      >
        {badge}
      </span>
    </Link>
  );
}

