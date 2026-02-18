import { X, User, Calendar, AlertCircle } from "lucide-react";

const DashboardModal = ({ titulo, datos, onClose, tipo }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Encabezado */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${tipo === 'danger' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${tipo === 'danger' ? 'text-red-700' : 'text-orange-700'}`}>
            <AlertCircle size={20} /> {titulo}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Lista Scrollable */}
        <div className="overflow-y-auto p-4 space-y-2">
          {datos.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No hay registros para mostrar.</p>
          ) : (
            datos.map((item, index) => (
              <div key={index} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={16} className="text-slate-400" /> {item.nombre}
                  </p>
                  <p className="text-xs text-slate-500 pl-6">{item.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-1 justify-end">
                    <Calendar size={14} /> 
                    {tipo === 'danger' 
                      ? new Date(item.vencioEl).toLocaleDateString() 
                      : new Date(item.venceEl).toLocaleDateString()}
                  </p>
                  {tipo === 'warning' && (
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                      Quedan {item.diasRestantes} días
                    </span>
                  )}
                  {tipo === 'danger' && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      Vencido
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Cerrar lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;