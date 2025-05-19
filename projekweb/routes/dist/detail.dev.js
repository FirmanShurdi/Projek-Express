"use strict";

var express = require('express');

var router = express.Router();

var db = require('../db');

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
//# sourceMappingURL=detail.dev.js.map
