(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('citybasicpartyService', citybasicpartyService);

  citybasicpartyService.$inject = ['$resource'];

  function citybasicpartyService($resource) {
    var citybasic = $resource('/api/citybasic');
    return citybasic;
  }
}());
