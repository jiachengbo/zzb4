(function () {
  'use strict';

  angular
    .module('orgset.services')
    .factory('OrgPersonService', OrgPersonService);

  OrgPersonService.$inject = ['$resource', '$log'];
  function OrgPersonService($resource, $log) {
    var Orgset = $resource('/api/orgperson/:orgpersonId', {
      orgpersonId: '@personId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Orgset.prototype, {
      createOrUpdate: function () {
        var orgset = this;
        return createOrUpdate(orgset);
      }
    });

    return Orgset;

    function createOrUpdate(orgset) {
      if (orgset.id) {
        return orgset.$update(onSuccess, onError);
      } else {
        return orgset.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(orgset) {
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
