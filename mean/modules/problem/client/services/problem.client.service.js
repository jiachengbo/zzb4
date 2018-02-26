(function () {
  'use strict';

  angular
    .module('problem.services')
    .factory('ProblemService', ProblemService);

  ProblemService.$inject = ['$resource', '$log'];

  function ProblemService($resource, $log) {
    var Problem = $resource('/api/problem/:problemId', {
      problemId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Problem.prototype, {
      createOrUpdate: function () {
        var problem = this;
        return createOrUpdate(problem);
      }
    });

    return Problem;

    function createOrUpdate(problem) {
      if (problem.id) {
        return problem.$update(onSuccess, onError);
      } else {
        return problem.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(problem) {
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
