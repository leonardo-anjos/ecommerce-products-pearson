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
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            E-Commerce Product Manager
          </h1>
          <p className="mt-1 text-gray-500">
            Full-stack demo — Next.js rendering strategies + .NET API + AI
          </p>
        </div>
        <RenderingBadge type="SSG" description="Static content at build time" />
      </div>

      {/* Rendering strategies overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pages</h2>
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
            description="The page shell loads instantly, then all data fetching and rendering happens in the browser. An LLM translates natural language questions into SQL queries executed against the product database."
            features={[
              "Browser-side data fetching",
              "Real-time interactive UI",
              "LLM-powered NL2SQL agent",
              "No server rendering overhead",
            ]}
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Backend — ASP.NET Core Web API
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>Controller → Service → Repository</strong> layered
                  architecture with dependency injection
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>Entity Framework Core</strong> with Fluent API, SQL
                  Server 2022 via Docker
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>FluentValidation</strong> with a global validation
                  filter for request DTOs
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>NL2SQL AI endpoint</strong> — receives natural language
                  questions, generates SQL via Google Gemini LLM, executes against the
                  database, and returns results
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Frontend — Next.js 14 (App Router)
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>SSG</strong> — static pages generated at build time (
                  this page)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>SSR</strong> — server-rendered product catalog with
                  real-time data from the API
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>CSR</strong> — fully client-side AI query page with
                  interactive NL2SQL chat
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">&#9654;</span>
                <span>
                  <strong>Tailwind CSS</strong> — utility-first styling with
                  responsive design
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            NL2SQL Data Flow
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              User Question
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
              POST /api/ai-query
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
              Google Gemini (LLM)
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
              Generated SQL
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">
              SQL Server
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
              Results Table
            </span>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { name: "Next.js 14", desc: "React Framework" },
            { name: "React 18", desc: "UI Library" },
            { name: "TypeScript", desc: "Type Safety" },
            { name: "Tailwind CSS", desc: "Styling" },
            { name: "ASP.NET Core", desc: "Backend API" },
            { name: "Entity Framework", desc: "ORM" },
            { name: "SQL Server 2022", desc: "Database" },
            { name: "Docker", desc: "Containerization" },
            { name: "Google Gemini", desc: "LLM / NL2SQL" },
            { name: "FluentValidation", desc: "Validation" },
          ].map((tech) => (
            <div
              key={tech.name}
              className="text-center p-3 rounded-lg bg-gray-50"
            >
              <p className="font-semibold text-gray-900 text-sm">
                {tech.name}
              </p>
              <p className="text-xs text-gray-500">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
        <div className="divide-y divide-gray-100">
          <FaqItem
            question="What is the difference between SSR, SSG, and CSR?"
            answer="SSR (Server-Side Rendering) generates HTML on the server for each request — ideal for dynamic data. SSG (Static Site Generation) pre-builds HTML at compile time — perfect for content that doesn't change. CSR (Client-Side Rendering) sends a minimal HTML shell and renders everything in the browser — great for highly interactive UIs."
          />
          <FaqItem
            question="How does the NL2SQL feature work?"
            answer="The user types a natural language question (e.g. 'Show me products under $50'). The backend sends it to an AI agent powered by Google Gemini, which receives the full database schema as context and generates a T-SQL SELECT query. The SQL is validated for safety (read-only, no mutations), executed against SQL Server, and the results are returned to the frontend."
          />
          <FaqItem
            question="Is the generated SQL safe?"
            answer="Yes. The backend validates that the generated SQL starts with SELECT and does not contain any forbidden keywords (INSERT, UPDATE, DELETE, DROP, EXEC, etc.). Queries are executed read-only with a 10-second timeout and results are capped at 100 rows."
          />
          <FaqItem
            question="How do I set up the Gemini API key?"
            answer="Get a free API key at ai.google.dev. Set it in appsettings.json under Gemini:ApiKey, or use an environment variable. The default model is gemini-2.0-flash (free tier). You can change it in Gemini:Model."
          />
          <FaqItem
            question="What database does this use?"
            answer="Microsoft SQL Server 2022 running in a Docker container. The connection string is configured in appsettings.json. Run 'docker compose up -d' to start the database."
          />
        </div>
      </section>

      {/* API Endpoints reference */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">API Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200">
                <th className="pb-2 pr-4">Method</th>
                <th className="pb-2 pr-4">Endpoint</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  method: "GET",
                  endpoint: "/api/products",
                  desc: "List products (paginated, filterable)",
                },
                {
                  method: "GET",
                  endpoint: "/api/products/:id",
                  desc: "Get a product by ID",
                },
                {
                  method: "POST",
                  endpoint: "/api/products",
                  desc: "Create a new product",
                },
                {
                  method: "PATCH",
                  endpoint: "/api/products/:id",
                  desc: "Partially update a product",
                },
                {
                  method: "DELETE",
                  endpoint: "/api/products/:id",
                  desc: "Delete a product",
                },
                {
                  method: "POST",
                  endpoint: "/api/ai-query",
                  desc: "NL2SQL — natural language to SQL query",
                },
              ].map((api) => (
                <tr key={api.endpoint + api.method} className="text-gray-700">
                  <td className="py-2 pr-4">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        api.method === "GET"
                          ? "bg-green-100 text-green-700"
                          : api.method === "POST"
                          ? "bg-blue-100 text-blue-700"
                          : api.method === "PATCH"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {api.method}
                    </span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">
                    {api.endpoint}
                  </td>
                  <td className="py-2 text-gray-600">{api.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────── Sub-components ───────────────────── */

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

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="py-3">
      <h3 className="text-sm font-semibold text-gray-800">{question}</h3>
      <p className="text-sm text-gray-600 mt-1">{answer}</p>
    </div>
  );
}
