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

  const validarData = (dataStr) => /^\d{4}-\d{2}-\d{2}$/.test(dataStr);

  const handleSave = async () => {
    const { titulo, descricao, valor, vencimento, categoria } = formData;

    if (!titulo || !descricao || !valor || !vencimento || !categoria)
      return showToast("warning", "Preencha todos os campos antes de salvar.");

    if (!validarData(vencimento))
      return showToast("error", "Data inválida! Escolha uma data real.");

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0)
      return showToast("error", "Informe um valor válido e maior que zero.");

    const valorFinal = activeTab === "despesas" ? -Math.abs(valorNum) : Math.abs(valorNum);

    const novaTransacao = {
      nome: titulo,
      descricao,
      valor: valorFinal,
      data: vencimento,
      categoria,
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
      if (onAddTransaction)
        onAddTransaction({
          id: saved.id || Date.now(),
          descricao: saved.titulo,
          valor: saved.valor,
          data: saved.vencimento,
          tipo: saved.tipo,
        });

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

      setTimeout(() => onNavigate("home"), 1000);
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
    onNavigate("home");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black pb-24 text-white overflow-hidden">
      {/* ✨ Efeito de brilho radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_80%)] pointer-events-none" />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <main className="flex-1 px-10 py-10 flex justify-center items-start">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`max-w-2xl w-full rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.2)] border ${activeTab === "despesas"
              ? "border-red-500/30 bg-gradient-to-br from-gray-900 via-gray-850 to-red-900/20"
              : "border-green-500/30 bg-gradient-to-br from-gray-900 via-gray-850 to-green-900/20"
            } backdrop-blur-xl p-8`}
        >
          {/* 🏷️ Título com brilho */}
          <motion.h2
            className="text-5xl font-extrabold text-center mb-8 tracking-tight select-none"
            animate={{
              textShadow: [
                "0 0 8px rgba(99,102,241,0.8)",
                "0 0 18px rgba(99,102,241,1)",
                "0 0 8px rgba(99,102,241,0.8)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage:
                activeTab === "despesas"
                  ? "linear-gradient(90deg, #ff5f5f, #ff9f9f, #ff5f5f)"
                  : "linear-gradient(90deg, #22c55e, #86efac, #22c55e)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              filter:
                activeTab === "despesas"
                  ? "drop-shadow(0 0 10px rgba(239,68,68,0.4))"
                  : "drop-shadow(0 0 10px rgba(34,197,94,0.4))",
            }}
          >
            {activeTab === "despesas" ? "Nova Despesa" : "Nova Receita"}
          </motion.h2>

          {/* 🧭 Abas */}
          <div className="flex justify-center mb-10 gap-6">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveTab("despesas")}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base transition-all shadow-md border ${activeTab === "despesas"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
                  : "bg-gray-800/70 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Despesas
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setActiveTab("receitas")}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base transition-all shadow-md border ${activeTab === "receitas"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                  : "bg-gray-800/70 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Receitas
            </motion.button>
          </div>

          {/* 📋 Formulário */}
          <motion.div
            layout
            className="space-y-5 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
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
              required
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
              required
            />

            <div className="mt-8 flex justify-center">
              <SaveCancelButtons onSave={handleSave} onCancel={handleCancel} />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

Despesas.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onAddTransaction: PropTypes.func,
};
