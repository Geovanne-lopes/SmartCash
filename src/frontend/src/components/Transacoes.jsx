import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";
import InputField from "./InputField";
import SaveCancelButtons from "./SaveCancelButtons";
import Toast from "./Toast";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export default function Despesas({ onNavigate, onAddTransaction }) {
  const [activeTab, setActiveTab] = useState("despesas");
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    valor: "",
    vencimento: "",
    categoria: "",
  });
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

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

  const handleSave = async () => {
    if (!formData.titulo || !formData.valor || !formData.vencimento) {
      showToast(
        "warning",
        "Preencha Título, Valor e Vencimento antes de salvar."
      );
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
      const endpoint =
        activeTab === "despesas"
          ? "http://localhost:8080/api/despesa"
          : "http://localhost:8080/api/receita";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTransacao),
      });

      if (!response.ok) throw new Error(`Erro ao salvar: ${response.status}`);

      const saved = await response.json();

      if (onAddTransaction) {
        onAddTransaction({
          id: saved.id || Date.now(),
          descricao: saved.titulo,
          valor: saved.valor,
          data: saved.vencimento,
          tipo: saved.tipo,
        });
      }

      showToast(
        "success",
        `${activeTab === "despesas" ? "Despesa" : "Receita"} salva com sucesso!`
      );

      setFormData({
        titulo: "",
        descricao: "",
        valor: "",
        vencimento: "",
        categoria: "",
      });

      setTimeout(() => {
        if (onNavigate) onNavigate("home");
      }, 1000);
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
      showToast("error", "Erro ao salvar no servidor. Verifique o console.");
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
    if (onNavigate) onNavigate("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 pb-24">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 px-6 py-10 flex justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl w-full bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-3xl shadow-[0_8px_40px_-15px_rgba(0,0,0,0.8)] p-10"
        >
          {/* Tabs separadas visualmente */}
          <div className="flex justify-center mb-10 gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("despesas")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-base transition-all shadow-md border ${
                {
                  despesas:
                    activeTab === "despesas"
                      ? "bg-red-600 text-white border-red-500"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700",
                }["despesas"]
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Despesas
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("receitas")}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-base transition-all shadow-md border ${
                {
                  receitas:
                    activeTab === "receitas"
                      ? "bg-green-600 text-white border-green-500"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700",
                }["receitas"]
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Receitas
            </motion.button>
          </div>

          <h2 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-md">
            {activeTab === "despesas" ? "Nova Despesa" : "Nova Receita"}
          </h2>

          <motion.div
            layout
            className="space-y-5 bg-gray-800/60 p-8 rounded-2xl border border-gray-700 shadow-lg backdrop-blur-sm"
          >
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

            <div className="grid sm:grid-cols-2 gap-6">
              <InputField
                label="Valor"
                placeholder="R$ 150,00"
                type="number"
                value={formData.valor}
                onChange={handleChange("valor")}
                required
              />

              <InputField
                label="Vencimento"
                type="date"
                value={formData.vencimento}
                onChange={handleChange("vencimento")}
                required
              />
            </div>

            <InputField
              label="Categoria"
              placeholder="Exemplo: Utilidades"
              type="text"
              value={formData.categoria}
              onChange={handleChange("categoria")}
            />

            <div className="mt-8 flex justify-center">
              <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
            </div>
          </motion.div>
        </motion.div>
      </main>

      <FooterPanel currentScreen="despesas" onNavigate={onNavigate} />
    </div>
  );
}

Despesas.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onAddTransaction: PropTypes.func,
};
