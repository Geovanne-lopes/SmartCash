import { useEffect } from "react";
import PropTypes from "prop-types";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function Toast({ type = "info", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // ⏱️ Fecha automaticamente em 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400 w-5 h-5" />,
    error: <XCircle className="text-red-400 w-5 h-5" />,
    warning: <AlertTriangle className="text-yellow-400 w-5 h-5" />,
  };

  const bgColors = {
    success: "bg-green-800/90 border-green-600",
    error: "bg-red-800/90 border-red-600",
    warning: "bg-yellow-800/90 border-yellow-600",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${bgColors[type]} backdrop-blur-md transition-transform animate-fade-in-down`}
    >
      {icons[type]}
      <p className="text-white text-sm font-medium">{message}</p>
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
