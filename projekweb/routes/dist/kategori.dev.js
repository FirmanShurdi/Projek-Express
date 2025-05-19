"use strict";

var express = require('express');

var router = express.Router();

var conn = require('../db'); // INDEX


router.get('/', function (req, res) {
  var sql = "\n    SELECT o.id, o.nama, o.kategori_id, o.deskripsi, o.gambar, o.audio, k.nama_kategori \n    FROM objek o \n    JOIN kategori k ON o.kategori_id = k.id\n  ";
  conn.query(sql, function (err, objek) {
    if (err) throw err;
    conn.query('SELECT * FROM kategori', function (err, kategori) {
      if (err) throw err;
      res.render('kategori/index', {
        objek: objek,
        kategori: kategori
      });
    });
  });
}); // CREATE FORM

router.get('/create', function (req, res) {
  conn.query('SELECT * FROM kategori', function (err, kategori) {
    if (err) throw err;
    res.render('kategori/create', {
      kategori: kategori
    });
  });
}); // CREATE POST

router.post('/create', function (req, res) {
  var _req$body = req.body,
      nama = _req$body.nama,
      kategori_id = _req$body.kategori_id,
      deskripsi = _req$body.deskripsi,
      gambar = _req$body.gambar,
      audio = _req$body.audio;
  var sql = "\n    INSERT INTO objek (nama, kategori_id, deskripsi, gambar, audio) \n    VALUES (?, ?, ?, ?, ?)\n  ";
  conn.query(sql, [nama, kategori_id, deskripsi, gambar, audio], function (err) {
    if (err) throw err;
    res.redirect('/kategori');
  });
}); // EDIT FORM

router.get('/edit/:id', function (req, res) {
  var id = req.params.id;
  conn.query('SELECT * FROM objek WHERE id = ?', [id], function (err, results) {
    if (err) throw err;
    var objek = results[0];
    conn.query('SELECT * FROM kategori', function (err, kategori) {
      if (err) throw err;
      res.render('kategori/edit', {
        objek: objek,
        kategori: kategori
      });
    });
  });
}); // EDIT POST

router.post('/edit/:id', function (req, res) {
  var id = req.params.id;
  var _req$body2 = req.body,
      nama = _req$body2.nama,
      kategori_id = _req$body2.kategori_id,
      deskripsi = _req$body2.deskripsi,
      gambar = _req$body2.gambar,
      audio = _req$body2.audio;
  var sql = "\n    UPDATE objek \n    SET nama = ?, kategori_id = ?, deskripsi = ?, gambar = ?, audio = ? \n    WHERE id = ?\n  ";
  conn.query(sql, [nama, kategori_id, deskripsi, gambar, audio, id], function (err) {
    if (err) throw err;
    res.redirect('/kategori');
  });
}); // DELETE

router.get('/delete/:id', function (req, res) {
  conn.query('DELETE FROM objek WHERE id = ?', [req.params.id], function (err) {
    if (err) throw err;
    res.redirect('/kategori');
  });
});
module.exports = router;
//# sourceMappingURL=kategori.dev.js.map
