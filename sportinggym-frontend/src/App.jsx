import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Socios from "./components/Socios"; // Asegúrate de tener el archivo Socios.jsx creado
import { Toaster } from 'react-hot-toast';

// Componentes temporales para las otras rutas
const Dashboard = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
    <h1 className="text-2xl font-bold text-slate-800 mb-2">👋 Bienvenido al Panel</h1>
    <p className="text-slate-500">Selecciona una opción del menú para comenzar.</p>
  </div>
);

const Membresias = () => <div className="text-2xl font-bold text-slate-800">Módulo de Membresías (Próximamente)</div>;
const Pagos = () => <div className="text-2xl font-bold text-slate-800">Módulo de Pagos (Próximamente)</div>;

function App() {
  return (
    <Layout>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/membresias" element={<Membresias />} />
        <Route path="/pagos" element={<Pagos />} />
      </Routes>
    </Layout>
  );
}

export default App;