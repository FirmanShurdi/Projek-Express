var express = require('express');
var router = express.Router();
var db = require('../db');

// Route: Tampilkan semua kategori
router.get('/kategori', (req, res) => {
  var sql = 'SELECT * FROM kategori';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Gagal mengambil kategori:', err);
      return res.status(500).send('Gagal memuat kategori');
    }
    res.render('kategori/index', { kategoriList: results });
  });
});

// Route utama: GET /objek?kategori=buah&page=2
router.get('/', (req, res) => {
  var kategoriNama = req.query.kategori || null;
  var page = parseInt(req.query.page) || 1;
  var limit = 6;
  var offset = (page - 1) * limit;

  let countSql = 'SELECT COUNT(*) AS total FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  let dataSql = 'SELECT o.*, k.nama_kategori FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  let whereClause = '';
  let queryParams = [];

  if (kategoriNama) {
    whereClause = ' WHERE k.nama_kategori = ? ';
    queryParams.push(kategoriNama);
  }

  // Query total count untuk pagination
  db.query(countSql + whereClause, queryParams, (err, countResult) => {
    if (err) {
      console.error('Gagal mengambil jumlah data:', err);
      return res.status(500).send('Gagal memuat data');
    }

    var totalItems = countResult[0].total;
    var totalPages = Math.ceil(totalItems / limit);

    // Query data objek utama
    const fullDataSql = dataSql + whereClause + ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
    db.query(fullDataSql, [...queryParams, limit, offset], (err, objekList) => {
      if (err) {
        console.error('Gagal mengambil data objek:', err);
        return res.status(500).send('Gagal memuat objek');
      }

      // Ambil daftar ID objek utama untuk dikecualikan dari carousel
      const excludeIds = objekList.map(obj => obj.id);

      // Bangun query carousel dengan pengecualian
      let carouselSql = `
        SELECT o.*, k.nama_kategori
        FROM objek o
        LEFT JOIN kategori k ON o.kategori_id = k.id
      `;
      let carouselParams = [];

      if (excludeIds.length > 0) {
        const placeholders = excludeIds.map(() => '?').join(', ');
        carouselSql += ` WHERE o.id NOT IN (${placeholders}) `;
        carouselParams = excludeIds;
      }

      carouselSql += ' ORDER BY RAND() LIMIT 10';

      db.query(carouselSql, carouselParams, (err, carouselItems) => {
        if (err) {
          console.error('Gagal mengambil carousel:', err);
          return res.status(500).send('Gagal memuat carousel');
        }

        // Ambil semua kategori
        db.query('SELECT * FROM kategori', (err, kategoriList) => {
          if (err) {
            console.error('Gagal mengambil kategori:', err);
            return res.status(500).send('Gagal memuat kategori');
          }

          res.render('objek', {
            objekList,
            carouselItems,
            totalPages,
            currentPage: page,
            kategoriAktif: kategoriNama,
            kategoriList
          });
        });
      });
    });
  });
});

module.exports = router;
