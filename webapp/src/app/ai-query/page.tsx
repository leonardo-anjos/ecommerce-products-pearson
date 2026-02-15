"use client";

import { useState, useRef, useEffect } from "react";
import { RenderingBadge } from "@/components/RenderingBadge";

/**
 * AI Query Page — CSR (Client-Side Rendering)
 *
 * This page is rendered entirely in the browser. The "use client" directive
 * ensures nothing runs on the server. The NL2SQL feature translates natural
 * language questions into SQL-like queries and fetches matching products
 * from the backend API.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5079";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

interface QueryResult {
  question: string;
  filter: string;
  products: Product[];
  timestamp: Date;
}

const EXAMPLE_QUERIES = [
  "Show me all products under $50",
  "Which products are out of stock?",
  "List active products in the Electronics category",
  "Find the most expensive products",
  "Show me products with more than 100 items in stock",
];

/**
 * Translates a natural-language question into API query parameters.
 *
 * This is a lightweight client-side NL2SQL-style parser. It extracts
 * keywords, prices, stock values, and categories from the user's
 * question and builds the corresponding API query string.
 */
function nlToFilter(question: string): Record<string, string> {
  const q = question.toLowerCase();
  const params: Record<string, string> = {};

  // Price filters
  const underMatch = q.match(/under\s+\$?(\d+(?:\.\d+)?)/);
  const overMatch = q.match(/(?:over|above|more than)\s+\$?(\d+(?:\.\d+)?)/);
  const cheapest = /cheap|lowest price|least expensive/.test(q);
  const expensive = /expensive|highest price|most expensive|priciest/.test(q);

  if (underMatch) params.maxPrice = underMatch[1];
  if (overMatch) params.minPrice = overMatch[1];
  if (cheapest) params.orderBy = "price";
  if (expensive) params.orderBy = "priceDesc";

  // Stock filters
  const stockMatch = q.match(
    /(?:more than|over|above|at least)\s+(\d+)\s+(?:items?\s+)?(?:in\s+)?stock/
  );
  const outOfStock = /out of stock|no stock|zero stock/.test(q);
  const inStock = /in stock/.test(q) && !outOfStock;

  if (stockMatch) params.minStock = stockMatch[1];
  if (outOfStock) params.maxStock = "0";
  if (inStock && !stockMatch) params.minStock = "1";

  // Category filter
  const categoryMatch = q.match(
    /(?:in|from|category)\s+(?:the\s+)?["']?([a-zA-Z\s]+?)["']?\s*(?:category|$)/i
  );
  if (categoryMatch) params.category = categoryMatch[1].trim();

  // Active/inactive
  if (/\binactive\b|disabled|not active/.test(q)) params.isActive = "false";
  else if (/\bactive\b|enabled/.test(q)) params.isActive = "true";

  // Name search
  const nameMatch = q.match(/(?:named?|called)\s+["']?([^"']+)["']?/);
  if (nameMatch) params.name = nameMatch[1].trim();

  return params;
}

function buildQueryString(params: Record<string, string>): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", "1");
  searchParams.set("pageSize", "50");

  if (params.name) searchParams.set("name", params.name);
  if (params.category) searchParams.set("category", params.category);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice);
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice);
  if (params.minStock) searchParams.set("minStock", params.minStock);
  if (params.maxStock) searchParams.set("maxStock", params.maxStock);
  if (params.isActive) searchParams.set("isActive", params.isActive);
  if (params.orderBy) searchParams.set("orderBy", params.orderBy);

  return searchParams.toString();
}

export default function AiQueryPage() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = nlToFilter(question);
      const qs = buildQueryString(params);
      const filterDescription = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");

      const res = await fetch(`${API_URL}/api/products?${qs}`);
      if (!res.ok) throw new Error(`API responded with ${res.status}`);

      const data = await res.json();
      setResults((prev) => [
        ...prev,
        {
          question,
          filter: filterDescription || "No specific filters applied — showing all products",
          products: data.items,
          timestamp: new Date(),
        },
      ]);
      setQuestion("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to execute query"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Query</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ask questions about products in natural language
          </p>
        </div>
        <RenderingBadge
          type="CSR"
          description="Fully client-side rendered"
        />
      </div>

      {/* Query input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Show me all products under $50"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500
                       placeholder:text-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg
                       hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Querying…
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Query
              </>
            )}
          </button>
        </div>

        {/* Example queries */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((eq) => (
            <button
              key={eq}
              type="button"
              onClick={() => setQuestion(eq)}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600
                         hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              {eq}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {results.map((result, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Query header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    &quot;{result.question}&quot;
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    → {result.filter}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {result.products.length} result
                  {result.products.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Products table */}
            {result.products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Category</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Stock</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {result.products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {p.category}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {p.stockQuantity}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              p.isActive ? "bg-green-400" : "bg-gray-300"
                            }`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No products matched your query.
              </div>
            )}
          </div>
        ))}
        <div ref={resultsEndRef} />
      </div>

      {/* Empty state */}
      {results.length === 0 && !error && (
        <div className="text-center py-16 space-y-3">
          <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Ask a question to get started</p>
          <p className="text-sm text-gray-400">
            Try one of the example queries above or type your own
          </p>
        </div>
      )}
    </div>
  );
}
