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
  };

  const handleSave = async () => {
    // Validação dos campos obrigatórios
    if (!formData.titulo || !formData.valor || !formData.vencimento) {
      if (onNavigate) onNavigate("error");
      alert("Preencha Título, Valor e Vencimento antes de salvar.");
      return;
    }

    const valor = parseFloat(formData.valor) || 0;
    const valorFinal =
      activeTab === "despesas" ? -Math.abs(valor) : Math.abs(valor);

    const novaTransacao = {
      nome: formData.titulo,
      descricao: formData.descricao,
      valor: valorFinal,
      data: formData.vencimento,
      categoria: formData.categoria,
    };

    try {
      let response;

      if (activeTab === "despesas") {
        response = await fetch("http://localhost:8080/api/despesa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaTransacao),
        });
      } else {
        response = await fetch("http://localhost:8080/api/receita", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novaTransacao),
        });
      }

      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${response.status}`);
      }

      const saved = await response.json();
      console.log("Resposta do servidor:", saved);

      // Atualiza o histórico local (caso exista)
      if (onAddTransaction) {
        onAddTransaction({
          id: saved.id || Date.now(),
          descricao: saved.titulo,
          valor: saved.valor,
          data: saved.vencimento,
          tipo: saved.tipo,
        });
      }

      alert(
        `${activeTab === "despesas" ? "Despesa" : "Receita"} salva com sucesso!`
      );
      setFormData({
        titulo: "",
        descricao: "",
        valor: "",
        vencimento: "",
        categoria: "",
      });
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      alert(
        "Erro ao salvar no servidor. Verifique o console para mais detalhes."
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      titulo: "",
      descricao: "",
      valor: "",
      vencimento: "",
      categoria: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto w-full">
          {/* Alternância entre Despesas e Receitas */}
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
