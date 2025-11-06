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

/**
 * Home - Dashboard financeiro melhorado
 * - Cards com glow
 * - Mini gráfico de evolução (Recharts)
 * - Tabela de histórico com animações sutis
 */

export default function Home({ onNavigate, onLogout }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // cálculos
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

  // ✅ Corrigido para exibir R$ -1.540.000,00
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

  // fake data para mini-gráfico (pode substituir por endpoint real)
  const chartData = useMemo(() => {
    const base = new Array(8).fill(0).map((_, i) => {
      const val =
        i === 7
          ? saldoConta
          : Math.round((saldoConta / 8) * (i + 1) + (Math.random() - 0.4) * 200);
      return { name: `D-${8 - i}`, saldo: val };
    });
    return base;
  }, [saldoConta]);

  const excluirTransacao = async (id, tipo) => {
    const confirmar = window.confirm("Deseja realmente excluir esta transação?");
    if (!confirmar) return;

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
      <main className="flex-1 px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-green-400 drop-shadow-lg">
              Visão Financeira
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Acompanhe receitas, despesas e o saldo em tempo real.
            </p>
          </div>

          {/* Top: saldo + mini-gráfico */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <motion.div
              whileHover={{ y: -6 }}
              className="lg:col-span-2 relative bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-800 overflow-hidden"
            >
              {/* glow decorativo */}
              <div className="absolute -inset-1 blur-3xl opacity-20 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.06), rgba(59,130,246,0.06))" }} />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-gray-300 tracking-wider">Saldo da conta</div>
                  <div
                    className={`mt-2 text-4xl md:text-5xl font-extrabold ${saldoConta > 0 ? "text-teal-400" : saldoConta < 0 ? "text-rose-400" : "text-gray-200"
                      }`}
                  >
                    {formatCurrency(saldoConta)}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">Saldo disponível e último fechamento</div>
                </div>

                <div className="w-48 h-24 md:w-64 md:h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{ background: "#0f1724", border: "none", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        labelFormatter={() => ""}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Area type="monotone" dataKey="saldo" stroke="#7C3AED" fill="url(#g1)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Cards resumo */}
            <div className="grid grid-cols-2 gap-4">
              {/* Receitas */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-sm text-white/90">Receitas</div>
                <div className="mt-2 text-2xl font-bold text-white break-words">{formatCurrency(receitas)}</div>
                <div className="mt-4 text-xs text-white/80">Últimos registros</div>
              </motion.div>

              {/* Despesas */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center text-center"
              >
                <div className="text-sm text-white/90">Despesas</div>
                <div className="mt-2 text-2xl font-bold text-white break-words">{formatCurrency(despesas)}</div>
                <div className="mt-4 text-xs text-white/80">Últimos registros</div>
              </motion.div>
            </div>
          </div>

          {/* Histórico */}
          <motion.div
            className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">Histórico de Transações</h2>

            {historico.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Nenhuma transação registrada.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead className="text-xs text-gray-300 uppercase">
                    <tr>
                      <th className="py-3 px-3">Tipo</th>
                      <th className="py-3 px-3">Descrição</th>
                      <th className="py-3 px-3 text-right">Valor</th>
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
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${item.tipo === "Receita"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                              }`}
                          >
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-gray-200">{item.descricao || item.nome || "-"}</td>
                        <td className={`py-3 px-3 text-right font-semibold ${item.tipo === "Receita" ? "text-green-400" : "text-rose-400"}`}>
                          {formatCurrency(item.valor)}
                        </td>
                        <td className="py-3 px-3 text-gray-400">{formatDate(item.data)}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => editarTransacao(item.id, item.tipo)}
                              className="p-2 rounded-md bg-gray-700/50 hover:bg-blue-600/30 text-blue-300 transition"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => excluirTransacao(item.id, item.tipo)}
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

      <FooterPanel currentScreen="home" onNavigate={onNavigate} />
    </motion.div>
  );
}

Home.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};
