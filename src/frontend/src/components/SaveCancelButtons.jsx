import PropTypes from "prop-types";

export default function SaveCancelButtons({ onSave, onCancel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={onSave}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Salvar
      </button>
      <button
        onClick={onCancel}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Cancelar
      </button>
    </div>
  );
}

SaveCancelButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
