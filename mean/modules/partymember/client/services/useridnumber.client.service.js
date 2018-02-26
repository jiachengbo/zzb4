(function () {
  'use strict';

  angular
    .module('partymember.services')
    .factory('UserIDNumberService', UserIDNumberService);

  UserIDNumberService.$inject = ['$resource', '$log'];

  function UserIDNumberService($resource, $log) {
    var Partymember = $resource('/api/useridnumber');

    angular.extend(Partymember.prototype, {
      createOrUpdate: function () {
        var partymember = this;
        return createOrUpdate(partymember);
      }
    });

    return Partymember;

    function createOrUpdate(partymember) {
      if (partymember.id) {
        return partymember.$update(onSuccess, onError);
      } else {
        return partymember.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(partymember) {
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
