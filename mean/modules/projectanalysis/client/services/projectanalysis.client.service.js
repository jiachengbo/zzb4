(function () {
  'use strict';

  angular
    .module('projectAnalysis.services')
    .factory('ProjectAnalysisService', ProjectAnalysisService);

  ProjectAnalysisService.$inject = ['$resource', '$log'];

  function ProjectAnalysisService($resource, $log) {
    var ProjectAnalysis = $resource('/api/projectAnalysis/:projectManagerId', {
      projectManagerId: '@projectManagerId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(ProjectAnalysis.prototype, {
      createOrUpdate: function () {
        var projectAnalysis = this;
        return createOrUpdate(projectAnalysis);
      }
    });

    return ProjectAnalysis;

    function createOrUpdate(projectAnalysis) {
      if (projectAnalysis.id) {
        return projectAnalysis.$update(onSuccess, onError);
      } else {
        return projectAnalysis.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(projectAnalysis) {
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
