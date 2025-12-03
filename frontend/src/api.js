const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function buscarTarefas() {
  const res = await fetch(`${API_URL}/tarefas`);
  return res.json();
}

export async function adicionarTarefa(tarefa) {
  const res = await fetch(`${API_URL}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarefa),
  });
  return res.json();
}

export async function atualizarTarefa(id, dados) {
  const res = await fetch(`${API_URL}/tarefas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return await res.json();
}