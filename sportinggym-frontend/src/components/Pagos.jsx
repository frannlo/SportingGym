import { useState, useEffect } from "react";
import { DollarSign, Calendar, ChevronLeft, ChevronRight, Search, Printer } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";
import CobroModal from "./CobroModal";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const { data } = await api.get("/Pagos");
      setPagos(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  const pagosDelDia = pagos.filter(pago => 
    pago.fecha.substring(0, 10) === fechaSeleccionada
  );

  // Calculamos el total del día
  const totalDia = pagosDelDia.reduce((acc, curr) => acc + curr.monto, 0);

  // Funciones para cambiar de día
  const cambiarDia = (dias) => {
    const fecha = new Date(fechaSeleccionada);
    fecha.setDate(fecha.getDate() + dias);
    setFechaSeleccionada(fecha.toISOString().split('T')[0]);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando caja...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Encabezado y Selector de Fecha */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Control de Caja</h2>
          <p className="text-slate-500">Seguimiento diario de ingresos.</p>
        </div>

        <button 
                onClick={() => setShowModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all"
            >
                <DollarSign size={20} /> Registrar Cobro
            </button>

        {/* Control de Fecha */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => cambiarDia(-1)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Día anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="relative">
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          <button 
            onClick={() => cambiarDia(1)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Día siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Tarjeta de Resumen del Día */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total del Día */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-blue-100 font-medium mb-1">Total Recaudado (Día)</p>
                    <h3 className="text-4xl font-bold">${totalDia.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign size={32} />
                </div>
            </div>
            <div className="mt-6 text-sm text-blue-100 flex gap-2">
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">
                    {pagosDelDia.length}
                </span> movimientos registrados hoy.
            </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <Printer size={40} className="text-slate-300 mb-3" />
            <h4 className="font-bold text-slate-600">Reporte de Cierre</h4>
            <p className="text-sm text-slate-400 mb-4">Imprime el detalle para el control físico.</p>
            <button 
                onClick={() => window.print()}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
                Imprimir Comprobante
            </button>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Movimientos Detallados</h3>
            <span className="text-xs font-mono text-slate-400">
                {new Date(fechaSeleccionada).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="p-4 font-semibold w-32">Hora</th>
              <th className="p-4 font-semibold">Socio</th>
              <th className="p-4 font-semibold">Concepto / Plan</th>
              <th className="p-4 font-semibold text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {pagosDelDia.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={32} className="opacity-50" />
                    <p>No hubo movimientos en esta fecha.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagosDelDia.map((pago) => (
                <tr key={pago.id} className="hover:bg-slate-50 transition-colors">
                  {/* Hora */}
                  <td className="p-4 font-mono text-slate-500">
                    {new Date(pago.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  
                  {/* Socio */}
                  <td className="p-4 font-medium text-slate-800">
                    {pago.socio ? `${pago.socio.nombre} ${pago.socio.apellido}` : "Socio Eliminado"}
                  </td>
                  <td className="p-4 text-slate-600">
                    Pago de Membresía
                  </td>
                  {/* Monto */}
                  <td className="p-4 text-right font-bold text-slate-700">
                    ${pago.monto.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Pie de tabla con total */}
          {pagosDelDia.length > 0 && (
            <tfoot className="bg-slate-50 font-bold text-slate-800">
                <tr>
                    <td colSpan="3" className="p-4 text-right uppercase text-xs tracking-wider text-slate-500">Total Día:</td>
                    <td className="p-4 text-right text-lg border-t-2 border-slate-200">${totalDia.toLocaleString()}</td>
                </tr>
            </tfoot>
          )}
        </table>
      </div>
      {showModal && (
        <CobroModal 
            onClose={() => setShowModal(false)}
            onSuccess={() => {
                cargarPagos();      // Recargar la tabla de pagos
                // Opcional: Si muestras alertas de "caja actualizada", aquí irían
            }}
        />
      )}
    </div>
  );
};

export default Pagos;