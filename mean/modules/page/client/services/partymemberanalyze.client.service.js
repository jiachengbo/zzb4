(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('PartyMemberAnalyzeService', PartyMemberAnalyzeService);

  PartyMemberAnalyzeService.$inject = ['$resource'];

  function PartyMemberAnalyzeService($resource) {
    var citybasic = $resource('/api/partymemberanalyze');
    return citybasic;
  }
}());
