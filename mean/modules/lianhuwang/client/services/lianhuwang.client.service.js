(function () {
  'use strict';

  angular
    .module('lianhuwang.services')
    .factory('LianhuwangService', LianhuwangService);

  LianhuwangService.$inject = ['$resource', '$log'];

  function LianhuwangService($resource, $log) {
    var Lianhuwang = $resource('/api/lianhuwang/:lianhuwangId', {
      lianhuwangId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Lianhuwang.prototype, {
      createOrUpdate: function () {
        var lianhuwang = this;
        return createOrUpdate(lianhuwang);
      }
    });

    return Lianhuwang;

    function createOrUpdate(lianhuwang) {
      if (lianhuwang.id) {
        return lianhuwang.$update(onSuccess, onError);
      } else {
        return lianhuwang.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(lianhuwang) {
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
