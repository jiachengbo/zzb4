(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('GetPartyOrgService', GetPartyOrgService);

  GetPartyOrgService.$inject = ['$resource'];

  function GetPartyOrgService($resource) {
    var memberNum = $resource('/api/getpartyorg');
    return memberNum;
  }
}());
