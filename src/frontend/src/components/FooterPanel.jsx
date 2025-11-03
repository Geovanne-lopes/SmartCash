import PropTypes from "prop-types";

export default function FooterPanel({ currentScreen, onNavigate }) {
  const panels = [
    { id: "editarPerfil", label: "Editar Perfil" },
    { id: "despesas", label: "Despesas" },
    { id: "receitas", label: "Receitas" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {panels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => onNavigate(panel.id)}
            className={`flex-1 py-2 px-4 mx-1 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
              currentScreen === panel.id
                ? "bg-indigo-500 text-white font-semibold shadow-lg ring-2 ring-indigo-400"
                : "text-gray-200 hover:text-white hover:bg-white/10 active:bg-white/20"
            }`}
          >
            {panel.label}
          </button>
        ))}
      </div>
    </footer>
  );
}

FooterPanel.propTypes = {
  currentScreen: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
};
