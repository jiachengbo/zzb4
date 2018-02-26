(function () {
  'use strict';

  angular
    .module('partygeneral.services')
    .factory('PartygeneralService', PartygeneralService);

  PartygeneralService.$inject = ['$resource', '$log'];

  function PartygeneralService($resource, $log) {
    var Partygeneral = $resource('/api/partygeneral/:branchID', {
      branchID: '@branchID'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Partygeneral.prototype, {
      createOrUpdate: function () {
        var partygeneral = this;
        return createOrUpdate(partygeneral);
      }
    });

    return Partygeneral;

    function createOrUpdate(partygeneral) {
      if (partygeneral.branchID) {
        return partygeneral.$update(onSuccess, onError);
      } else {
        return partygeneral.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(partygeneral) {
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
