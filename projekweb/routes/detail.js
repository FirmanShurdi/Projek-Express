var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:id', (req, res) => {
  const objekId = req.params.id;

  const sql = `
    SELECT o.*, k.nama_kategori 
    FROM objek o 
    LEFT JOIN kategori k ON o.kategori_id = k.id 
    WHERE o.id = ?
  `;

  db.query(sql, [objekId], (err, results) => {
    if (err) {
      console.error('Gagal mengambil detail objek:', err);
      return res.status(500).send('Gagal memuat detail objek');
    }

    if (results.length === 0) {
      return res.status(404).render('error', { message: 'Objek tidak ditemukan' });
    }

    const objek = results[0];
    res.render('detail', { objek });
  });
});


module.exports = router;
