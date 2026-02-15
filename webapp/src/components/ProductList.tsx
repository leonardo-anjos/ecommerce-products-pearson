"use client";

/**
 * ProductList — CSR: client component that manages state, handles CRUD
 * operations, and re-fetches data after mutations.
 */

import { useState, useCallback } from "react";
import { Product, PagedResponse } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductForm } from "./ProductForm";
import { DeleteModal } from "./DeleteModal";
import { Pagination } from "./Pagination";
import * as api from "@/services/api";

interface ProductListProps {
  initialData: PagedResponse<Product>;
}

export function ProductList({ initialData }: ProductListProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialData.page);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getProducts(page, 10);
      setData(result);
      setCurrentPage(page);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(currentPage);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await api.deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Loading skeleton
  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="h-36 bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-14" />
            </div>
            <div className="flex gap-1.5">
              <div className="h-8 bg-gray-200 rounded-lg flex-1" />
              <div className="h-8 bg-gray-200 rounded-lg flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">{data.totalCount}</span>{" "}
          product{data.totalCount !== 1 ? "s" : ""} found
        </p>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Product
        </button>
      </div>

      {/* Product Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button
            onClick={() => fetchProducts(currentPage)}
            className="text-sm font-medium text-red-700 hover:text-red-900 underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : data.items.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          <button
            onClick={handleCreate}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={data.page}
        totalPages={data.totalPages}
        hasPreviousPage={data.hasPreviousPage}
        hasNextPage={data.hasNextPage}
        onPageChange={fetchProducts}
      />

      {/* Create/Edit Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteModal
          productName={deletingProduct.name}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
