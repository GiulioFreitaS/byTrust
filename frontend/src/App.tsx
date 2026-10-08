// ── App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { I18nProvider } from "./hooks/useI18n";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Verificador from "./pages/Verificador";
import Perfil from "./pages/Perfil";
import Feed from "./pages/Feed";
import Educacao from "./pages/Educacao";
import Cartilhas from "./pages/cartilhas";
import Contato from "./pages/contato";
import EsqueciSenha from "./pages/esqueci-senha";
import RedefinirSenha from "./pages/redefinir-senha";
import Privacidade from "./pages/privacidade";
import Termos from "./pages/termos";

export default function App() {
  return (
    // I18nProvider envolve tudo — disponível em qualquer componente
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/verificar" element={<Verificador />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/aprender" element={<Educacao />} />
            <Route path="/cartilhas" element={<Cartilhas />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}