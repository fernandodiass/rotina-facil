import { closestCenter, DndContext } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { buscarTarefas } from './api';

const columns = ['todo', 'doing', 'done'];

const columnNames = {
  todo: 'A Fazer',
  doing: 'Em Progresso',
  done: 'Concluído',
};

// Componente de tarefa que pode ser arrastado
function TarefaCard({ id, conteudo }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '0.5rem',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {conteudo}
    </div>
  );
}

// Componente principal do board
export default function Board() {
  const [tarefas, setTarefas] = useState([]);
  const [tarefasPorColuna, setTarefasPorColuna] = useState({
    todo: [],
    doing: [],
    done: [],
  });

  // Carrega tarefas da API
  useEffect(() => {
    async function carregar() {
      const dados = await buscarTarefas();

      // Organiza por status
      const porColuna = { todo: [], doing: [], done: [] };
      dados.forEach((tarefa) => {
        const status = tarefa.status || 'todo';
        porColuna[status].push({ id: tarefa.id.toString(), conteudo: tarefa.titulo });
      });
      setTarefas(dados);
      setTarefasPorColuna(porColuna);
    }
    carregar();
  }, []);

  // Handler de drag and drop
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const origem = encontrarColuna(active.id);
    const destino = encontrarColuna(over.id);

    if (!origem || !destino) return;

    if (origem !== destino) {
      const tarefaMovida = tarefasPorColuna[origem].find((t) => t.id === active.id);

      setTarefasPorColuna((prev) => {
        const novoOrigem = prev[origem].filter((t) => t.id !== active.id);
        const novoDestino = [tarefaMovida, ...prev[destino]];
        return {
          ...prev,
          [origem]: novoOrigem,
          [destino]: novoDestino,
        };
      });

      // Aqui você poderia chamar a API para atualizar o status da tarefa no backend
      // ex: atualizarTarefaStatus(active.id, destino)
    }
  }

  function encontrarColuna(tarefaId) {
    return columns.find((coluna) =>
      tarefasPorColuna[coluna].some((t) => t.id === tarefaId)
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {columns.map((coluna) => (
          <div
            key={coluna}
            style={{
              flex: 1,
              backgroundColor: '#f1f1f1',
              borderRadius: '10px',
              padding: '1rem',
              minHeight: '300px',
            }}
          >
            <h3 style={{ textAlign: 'center' }}>{columnNames[coluna]}</h3>
            <SortableContext
              items={tarefasPorColuna[coluna].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tarefasPorColuna[coluna].map((tarefa) => (
                <TarefaCard key={tarefa.id} id={tarefa.id} conteudo={tarefa.conteudo} />
              ))}
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  );
}