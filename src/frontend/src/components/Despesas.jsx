import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";
import InputField from "./InputField";
import SaveCancelButtons from "./SaveCancelButtons";

export default function Despesas({ onNavigate, onAddTransaction }) {
  const [activeTab, setActiveTab] = useState("despesas"); // "despesas" ou "receitas"
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    vencimento: "",
    categoria: "",
  });

  // Limpar formulário quando mudar de aba
  useEffect(() => {
    setFormData({
      titulo: "",
      descricao: "",
      valor: "",
      vencimento: "",
      categoria: "",
    });
  }, [activeTab]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // O useEffect já limpa o formulário quando activeTab muda
  };

  const handleSave = () => {
    // Validar apenas os campos que vão para o histórico: título, valor e vencimento
    if (!formData.titulo || !formData.valor || !formData.vencimento) {
      if (onNavigate) onNavigate("error");
      return;
    }

    // Criar transação usando apenas título, valor e vencimento
    const valor = parseFloat(formData.valor) || 0;
    const valorFinal = activeTab === "despesas" ? -Math.abs(valor) : Math.abs(valor);
    
    const novaTransacao = {
      id: Date.now(),
      tipo: activeTab === "despesas" ? "Despesa" : "Receita",
      descricao: formData.titulo, // Usar título como descrição no histórico
      valor: valorFinal, // Negativo para despesas, positivo para receitas
      data: formData.vencimento,
    };

    // Adicionar ao histórico via callback
    if (onAddTransaction) {
      onAddTransaction(novaTransacao);
    }

    console.log("Salvando:", activeTab, formData);
    alert(`${activeTab === "despesas" ? "Despesa" : "Receita"} salva com sucesso!`);
    setFormData({ titulo: "", descricao: "", valor: "", vencimento: "", categoria: "" });
  };

  const handleCancel = () => {
    setFormData({ titulo: "", descricao: "", valor: "", vencimento: "", categoria: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto w-full">
          {/* Botão de transição acima do título */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="inline-flex rounded-lg bg-gray-800 dark:bg-gray-800 p-1">
              <button
                onClick={() => handleTabChange("despesas")}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "despesas"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-300 dark:text-gray-300 hover:text-white"
                }`}
              >
                Despesas
              </button>
              <button
                onClick={() => handleTabChange("receitas")}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === "receitas"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-300 dark:text-gray-300 hover:text-white"
                }`}
              >
                Receitas
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4 sm:mb-6">
            {activeTab === "despesas" ? "Despesas" : "Receitas"}
          </h2>

          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg space-y-4">
            <InputField
              label="Título"
              placeholder="Exemplo: Conta de luz"
              type="text"
              value={formData.titulo}
              onChange={handleChange("titulo")}
              required
            />

            <InputField
              label="Descrição"
              placeholder="Exemplo: Pagamento da conta de energia elétrica"
              type="text"
              value={formData.descricao}
              onChange={handleChange("descricao")}
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
            />

            <div className="flex flex-col gap-3 mt-6">
              <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
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
  onAddTransaction: PropTypes.func,
};
