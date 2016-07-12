'use strict';

angular.module('loveLabApp')
  .factory('sync', function () {
    var syncService = {};

    syncService.save = function () {
    	return true;
    }

    return syncService;
  });
