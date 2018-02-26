(function () {
  'use strict';

  angular
    .module('partyorganization.services')
    .factory('PartyorganizationService', PartyorganizationService);

  PartyorganizationService.$inject = ['$resource', '$log'];

  function PartyorganizationService($resource, $log) {
    var Partyorganization = $resource('/api/partyorganization/:partyorganizationId', {
      partyorganizationId: '@OrganizationId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Partyorganization.prototype, {
      createOrUpdate: function () {
        var partyorganization = this;
        return createOrUpdate(partyorganization);
      }
    });

    return Partyorganization;

    function createOrUpdate(partyorganization) {
      if (partyorganization.id) {
        return partyorganization.$update(onSuccess, onError);
      } else {
        return partyorganization.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(partyorganization) {
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
