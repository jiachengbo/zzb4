(function () {
  'use strict';

  angular
    .module('appeal.services')
    .factory('appealZQService', appealZQService);

  appealZQService.$inject = ['$resource'];

  function appealZQService($resource) {
    var appealzq = $resource('/api/appealzq');
    return appealzq;
  }
}());
