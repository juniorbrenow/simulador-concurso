const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'questoes.db');

const db = new sqlite3.Database(dbPath);

// Inicializa tabelas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct INTEGER NOT NULL, -- 0 a 3
      explanation TEXT,
      tema TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id TEXT DEFAULT 'default',
      question_id INTEGER,
      selected_option INTEGER,
      is_correct BOOLEAN,
      answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, question_id)
    )
  `);
});

// Funções auxiliares
const getQuestions = (limit, offset, tema = null) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM questions`;
    const params = [];
    if (tema) {
      sql += ` WHERE tema = ?`;
      params.push(tema);
    }
    sql += ` ORDER BY id LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getTotalQuestions = (tema = null) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) as total FROM questions`;
    const params = [];
    if (tema) {
      sql += ` WHERE tema = ?`;
      params.push(tema);
    }
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row.total);
    });
  });
};

const saveAnswer = (userId, questionId, selectedOption, isCorrect) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO user_progress (user_id, question_id, selected_option, is_correct, answered_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, questionId, selectedOption, isCorrect],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

const getUserProgress = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT question_id, selected_option, is_correct FROM user_progress WHERE user_id = ?`, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = { db, getQuestions, getTotalQuestions, saveAnswer, getUserProgress };