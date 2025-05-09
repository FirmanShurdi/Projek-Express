"use strict";

var express = require('express');

var router = express.Router();
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Meduro Pride Anti Keciprat',
    success: req.query.success || null
  });
});
module.exports = router;
//# sourceMappingURL=index.dev.js.map
