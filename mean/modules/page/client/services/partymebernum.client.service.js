(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('memberNumService', memberNumService);

  memberNumService.$inject = ['$resource'];

  function memberNumService($resource) {
    var memberNum = $resource('/api/memberNum');
    return memberNum;
  }
}());
