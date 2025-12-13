"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import { Search, Package, PackageX, DollarSign, FileText, Loader2 } from "lucide-react";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

type StockStatus = "" | "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

function ManageProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState<StockStatus>("");

  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/products", { credentials: "include" });
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
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStock = true;
      if (filterStock === "IN_STOCK") {
        matchesStock = product.stock > 0;
      } else if (filterStock === "OUT_OF_STOCK") {
        matchesStock = product.stock === 0;
      } else if (filterStock === "LOW_STOCK") {
        matchesStock = product.stock > 0 && product.stock <= 5;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, searchTerm, filterStock]);

  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    return { totalProducts, outOfStock, inventoryValue };
  }, [products]);

  const handleDeleteClick = (product: Product) => {
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

  const handleExportToExcel = () => {
    const headers = ["ID", "Nombre", "Precio", "Stock"];
    const csvRows = filteredProducts.map(p => 
      [`"${p._id}"`, `"${p.name}"`, p.price, p.stock].join(',')
    );
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-xl text-gray-400">Cargando productos...</p>
      </main>
    );
  }

  if (error) {
    return <div className="max-w-6xl mx-auto px-4 py-8 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Productos</h1>
        <Link href="/admin/products/create" className="bg-cyan-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-cyan-400">
          Crear Nuevo Producto
        </Link>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <Package className="h-8 w-8 text-cyan-400" />
          <div><p className="text-sm text-gray-400">Total de Productos</p><p className="text-2xl font-bold">{analytics.totalProducts}</p></div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <PackageX className="h-8 w-8 text-red-400" />
          <div><p className="text-sm text-gray-400">Productos Agotados</p><p className="text-2xl font-bold">{analytics.outOfStock}</p></div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-green-400" />
          <div><p className="text-sm text-gray-400">Valor del Inventario</p><p className="text-2xl font-bold">${analytics.inventoryValue.toLocaleString('es-CO')}</p></div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4 flex-grow">
          <div className="relative flex-grow min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"/>
          </div>
          <select value={filterStock} onChange={e => setFilterStock(e.target.value as StockStatus)} className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
            <option value="">Todo el Stock</option>
            <option value="IN_STOCK">En Stock</option>
            <option value="LOW_STOCK">Bajo Stock (≤5)</option>
            <option value="OUT_OF_STOCK">Agotado</option>
          </select>
        </div>
        <button onClick={handleExportToExcel} className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:from-purple-600 hover:to-indigo-600 transition-colors">
          <FileText size={18} /> Exportar
        </button>
      </div>
      
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400">No se encontraron productos que coincidan con los filtros.</p>
      ) : (
        <div className="bg-[#111] rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[#181818]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4"><div className="w-12 h-12 relative">{product.image ? <Image src={product.image} alt={product.name} layout="fill" className="rounded object-cover" /> : <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">No img</div>}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price?.toLocaleString('es-CO')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/products/edit/${product._id}`} className="text-indigo-400 hover:text-indigo-300 mr-4">Editar</Link>
                    <button onClick={() => handleDeleteClick(product)} className="text-red-400 hover:text-red-300">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && productToDelete && (
        <DeleteModal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteConfirm} count={1} itemType="producto" />
      )}
    </div>
  );
}

export default function ManageProductsPage() {
  return (
    <AdminAuthGuard>
      <ManageProductsPageContent />
    </AdminAuthGuard>
  )
}
