import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'biblioteca'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res.json({ message: 'Login exitoso' });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});