(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('litterxinService', litterxinService);

  litterxinService.$inject = ['$resource'];

  function litterxinService($resource) {
    var litterxin = $resource('/api/litterxin');
    return litterxin;
  }
}());
