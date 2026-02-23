import { useState, useEffect } from "react";
import { X, CheckCircle, DollarSign, User, CreditCard, Banknote, Smartphone, Receipt } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const CobroModal = ({ onClose, onSuccess }) => {
  const [socios, setSocios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [seleccion, setSeleccion] = useState({
    socioId: "",
    tipoMembresiaId: ""
  });

  // NUEVO: Estado para el desglose de caja
  const [desglose, setDesglose] = useState({
    efectivo: "",
    transferencia: "",
    tarjeta: "",
    comprobante: ""
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resSocios, resPlanes] = await Promise.all([
          api.get("/Socios"),
          api.get("/TiposMembresia")
        ]);
        setSocios(resSocios.data.filter(s => s.activo));
        setPlanes(resPlanes.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar datos");
      }
    };
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Armamos el paquete de datos EXACTO como lo pide el DTO del backend
        const payload = {
            socioId: parseInt(seleccion.socioId),
            tipoMembresiaId: parseInt(seleccion.tipoMembresiaId),
            montoEfectivo: parseFloat(desglose.efectivo) || 0,
            montoTransferencia: parseFloat(desglose.transferencia) || 0,
            montoTarjeta: parseFloat(desglose.tarjeta) || 0,
            comprobante: desglose.comprobante
        };

        await api.post("/Membresias/renovar", payload);
        
        toast.success("¡Cobro mixto y renovación registrados!");
        onSuccess(); 
        onClose();
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data || "Error al procesar el cobro");
    } finally {
        setLoading(false);
    }
  };

  // Cálculos dinámicos para la UI
  const planSeleccionado = planes.find(p => p.id === parseInt(seleccion.tipoMembresiaId));
  const costoPlan = planSeleccionado ? planSeleccionado.costo : 0;
  
  const totalIngresado = 
    (parseFloat(desglose.efectivo) || 0) + 
    (parseFloat(desglose.transferencia) || 0) + 
    (parseFloat(desglose.tarjeta) || 0);

  // Botón rápido para llenar el efectivo automático
  const autoCompletarEfectivo = () => {
      if (costoPlan > 0) {
          setDesglose({ ...desglose, efectivo: costoPlan.toString(), transferencia: "", tarjeta: "" });
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="bg-green-600 px-6 py-4 border-b border-green-500 flex justify-between items-center text-white shrink-0">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <DollarSign size={24} /> Registrar Cobro
          </h3>
          <button onClick={onClose}><X className="hover:text-green-200" /></button>
        </div>

        <form id="cobro-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><User size={14}/> Socio</label>
                <select
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    value={seleccion.socioId}
                    onChange={e => setSeleccion({...seleccion, socioId: e.target.value})}
                    required
                >
                    <option value="">-- Seleccionar --</option>
                    {socios.map(s => <option key={s.id} value={s.id}>{s.nombre} {s.apellido}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Receipt size={14}/> Plan</label>
                <select
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    value={seleccion.tipoMembresiaId}
                    onChange={e => setSeleccion({...seleccion, tipoMembresiaId: e.target.value})}
                    required
                >
                    <option value="">-- Seleccionar --</option>
                    {planes.map(p => <option key={p.id} value={p.id}>{p.nombre} (${p.costo})</option>)}
                </select>
              </div>
          </div>

          {/* SECCIÓN DESGLOSE DE PAGOS */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="text-sm font-bold text-slate-700">Métodos de Pago</h4>
                  <button type="button" onClick={autoCompletarEfectivo} className="text-xs text-green-600 font-bold hover:underline">
                      Pago exacto en Efectivo
                  </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Efectivo */}
                  <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><Banknote size={14} className="text-emerald-500"/> Efectivo</label>
                      <input 
                          type="number" min="0" step="0.01" placeholder="0.00"
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-green-500"
                          value={desglose.efectivo} onChange={e => setDesglose({...desglose, efectivo: e.target.value})}
                      />
                  </div>
                  {/* Transferencia */}
                  <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><Smartphone size={14} className="text-blue-500"/> Transf.</label>
                      <input 
                          type="number" min="0" step="0.01" placeholder="0.00"
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                          value={desglose.transferencia} onChange={e => setDesglose({...desglose, transferencia: e.target.value})}
                      />
                  </div>
                  {/* Tarjeta */}
                  <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 flex items-center gap-1"><CreditCard size={14} className="text-purple-500"/> Tarjeta</label>
                      <input 
                          type="number" min="0" step="0.01" placeholder="0.00"
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                          value={desglose.tarjeta} onChange={e => setDesglose({...desglose, tarjeta: e.target.value})}
                      />
                  </div>
              </div>

              {/* Si hay transferencia, pedimos el comprobante */}
              {parseFloat(desglose.transferencia) > 0 && (
                  <input 
                      type="text" placeholder="N° de Comprobante / CBU Origen (Opcional)"
                      className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none"
                      value={desglose.comprobante} onChange={e => setDesglose({...desglose, comprobante: e.target.value})}
                  />
              )}
          </div>

          {/* RESUMEN VISUAL */}
          <div className="flex justify-between items-center bg-white border-2 border-slate-100 p-3 rounded-xl">
              <div className="text-sm">
                  <p className="text-slate-500">Costo del plan: <span className="font-bold text-slate-700">${costoPlan}</span></p>
              </div>
              <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total a Ingresar</p>
                  <p className={`text-2xl font-extrabold ${totalIngresado >= costoPlan && costoPlan > 0 ? "text-green-600" : "text-slate-700"}`}>
                      ${totalIngresado}
                  </p>
              </div>
          </div>

        </form>

        <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button 
                type="submit" 
                form="cobro-form"
                disabled={loading || totalIngresado <= 0 || !seleccion.socioId || !seleccion.tipoMembresiaId}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-200"
            >
                {loading ? "Procesando..." : <><CheckCircle size={20} /> Confirmar Pago</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CobroModal;