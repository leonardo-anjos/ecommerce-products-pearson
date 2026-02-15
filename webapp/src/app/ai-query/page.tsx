"use client";

import { useState, useRef, useEffect } from "react";
import { RenderingBadge } from "@/components/RenderingBadge";

/**
 * AI Query Page — CSR (Client-Side Rendering)
 *
 * This page is rendered entirely in the browser. The "use client" directive
 * ensures nothing runs on the server. Users type natural language questions
 * which are sent to the backend NL2SQL endpoint. The backend uses an AI agent
 * powered by Google Gemini (LLM) to interpret the question, generate a T-SQL
 * query, execute it against SQL Server, and return the results.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5079";

interface AiQueryResult {
  question: string;
  generatedSql: string;
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
}

interface QueryEntry {
  result?: AiQueryResult;
  error?: string;
  timestamp: Date;
}

const EXAMPLE_QUERIES = [
  "Show all products under $50",
  "Which products are out of stock?",
  "List active products in the Electronics category",
  "What are the 5 most expensive products?",
  "Show the average price per category",
  "How many products do we have in total?",
];

export default function AiQueryPage() {
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<QueryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ai-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body?.message || body?.title || `API responded with ${res.status}`;
        throw new Error(message);
      }

      const data: AiQueryResult = await res.json();
      setEntries((prev) => [...prev, { result: data, timestamp: new Date() }]);
      setQuestion("");
    } catch (err) {
      setEntries((prev) => [
        ...prev,
        {
          error: err instanceof Error ? err.message : "Failed to process query",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setEntries([]);
  }

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toLocaleString();
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return String(value);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Query</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ask questions in natural language — powered by Google Gemini AI
          </p>
        </div>
        <RenderingBadge
          type="CSR"
          description="Fully client-side rendered"
        />
      </div>

      {/* Info banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 flex items-start gap-2">
        <svg
          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          Your question is sent to{" "}
          <strong>POST /api/ai-query</strong>. The backend uses an AI agent
          powered by <strong>Google Gemini</strong> to interpret your question
          and generate a T-SQL query. The SQL is validated (read-only SELECT
          only), executed against <strong>SQL Server</strong>, and the results
          are returned.
        </span>
      </div>

      {/* Query input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the 5 most expensive products?"
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
                Processing…
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

        {/* Example queries + clear history */}
        <div className="flex flex-wrap items-center gap-2">
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
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-600
                         hover:bg-red-100 transition-colors ml-auto"
            >
              Clear history
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      <div className="space-y-6">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {entry.error ? (
              /* Error entry */
              <div className="px-4 py-4 flex items-start gap-3">
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
                    Query failed
                  </p>
                  <p className="text-sm text-red-600 mt-1">{entry.error}</p>
                </div>
              </div>
            ) : entry.result ? (
              <>
                {/* Query header */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        &quot;{entry.result.question}&quot;
                      </p>
                      <div className="bg-gray-900 rounded-md px-3 py-2 mt-2 overflow-x-auto">
                        <code className="text-xs text-green-400 whitespace-pre font-mono">
                          {entry.result.generatedSql}
                        </code>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                        Gemini
                      </span>
                      <span className="text-xs text-gray-400">
                        {entry.result.rowCount} row
                        {entry.result.rowCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-gray-400">
                        {entry.result.executionTimeMs}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Results table */}
                {entry.result.rowCount > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-left text-xs text-gray-500 uppercase">
                          {entry.result.columns.map((col) => (
                            <th key={col} className="px-4 py-2">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {entry.result.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-gray-50">
                            {entry.result!.columns.map((col) => (
                              <td
                                key={col}
                                className="px-4 py-2 text-gray-700 whitespace-nowrap"
                              >
                                {formatValue(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    The query returned no results.
                  </div>
                )}
              </>
            ) : null}
          </div>
        ))}
        <div ref={resultsEndRef} />
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
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
          <p className="text-gray-600 font-medium">
            Ask a question to get started
          </p>
          <p className="text-sm text-gray-400">
            Your question will be interpreted by an AI model that generates SQL
            and executes it against the product database
          </p>
        </div>
      )}
    </div>
  );
}
