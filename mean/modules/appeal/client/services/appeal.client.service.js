(function () {
  'use strict';

  angular
    .module('appeal.services')
    .factory('AppealService', AppealService);

  AppealService.$inject = ['$resource', '$log'];

  function AppealService($resource, $log) {
    var Appeal = $resource('/api/appeal/:appealId', {
      appealId: '@appealId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Appeal.prototype, {
      createOrUpdate: function () {
        var appeal = this;
        return createOrUpdate(appeal);
      }
    });

    return Appeal;

    function createOrUpdate(appeal) {
      if (appeal.appealId) {
        return appeal.$update(onSuccess, onError);
      } else {
        return appeal.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(appeal) {
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
