(function () {
  'use strict';

  angular
    .module('orgset.services')
    .factory('OrgtableService', OrgtableService);

  OrgtableService.$inject = ['$resource', '$log'];

  function OrgtableService($resource, $log) {
    var Orgtable = $resource('/api/orgtable/:orgId', {
      orgId: '@orgId'
    }, {
      update: {
        method: 'PUT'
      }
    });
    angular.extend(Orgtable.prototype, {
      createOrUpdate: function () {
        var orgtable = this;
        return createOrUpdate(orgtable);
      }
    });
    return Orgtable;
    function createOrUpdate(orgtable) {
      if (orgtable.id) {
        return orgtable.$update(onSuccess, onError);
      } else {
        return orgtable.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(orgtable) {
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
