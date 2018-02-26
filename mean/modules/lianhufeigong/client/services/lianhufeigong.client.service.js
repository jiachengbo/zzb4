(function () {
  'use strict';

  angular
    .module('lianhufeigong.services')
    .factory('LianhufeigongService', LianhufeigongService);

  LianhufeigongService.$inject = ['$resource', '$log'];

  function LianhufeigongService($resource, $log) {
    var Lianhufeigong = $resource('/api/lianhufeigong/:lianhufeigongId', {
      lianhufeigongId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Lianhufeigong.prototype, {
      createOrUpdate: function () {
        var lianhufeigong = this;
        return createOrUpdate(lianhufeigong);
      }
    });

    return Lianhufeigong;

    function createOrUpdate(lianhufeigong) {
      if (lianhufeigong.id) {
        return lianhufeigong.$update(onSuccess, onError);
      } else {
        return lianhufeigong.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(lianhufeigong) {
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
