const express = require('express');
const router = express.Router();
const conn = require('../db');

// INDEX
router.get('/', (req, res) => {
  const sql = `
    SELECT o.id, o.nama, o.kategori_id, o.deskripsi, o.gambar, o.audio, k.nama_kategori 
    FROM objek o 
    JOIN kategori k ON o.kategori_id = k.id
  `;
  conn.query(sql, (err, objek) => {
    if (err) throw err;
    conn.query('SELECT * FROM kategori', (err, kategori) => {
      if (err) throw err;
      res.render('kategori/index', { objek, kategori });
    });
  });
});

// CREATE FORM
router.get('/create', (req, res) => {
  conn.query('SELECT * FROM kategori', (err, kategori) => {
    if (err) throw err;
    res.render('kategori/create', { kategori });
  });
});

// CREATE POST
router.post('/create', (req, res) => {
  const { nama, kategori_id, deskripsi, gambar, audio } = req.body;
  const sql = `
    INSERT INTO objek (nama, kategori_id, deskripsi, gambar, audio) 
    VALUES (?, ?, ?, ?, ?)
  `;
  conn.query(sql, [nama, kategori_id, deskripsi, gambar, audio], (err) => {
    if (err) throw err;
    res.redirect('/kategori');
  });
});

// EDIT FORM
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  conn.query('SELECT * FROM objek WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    const objek = results[0];
    conn.query('SELECT * FROM kategori', (err, kategori) => {
      if (err) throw err;
      res.render('kategori/edit', { objek, kategori });
    });
  });
});

// EDIT POST
router.post('/edit/:id', (req, res) => {
  const id = req.params.id;
  const { nama, kategori_id, deskripsi, gambar, audio } = req.body;
  const sql = `
    UPDATE objek 
    SET nama = ?, kategori_id = ?, deskripsi = ?, gambar = ?, audio = ? 
    WHERE id = ?
  `;
  conn.query(sql, [nama, kategori_id, deskripsi, gambar, audio, id], (err) => {
    if (err) throw err;
    res.redirect('/kategori');
  });
});

// DELETE
router.get('/delete/:id', (req, res) => {
  conn.query('DELETE FROM objek WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/kategori');
  });
});

module.exports = router;
