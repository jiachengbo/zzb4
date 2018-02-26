(function () {
  'use strict';

  angular
    .module('advice.services')
    .factory('AdviceService', AdviceService);

  AdviceService.$inject = ['$resource', '$log'];

  function AdviceService($resource, $log) {
    var Advice = $resource('/api/advice/:adviceId', {
      adviceId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Advice.prototype, {
      createOrUpdate: function () {
        var advice = this;
        return createOrUpdate(advice);
      }
    });

    return Advice;

    function createOrUpdate(advice) {
      if (advice.id) {
        return advice.$update(onSuccess, onError);
      } else {
        return advice.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(advice) {
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
