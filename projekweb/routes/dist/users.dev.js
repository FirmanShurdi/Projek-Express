"use strict";

var express = require('express');

var router = express.Router();

var connection = require('../db'); // Menampilkan daftar users


router.get('/', function (req, res) {
  connection.query('SELECT * FROM users ORDER BY id DESC', function (err, rows) {
    if (err) {
      console.log('Error:', err); // Tambahkan baris ini

      req.flash('error', 'Gagal mengambil data: ' + err.message);
      return res.redirect('/');
    }

    console.log('Data berhasil diambil:', rows.length); // Tambahkan baris ini

    res.render('users/index', {
      data: rows,
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  });
}); // Form tambah user

router.get('/create', function (req, res) {
  res.render('users/create');
}); // Simpan user baru

router.post('/store', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password,
      email = _req$body.email,
      role = _req$body.role;
  var data = {
    username: username,
    password: password,
    email: email,
    role: role
  };
  connection.query('INSERT INTO users SET ?', data, function (err) {
    if (err) {
      req.flash('error', 'Gagal menyimpan data: ' + err.message);
    } else {
      req.flash('success', 'Berhasil menyimpan data');
    }

    res.redirect('/users');
  });
}); // Form edit user

router.get('/edit/:id', function (req, res) {
  var id = req.params.id;
  connection.query('SELECT * FROM users WHERE id = ?', [id], function (err, rows) {
    if (err || rows.length === 0) {
      req.flash('error', 'User tidak ditemukan');
      return res.redirect('/users');
    }

    res.render('users/edit', {
      user: rows[0]
    });
  });
}); // Update user

router.post('/update/:id', function (req, res) {
  var id = req.params.id;
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password,
      email = _req$body2.email,
      role = _req$body2.role;
  var data = {
    username: username,
    password: password,
    email: email,
    role: role
  };
  connection.query('UPDATE users SET ? WHERE id = ?', [data, id], function (err) {
    if (err) {
      req.flash('error', 'Gagal memperbarui data: ' + err.message);
    } else {
      req.flash('success', 'Berhasil memperbarui data');
    }

    res.redirect('/users');
  });
}); // Hapus user

router.get('/delete/:id', function (req, res) {
  var id = req.params.id;
  connection.query('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      req.flash('error', 'Gagal menghapus data: ' + err.message);
    } else {
      req.flash('success', 'Data berhasil dihapus');
    }

    res.redirect('/users');
  });
});
module.exports = router;
//# sourceMappingURL=users.dev.js.map
