import { useState } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";
import InputField from "./InputField";
import SaveCancelButtons from "./SaveCancelButtons";
import HomeButton from "./HomeButton";

export default function Despesas({ onNavigate }) {
  const [formData, setFormData] = useState({
    titulo: "",
    valor: "",
    vencimento: "",
    categoria: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    const isAllEmpty =
      !formData.titulo &&
      !formData.valor &&
      !formData.vencimento &&
      !formData.categoria;
    if (isAllEmpty) {
      if (onNavigate) onNavigate("error");
      return;
    }

    console.log("Salvando despesa:", formData);
    alert("Despesa salva com sucesso!");
    setFormData({ titulo: "", valor: "", vencimento: "", categoria: "" });
  };

  const handleCancel = () => {
    setFormData({ titulo: "", valor: "", vencimento: "", categoria: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Nova Despesa</h2>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg space-y-4">
            <InputField
              label="Título"
              placeholder="Exemplo: Conta de luz"
              type="text"
              value={formData.titulo}
              onChange={handleChange("titulo")}
              required
            />

            <InputField
              label="Valor"
              placeholder="Exemplo: R$ 150,00"
              type="text"
              value={formData.valor}
              onChange={handleChange("valor")}
              required
            />

            <InputField
              label="Vencimento"
              placeholder="Exemplo: 2024-01-15"
              type="date"
              value={formData.vencimento}
              onChange={handleChange("vencimento")}
              required
            />

            <InputField
              label="Categoria"
              placeholder="Exemplo: Utilidades"
              type="text"
              value={formData.categoria}
              onChange={handleChange("categoria")}
              required
            />

            <div className="flex flex-col gap-3 mt-6">
              <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
              <HomeButton onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      </main>

      <FooterPanel currentScreen="despesas" onNavigate={onNavigate} />
    </div>
  );
}

Despesas.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
