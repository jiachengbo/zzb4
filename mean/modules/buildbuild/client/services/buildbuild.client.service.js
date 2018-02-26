(function () {
  'use strict';

  angular
    .module('buildbuild.services')
    .factory('BuildbuildService', BuildbuildService);

  BuildbuildService.$inject = ['$resource', '$log'];

  function BuildbuildService($resource, $log) {
    var Buildbuild = $resource('/api/buildbuild/:buildbuildId', {
      buildbuildId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Buildbuild.prototype, {
      createOrUpdate: function () {
        var buildbuild = this;
        return createOrUpdate(buildbuild);
      }
    });

    return Buildbuild;

    function createOrUpdate(buildbuild) {
      if (buildbuild.id) {
        return buildbuild.$update(onSuccess, onError);
      } else {
        return buildbuild.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(buildbuild) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
