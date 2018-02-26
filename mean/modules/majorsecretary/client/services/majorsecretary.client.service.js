(function () {
  'use strict';

  angular
    .module('majorsecretary.services')
    .factory('MajorsecretaryService', MajorsecretaryService);

  MajorsecretaryService.$inject = ['$resource', '$log'];

  function MajorsecretaryService($resource, $log) {
    var Majorsecretary = $resource('/api/majorsecretary/:majorsecretaryId', {
      majorsecretaryId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Majorsecretary.prototype, {
      createOrUpdate: function () {
        var majorsecretary = this;
        return createOrUpdate(majorsecretary);
      }
    });

    return Majorsecretary;

    function createOrUpdate(majorsecretary) {
      if (majorsecretary.id) {
        return majorsecretary.$update(onSuccess, onError);
      } else {
        return majorsecretary.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(majorsecretary) {
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
