(function () {
  'use strict';

  angular
    .module('partymoney.services')
    .factory('PartymoneyService', PartymoneyService);

  PartymoneyService.$inject = ['$resource', '$log'];

  function PartymoneyService($resource, $log) {
    var Partymoney = $resource('/api/partymoney/:partymoneyId', {
      partymoneyId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Partymoney.prototype, {
      createOrUpdate: function () {
        var partymoney = this;
        return createOrUpdate(partymoney);
      }
    });

    return Partymoney;

    function createOrUpdate(partymoney) {
      if (partymoney.id) {
        return partymoney.$update(onSuccess, onError);
      } else {
        return partymoney.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(partymoney) {
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
