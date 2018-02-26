(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('GetPartyMemberService', GetPartyMemberService);

  GetPartyMemberService.$inject = ['$resource'];

  function GetPartyMemberService($resource) {
    var memberNum = $resource('/api/getpartymember');
    return memberNum;
  }
}());
