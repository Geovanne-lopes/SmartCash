import "./App.css";
import { useState, useEffect } from "react";
import Smc from "./assets/smcash.svg";

// 🧩 Telas do sistema
import EditarPerfil from "./components/EditarPerfil";
import Despesas from "./components/Transacoes";
import Home from "./components/Home";
import ErrorScreen from "./components/ErrorScreen";
import EditarTransacao from "./components/EditarTransacao";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("initial");
  const [userName, setUserName] = useState("");
  const [addTransactionCallback, setAddTransactionCallback] = useState(null);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

  // 🕒 Verifica sessão com expiração de 3 minutos
  useEffect(() => {
    const storedSession = localStorage.getItem("userSession");

    if (storedSession) {
      const { user, expiresAt } = JSON.parse(storedSession);
      const now = new Date().getTime();

      if (now < expiresAt) {
        setUserName(user.nome);
        setCurrentScreen("home");
      } else {
        // sessão expirada
        localStorage.removeItem("userSession");
        setCurrentScreen("initial");
      }
    }
  }, []);

  // 🔹 Navegação entre telas
  const handleNavigate = (screen, data = null) => {
    if (data) setTransacaoSelecionada(data);
    setCurrentScreen(screen);
  };

  // 🔹 Callback para adicionar transações
  const handleAddTransaction = (transacao) => {
    if (addTransactionCallback) addTransactionCallback(transacao);
  };

  const handleRegisterTransactionCallback = (callback) => {
    setAddTransactionCallback(() => callback);
  };

  // 🔐 Login com expiração automática
  const handleLoginSuccess = (nome) => {
    const expiresAt = new Date().getTime() + 3 * 60 * 1000; // 3 minutos
    const user = { nome };

    localStorage.setItem("userSession", JSON.stringify({ user, expiresAt }));

    setUserName(nome);
    setCurrentScreen("home");
  };

  // 🚪 Logout manual
  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setUserName("");
    setCurrentScreen("initial");
  };

  // 🔹 Renderização condicional
  if (currentScreen === "home") {
    return (
      <Home
        userName={userName}
        onNavigate={handleNavigate}
        onAddTransaction={handleRegisterTransactionCallback}
        onLogout={handleLogout} // ✅ logout aqui
      />
    );
  }

  if (currentScreen === "editarPerfil") {
    return (
      <EditarPerfil
        userName={userName}
        onNavigate={handleNavigate}
        onUpdateUserName={setUserName}
      />
    );
  }

  if (currentScreen === "despesas") {
    return (
      <Despesas
        userName={userName}
        onNavigate={handleNavigate}
        onAddTransaction={handleAddTransaction}
      />
    );
  }

  if (currentScreen === "editarTransacao") {
    return (
      <EditarTransacao
        onNavigate={handleNavigate}
        transacaoSelecionada={transacaoSelecionada}
      />
    );
  }

  if (currentScreen === "error") {
    return <ErrorScreen onNavigate={handleNavigate} />;
  }

  // 🌌 Tela inicial (Login animado)
  if (currentScreen === "initial") {
    return (
      <LoginScreen
        onLogin={handleLoginSuccess}
        onNavigate={handleNavigate}
      />
    );
  }

  // 🔁 Fallback visual
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <img src={Smc} alt="SmartCash Logo" className="h-16 mx-auto mb-4" />
        <p>Carregando...</p>
      </div>
    </div>
  );
}
