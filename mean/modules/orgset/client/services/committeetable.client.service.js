(function () {
  'use strict';

  angular
    .module('orgset.services')
    .factory('CommitteeTableService', CommitteeTableService);

  CommitteeTableService.$inject = ['$resource', '$log'];

  function CommitteeTableService($resource, $log) {
    var CommitteeTable = $resource('/api/committeeTable/:committeeTableId', {
      committeeTableId: '@CommitteeId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(CommitteeTable.prototype, {
      createOrUpdate: function () {
        var committeeTable = this;
        return createOrUpdate(committeeTable);
      }
    });

    return CommitteeTable;

    function createOrUpdate(committeeTable) {
      if (committeeTable.id) {
        return committeeTable.$update(onSuccess, onError);
      } else {
        return committeeTable.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(committeeTable) {
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
