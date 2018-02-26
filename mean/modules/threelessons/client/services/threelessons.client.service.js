(function () {
  'use strict';

  angular
    .module('threelessons.services')
    .factory('ThreelessonsService', ThreelessonsService);

  ThreelessonsService.$inject = ['$resource', '$log'];

  function ThreelessonsService($resource, $log) {
    var Threelessons = $resource('/api/threelessons/:threelessonsId', {
      threelessonsId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Threelessons.prototype, {
      createOrUpdate: function () {
        var threelessons = this;
        return createOrUpdate(threelessons);
      }
    });

    return Threelessons;

    function createOrUpdate(threelessons) {
      if (threelessons.id) {
        return threelessons.$update(onSuccess, onError);
      } else {
        return threelessons.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(threelessons) {
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
