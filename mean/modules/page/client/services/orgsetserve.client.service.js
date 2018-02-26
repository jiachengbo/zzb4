(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('cityorgsetService', cityorgsetService);

  cityorgsetService.$inject = ['$resource'];

  function cityorgsetService($resource) {
    var cityorgset = $resource('/api/cityorgset');
    return cityorgset;
  }
}());
