(function () {
  'use strict';

  angular
    .module('relationswitch.services')
    .factory('RelationswitchOutService', RelationswitchOutService);

  RelationswitchOutService.$inject = ['$resource', '$log'];

  function RelationswitchOutService($resource, $log) {
    var Relationswitch = $resource('/api/relationswitchout/:relationswitchoutId', {
      relationswitchoutId: '@shipId'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Relationswitch.prototype, {
      createOrUpdate: function () {
        var relationswitch = this;
        return createOrUpdate(relationswitch);
      }
    });

    return Relationswitch;

    function createOrUpdate(relationswitch) {
      if (relationswitch.id) {
        return relationswitch.$update(onSuccess, onError);
      } else {
        return relationswitch.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(relationswitch) {
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
