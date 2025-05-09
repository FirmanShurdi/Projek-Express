"use strict";

var express = require('express');

var router = express.Router();

var _require = require('./logres'),
    isAdmin = _require.isAdmin;

router.get('/', isAdmin, function (req, res) {
  res.render('master', {
    success: req.query.success || null,
    error: req.query.error || null
  });
});
module.exports = router;
//# sourceMappingURL=master.dev.js.map
