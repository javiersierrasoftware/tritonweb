"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook
import DeleteModal from "@/components/DeleteModal"; // Reusable delete confirmation modal

export default function ManageProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const router = useRouter();
  const { user } = useAuth(); // Assuming useAuth provides user

  const fetchProducts = async () => {
    if (!user || user.role !== "ADMIN") {
      setError("No autorizado.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/products", {
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al cargar los productos.");
      }
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]); // Refetch when user changes

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al eliminar el producto.");
      }

      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-red-500 text-center">{error}</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-red-500 text-center">Acceso denegado. Solo administradores.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestionar Productos</h1>

      <div className="mb-6 flex justify-end gap-2">
        <Link
          href="/admin/products/create"
          className="bg-cyan-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-cyan-400"
        >
          Crear Nuevo Producto
        </Link>
        {/* Future: Link to 'Ventas realizadas' */}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400">No hay productos disponibles.</p>
      ) : (
        <div className="bg-[#111] rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[#181818]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${product.price?.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteConfirm()}
          count={1}
          itemType="producto"
        />
      )}
    </div>
  );
}
