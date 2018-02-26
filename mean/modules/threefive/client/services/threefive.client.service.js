(function () {
  'use strict';

  angular
    .module('threefive.services')
    .factory('ThreefiveService', ThreefiveService);

  ThreefiveService.$inject = ['$resource', '$log'];

  function ThreefiveService($resource, $log) {
    var Threefive = $resource('/api/threefive/:threefiveId', {
      threefiveId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Threefive.prototype, {
      createOrUpdate: function () {
        var threefive = this;
        return createOrUpdate(threefive);
      }
    });

    return Threefive;

    function createOrUpdate(threefive) {
      if (threefive.id) {
        return threefive.$update(onSuccess, onError);
      } else {
        return threefive.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(threefive) {
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
