(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('PartyBuildingService', PartyBuildingService);

  PartyBuildingService.$inject = ['$resource', '$log'];

  function PartyBuildingService($resource, $log) {
    var Partymap = $resource('/api/partybuilding');
    return Partymap;
  }
}());
