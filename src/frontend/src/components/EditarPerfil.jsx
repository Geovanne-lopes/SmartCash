import { useState } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";
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

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    const isAllEmpty = !formData.nome && !formData.email && !formData.senha;
    if (isAllEmpty) {
      if (onNavigate) onNavigate("error");
      return;
    }

    if (onUpdateUserName) onUpdateUserName(formData.nome || "");
    alert("Perfil salvo com sucesso!");
    if (onNavigate) onNavigate("home");
  };

  const handleCancel = () => {
    setFormData({ nome: userName || "", email: "", senha: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4 sm:mb-6">Editar Perfil</h2>

          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg space-y-4">
            <InputField
              label="Nome"
              placeholder="Digite seu nome"
              type="text"
              value={formData.nome}
              onChange={handleChange("nome")}
              required
            />

            <InputField
              label="Email"
              placeholder="Digite seu email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              required
            />

            <InputField
              label="Alterar Senha"
              placeholder="Digite sua nova senha"
              type="password"
              value={formData.senha}
              onChange={handleChange("senha")}
            />

            <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
          </div>
        </div>
      </main>

      <FooterPanel currentScreen="editarPerfil" onNavigate={onNavigate} />
    </div>
  );
}

EditarPerfil.propTypes = {
  userName: PropTypes.string,
  onNavigate: PropTypes.func.isRequired,
  onUpdateUserName: PropTypes.func,
};
