import { useState, useEffect } from "react";
import { DollarSign, Calendar, CreditCard, Search, ArrowUpRight } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
import PagoModal from "./PagoModal";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const { data } = await api.get("/Pagos"); 
      setPagos(data);
    } catch (error) {
      console.error(error);
      toast.error("Error cargando la caja");
    } finally {
      setLoading(false);
    }
  };

  const pagosFiltrados = pagos.filter(p => 
    p.nombreSocio?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalIngresos = pagos.reduce((acc, curr) => acc + curr.monto, 0);

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando caja...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Ingresos Totales</p>
            <h2 className="text-3xl font-bold">${totalIngresos.toLocaleString()}</h2>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <DollarSign size={32} className="text-green-400" />
          </div>
        </div>
      </div>

      {/* Barra de Herramientas */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar pago por socio..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        
        <button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all">
          <DollarSign size={20} /> Registrar Ingreso 
        </button>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Fecha</th>
              <th className="p-4 font-semibold">Socio</th>
              <th className="p-4 font-semibold">Concepto</th>
              <th className="p-4 font-semibold">Método</th>
              <th className="p-4 font-semibold text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No hay movimientos registrados.
                </td>
              </tr>
            ) : (
              pagosFiltrados.map((pago) => (
                <tr key={pago.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    {new Date(pago.fecha).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {pago.nombreSocio}
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    Cuota Mensual 
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <CreditCard size={12} />
                        {pago.metodo || "Efectivo"} 
                    </span>
                  </td>
                  
                  {/* --- AQUÍ ESTABA EL ERROR: FALTABA ESTA COLUMNA --- */}
                  <td className="p-4 text-right font-bold text-slate-700">
                    ${pago.monto?.toLocaleString()}
                  </td>
                  {/* -------------------------------------------------- */}

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <PagoModal 
          onClose={() => setShowModal(false)}
          onSuccess={cargarPagos}
        />
      )}    
    </div>
  );
};

export default Pagos;