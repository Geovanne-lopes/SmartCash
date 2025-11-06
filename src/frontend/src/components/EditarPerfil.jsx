import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { User, CheckCircle, XCircle } from "lucide-react";
import InputField from "./InputField";
import SaveCancelButtons from "./SaveCancelButtons";

export default function EditarPerfil({
  userName,
  onNavigate,
  onUpdateUserName,
}) {
  const [formData, setFormData] = useState({
    nome: userName || "",
    email: "",
    senha: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const validateField = (field, value) => {
    let message = "";
    if (field === "nome" && !value.trim()) message = "O nome é obrigatório.";
    if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      message = "Email inválido.";
    if (field === "senha" && value.length > 0 && value.length < 8)
      message = "A senha deve ter pelo menos 8 caracteres.";
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  // 💬 Toast
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    const hasError = Object.values(errors).some((err) => err);
    const isAllEmpty = !formData.nome && !formData.email && !formData.senha;

    if (hasError || isAllEmpty) {
      showToast("error", "Preencha os campos corretamente antes de salvar.");
      return;
    }

    setIsSaving(true);
    try {
      const storedSession = JSON.parse(localStorage.getItem("userSession"));
      const usuarioId = storedSession?.user?.id;

      const response = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: usuarioId,
            email: formData.email,
            senhaHash: formData.senha,
            nome: formData.nome,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar perfil.");

      const data = await response.json();
      showToast("success", "Perfil atualizado com sucesso!");
      onUpdateUserName?.(data.nome);

      setTimeout(() => onNavigate?.("home"), 1000);
    } catch (error) {
      console.error("❌ Erro ao atualizar perfil:", error);
      showToast("error", "Falha ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nome: userName || "", email: "", senha: "" });
    onNavigate?.("home");
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black pb-20 text-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_80%)] pointer-events-none" />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-sm font-medium z-50 ${
              toast.type === "success"
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 px-6 sm:px-8 lg:px-12 py-10 flex justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full bg-gray-900/70 backdrop-blur-xl border border-indigo-500/20 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)] p-10"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              className="bg-gray-800/60 p-4 rounded-full mb-4 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <User size={42} className="text-indigo-400" />
            </motion.div>

            <motion.h2
              className="text-4xl font-extrabold mb-2 select-none"
              animate={{
                textShadow: [
                  "0 0 8px rgba(99,102,241,0.8)",
                  "0 0 16px rgba(99,102,241,1)",
                  "0 0 8px rgba(99,102,241,0.8)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(90deg,#818cf8,#a78bfa,#818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Editar Perfil
            </motion.h2>

            <p className="text-gray-400 text-sm">
              Atualize suas informações pessoais e senha com segurança.
            </p>
          </div>

          <motion.div
            layout
            className="space-y-5 bg-gray-800/60 p-8 rounded-2xl border border-gray-700/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]"
          >
            <InputField
              label="Nome"
              placeholder="Digite seu nome completo"
              type="text"
              value={formData.nome}
              onChange={handleChange("nome")}
              required
            />
            {errors.nome && (
              <p className="text-red-400 text-xs mt-1">{errors.nome}</p>
            )}

            <InputField
              label="Email"
              placeholder="Digite seu email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              required
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}

            <InputField
              label="Alterar Senha"
              placeholder="Digite sua nova senha"
              type="password"
              value={formData.senha}
              onChange={handleChange("senha")}
            />
            {errors.senha && (
              <p className="text-red-400 text-xs mt-1">{errors.senha}</p>
            )}

            <div className="mt-8 flex justify-center">
              <SaveCancelButtons
                onSave={handleSave}
                onCancel={handleCancel}
                saving={isSaving}
              />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}

EditarPerfil.propTypes = {
  userName: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  onUpdateUserName: PropTypes.func,
};
