import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Star, Mail, Lock, User } from "lucide-react";
import PropTypes from "prop-types";

export default function LoginScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  LoginScreen.propTypes = {
    onLogin: PropTypes.func.isRequired, // 🔧 onLogin precisa ser função e é obrigatória
  };

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const storedSession = localStorage.getItem("userSession");
    if (storedSession) {
      const { user } = JSON.parse(storedSession);
      if (user?.nome) onLogin(user.nome);
    }
  }, []);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const senha = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) throw new Error("Usuário ou senha incorretos.");

      const data = await response.json();

      localStorage.setItem(
        "userSession",
        JSON.stringify({
          user: { id: data.id, nome: data.nome, email: data.email },
        })
      );

      onLogin(data.nome || email);
    } catch (err) {
      console.error("Erro no login:", err);
      showToast(err.message || "Falha ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 CADASTRO
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const nome = e.target.nome.value;
    const email = e.target.email.value;
    const senha = e.target.senha.value;

    try {
      const response = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 0,
          nome,
          email,
          senhaHash: senha,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Erro ao criar conta.");
      }

      showToast("Conta criada com sucesso! Faça login.", "success");

      // Volta automaticamente para tela de login
      setTimeout(() => setIsLogin(true), 2000);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      showToast(err.message || "Falha ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={(e) => {
        const moveX = (e.clientX / window.innerWidth - 0.5) * 15;
        const moveY = (e.clientY / window.innerHeight - 0.5) * 15;
        setParallax({ x: moveX, y: moveY });
      }}
      className="relative flex items-center justify-start min-h-screen overflow-hidden 
      bg-[radial-gradient(circle_at_30%_20%,#0f172a_0%,#020617_70%)] text-white"
    >
      {/* 🌠 Fundo de estrelas */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-50"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [Math.random() * window.innerHeight, -50],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 14 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ✴️ Estrelas com parallax */}
      <motion.div
        animate={{ x: parallax.x * 0.6, y: parallax.y * 0.6 }}
        transition={{ type: "spring", stiffness: 25, damping: 10 }}
        className="absolute top-[10%] left-[10%] text-yellow-300 z-10"
      >
        <Star size={40} />
      </motion.div>
      <motion.div
        animate={{ x: -parallax.x * 0.8, y: -parallax.y * 0.8 }}
        transition={{ type: "spring", stiffness: 25, damping: 10 }}
        className="absolute bottom-[15%] right-[10%] text-yellow-300 z-10"
      >
        <Star size={40} />
      </motion.div>

      {/* 🚀 Logo + animação */}
      <motion.div
        animate={{ x: parallax.x * 1.2, y: parallax.y * 1.2 }}
        transition={{ type: "spring", stiffness: 30, damping: 15 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          className="flex items-center gap-8"
          animate={{
            rotate: [-4, 4, -4],
            scale: [0.98, 1.03, 0.98],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="text-indigo-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.9)] relative"
            animate={{
              x: [580, 760],
              y: [0, -8, 0],
              rotate: [-15, -25, -160],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          >
            <div className="absolute w-24 h-6 bg-gradient-to-r from-indigo-400/30 to-transparent blur-md -left-20 top-4 rounded-full"></div>
            <Rocket size={65} strokeWidth={1.5} />
          </motion.div>

          <motion.h1
            className="font-extrabold select-none"
            animate={{
              opacity: [0.7, 1, 0.7],
              rotate: [-3, 2, -5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "5rem",
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(90deg, rgba(168,196,255,1), rgba(120,130,255,1), rgba(190,160,255,1))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 25px rgba(120,130,255,0.5)) drop-shadow(0 0 50px rgba(190,160,255,0.3))",
              transform: "rotate(-2deg)",
            }}
          >
            SmartCash
          </motion.h1>
        </motion.div>
      </motion.div>

      {/* 💳 Card Login/Cadastro */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-md bg-gray-900/60 backdrop-blur-2xl 
        border border-indigo-400/10 p-10 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.2)] ml-[8vw]"
      >
        <div className="text-center mb-6">
          <h2 className="text-sm uppercase tracking-widest text-indigo-400 mb-2">
            Plataforma Financeira Inteligente
          </h2>
          <h1
            className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 
          bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]"
          >
            {isLogin ? "Bem-vindo" : "Crie sua conta"}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            // 🔐 LOGIN
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Sua senha"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                whileHover={{
                  scale: 1.03,
                  backgroundPosition: "200% center",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white 
                bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 
                bg-[length:200%_auto] hover:bg-[position:100%_center] 
                shadow-lg hover:shadow-indigo-500/40 transition"
              >
                {loading ? "Entrando..." : "Entrar 🚀"}
              </motion.button>

              <p className="text-sm text-gray-400 text-center">
                Não tem conta?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Criar agora
                </span>
              </p>
            </motion.form>
          ) : (
            // 🧠 CADASTRO
            <motion.form
              key="signup"
              onSubmit={handleSignup}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="nome"
                  type="text"
                  placeholder="Nome completo"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  name="senha"
                  type="password"
                  placeholder="Senha"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/60 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                whileHover={{
                  scale: 1.03,
                  backgroundPosition: "200% center",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white 
                bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 
                bg-[length:200%_auto] hover:bg-[position:100%_center] 
                shadow-lg hover:shadow-indigo-500/40 transition"
              >
                {loading ? "Criando conta..." : "Criar conta ✨"}
              </motion.button>

              <p className="text-center text-sm text-gray-400 mt-4">
                Já tem conta?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Fazer login
                </span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ✅ Toast global - fora da caixa */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded-xl text-sm font-semibold 
        shadow-[0_0_30px_rgba(0,0,0,0.4)] backdrop-blur-xl border border-white/10 
        z-[9999]
        ${
          toast.type === "error"
            ? "bg-red-500/90 border-red-400/40 text-white"
            : "bg-green-500/90 border-green-400/40 text-white"
        }`}
            style={{
              letterSpacing: "0.3px",
              boxShadow:
                toast.type === "error"
                  ? "0 0 25px rgba(239,68,68,0.5)"
                  : "0 0 25px rgba(34,197,94,0.4)",
            }}
          >
            <div className="flex items-center gap-2">
              {toast.type === "error" ? (
                <span className="text-xl leading-none">❌</span>
              ) : (
                <span className="text-xl leading-none">✅</span>
              )}
              <span>{toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
