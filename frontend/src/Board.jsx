// frontend/src/Board.jsx
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

export default function Board({ tarefas, moverTarefa }) {
  const agrupadas = tarefas.reduce((acc, t) => {
    const cat = t.categoria || 'Sem Categoria';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <DndContext onDragEnd={({ active, over }) => {
      if (!over) return;
      const from = active.data.current?.categoria;
      const to = over.id;
      if (from !== to) moverTarefa(active.id, to);
    }}>
      <div className="flex gap-4 overflow-x-auto">
        {Object.entries(agrupadas).map(([cat, tarefas]) => (
          <Coluna key={cat} nome={cat} tarefas={tarefas} />
        ))}
      </div>
    </DndContext>
  );
}

function Coluna({ nome, tarefas }) {
  const { setNodeRef } = useDroppable({ id: nome });
  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-lg p-4 w-80 min-w-80">
      <h2 className="font-bold text-lg mb-4 text-center">{nome}</h2>
      {tarefas.map(t => (
        <Card key={t.id} tarefa={t} categoria={nome} />
      ))}
    </div>
  );
}

function Card({ tarefa, categoria }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: tarefa.id,
    data: { categoria }
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const toggleFeita = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tarefas/${tarefa.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feita: !tarefa.feita })
    });

    const atualizada = await res.json();
    // Atualizar localmente ou via prop se preferir
    tarefa.feita = atualizada.feita;
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onDoubleClick={toggleFeita}
      className={`rounded shadow p-4 mb-3 cursor-pointer select-none transition duration-300 ${tarefa.feita ? 'bg-green-100 line-through text-gray-400' : 'bg-white'
        }`}
    >
      <h4 className="font-medium">{tarefa.descricao}</h4>
      <p className="text-sm text-gray-500">⏰ {tarefa.horario}</p>
      {tarefa.feita && <p className="text-xs mt-1 text-green-600 font-bold">✔ Feita</p>}
    </div>
  );
}