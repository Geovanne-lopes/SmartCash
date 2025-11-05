import "./App.css";
import { useState } from "react";
import Smc from "./assets/smcash.svg";

// Importar componentes
import EditarPerfil from "./components/EditarPerfil";
import Despesas from "./components/Transacoes";
import Home from "./components/Home";
import ErrorScreen from "./components/ErrorScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("initial");
  const [userName, setUserName] = useState("");
  const [addTransactionCallback, setAddTransactionCallback] = useState(null);

  // Função para navegação
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  // Handler para adicionar transação ao histórico
  const handleAddTransaction = (transacao) => {
    if (addTransactionCallback) {
      addTransactionCallback(transacao);
    }
  };

  // Handler para registrar callback do componente Receitas (Home)
  const handleRegisterTransactionCallback = (callback) => {
    setAddTransactionCallback(() => callback);
  };

  // Handler para login - envia dados ao backend
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer login: " + response.status);
      }

      const data = await response.json();
      console.log("Usuário logado:", data);

      // Se a API retorna nome ou token, salve aqui
      setUserName(data.nome || email); // usa nome retornado ou o e-mail
      // localStorage.setItem("token", data.token); // se o backend tiver JWT

      setCurrentScreen("home"); // vai pra tela principal
    } catch (error) {
      console.error(error);
      alert("Falha no login. Verifique seu e-mail e senha.", error);
    }
  };


  // Handler para cadastro
  const handleSignup = async (e) => {
    e.preventDefault();

    const nome = e.target[0].value;     // primeiro input do form
    const email = e.target[1].value;    // segundo input
    const senha = e.target[2].value;    // terceiro input
    const confirmarSenha = e.target[3].value; // quarto input

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário: " + response.status);
      }

      const data = await response.json();
      console.log("Usuário cadastrado com sucesso:", data);

      // Se o backend retorna o usuário criado, podemos usar o nome retornado
      setUserName(data.nome || nome);
      setCurrentScreen("home");
    } catch (error) {
      console.error(error);
      alert("Falha ao cadastrar usuário. Tente novamente.");
    }
  };


  // Se estiver nas telas internas (após login), renderizar componente específico
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
        className="flex w-full justify-center rounded-md bg-indigo-500 dark:bg-indigo-500 px-3 py-3 text-sm sm:text-base font-semibold text-white dark:text-white hover:bg-indigo-400 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        Entrar
      </button>
      <button
        onClick={() => setCurrentScreen("signup")}
        className="flex w-full justify-center rounded-md border border-white dark:border-white bg-transparent px-3 py-3 text-sm sm:text-base font-semibold text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            className="w-full sm:w-auto flex-shrink-0 rounded-md bg-indigo-500 dark:bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white dark:text-white hover:bg-indigo-400 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Cadastrar
          </button>
        </div>
      </form>

      <p className="mt-6 sm:mt-10 text-center text-sm sm:text-base text-gray-400 dark:text-gray-400">
        Já tem uma conta?{" "}
        <a
          onClick={() => setCurrentScreen("login")}
          className="font-semibold text-indigo-400 dark:text-indigo-400 hover:text-indigo-300 dark:hover:text-indigo-300 cursor-pointer"
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
              className="text-xs sm:text-sm font-semibold text-indigo-400 dark:text-indigo-400 hover:text-indigo-300 dark:hover:text-indigo-300 cursor-pointer"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 dark:bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white dark:text-white hover:bg-indigo-400 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-6 sm:mt-10 text-center text-sm sm:text-base text-gray-400 dark:text-gray-400">
        Não tem uma conta?{" "}
        <a
          onClick={() => setCurrentScreen("signup")}
          className="font-semibold text-indigo-400 dark:text-indigo-400 hover:text-indigo-300 dark:hover:text-indigo-300 cursor-pointer"
        >
          Venha fazer parte do SmartCash!
        </a>
      </p>
    </>
  );

  const ForgotPasswordScreen = (
    <>
      <p className="text-sm sm:text-base text-center text-gray-300 dark:text-gray-300 mb-4 sm:mb-6">
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
            className="flex w-full justify-center rounded-md bg-indigo-500 dark:bg-indigo-500 px-3 py-2 text-sm sm:text-base font-semibold text-white dark:text-white hover:bg-indigo-400 dark:hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Enviar Código
          </button>
        </div>
      </form>

      <p className="mt-6 sm:mt-10 text-center text-sm sm:text-base text-gray-400 dark:text-gray-400">
        <a
          onClick={() => setCurrentScreen("login")}
          className="font-semibold text-indigo-400 dark:text-indigo-400 hover:text-indigo-300 dark:hover:text-indigo-300 cursor-pointer"
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
        <img
          src={Smc}
          alt="SmartCash Logo"
          className="mx-auto h-12 sm:h-16 w-auto"
        />
        <h2 className="mt-6 sm:mt-8 text-center text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-white">
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
