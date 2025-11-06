import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function EditarTransacao({ onNavigate, transacaoSelecionada }) {
  const id = transacaoSelecionada?.id;
  const tipo = transacaoSelecionada?.tipo;

  const [form, setForm] = useState({
    id: 0,
    nome: "",
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ Toast elegante
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Carrega dados da transação
  useEffect(() => {
    if (!id || !tipo) {
      setError("Transação inválida");
      setLoading(false);
      return;
    }

    const carregar = async () => {
      try {
        const endpoint =
          tipo === "Receita"
            ? `http://localhost:8080/api/receita/${id}`
            : `http://localhost:8080/api/despesa/${id}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Erro ao buscar transação");

        const data = await res.json();

        setForm({
          id: data.id,
          nome: data.nome || "",
          descricao: data.descricao || "",
          valor: data.valor || "",
          data: data.data ? data.data.split("T")[0] : "",
          categoria: data.categoria || "",
        });
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados da transação");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id, tipo]);

  // 🔹 Atualiza campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "data" && value.length > 10) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Salvar alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint =
        tipo === "Receita"
          ? `http://localhost:8080/api/receita/${id}`
          : `http://localhost:8080/api/despesa/${id}`;

      const payload = { ...form, valor: Number(form.valor) };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao atualizar transação");

      showToast("success", "Transação atualizada com sucesso!");
      setTimeout(() => onNavigate("home"), 1200);
    } catch (err) {
      console.error(err);
      showToast("error", "Erro ao atualizar transação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-200">
        <Loader2 className="animate-spin mr-2" />
        Carregando dados...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400">
        {error}
      </div>
    );

  const isReceita = tipo === "Receita";

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-950 to-gray-900 px-6 py-10 text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 🔔 Toast */}
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

      {/* 🧾 Card principal */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative w-full max-w-xl p-10 rounded-3xl backdrop-blur-xl border overflow-hidden ${
          isReceita
            ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.25)]"
            : "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]"
        } bg-gray-900/70`}
      >
        {/* ✨ Glow radial de fundo */}
        <div
          className={`absolute inset-0 rounded-3xl blur-3xl opacity-15 pointer-events-none ${
            isReceita
              ? "bg-gradient-to-t from-green-400/30 to-transparent"
              : "bg-gradient-to-t from-red-500/30 to-transparent"
          }`}
        />

        {/* ✨ Linha de brilho inferior */}
        <div
          className={`absolute bottom-0 left-0 w-full h-[2px] rounded-b-3xl pointer-events-none ${
            isReceita
              ? "bg-gradient-to-r from-transparent via-green-500/40 to-transparent"
              : "bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
          }`}
        />

        {/* Conteúdo */}
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-6">
            <motion.div
              className={`p-4 rounded-full border ${
                isReceita
                  ? "border-green-400/30"
                  : "border-red-400/30"
              } mb-3 shadow-[0_0_20px_rgba(0,0,0,0.4)]`}
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {isReceita ? (
                <ArrowUpCircle
                  size={46}
                  className="text-green-400 drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                />
              ) : (
                <ArrowDownCircle
                  size={46}
                  className="text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                />
              )}
            </motion.div>

            <motion.h1
              className="text-4xl font-extrabold text-center select-none"
              animate={{
                textShadow: isReceita
                  ? [
                      "0 0 8px rgba(34,197,94,0.8)",
                      "0 0 16px rgba(34,197,94,1)",
                      "0 0 8px rgba(34,197,94,0.8)",
                    ]
                  : [
                      "0 0 8px rgba(239,68,68,0.8)",
                      "0 0 16px rgba(239,68,68,1)",
                      "0 0 8px rgba(239,68,68,0.8)",
                    ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: isReceita
                  ? "linear-gradient(90deg,#22c55e,#4ade80,#22c55e)"
                  : "linear-gradient(90deg,#ef4444,#fb7185,#ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Editar {tipo}
            </motion.h1>

            <p className="text-gray-400 text-sm text-center mt-1">
              Atualize as informações da sua {tipo.toLowerCase()}.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Nome *</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full bg-gray-800/60 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Salário, Conta de luz..."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Descrição *
              </label>
              <input
                type="text"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                className="w-full bg-gray-800/60 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Pagamento de conta de energia"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  name="valor"
                  value={form.valor}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full bg-gray-800/60 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full bg-gray-800/60 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Categoria *
              </label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full bg-gray-800/60 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Alimentação, Transporte..."
              />
            </div>

            {/* Botões */}
            <div className="flex justify-center gap-6 pt-6">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all ${
                  saving
                    ? "bg-indigo-500/60 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>

              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="px-6 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

EditarTransacao.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  transacaoSelecionada: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tipo: PropTypes.string.isRequired,
  }).isRequired,
};
