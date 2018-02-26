(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('commjobService', commjobService);

  commjobService.$inject = ['$resource'];

  function commjobService($resource) {
    var commjob = $resource('/api/commjob');
    return commjob;
  }
}());
