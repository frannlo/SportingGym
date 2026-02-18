import { useState, useEffect } from "react";
import { X, Check, User } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const VentaModal = ({ plan, onClose, onSuccess }) => {
  const [socios, setSocios] = useState([]);
  const [selectedSocio, setSelectedSocio] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargamos los socios para llenar el selector
  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const { data } = await api.get("/Socios");
        setSocios(data);
      } catch (error) {
        toast.error("Error al cargar socios");
      }
    };
    fetchSocios();
  }, []);

  const handleVenta = async () => {
    if (!selectedSocio) return toast.error("Por favor selecciona un socio");

    setLoading(true);
    try {
      // Estructura del DTO para POST /api/Membresias
      // Asumimos que tu backend calcula FechaFin automáticamente (1 mes)
      const ventaData = {
        socioId: parseInt(selectedSocio),
        tipoMembresiaId: plan.id,
        fechaInicio: new Date().toISOString() // Empieza hoy
      };

      await api.post("/Membresias", ventaData);
      
      toast.success(`¡Membresía vendida correctamente!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Cabecera */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Nueva Venta</h3>
            <p className="text-sm text-blue-600 font-medium">{plan.nombre} - ${plan.costo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <User size={16} /> Seleccionar Socio
            </label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={selectedSocio}
              onChange={(e) => setSelectedSocio(e.target.value)}
            >
              <option value="">-- Buscar socio --</option>
              {socios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} {s.apellido} (DNI: {s.dni})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
            <p>✅ Se asignará vigencia de <strong>1 mes</strong> a partir de hoy.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
          <button onClick={onClose} className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button 
            onClick={handleVenta}
            disabled={loading}
            className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Procesando..." : <><Check size={18} /> Confirmar Venta</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaModal;