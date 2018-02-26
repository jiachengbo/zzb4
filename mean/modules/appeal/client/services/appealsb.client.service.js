(function () {
  'use strict';

  angular
    .module('appeal.services')
    .factory('AppealsbService', AppealsbService);

  AppealsbService.$inject = ['$resource', '$log'];

  function AppealsbService($resource, $log) {
    var Appealsb = $resource('/api/appealsb/:id', {
      id: '@id'
    }, {
      query: {
        method: 'GET',
        isArray: false
      }
    });

    angular.extend(Appealsb.prototype, {
      createOrUpdate: function () {
        var appealsb = this;
        return createOrUpdate(appealsb);
      }
    });

    return Appealsb;

    function createOrUpdate(appealsb) {
      if (appealsb.id) {
        return appealsb.$update(onSuccess, onError);
      } else {
        return appealsb.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(appealsb) {
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
