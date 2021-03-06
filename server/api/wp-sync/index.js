'use strict';

var express = require('express');
var controller = require('./wp-sync.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.sync);

module.exports = router;