import Link from "next/link";
import { RenderingBadge } from "@/components/RenderingBadge";

/**
 * Home Page — SSG (Static Site Generation)
 *
 * This page is statically generated at build time. It contains no dynamic
 * data fetching — all content is known ahead of time and served as static
 * HTML. Next.js defaults to SSG when there is no dynamic data dependency.
 */

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Commerce Product Manager
          </h1>
          <p className="mt-1 text-gray-500">
            Demonstration of Next.js rendering strategies
          </p>
        </div>
        <RenderingBadge type="SSG" description="Static content at build time" />
      </div>

      {/* Rendering strategies overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StrategyCard
          href="/products"
          badge="SSR"
          badgeColor="blue"
          title="Products"
          subtitle="Server-Side Rendering"
          description="Product data is fetched on the server for every request, ensuring fresh data from the .NET backend API. The initial HTML is rendered server-side, then hydrated for client-side interactivity (CRUD operations)."
          features={[
            "Server-side data fetching per request",
            "Fresh data on every page load",
            "SEO-friendly pre-rendered HTML",
            "CRUD via client-side hydration",
          ]}
        />
        <StrategyCard
          href="/"
          badge="SSG"
          badgeColor="purple"
          title="Home (this page)"
          subtitle="Static Site Generation"
          description="This page is generated at build time as static HTML. No server-side computation happens per request — the content is served directly from CDN/cache, resulting in the fastest possible load time."
          features={[
            "Pre-built at compile time",
            "Zero server cost per request",
            "Ideal for documentation & marketing",
            "Instant page loads from cache",
          ]}
        />
        <StrategyCard
          href="/ai-query"
          badge="CSR"
          badgeColor="green"
          title="AI Query"
          subtitle="Client-Side Rendering"
          description="The page shell loads instantly, then all data fetching and rendering happens in the browser. The NL2SQL feature uses AI to convert natural language questions into SQL queries against the product database."
          features={[
            "Browser-side data fetching",
            "Real-time interactive UI",
            "Natural Language → SQL translation",
            "No server rendering overhead",
          ]}
        />
      </div>

      {/* Tech stack */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Next.js 14", desc: "React Framework" },
            { name: "React 18", desc: "UI Library" },
            { name: "TypeScript", desc: "Type Safety" },
            { name: "Tailwind CSS", desc: "Styling" },
            { name: "ASP.NET Core", desc: "Backend API" },
            { name: "Entity Framework", desc: "ORM" },
            { name: "SQL Server", desc: "Database" },
            { name: "Docker", desc: "Containerization" },
          ].map((tech) => (
            <div key={tech.name} className="text-center p-3 rounded-lg bg-gray-50">
              <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
              <p className="text-xs text-gray-500">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategyCard({
  href,
  badge,
  badgeColor,
  title,
  subtitle,
  description,
  features,
}: {
  href: string;
  badge: string;
  badgeColor: "blue" | "green" | "purple";
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}) {
  const colors = {
    blue: "border-blue-200 hover:border-blue-400",
    green: "border-green-200 hover:border-green-400",
    purple: "border-purple-200 hover:border-purple-400",
  };
  const badgeColors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <Link
      href={href}
      className={`block bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${colors[badgeColor]}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-2 py-0.5 text-xs font-bold rounded ${badgeColors[badgeColor]}`}
        >
          {badge}
        </span>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ul className="space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </Link>
  );
}
