import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Socios from "./components/Socios"; // Asegúrate de tener el archivo Socios.jsx creado
import { Toaster } from 'react-hot-toast';
import Membresias from "./components/Membresias";
import Pagos from "./components/Pagos";
import Dashboard from "./components/Dashboard";


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