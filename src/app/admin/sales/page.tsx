"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, ShoppingCart, BarChart2, Package, Search, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Order = {
  _id: string;
  guestInfo: {
    name: string;
    email: string;
    cedula: string;
    address: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING_PAYMENT" | "PAID" | "FAILED" | "COMPLETED";
  createdAt: string;
  wompiTransactionId?: string;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  { value: 1, name: "Enero" }, { value: 2, name: "Febrero" },
  { value: 3, name: "Marzo" }, { value: 4, name: "Abril" },
  { value: 5, name: "Mayo" }, { value: 6, name: "Junio" },
  { value: 7, name: "Julio" }, { value: 8, name: "Agosto" },
  { value: 9, name: "Septiembre" }, { value: 10, name: "Octubre" },
  { value: 11, name: "Noviembre" }, { value: 12, name: "Diciembre" },
];

function SalesPageContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    // Setting isLoading is only needed on mount, not on re-fetch
    // setIsLoading(true); 
    setError(null);
    try {
      const url = new URL("/api/admin/orders", window.location.origin);
      url.searchParams.append("year", selectedYear.toString());
      url.searchParams.append("month", selectedMonth.toString());
      
      const res = await fetch(url.toString(), { credentials: "include" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al cargar las ventas.");
      }
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOrders();
  }, [selectedYear, selectedMonth]);

  const handleForceProcess = async (orderId: string) => {
    setProcessingId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/force-process`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al procesar la orden.');
      }
      await fetchOrders(); // Re-fetch orders to see the change
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const guest = order.guestInfo;
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = searchTerm === "" ||
        guest.name.toLowerCase().includes(searchLower) ||
        guest.email.toLowerCase().includes(searchLower) ||
        guest.cedula.toLowerCase().includes(searchLower);

      const matchesStatus = filterStatus === "" || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, filterStatus]);

  const analytics = useMemo(() => {
    const relevantOrders = filteredOrders;
    const totalRevenue = relevantOrders.reduce((sum, order) => (order.status === 'PAID' || order.status === 'COMPLETED' ? sum + order.totalAmount : sum), 0);
    const totalOrders = relevantOrders.length;
    const paidOrders = relevantOrders.filter(order => order.status === 'PAID' || order.status === 'COMPLETED').length;

    return { totalRevenue, totalOrders, paidOrders };
  }, [filteredOrders]);

  const handleExportToExcel = () => {
    const headers = [
      "ID de Orden",
      "Fecha",
      "Cliente",
      "Email",
      "Cédula",
      "Teléfono",
      "Dirección",
      "Productos",
      "Total",
      "Estado del Pago",
      "ID de Transacción",
    ];

    const csvRows = filteredOrders.map((order) => {
      const { _id, createdAt, guestInfo, items, totalAmount, status, wompiTransactionId } = order;
      const date = new Date(createdAt).toLocaleDateString();
      const productList = items.map(item => `${item.name} (x${item.qty})`).join('; ');

      return [
        `"${_id}"`,
        `"${date}"`,
        `"${guestInfo.name}"`,
        `"${guestInfo.email}"`,
        `"${guestInfo.cedula}"`,
        `"${guestInfo.phoneNumber}"`,
        `"${guestInfo.address}"`,
        `"${productList}"`,
        totalAmount,
        `"${status}"`,
        `"${wompiTransactionId || 'N/A'}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas-${selectedYear}-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-xl text-gray-400">Cargando ventas...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <p className="text-red-500 text-xl">{error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Ventas Realizadas</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Date Filters */}
        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-white/10">
          <div>
            <label htmlFor="year-filter" className="block text-sm font-medium text-gray-400">Año</label>
            <select id="year-filter" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="month-filter" className="block text-sm font-medium text-gray-400">Mes</label>
            <select id="month-filter" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
              {months.map(month => <option key={month.value} value={month.value}>{month.name}</option>)}
            </select>
          </div>
        </div>

        {/* Search and Status Filter */}
        <div className="flex flex-wrap gap-4 flex-grow">
          <div className="relative flex-grow min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, email, cédula..."
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos los Estados</option>
            <option value="PAID">Pagadas</option>
            <option value="PENDING_PAYMENT">Pendientes</option>
            <option value="FAILED">Fallidas</option>
          </select>
        </div>

        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:from-purple-600 hover:to-indigo-600 transition-colors"
        >
          <FileText size={18} /> Exportar a Excel
        </button>
      </div>

      {/* ANALYTICS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <DollarSign className="h-8 w-8 text-green-400" />
          <div>
            <p className="text-sm text-gray-400">Ingresos (Pagados)</p>
            <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString('es-CO')}</p>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <ShoppingCart className="h-8 w-8 text-cyan-400" />
          <div>
            <p className="text-sm text-gray-400">Órdenes (Filtradas)</p>
            <p className="text-2xl font-bold">{analytics.totalOrders}</p>
          </div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 flex items-center gap-4">
          <BarChart2 className="h-8 w-8 text-orange-400" />
          <div>
            <p className="text-sm text-gray-400">Órdenes Pagadas</p>
            <p className="text-2xl font-bold">{analytics.paidOrders}</p>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400 p-8">No se encontraron órdenes para el período y filtros seleccionados.</p>
      ) : (
        <div className="bg-gray-800/50 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Productos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <div>{order.guestInfo.name}</div>
                      <div className="text-xs text-gray-400">{order.guestInfo.cedula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>{order.guestInfo.email}</div>
                      <div className="text-xs">{order.guestInfo.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <ul className="space-y-2">
                        {order.items.map((item: OrderItem) => (
                          <li key={item.productId} className="flex items-center gap-2">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} width={24} height={24} className="rounded object-cover" />
                            ) : (
                              <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center"><Package size={14}/></div>
                            )}
                            <span>{item.name} (x{item.qty})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.totalAmount.toLocaleString('es-CO')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                                              order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                              order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                            }`}> 
                                              {order.status}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {order.status === 'PENDING_PAYMENT' && (
                                              <button
                                                onClick={() => handleForceProcess(order._id)}
                                                disabled={processingId === order._id}
                                                className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-2 rounded disabled:bg-gray-500 flex items-center justify-center"
                                              >
                                                {processingId === order._id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aprobar Pago'}
                                              </button>
                                            )}
                                          </td>
                                        </tr>                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SalesPage() {
  return (
    <AdminAuthGuard>
      <SalesPageContent />
    </AdminAuthGuard>
  )
}
