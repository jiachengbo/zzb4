(function () {
  'use strict';

  angular
    .module('buildbuild.services')
    .factory('buildpersonService', buildpersonService);

  buildpersonService.$inject = ['$resource'];

  function buildpersonService($resource) {
    var buildperson = $resource('/api/buildperson');
    return buildperson;
  }
}());
