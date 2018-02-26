(function () {
  'use strict';

  angular
    .module('problemWall.services')
    .factory('ProblemWallRecService', ProblemWallRecService);

  ProblemWallRecService.$inject = ['$resource', '$log'];

  function ProblemWallRecService($resource, $log) {
    var ProblemWallRec = $resource('/api/problemWallRec/:problemWallRecId', {
      problemWallRecId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(ProblemWallRec.prototype, {
      createOrUpdate: function () {
        var problemWallRec = this;
        return createOrUpdate(problemWallRec);
      }
    });

    return ProblemWallRec;

    function createOrUpdate(problemWallRec) {
      if (problemWallRec.id) {
        return problemWallRec.$update(onSuccess, onError);
      } else {
        return problemWallRec.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(problemWallRec) {
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
