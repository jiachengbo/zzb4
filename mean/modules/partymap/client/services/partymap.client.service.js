(function () {
  'use strict';

  angular
    .module('partymap.services')
    .factory('PartymapService', PartymapService);

  PartymapService.$inject = ['$resource', '$log'];

  function PartymapService($resource, $log) {
    var Partymap = $resource('/api/partymap/:partymapId', {
      partymapId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Partymap.prototype, {
      createOrUpdate: function () {
        var partymap = this;
        return createOrUpdate(partymap);
      }
    });

    return Partymap;

    function createOrUpdate(partymap) {
      if (partymap.id) {
        return partymap.$update(onSuccess, onError);
      } else {
        return partymap.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(partymap) {
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
