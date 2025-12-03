<<<<<<< HEAD
=======
// backend/server.js
>>>>>>> 9b22580 (Início do projeto limpo)
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 4000;

<<<<<<< HEAD
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

=======
const DB_FILE = './db.json';

app.use(cors());
app.use(express.json());

// Utilitários de leitura/escrita
>>>>>>> 9b22580 (Início do projeto limpo)
const readTasks = () => {
  if (!fs.existsSync(DB_FILE)) return [];
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
};

<<<<<<< HEAD
=======
// GET /tarefas - lista todas agrupadas por categoria
>>>>>>> 9b22580 (Início do projeto limpo)
app.get('/tarefas', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

<<<<<<< HEAD
app.post('/tarefas', (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: Date.now(),
    descricao: req.body.descricao,
    horario: req.body.horario,
    feita: false,
  };
=======
// POST /tarefas - cria nova tarefa
app.post('/tarefas', (req, res) => {
  const tasks = readTasks();
  const { descricao, horario, categoria } = req.body;

  const newTask = {
    id: Date.now().toString(),
    descricao,
    horario,
    categoria,
    feita: false
  };

>>>>>>> 9b22580 (Início do projeto limpo)
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

<<<<<<< HEAD
app.patch('/tarefas/:id', (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);
  tasks = tasks.map((t) => (t.id === id ? { ...t, feita: req.body.feita } : t));
  saveTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
=======
// PATCH /tarefas/:id - atualiza tarefa (ex: mover categoria)
app.patch('/tarefas/:id', (req, res) => {
  const tasks = readTasks();
  const id = req.params.id;
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tarefa não encontrada' });

  tasks[index] = { ...tasks[index], ...req.body };
  saveTasks(tasks);
  res.json(tasks[index]);
});

// DELETE /tarefas/:id - remove tarefa
app.delete('/tarefas/:id', (req, res) => {
  let tasks = readTasks();
  const id = req.params.id;
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === before) return res.status(404).json({ error: 'Tarefa não encontrada' });

  saveTasks(tasks);
  res.status(204).end();
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
>>>>>>> 9b22580 (Início do projeto limpo)
});