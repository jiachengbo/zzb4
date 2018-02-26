(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('projectprossService', projectprossService);

  projectprossService.$inject = ['$resource'];

  function projectprossService($resource) {
    var projectpross = $resource('/api/projectpross');
    return projectpross;
  }
}());
