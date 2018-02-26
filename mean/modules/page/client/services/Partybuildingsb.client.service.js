(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('PartyBuildingSbService', PartyBuildingSbService);

  PartyBuildingSbService.$inject = ['$resource', '$log'];

  function PartyBuildingSbService($resource, $log) {
    var Partymap = $resource('/api/partybuildingsb');
    return Partymap;
  }
}());
