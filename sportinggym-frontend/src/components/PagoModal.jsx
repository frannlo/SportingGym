import { useState, useEffect } from "react";
import { X, Save, DollarSign, CreditCard, ArrowRightLeft } from "lucide-react"; // ArrowRightLeft icono para transferencia
import api from "../config/api";
import toast from "react-hot-toast";

const PagoModal = ({ onClose, onSuccess }) => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    socioId: "",
    monto: "",
    metodoPagoId: 1 // 1: Efectivo, 2: Transferencia, 3: Tarjeta
  });

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

  // VALIDACIÓN DE MONTO (Solo números y un punto)
  const handleMontoChange = (e) => {
    const val = e.target.value;
    // Regex: Solo permite dígitos y opcionalmente un punto decimal
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setFormData({ ...formData, monto: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.socioId) return toast.error("Selecciona un socio");
    if (!formData.monto || parseFloat(formData.monto) <= 0) return toast.error("Ingresa un monto válido");
    
    setLoading(true);
    try {
      const payload = {
        socioId: parseInt(formData.socioId),
        monto: parseFloat(formData.monto),
        metodoPagoId: parseInt(formData.metodoPagoId),
      };

      await api.post("/Pagos", payload);
      toast.success("¡Pago registrado con éxito!");
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(", ")
        : "Error al registrar el pago";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="text-green-600" size={20} /> Registrar Ingreso
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Selector de Socio */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Socio</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
              value={formData.socioId}
              onChange={(e) => setFormData({...formData, socioId: e.target.value})}
              required
            >
              <option value="">-- Seleccionar quién paga --</option>
              {socios.map(s => (
                <option key={s.id} value={s.id}>
                  {s.nombre} {s.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Monto (Input Texto sin flechas) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Monto ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input 
                type="text" 
                className="w-full pl-8 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg text-slate-700 placeholder-slate-300"
                placeholder="0.00"
                value={formData.monto}
                onChange={handleMontoChange}
                required
              />
            </div>
          </div>

          {/* Método de Pago (3 Botones) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Opción 1: Efectivo */}
              <button
                type="button"
                onClick={() => setFormData({...formData, metodoPagoId: 1})}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-medium ${
                  formData.metodoPagoId === 1 
                    ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500" 
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <DollarSign size={18} /> Efectivo
              </button>

              {/* Opción 2: Transferencia (NUEVO) */}
              <button
                type="button"
                onClick={() => setFormData({...formData, metodoPagoId: 2})}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-medium ${
                  formData.metodoPagoId === 2 
                    ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500" 
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ArrowRightLeft size={18} /> Transf.
              </button>

              {/* Opción 3: Tarjeta */}
              <button
                type="button"
                onClick={() => setFormData({...formData, metodoPagoId: 3})}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-medium ${
                  formData.metodoPagoId === 3 
                    ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500" 
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <CreditCard size={18} /> Tarjeta
              </button>

            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? "..." : <><Save size={20} /> Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PagoModal;