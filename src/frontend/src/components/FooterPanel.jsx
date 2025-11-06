import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ArrowLeftRight, UserCog, LogOut } from "lucide-react";

export default function FooterPanel({ currentScreen, onNavigate }) {
  // ⚙️ Itens de navegação (sem o Home)
  const navItems = [
    { id: "editarPerfil", label: "Editar Perfil", icon: <UserCog size={21} /> },
    { id: "despesas", label: "Despesas e Receitas", icon: <ArrowLeftRight size={20} /> },
  ];

  // 🚪 Função de logout
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // limpa sessão
    window.location.href = "/login"; // redireciona pra tela de login
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 shadow-[0_-3px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="max-w-4xl mx-auto flex justify-around items-center py-3">

        {/* 🔘 Botão Editar Perfil */}
        <motion.button
          onClick={() => onNavigate("editarPerfil")}
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -3 }}
          className={`flex flex-col items-center justify-center text-sm font-medium transition-all duration-300 ${
            currentScreen === "editarPerfil"
              ? "text-green-400 scale-110"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <UserCog size={21} />
          <span className="text-xs mt-1">Editar Perfil</span>
        </motion.button>

        {/* 🚪 Botão de Logout Centralizado */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.2, y: -2 }}
          className="flex flex-col items-center justify-center text-sm font-medium text-red-400 hover:text-red-300 transition-all duration-300"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1 font-semibold">Sair</span>
        </motion.button>

        {/* 💰 Botão Despesas */}
        <motion.button
          onClick={() => onNavigate("despesas")}
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -3 }}
          className={`flex flex-col items-center justify-center text-sm font-medium transition-all duration-300 ${
            currentScreen === "despesas"
              ? "text-green-400 scale-110"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <ArrowLeftRight size={20} />
          <span className="text-xs mt-1">Despesas</span>
        </motion.button>
      </div>
    </motion.footer>
  );
}

FooterPanel.propTypes = {
  currentScreen: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
};
