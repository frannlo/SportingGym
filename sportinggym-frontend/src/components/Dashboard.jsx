import { useState, useEffect } from "react";
import { Users, TrendingUp, AlertTriangle, UserCheck, Eye } from "lucide-react"; // Eye icon
import api from "../config/api";
import { Link } from "react-router-dom";
import DashboardModal from "./DashboardModal"; // <--- Importar Modal

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSocios: 0,
    sociosActivos: 0,
    ingresosMes: 0,
    membresiasPorVencer: 0
  });
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [modalData, setModalData] = useState(null); // Datos a mostrar
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info"); // 'danger' o 'warning'

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/Dashboard");
      setStats(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para abrir detalles
  const handleVerVencidos = async () => {
    try {
      const { data } = await api.get("/Dashboard/vencidos");
      setModalTitle("Socios con Cuota Vencida");
      setModalData(data);
      setModalType("danger");
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerPorVencer = async () => {
    try {
      const { data } = await api.get("/Dashboard/por-vencer");
      setModalTitle("Vencimientos Próximos (7 días)");
      setModalData(data);
      setModalType("warning");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando estadísticas...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-slate-500">Resumen de actividad de SportingGym.</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">        
            
        {/* Card 1:Socios activos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Socios Activos</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalSocios}</h3>
          </div>
        </div>

        {/* Card 2: Ingresos Mes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Ingresos (Mes)</p>
            <h3 className="text-2xl font-bold text-slate-800">${stats.ingresosMes.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 3: Activos / Deudores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <UserCheck size={28} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Cuotas al Día</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{stats.sociosActivos}</h3>
                  <span className="text-xs font-medium text-slate-400">
                    de {stats.totalSocios}
                  </span>
                </div>
            </div>
        </div>

        {/* Card 4: Por Vencer  */}
        <div 
            onClick={handleVerPorVencer}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group relative"
        >
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-100 transition-colors">
            <AlertTriangle size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Vencen pronto</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.membresiasPorVencer}</h3>
          </div>
          <Eye size={16} className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Accesos Rápidos (Botón Extra para ver DEUDORES VENCIDOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <button onClick={handleVerVencidos} className="col-span-1 md:col-span-2 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between hover:bg-red-100 transition-colors group">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full text-red-500 shadow-sm">
                    <AlertTriangle size={20} />
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-red-800">Ver lista de Socios Vencidos (Deudores)</h4>
                    <p className="text-xs text-red-600">Haz clic para ver quiénes ya no tienen cuota vigente.</p>
                </div>
            </div>
            <Eye className="text-red-400 group-hover:text-red-600" />
        </button>
      </div>

      {/* Renderizado del Modal */}
      {modalData && (
        <DashboardModal 
            titulo={modalTitle}
            datos={modalData}
            tipo={modalType}
            onClose={() => setModalData(null)}
        />
      )}

    </div>
  );
};

export default Dashboard;