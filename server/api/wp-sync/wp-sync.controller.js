'use strict';

var _ = require('lodash');

// Get list of wp-syncs
exports.index = function(req, res) {
  res.json([{'deployed': 'yes'}]);
};