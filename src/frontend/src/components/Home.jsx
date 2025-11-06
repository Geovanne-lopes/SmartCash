import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FooterPanel from "./FooterPanel";
import ConfirmDialog from "./ConfirmDialog";

export default function Home({ onNavigate, onLogout }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    id: null,
    tipo: null,
  });

  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      const [resReceitas, resDespesas] = await Promise.all([
        fetch("http://localhost:8080/api/receita"),
        fetch("http://localhost:8080/api/despesa"),
      ]);

      if (!resReceitas.ok || !resDespesas.ok)
        throw new Error("Erro ao carregar dados do servidor");

      const [receitas, despesas] = await Promise.all([
        resReceitas.json(),
        resDespesas.json(),
      ]);

      const receitasComTipo = receitas.map((r) => ({ ...r, tipo: "Receita" }));
      const despesasComTipo = despesas.map((d) => ({ ...d, tipo: "Despesa" }));

      const historicoCompleto = [...receitasComTipo, ...despesasComTipo].sort(
        (a, b) => new Date(b.data) - new Date(a.data)
      );

      setHistorico(historicoCompleto);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const receitas = useMemo(
    () =>
      historico
        .filter((i) => i.tipo === "Receita")
        .reduce((s, i) => s + (Number(i.valor) || 0), 0),
    [historico]
  );

  const despesas = useMemo(
    () =>
      Math.abs(
        historico
          .filter((i) => i.tipo === "Despesa")
          .reduce((s, i) => s + (Number(i.valor) || 0), 0)
      ),
    [historico]
  );

  const saldoConta = receitas - despesas;

  const formatCurrency = (v) => {
    if (v == null || isNaN(v)) return "R$ 0,00";
    const isNegative = v < 0;
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(v));
    return isNegative ? `R$ -${formatted.replace("R$", "").trim()}` : formatted;
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d) ? "--/--/----" : d.toLocaleDateString("pt-BR");
  };

  // 💹 Gera o gráfico com base nas transações reais
  const chartData = useMemo(() => {
    if (!historico || historico.length === 0) return [];

    const sorted = [...historico].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );

    let saldoAcumulado = 0;
    const data = sorted.map((item, index) => {
      saldoAcumulado += Number(item.valor) || 0;
      return {
        name: `#${index + 1}`,
        saldo: saldoAcumulado,
        tipo: item.tipo,
        data: item.data,
      };
    });

    return data;
  }, [historico]);

  const handleDeleteClick = (id, tipo) => {
    setConfirmDialog({ show: true, id, tipo });
  };

  const confirmDelete = async () => {
    const { id, tipo } = confirmDialog;
    try {
      const endpoint =
        tipo === "Receita"
          ? `http://localhost:8080/api/receita/${id}`
          : `http://localhost:8080/api/despesa/${id}`;

      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir");

      setHistorico((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir transação.");
    } finally {
      setConfirmDialog({ show: false, id: null, tipo: null });
    }
  };

  const editarTransacao = (id, tipo) => {
    onNavigate && onNavigate("editarTransacao", { id, tipo });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center text-gray-300">
        <div className="animate-pulse">Carregando visão financeira...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gray-950">
        {error}
      </div>
    );

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {confirmDialog.show && (
        <ConfirmDialog
          show={confirmDialog.show}
          title="Excluir Transação"
          message="Deseja realmente excluir esta transação?"
          onConfirm={confirmDelete}
          onCancel={() =>
            setConfirmDialog({ show: false, id: null, tipo: null })
          }
        />
      )}

      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Cabeçalho */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-green-400 drop-shadow-lg">
              Visão Financeira
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Acompanhe receitas, despesas e o saldo em tempo real.
            </p>
          </div>

          {/* --- SALDO E GRÁFICO --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <motion.div
              whileHover={{ y: -6 }}
              className="lg:col-span-2 relative bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-800 overflow-hidden"
            >
              <div
                className="absolute -inset-1 blur-3xl opacity-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(16,185,129,0.06), rgba(59,130,246,0.06))",
                }}
              />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-gray-300 tracking-wider">
                    Saldo da conta
                  </div>
                  <div
                    className={`mt-2 text-4xl md:text-5xl font-extrabold ${
                      saldoConta > 0
                        ? "text-teal-400"
                        : saldoConta < 0
                        ? "text-rose-400"
                        : "text-gray-200"
                    }`}
                  >
                    {formatCurrency(saldoConta)}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Saldo disponível e último fechamento
                  </div>
                </div>

                <div className="w-48 h-24 md:w-64 md:h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="saldoGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor={saldoConta >= 0 ? "#10B981" : "#EF4444"}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor={saldoConta >= 0 ? "#34D399" : "#F87171"}
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f1724",
                          border: "none",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="saldo"
                        stroke={saldoConta >= 0 ? "#10B981" : "#EF4444"}
                        fill="url(#saldoGradient)"
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* --- RESUMO --- */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-sm text-white/90">Receitas</div>
                <div className="mt-2 text-2xl font-bold text-white break-words">
                  {formatCurrency(receitas)}
                </div>
                <div className="mt-4 text-xs text-white/80">
                  Últimos registros
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-sm text-white/90">Despesas</div>
                <div className="mt-2 text-2xl font-bold text-white break-words">
                  {formatCurrency(despesas)}
                </div>
                <div className="mt-4 text-xs text-white/80">
                  Últimos registros
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- HISTÓRICO --- */}
          <motion.div
            className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Histórico de Transações
            </h2>

            {historico.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhuma transação registrada.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead className="text-xs text-gray-300 uppercase">
                    <tr>
                      <th className="py-3 px-3">Tipo</th>
                      <th className="py-3 px-3">Título</th>
                      <th className="py-3 px-3">Descrição</th>
                      <th className="py-3 px-3">Categoria</th>
                      <th className="py-3 px-3 text-center">Valor</th>
                      <th className="py-3 px-3">Data</th>
                      <th className="py-3 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, idx) => (
                      <motion.tr
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * idx }}
                        className="border-t border-gray-700 hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.tipo === "Receita"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-200 text-sm">
                          {item.nome || item.titulo || "-"}
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-sm max-w-xs truncate">
                          {item.descricao || "-"}
                        </td>
                        <td className="py-3 px-3 text-gray-300 text-sm">
                          {item.categoria || "-"}
                        </td>
                        <td
                          className={`py-3 px-3 text-center font-semibold ${
                            item.tipo === "Receita"
                              ? "text-green-400"
                              : "text-rose-400"
                          }`}
                        >
                          {formatCurrency(item.valor)}
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-sm">
                          {formatDate(item.data)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() =>
                                editarTransacao(item.id, item.tipo)
                              }
                              className="p-1 rounded-md bg-gray-700/50 hover:bg-blue-600/30 text-blue-300 transition text-xs"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(item.id, item.tipo)
                              }
                              className="p-2 rounded-md bg-gray-700/50 hover:bg-rose-600/30 text-rose-300 transition"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <FooterPanel
        currentScreen="home"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    </motion.div>
  );
}

Home.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};
