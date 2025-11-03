import "./App.css";
import { useState } from "react";
import Smc from "./assets/smcash.svg";

// Importar componentes
import Home from "./components/Home";
import EditarPerfil from "./components/EditarPerfil";
import Despesas from "./components/Despesas";
import Receitas from "./components/Receitas";
import ErrorScreen from "./components/ErrorScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("initial");
  const [userName, setUserName] = useState("");

  // Função para navegação
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Handler para login - quando o usuário clica em "Entrar"
  const handleLogin = (e) => {
    e.preventDefault();
    setCurrentScreen("home");
  };

  // Handler para cadastro
  const handleSignup = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica de cadastro
    setCurrentScreen("home");
  };

  // Se estiver nas telas internas (após login), renderizar componente específico
  if (currentScreen === "home") {
    return <Home userName={userName} onNavigate={handleNavigate} />;
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
    return <Despesas userName={userName} onNavigate={handleNavigate} />;
  }

  if (currentScreen === "receitas") {
    return <Receitas userName={userName} onNavigate={handleNavigate} />;
  }

  if (currentScreen === "error") {
    return <ErrorScreen onNavigate={handleNavigate} />;
  }

  // Telas de autenticação
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
        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-3 text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Entrar
      </button>
      <button
        onClick={() => setCurrentScreen("signup")}
        className="flex w-full justify-center rounded-md border border-white bg-transparent px-3 py-3 text-base font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            className="w-full sm:w-auto flex-shrink-0 rounded-md bg-indigo-500 px-3 py-2 text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-base text-gray-400">
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
          <label htmlFor="email" className="sr-only">
            Endereço de email
          </label>
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
          <label htmlFor="password" className="sr-only">
            Senha
          </label>
          <div className="mt-2">
            <input
              placeholder="Digite sua senha"
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            />
          </div>
          <div className="mt-2 text-right">
            <a
              onClick={() => setCurrentScreen("forgotPassword")}
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-base text-gray-400">
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
      <p className="text-base text-center text-gray-300 mb-6">
        Insira seu email para receber o código de 6 dígitos.
      </p>
      <form action="#" method="POST" className="space-y-6">
        <div>
          <label htmlFor="recovery-email" className="sr-only">
            Email
          </label>
          <input
            placeholder="Digite seu e-mail"
            id="recovery-email"
            name="email"
            type="email"
            required
            className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-base font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Enviar Código
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-base text-gray-400">
        <a
          onClick={() => setCurrentScreen("login")}
          className="font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          Voltar para o login
        </a>
      </p>
    </>
  );

  if (currentScreen === "initial") {
    content = InitialButtons;
  } else if (currentScreen === "login") {
    content = LoginForm;
  } else if (currentScreen === "signup") {
    content = SignupForm;
  } else if (currentScreen === "forgotPassword") {
    content = ForgotPasswordScreen;
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Logo e Título */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src={Smc} alt="SmartCash Logo" className="mx-auto h-16 w-auto" />
        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
