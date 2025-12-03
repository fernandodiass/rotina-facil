import { useEffect, useState } from 'react';
import { adicionarTarefa, atualizarTarefa, buscarTarefas } from './api';
import Board from './Board';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState('');
  const [categoria, setCategoria] = useState('Geral');

  useEffect(() => {
    buscarTarefas().then(setTarefas);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nova = await adicionarTarefa({ descricao, horario, categoria });
    setTarefas([...tarefas, nova]);
    setDescricao('');
    setHorario('');
    setCategoria('Geral');
  };

  const moverTarefa = async (id, novaCategoria) => {
    const atualizada = await atualizarTarefa(id, { categoria: novaCategoria });
    setTarefas(tarefas.map(t => t.id === id ? atualizada : t));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Rotina Fácil 🧸</h1>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 justify-center mb-8">
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg shadow"
          />
          <input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
            className="px-4 py-2 border rounded-lg shadow"
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Adicionar
          </button>
        </form>

        <Board tarefas={tarefas} moverTarefa={moverTarefa} />
      </div>
    </div>
  );
}