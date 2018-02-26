(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('prowallService', prowallService);

  prowallService.$inject = ['$resource'];

  function prowallService($resource) {
    var prowall = $resource('/api/prowall');
    return prowall;
  }
}());
