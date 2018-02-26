(function () {
  'use strict';

  angular
    .module('problemWall.services')
    .factory('ProblemWallService', ProblemWallService);

  ProblemWallService.$inject = ['$resource', '$log'];

  function ProblemWallService($resource, $log) {
    var ProblemWall = $resource('/api/problemWall/:problemWallId', {
      problemWallId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(ProblemWall.prototype, {
      createOrUpdate: function () {
        var problemWall = this;
        return createOrUpdate(problemWall);
      }
    });

    return ProblemWall;

    function createOrUpdate(problemWall) {
      if (problemWall.id) {
        return problemWall.$update(onSuccess, onError);
      } else {
        return problemWall.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(problemWall) {
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
