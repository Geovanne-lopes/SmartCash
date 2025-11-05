import "./App.css";
import { useState } from "react";
import Smc from "./assets/smcash.svg";

import EditarPerfil from "./components/EditarPerfil";
import Despesas from "./components/Transacoes";
import Home from "./components/Home";
import ErrorScreen from "./components/ErrorScreen";
import EditarTransacao from "./components/EditarTransacao"; // 🔹 novo import

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("initial");
  const [userName, setUserName] = useState("");
  const [addTransactionCallback, setAddTransactionCallback] = useState(null);

  // 🔹 Estado para guardar a transação selecionada (id + tipo)
  const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);

  // 🔹 handleNavigate agora aceita dados extras
  const handleNavigate = (screen, data = null) => {
    if (data) setTransacaoSelecionada(data);
    setCurrentScreen(screen);
  };

  const handleAddTransaction = (transacao) => {
    if (addTransactionCallback) {
      addTransactionCallback(transacao);
    }
  };

  const handleRegisterTransactionCallback = (callback) => {
    setAddTransactionCallback(() => callback);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login: " + response.status);
      }

      const data = await response.json();
      console.log("Usuário logado:", data);

      setUserName(data.nome || email);
      setCurrentScreen("home");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha no login. \nVerifique seu e-mail e senha.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const nome = e.target[0].value;
    const email = e.target[1].value;
    const senhaHash = e.target[2].value;
    const confirmarSenha = e.target[3].value;

    if (senhaHash !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senhaHash }),
      });

      const responseText = await response.text();
      console.log("Status:", response.status);
      console.log("Resposta completa:", responseText);

      if (!response.ok) {
        let errorMessage = "Erro ao cadastrar usuário.";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      console.log("Usuário cadastrado com sucesso:", data);

      setUserName(data.nome || nome);
      setCurrentScreen("home");
    } catch (error) {
      console.error("Erro capturado:", error);
      alert(error.message || "Falha ao cadastrar usuário. Tente novamente.");
    }
  };

  // 🔹 Controles de telas
  if (currentScreen === "home") {
    return (
      <Home
        userName={userName}
        onNavigate={handleNavigate}
        onAddTransaction={handleRegisterTransactionCallback}
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

  // 🔹 Nova tela: edição de transação
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

  // 🔹 Telas de autenticação / inicial
  let title;
  let content;

  if (currentScreen === "initial") {
    title = "Bem-vindo ao SmartCash";
  } else if (currentScreen === "login") {
    title = "Entre na sua conta";
  } else if (currentScreen === "signup") {
    title = "Crie sua conta";
  } else if (currentScreen === "forgotPassword") {
    title = "Recuperação de Senha";
  }

  const InitialButtons = (
    <div className="space-y-4">
      <button
        onClick={() => setCurrentScreen("login")}
        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-3 text-sm sm:text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Entrar
      </button>
      <button
        onClick={() => setCurrentScreen("signup")}
        className="flex w-full justify-center rounded-md border border-white bg-transparent px-3 py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Criar conta
      </button>
    </div>
  );

  const SignupForm = (
    <>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          placeholder="Digite seu nome"
          type="text"
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
        />
        <input
          placeholder="Digite seu email"
          type="email"
          required
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
        />
        <input
          placeholder="Digite sua senha"
          type="password"
          required
          className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            placeholder="Confirme sua senha"
            type="password"
            required
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto flex-shrink-0 rounded-md bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm sm:text-base text-gray-400">
        Já tem uma conta?{" "}
        <a
          onClick={() => setCurrentScreen("login")}
          className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          Fazer login!
        </a>
      </p>
    </>
  );

  const LoginForm = (
    <>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input
            placeholder="Digite seu e-mail"
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          />
        </div>

        <div>
          <input
            placeholder="Digite sua senha"
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          />
          <div className="mt-2 text-right">
            <a
              onClick={() => setCurrentScreen("forgotPassword")}
              className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm sm:text-base text-gray-400">
        Não tem uma conta?{" "}
        <a
          onClick={() => setCurrentScreen("signup")}
          className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          Venha fazer parte do SmartCash!
        </a>
      </p>
    </>
  );

  const ForgotPasswordScreen = (
    <>
      <p className="text-sm sm:text-base text-center text-gray-300 mb-4">
        Insira seu email para receber o código de 6 dígitos.
      </p>
      <form action="#" method="POST" className="space-y-6">
        <input
          placeholder="Digite seu e-mail"
          id="recovery-email"
          name="email"
          type="email"
          required
          className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
        />

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Enviar Código
        </button>
      </form>

      <p className="mt-6 text-center text-sm sm:text-base text-gray-400">
        <a
          onClick={() => setCurrentScreen("login")}
          className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          Voltar para o login
        </a>
      </p>
    </>
  );

  if (currentScreen === "initial") content = InitialButtons;
  else if (currentScreen === "login") content = LoginForm;
  else if (currentScreen === "signup") content = SignupForm;
  else if (currentScreen === "forgotPassword") content = ForgotPasswordScreen;

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src={Smc}
          alt="SmartCash Logo"
          className="mx-auto h-12 sm:h-16 w-auto"
        />
        <h2 className="mt-6 text-center text-xl sm:text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div
          key={currentScreen}
          className="transition-opacity duration-500 ease-in-out opacity-100"
        >
          {content}
        </div>
      </div>
    </div>
  );
}
