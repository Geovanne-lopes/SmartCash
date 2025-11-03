import PropTypes from "prop-types";
import HomeButton from "./HomeButton";

export default function ErrorScreen({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-6 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-red-400"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 5.25a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zM12 17.25a.937.937 0 100 1.875.937.937 0 000-1.875z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Ops, algo deu errado
        </h1>
        <p className="text-gray-300 mb-6">
          Você tentou salvar sem preencher as informações obrigatórias. Por
          favor, revise os campos e tente novamente.
        </p>
        <div className="flex justify-center">
          <HomeButton onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

ErrorScreen.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
