import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { ArrowLeftRight, UserCog, LogOut } from "lucide-react";

export default function FooterPanel({ currentScreen, onNavigate, onLogout }) {
  const navItems = [
    {
      id: "editarPerfil",
      label: "Editar Perfil",
      icon: <UserCog size={21} />,
    },
    {
      id: "despesas",
      label: "Despesas e Receitas",
      icon: <ArrowLeftRight size={20} />,
    },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("userSession");
      window.location.href = "/";
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-xl border-t border-gray-800 shadow-[0_-3px_20px_rgba(0,0,0,0.35)] z-50"
    >
      <div className="max-w-4xl mx-auto flex justify-around items-center py-3 relative">
        {/* Botões de navegação */}
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -3 }}
            className={`flex flex-col items-center justify-center text-sm font-medium transition-all duration-300 ${
              currentScreen === item.id
                ? "text-green-400 scale-110"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}

        {/* Botão "Sair" centralizado com brilho sutil */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.15, y: -2 }}
          animate={{
            textShadow: [
              "0 0 6px rgba(239,68,68,0.4)",
              "0 0 12px rgba(239,68,68,0.6)",
              "0 0 6px rgba(239,68,68,0.4)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center justify-center text-sm font-medium text-red-400 hover:text-red-300 transition-all duration-300 absolute left-1/2 -translate-x-1/2"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1 font-semibold">Sair</span>
        </motion.button>
      </div>
    </motion.footer>
  );
}

FooterPanel.propTypes = {
  currentScreen: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};
