(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('SearchService', SearchService);

  SearchService.$inject = ['$resource'];

  function SearchService($resource) {
    var memberNum = $resource('/api/search');
    return memberNum;
  }
}());
