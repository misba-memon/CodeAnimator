const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // mysql connection
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/visualization', express.static('C:/xampp/htdocs/visualization'));
// Add this ABOVE all routes
// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.url}`);
//   next();
// });

// ---------------- REGISTER ----------------
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  const checkUserSql = 'SELECT * FROM user WHERE email = ?';
  db.query(checkUserSql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'You are already registered' });
    }

    const insertSql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    db.query(insertSql, [name, email, password], (err) => {
      if (err) return res.status(400).json({ success: false, message: 'Registration failed' });

      res.status(200).json({ success: true, message: '✅ Registered successfully' });
    });
  });
});

// ---------------- LOGIN ----------------
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const checkUserSql = 'SELECT * FROM user WHERE email = ?';
  db.query(checkUserSql, [email], (err, userResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (userResults.length === 0) {
      return res.status(404).json({ success: false, message: 'You are not registered' });
    }

    const loginSql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(loginSql, [email, password], (err, loginResults) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });

      if (loginResults.length > 0) {
        res.status(200).json({ success: true, email: email, userId: loginResults[0].id });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    });
  });
});

// ---------------- HOME ----------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// ---------------- GET ALGORITHM ----------------
app.get('/api/algorithm', (req, res) => {
  const algoName = req.query.name;
  const sql = `
    SELECT a.id, a.name, a.code, v.visual_html, e.explanation 
    FROM Algorithm a
    JOIN Visualization v ON a.id = v.algorithm_id
    JOIN Explanation e ON a.id = e.algorithm_id
    WHERE a.name = ?
  `;
  db.query(sql, [algoName], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Algorithm not found" });
    }

    res.status(200).json({
      success: true,
      id: results[0].id,
      name: results[0].name,
      code: results[0].code,
      visual_html: results[0].visual_html,
      explanation: results[0].explanation
    });
  });
});

// ---------------- FEEDBACK ----------------
app.post('/api/feedback', (req, res) => {
  const { userId, algorithmId, feedbackText } = req.body;

  console.log("👉 Received from frontend:", { userId, algorithmId, feedbackText });

  const sql = 'INSERT INTO Feedback (user_id, algorithm_id, feedback) VALUES (?, ?, ?)';
  db.query(sql, [userId, algorithmId, feedbackText], (err) => {
    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).json({ success: false, message: 'Error saving feedback' });
    }

    res.status(200).json({ success: true, message: 'Feedback submitted successfully!' });
  });
});

// ---------------- SERVER START ----------------
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
