(function () {
  'use strict';

  angular
    .module('worknode.services')
    .factory('WorknodeService', WorknodeService);

  WorknodeService.$inject = ['$resource', '$log'];

  function WorknodeService($resource, $log) {
    var Worknode = $resource('/api/worknode/:worknodeId', {
      worknodeId: '@userReportId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Worknode.prototype, {
      createOrUpdate: function () {
        var worknode = this;
        return createOrUpdate(worknode);
      }
    });

    return Worknode;

    function createOrUpdate(worknode) {
      if (worknode.id) {
        return worknode.$update(onSuccess, onError);
      } else {
        return worknode.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(worknode) {
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
