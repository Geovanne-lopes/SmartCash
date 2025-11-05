import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";

export default function Home({ onNavigate }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Busca receitas e despesas do backend
  const carregarTransacoes = async () => {
    try {
      setLoading(true);
      setError(null);

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
      console.error("❌ Erro ao carregar transações:", err);
      setError("Erro ao buscar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTransacoes();
  }, []);

  // ✅ Cálculos
  const receitas = historico
    .filter((item) => item.tipo === "Receita")
    .reduce((sum, item) => sum + item.valor, 0);

  const despesas = Math.abs(
    historico
      .filter((item) => item.tipo === "Despesa")
      .reduce((sum, item) => sum + item.valor, 0)
  );

  const saldoConta = receitas - despesas;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // ✅ Estados de carregamento e erro
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white items-center justify-center">
        <p className="text-lg animate-pulse">Carregando dados financeiros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-red-400 items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  // ✅ Interface principal
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* 🔹 Cabeçalho */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Visão Financeira
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Acompanhe suas receitas, despesas e o saldo da sua conta em tempo
              real.
            </p>
          </div>

          {/* 🔹 Saldo da Conta */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center border border-gray-700/50">
            <h3 className="text-gray-300 text-sm tracking-wide uppercase mb-2 font-extrabold tracking-tight">
              Saldo da Conta
            </h3>
            <p
              className={`text-5xl sm:text-6xl font-extrabold ${
                saldoConta > 0
                  ? "text-green-400"
                  : saldoConta < 0
                  ? "text-red-400"
                  : "text-gray-200"
              } transition-colors duration-300`}
            >
              R${" "}
              {saldoConta < 0
                ? `-${formatCurrency(Math.abs(saldoConta))
                    .replace("R$", "")
                    .trim()}`
                : `${formatCurrency(saldoConta).replace("R$", "").trim()}`}
            </p>
          </div>

          {/* 🔹 Cards de Receitas e Despesas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-gradient-to-br from-green-500/90 to-green-600 p-6 shadow-md hover:scale-[1.02] transition-transform duration-300">
              <p className="text-white/80 text-sm mb-1 font-medium">Receitas</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {formatCurrency(receitas)}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-red-500/90 to-red-600 p-6 shadow-md hover:scale-[1.02] transition-transform duration-300">
              <p className="text-white/80 text-sm mb-1 font-medium">Despesas</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {formatCurrency(despesas)}
              </p>
            </div>
          </div>

          {/* 🔹 Histórico */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-5">
              Histórico de Transações
            </h3>

            {historico.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">
                  Nenhuma transação registrada ainda.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Adicione despesas ou receitas para começar a acompanhar seu
                  histórico financeiro.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-gray-200">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
                        Tipo
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
                        Descrição
                      </th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-300">
                        Valor
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              item.tipo === "Receita"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 px-4">{item.descricao}</td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${
                            item.tipo === "Receita"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(item.valor)}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {formatDate(item.data)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterPanel currentScreen="home" onNavigate={onNavigate} />
    </div>
  );
}

Home.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
