'use strict';

angular.module('loveLabApp')
  .controller('ApplicationCtrl', function ($scope) {
    console.log('test')
    $scope.message = function () {
    	console.log('test')
    };
  });
