import PropTypes from "prop-types";
import FooterPanel from "./FooterPanel";

export default function Home({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 pb-20">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gráfico 1 - Saldo Total */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Saldo Total
              </h3>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    R$ 15.420,00
                  </div>
                  <div className="text-sm text-green-400">+5.2% este mês</div>
                </div>
              </div>
            </div>

            {/* Gráfico 2 - Despesas */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Despesas
              </h3>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    R$ 3.250,00
                  </div>
                  <div className="text-sm text-red-400">-2.1% este mês</div>
                </div>
              </div>
            </div>

            {/* Gráfico 3 - Receitas */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Receitas
              </h3>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    R$ 18.670,00
                  </div>
                  <div className="text-sm text-green-400">+8.3% este mês</div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de gráficos detalhados */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Linha - Evolução do Saldo (últimos meses) */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Evolução do Saldo
              </h3>
              <div className="h-56 bg-gray-900/50 rounded-lg p-4">
                <svg viewBox="0 0 300 140" className="w-full h-full">
                  <defs>
                    <linearGradient id="saldoGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity="0.35"
                      />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* grade */}
                  <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                    <line x1="0" y1="30" x2="300" y2="30" />
                    <line x1="0" y1="70" x2="300" y2="70" />
                    <line x1="0" y1="110" x2="300" y2="110" />
                  </g>
                  {/* área */}
                  <path
                    d="M10,110 C40,80 70,95 100,75 C130,55 160,65 190,50 C220,35 250,45 290,30 L290,140 L10,140 Z"
                    fill="url(#saldoGrad)"
                  />
                  {/* linha */}
                  <path
                    d="M10,110 C40,80 70,95 100,75 C130,55 160,65 190,50 C220,35 250,45 290,30"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            {/* Barras - Despesas por categoria */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Despesas por Categoria
              </h3>
              <div className="h-56 bg-gray-900/50 rounded-lg p-4 flex items-end gap-3">
                {[
                  { h: 120, c: "#ef4444", label: "Moradia" },
                  { h: 100, c: "#f97316", label: "Alimentação" },
                  { h: 80, c: "#f59e0b", label: "Transporte" },
                  { h: 60, c: "#a855f7", label: "Lazer" },
                  { h: 40, c: "#22c55e", label: "Saúde" },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full max-w-10 rounded-md"
                      style={{ height: b.h + "px", backgroundColor: b.c }}
                    />
                    <span className="mt-2 text-xs text-gray-400 truncate w-full text-center">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut - Receitas x Despesas */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">
                Receitas x Despesas
              </h3>
              <div className="h-56 bg-gray-900/50 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-40 h-40">
                  <circle
                    cx="60"
                    cy="60"
                    r="42"
                    stroke="#374151"
                    strokeWidth="16"
                    fill="none"
                  />
                  {/* Receitas 65% */}
                  <circle
                    cx="60"
                    cy="60"
                    r="42"
                    stroke="#22c55e"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray="273"
                    strokeDashoffset="95"
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text
                    x="60"
                    y="60"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white"
                    fontSize="14"
                    fontWeight="700"
                  >
                    65% Receita
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterPanel currentScreen="" onNavigate={onNavigate} />
    </div>
  );
}

Home.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};
