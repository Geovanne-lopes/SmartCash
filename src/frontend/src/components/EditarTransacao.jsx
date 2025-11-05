import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function EditarTransacao({ onNavigate, transacaoSelecionada }) {
  const id = transacaoSelecionada?.id;
  const tipo = transacaoSelecionada?.tipo;

  const [form, setForm] = useState({
    id: 0,
    nome: "",
    descricao: "",
    valor: 0,
    data: "",
    categoria: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Carrega os dados da transação para edição
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

        // ✅ Preenche todos os campos esperados pelo backend
        setForm({
          id: data.id,
          nome: data.nome || "",
          descricao: data.descricao || "",
          valor: data.valor || 0,
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

  // 🔹 Atualiza campos conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Envia atualização completa para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        tipo === "Receita"
          ? `http://localhost:8080/api/receita/${id}`
          : `http://localhost:8080/api/despesa/${id}`;

      const payload = {
        ...form,
        valor: Number(form.valor),
      };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao atualizar transação");
      }

      alert("✅ Transação atualizada com sucesso!");
      onNavigate("home");
    } catch (err) {
      console.error(err);
      alert(
        "❌ Erro ao atualizar transação. Verifique os dados e tente novamente."
      );
    }
  };

  // 🔹 Tratamento de estados
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="animate-pulse text-lg">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  // 🔹 Interface principal
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-lg w-full max-w-md border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Editar {tipo}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Salário, Aluguel, Conta de Luz..."
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Descrição
            </label>
            <input
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição detalhada da transação"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Valor (R$)
            </label>
            <input
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Categoria
            </label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Ex: Alimentação, Transporte, Salário..."
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ Validação de props
EditarTransacao.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  transacaoSelecionada: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tipo: PropTypes.string.isRequired,
  }).isRequired,
};
