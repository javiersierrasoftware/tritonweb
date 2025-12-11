"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Loader2, Users, Search, FileText } from "lucide-react";

interface RegistrationData {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  guestInfo?: {
    name: string;
    email: string;
  };
  cedula: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO string
  distance: string;
  category: string;
  tshirtSize: string;
  status: "PENDING_PAYMENT" | "COMPLETED" | "FAILED";
  paymentId?: string;
  wompiTransactionId?: string;
  createdAt: string;
}

export default function AdminEventRegistrationsPage() {
  const params = useParams();
  const eventId = params.id;
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("");
  const [filterDistance, setFilterDistance] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/admin/${eventId}`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch event details.");
        }
        const eventData = await response.json();
        setEventDetails(eventData.data);
      } catch (err: any) {
        console.error("Error fetching event details:", err);
        setError(err.message);
      }
    };

    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`/api/admin/events/${eventId}/registrations`);
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch registrations.");
        }
        const data = await response.json();
        setRegistrations(data.data);
      } catch (err: any) {
        console.error("Error fetching registrations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
    fetchRegistrations();
  }, [eventId]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const fullName = (reg.user?.name || reg.guestInfo?.name || "").toLowerCase();
      const email = (reg.user?.email || reg.guestInfo?.email || "").toLowerCase();
      const cedula = (reg.cedula || "").toLowerCase();
      const regDistance = (reg.distance || "").toLowerCase();
      const regCategory = (reg.category || "").toLowerCase();

      const matchesSearchTerm =
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        cedula.includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus ? reg.status === filterStatus : true;
      const matchesGender = filterGender ? reg.gender === filterGender : true;
      const matchesDistance = filterDistance ? regDistance === filterDistance.toLowerCase() : true;
      const matchesCategory = filterCategory ? regCategory === filterCategory.toLowerCase() : true;

      return matchesSearchTerm && matchesStatus && matchesGender && matchesDistance && matchesCategory;
    });
  }, [registrations, searchTerm, filterStatus, filterGender, filterDistance, filterCategory]);

  const handleExportToExcel = () => {
    const headers = [
      "Nombre",
      "Email",
      "Cédula",
      "Género",
      "Teléfono",
      "Fecha de Nacimiento",
      "Distancia",
      "Categoría",
      "Talla Camiseta",
      "Estado",
      "Fecha de Registro",
      "ID de Pago (Wompi)",
    ];

    const csvRows = filteredRegistrations.map((reg) => {
      const name = reg.user?.name || reg.guestInfo?.name || "N/A";
      const email = reg.user?.email || reg.guestInfo?.email || "N/A";
      const dateOfBirth = new Date(reg.dateOfBirth).toLocaleDateString();
      const createdAt = new Date(reg.createdAt).toLocaleDateString();
      const wompiPaymentId = reg.wompiTransactionId || reg.paymentId || "N/A";

      return [
        `"${name}"`, // Wrap in quotes to handle commas in names
        `"${email}"`,
        `"${reg.cedula}"`,
        `"${reg.gender}"`,
        `"${reg.phoneNumber}"`,
        `"${dateOfBirth}"`,
        `"${reg.distance}"`,
        `"${reg.category}"`,
        `"${reg.tshirtSize}"`,
        `"${reg.status}"`,
        `"${createdAt}"`,
        `"${wompiPaymentId}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inscripciones-${eventDetails?.name || "evento"}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <Loader2 className="h-16 w-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-xl text-gray-400">Cargando inscripciones...</p>
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
    <main className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Users className="h-10 w-10 text-cyan-400" />
        <h1 className="text-4xl font-bold">Inscripciones para: {eventDetails?.name || "Cargando..."}</h1>
      </div>

      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
          <p className="text-2xl font-bold text-white">{filteredRegistrations.length}</p>
          <p className="text-gray-400 text-sm">Total Inscritos</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
          <p className="text-2xl font-bold text-green-400">{filteredRegistrations.filter(reg => reg.status === "COMPLETED").length}</p>
          <p className="text-gray-400 text-sm">Pagadas</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
          <p className="text-2xl font-bold text-yellow-400">{filteredRegistrations.filter(reg => reg.status === "PENDING_PAYMENT").length}</p>
          <p className="text-gray-400 text-sm">Pendientes</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
          <p className="text-2xl font-bold text-pink-400">{filteredRegistrations.filter(reg => reg.gender === "Mujer").length}</p>
          <p className="text-gray-400 text-sm">Mujeres</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
          <p className="text-2xl font-bold text-blue-400">{filteredRegistrations.filter(reg => reg.gender === "Hombre").length}</p>
          <p className="text-gray-400 text-sm">Hombres</p>
        </div>
        {eventDetails?.slotsLeft !== undefined && (
           <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-white/10">
             <p className="text-2xl font-bold text-orange-400">{eventDetails.slotsLeft - filteredRegistrations.filter(reg => reg.status === "COMPLETED").length}</p>
             <p className="text-gray-400 text-sm">Cupos Restantes</p>
           </div>
        )}
      </div>

      {/* Controles de Filtrado y Exportar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4 flex-grow">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o cédula..."
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
            <option value="COMPLETED">Pagadas</option>
            <option value="PENDING_PAYMENT">Pendientes</option>
            <option value="FAILED">Fallidas</option>
          </select>

          <select
            className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="">Todos los Géneros</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>
          
          {eventDetails?.distances && eventDetails.distances.length > 0 && (
            <select
              className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
            >
              <option value="">Todas las Distancias</option>
              {eventDetails.distances.map((dist: string) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          )}

          {eventDetails?.category && eventDetails.category.length > 0 && (
            <select
              className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas las Categorías</option>
              {eventDetails.category.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md hover:from-purple-600 hover:to-indigo-600 transition-colors"
        >
          <FileText size={18} /> Exportar a Excel
        </button>
      </div>

      {filteredRegistrations.length === 0 ? (
        <p className="text-gray-400 text-lg">No hay inscripciones que coincidan con los filtros.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800/50 rounded-lg shadow-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cédula
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Género
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Teléfono
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nacimiento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Distancia
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Talla Camiseta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Reg. Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredRegistrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {reg.user?.name || reg.guestInfo?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.user?.email || reg.guestInfo?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.cedula}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(reg.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.distance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {reg.tshirtSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reg.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      reg.status === "PENDING_PAYMENT" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
