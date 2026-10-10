import bcrypt from 'bcrypt';
import mysql from 'mysql2';

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

const saltRounds = 10;
const usuario = 'juan';
const password = 'contraseña123';

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err.message);
    return;
  }
  db.query('INSERT INTO usuarios (usuario, password) VALUES (?, ?)', [usuario, hash], (err, results) => {
    if (err) {
      console.error('Error insertando usuario:', err.message);
    } else {
      console.log('Usuario registrado en la base de datos.');
    }
    db.end();
  });
});