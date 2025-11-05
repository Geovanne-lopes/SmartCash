import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";

export default function Receitas({ onNavigate, onAddTransaction }) {
  const [historico, setHistorico] = useState([]);

  // Registrar função de callback para adicionar transações
  useEffect(() => {
    if (onAddTransaction) {
      // Registrar função que adiciona transação ao histórico
      onAddTransaction((novaTransacao) => {
        setHistorico((prev) => [novaTransacao, ...prev]);
      });
    }
  }, [onAddTransaction]);

  // Calcular valores dinamicamente
  const receitas = historico
    .filter((item) => item.tipo === "Receita")
    .reduce((sum, item) => sum + item.valor, 0);

  const despesas = Math.abs(
    historico
      .filter((item) => item.tipo === "Despesa")
      .reduce((sum, item) => sum + item.valor, 0)
  );

  const saldoConta = receitas - despesas;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-white mb-4 sm:mb-6">
            Receitas e Despesas
          </h2>

          {/* Valor da Conta */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 sm:p-6 shadow-lg mb-4 sm:mb-6">
            <div className="text-center">
              <p className="text-gray-200 dark:text-gray-200 text-xs sm:text-sm mb-2">
                Saldo da Conta
              </p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white dark:text-white">
                {formatCurrency(saldoConta)}
              </p>
            </div>
          </div>

          {/* Receita | Despesa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-green-600 dark:bg-green-600 rounded-lg p-4 sm:p-5 shadow-lg">
              <p className="text-gray-100 dark:text-gray-100 text-xs sm:text-sm mb-1">
                Receitas
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                {formatCurrency(receitas)}
              </p>
            </div>
            <div className="bg-red-600 dark:bg-red-600 rounded-lg p-4 sm:p-5 shadow-lg">
              <p className="text-gray-100 dark:text-gray-100 text-xs sm:text-sm mb-1">
                Despesas
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white dark:text-white">
                {formatCurrency(despesas)}
              </p>
            </div>
          </div>

          {/* Tabela de Histórico */}
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white dark:text-white mb-3 sm:mb-4">
              Histórico
            </h3>

            {historico.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-400 dark:text-gray-400 text-sm sm:text-base">
                  Nenhuma transação registrada ainda.
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm mt-2">
                  Adicione despesas ou receitas para começar a acompanhar seu
                  histórico financeiro.
                </p>
              </div>
            ) : (
              <>
                {/* Versão Mobile - Cards */}
                <div className="sm:hidden space-y-3">
                  {historico.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-700/50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-600/50 dark:border-gray-600/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.tipo === "Receita"
                              ? "bg-green-500/20 dark:bg-green-500/20 text-green-400 dark:text-green-400"
                              : "bg-red-500/20 dark:bg-red-500/20 text-red-400 dark:text-red-400"
                          }`}
                        >
                          {item.tipo}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            item.valor > 0
                              ? "text-green-400 dark:text-green-400"
                              : "text-red-400 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(item.valor)}
                        </span>
                      </div>
                      <p className="text-white dark:text-white text-sm font-medium mb-1">
                        {item.descricao}
                      </p>
                      <p className="text-gray-400 dark:text-gray-400 text-xs">
                        {formatDate(item.data)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Versão Desktop - Tabela */}
                <div className="hidden sm:block overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-gray-300 dark:text-gray-300 font-semibold text-sm">
                            Tipo
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 dark:text-gray-300 font-semibold text-sm">
                            Descrição
                          </th>
                          <th className="text-right py-3 px-4 text-gray-300 dark:text-gray-300 font-semibold text-sm">
                            Valor
                          </th>
                          <th className="text-left py-3 px-4 text-gray-300 dark:text-gray-300 font-semibold text-sm">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {historico.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-700/50 hover:bg-gray-700/30 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  item.tipo === "Receita"
                                    ? "bg-green-500/20 dark:bg-green-500/20 text-green-400 dark:text-green-400"
                                    : "bg-red-500/20 dark:bg-red-500/20 text-red-400 dark:text-red-400"
                                }`}
                              >
                                {item.tipo}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white dark:text-white text-sm">
                              {item.descricao}
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-semibold text-sm ${
                                item.valor > 0
                                  ? "text-green-400 dark:text-green-400"
                                  : "text-red-400 dark:text-red-400"
                              }`}
                            >
                              {formatCurrency(item.valor)}
                            </td>
                            <td className="py-3 px-4 text-gray-400 dark:text-gray-400 text-sm">
                              {formatDate(item.data)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <FooterPanel currentScreen="home" onNavigate={onNavigate} />
    </div>
  );
}

Receitas.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  onAddTransaction: PropTypes.func,
};
