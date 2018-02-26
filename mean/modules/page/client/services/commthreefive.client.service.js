(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('commthreefiveService', commthreefiveService);

  commthreefiveService.$inject = ['$resource'];

  function commthreefiveService($resource) {
    var commthreefive = $resource('/api/commthreefive');
    return commthreefive;
  }
}());
