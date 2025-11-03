import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";
import HomeButton from "./HomeButton";

export default function Receitas({ onNavigate }) {
  // Dados mockados para exemplo
  const saldoConta = 12500.0;
  const receitas = 8500.0;
  const despesas = 3200.0;

  const historico = [
    {
      id: 1,
      tipo: "Receita",
      descricao: "Salário",
      valor: 5000.0,
      data: "2024-01-05",
    },
    {
      id: 2,
      tipo: "Despesa",
      descricao: "Aluguel",
      valor: -1200.0,
      data: "2024-01-10",
    },
    {
      id: 3,
      tipo: "Receita",
      descricao: "Freelance",
      valor: 1500.0,
      data: "2024-01-15",
    },
    {
      id: 4,
      tipo: "Despesa",
      descricao: "Supermercado",
      valor: -450.0,
      data: "2024-01-18",
    },
    {
      id: 5,
      tipo: "Despesa",
      descricao: "Conta de Luz",
      valor: -180.0,
      data: "2024-01-20",
    },
    {
      id: 6,
      tipo: "Receita",
      descricao: "Venda",
      valor: 2000.0,
      data: "2024-01-25",
    },
  ];

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
    <div className="min-h-screen flex flex-col bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            Receitas e Despesas
          </h2>

          {/* Valor da Conta */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 shadow-lg mb-6">
            <div className="text-center">
              <p className="text-gray-200 text-sm mb-2">Saldo da Conta</p>
              <p className="text-4xl font-bold text-white">
                {formatCurrency(saldoConta)}
              </p>
            </div>
          </div>

          {/* Receita | Despesa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-600 rounded-lg p-4 shadow-lg">
              <p className="text-gray-100 text-sm mb-1">Receitas</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(receitas)}
              </p>
            </div>
            <div className="bg-red-600 rounded-lg p-4 shadow-lg">
              <p className="text-gray-100 text-sm mb-1">Despesas</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(despesas)}
              </p>
            </div>
          </div>

          {/* Tabela de Histórico */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Histórico</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Descrição
                    </th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">
                      Valor
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.tipo === "Receita"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {item.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{item.descricao}</td>
                      <td
                        className={`py-3 px-4 text-right font-semibold ${
                          item.valor > 0 ? "text-green-400" : "text-red-400"
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
          </div>

          <HomeButton onNavigate={onNavigate} />
        </div>
      </main>

      <FooterPanel currentScreen="receitas" onNavigate={onNavigate} />
    </div>
  );
}

Receitas.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
