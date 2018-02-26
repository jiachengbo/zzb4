(function () {
  'use strict';

  angular
    .module('jobduties.services')
    .factory('JobdutiesService', JobdutiesService);

  JobdutiesService.$inject = ['$resource', '$log'];

  function JobdutiesService($resource, $log) {
    var Jobduties = $resource('/api/jobduties/:jobdutiesId', {
      jobdutiesId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Jobduties.prototype, {
      createOrUpdate: function () {
        var jobduties = this;
        return createOrUpdate(jobduties);
      }
    });

    return Jobduties;

    function createOrUpdate(jobduties) {
      if (jobduties.id) {
        return jobduties.$update(onSuccess, onError);
      } else {
        return jobduties.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(jobduties) {
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
