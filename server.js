const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para listar questões com paginação e filtro por tema
app.get('/api/questions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tema = req.query.tema || null;
    const offset = (page - 1) * limit;

    const questions = await db.getQuestions(limit, offset, tema);
    const total = await db.getTotalQuestions(tema);

    res.json({
      data: questions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter uma única questão por ID
app.get('/api/questions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.db.get(`SELECT * FROM questions WHERE id = ?`, [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Questão não encontrada' });
      res.json(row);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para salvar a resposta do usuário
app.post('/api/answer', async (req, res) => {
  try {
    const { userId = 'default', questionId, selectedOption, isCorrect } = req.body;
    await db.saveAnswer(userId, questionId, selectedOption, isCorrect);
    res.status(201).json({ message: 'Resposta salva' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter o progresso do usuário
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || 'default';
    const progress = await db.getUserProgress(userId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para listar todos os temas distintos
app.get('/api/temas', (req, res) => {
  db.db.all(`SELECT DISTINCT tema FROM questions ORDER BY tema`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.tema));
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});