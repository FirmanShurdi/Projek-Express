"use strict";

var express = require('express');

var router = express.Router();

var db = require('../db'); // Route: Tampilkan semua kategori


router.get('/kategori', function (req, res) {
  var sql = 'SELECT * FROM kategori';
  db.query(sql, function (err, results) {
    if (err) {
      console.error('Gagal mengambil kategori:', err);
      return res.status(500).send('Gagal memuat kategori');
    }

    res.render('kategori/index', {
      kategoriList: results
    });
  });
}); // Route utama: GET /objek?kategori=buah&page=2

router.get('/', function (req, res) {
  var kategoriNama = req.query.kategori || null;
  var page = parseInt(req.query.page) || 1;
  var limit = 6;
  var offset = (page - 1) * limit;
  var tampilkanSemua = req.query.all === 'true';
  var countSql = 'SELECT COUNT(*) AS total FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  var dataSql = 'SELECT o.*, k.nama_kategori FROM objek o LEFT JOIN kategori k ON o.kategori_id = k.id';
  var whereClause = '';
  var queryParams = [];

  if (kategoriNama) {
    whereClause = ' WHERE k.nama_kategori = ? ';
    queryParams.push(kategoriNama);
  } // Query total count untuk pagination


  db.query(countSql + whereClause, queryParams, function (err, countResult) {
    if (err) {
      console.error('Gagal mengambil jumlah data:', err);
      return res.status(500).send('Gagal memuat data');
    }

    var totalItems = countResult[0].total;
    var totalPages = Math.ceil(totalItems / limit);
    var fullDataSql;
    var dataParams;

    if (tampilkanSemua) {
      fullDataSql = dataSql + whereClause + ' ORDER BY o.id DESC';
      dataParams = queryParams;
      page = 1; // reset halaman ke 1
    } else {
      fullDataSql = dataSql + whereClause + ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
      dataParams = [].concat(queryParams, [limit, offset]);
    }

    db.query(fullDataSql, [].concat(queryParams, [limit, offset]), function (err, objekList) {
      if (err) {
        console.error('Gagal mengambil data objek:', err);
        return res.status(500).send('Gagal memuat objek');
      } // Ambil daftar ID objek utama untuk dikecualikan dari carousel


      var excludeIds = objekList.map(function (obj) {
        return obj.id;
      }); // Bangun query carousel dengan pengecualian

      var carouselSql = "\n        SELECT o.*, k.nama_kategori\n        FROM objek o\n        LEFT JOIN kategori k ON o.kategori_id = k.id\n      ";
      var carouselParams = [];

      if (excludeIds.length > 0) {
        var placeholders = excludeIds.map(function () {
          return '?';
        }).join(', ');
        carouselSql += " WHERE o.id NOT IN (".concat(placeholders, ") ");
        carouselParams = excludeIds;
      }

      carouselSql += ' ORDER BY RAND() LIMIT 10';
      db.query(carouselSql, carouselParams, function (err, carouselItems) {
        if (err) {
          console.error('Gagal mengambil carousel:', err);
          return res.status(500).send('Gagal memuat carousel');
        } // Ambil semua kategori


        db.query('SELECT * FROM kategori', function (err, kategoriList) {
          if (err) {
            console.error('Gagal mengambil kategori:', err);
            return res.status(500).send('Gagal memuat kategori');
          }

          res.render('objek', {
            objekList: objekList,
            carouselItems: carouselItems,
            totalPages: totalPages,
            currentPage: page,
            kategoriAktif: kategoriNama,
            kategoriList: kategoriList,
            tampilkanSemua: tampilkanSemua
          });
        });
      });
    });
  });
}); // Route: Data JSON semua objek (untuk AJAX "Tampilkan Semua")

router.get('/semua', function (req, res) {
  var sql = "\n    SELECT o.*, k.nama_kategori\n    FROM objek o\n    LEFT JOIN kategori k ON o.kategori_id = k.id\n    ORDER BY o.id DESC\n  ";
  db.query(sql, function (err, results) {
    if (err) {
      console.error('Gagal mengambil semua objek:', err);
      return res.status(500).json({
        error: 'Gagal mengambil data'
      });
    }

    res.json(results);
  });
}); // Route: Detail objek berdasarkan ID

router.get('/:id', function (req, res) {
  var objekId = req.params.id;
  var sql = "\n    SELECT o.*, k.nama_kategori \n    FROM objek o \n    LEFT JOIN kategori k ON o.kategori_id = k.id \n    WHERE o.id = ?\n  ";
  db.query(sql, [objekId], function (err, results) {
    if (err) {
      console.error('Gagal mengambil detail objek:', err);
      return res.status(500).send('Gagal memuat detail objek');
    }

    if (results.length === 0) {
      return res.status(404).render('error', {
        message: 'Objek tidak ditemukan'
      });
    }

    var objek = results[0];
    res.render('detail', {
      objek: objek
    });
  });
});
module.exports = router;
//# sourceMappingURL=objek.dev.js.map
