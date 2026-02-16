import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Socios from "./components/Socios"; // <--- Importamos el nuevo archivo

// Placeholders para las otras páginas (por ahora)
const Dashboard = () => <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Panel</h1>;
const Membresias = () => <h1 className="text-3xl font-bold text-gray-800">Planes</h1>;
const Pagos = () => <h1 className="text-3xl font-bold text-gray-800">Caja</h1>;

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} /> {/* <--- Usamos el componente */}
        <Route path="/membresias" element={<Membresias />} />
        <Route path="/pagos" element={<Pagos />} />
      </Routes>
    </Layout>
  );
}

export default App;