import PropTypes from "prop-types";

export default function ErrorScreen({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 dark:bg-gray-900 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 sm:mb-6 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-500/20 dark:bg-red-500/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 sm:w-10 sm:h-10 text-red-400 dark:text-red-400"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 5.25a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zM12 17.25a.937.937 0 100 1.875.937.937 0 000-1.875z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-2">
          Ops, algo deu errado
        </h1>
        <p className="text-gray-300 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
          Você tentou salvar sem preencher as informações obrigatórias. Por
          favor, revise os campos e tente novamente.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center justify-center gap-2 bg-gray-700 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600 text-white dark:text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

ErrorScreen.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
