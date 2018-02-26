(function () {
  'use strict';

  angular
    .module('workposition.services')
    .factory('WorkPositionService', WorkPositionService);

  WorkPositionService.$inject = ['$resource', '$log'];

  function WorkPositionService($resource, $log) {
    var WorkPosition = $resource('/api/workposition/:workpositionId', {
      workpositionId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(WorkPosition.prototype, {
      createOrUpdate: function () {
        var workposition = this;
        return createOrUpdate(workposition);
      }
    });

    return WorkPosition;

    function createOrUpdate(workposition) {
      if (workposition.id) {
        return workposition.$update(onSuccess, onError);
      } else {
        return workposition.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(workposition) {
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
