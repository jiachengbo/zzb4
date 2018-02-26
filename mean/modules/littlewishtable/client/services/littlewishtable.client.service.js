(function () {
  'use strict';

  angular
    .module('littleWishTable.services')
    .factory('LittleWishTableService', LittleWishTableService);

  LittleWishTableService.$inject = ['$resource', '$log'];

  function LittleWishTableService($resource, $log) {
    var LittleWishTable = $resource('/api/littleWishTable/:littleId', {
      littleId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(LittleWishTable.prototype, {
      createOrUpdate: function () {
        var littleWishTable = this;
        return createOrUpdate(littleWishTable);
      }
    });

    return LittleWishTable;

    function createOrUpdate(littleWishTable) {
      if (littleWishTable.id) {
        return littleWishTable.$update(onSuccess, onError);
      } else {
        return littleWishTable.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(littleWishTable) {
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
