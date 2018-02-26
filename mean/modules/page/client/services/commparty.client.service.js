(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('commpartyService', commpartyService);

  commpartyService.$inject = ['$resource'];

  function commpartyService($resource) {
    var communityparty = $resource('/api/commparty');
    return communityparty;
  }
}());
