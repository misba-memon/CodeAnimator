const mysql = require('mysql');

const db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password:'',
  database: 'codeanimator'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err);
    return;
  }
  console.log('✅ MySQL Connected');
});

module.exports = db;
