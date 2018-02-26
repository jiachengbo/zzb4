(function () {
  'use strict';

  angular
    .module('relationswitch.services')
    .factory('RelationswitchInService', RelationswitchInService);

  RelationswitchInService.$inject = ['$resource', '$log'];

  function RelationswitchInService($resource, $log) {
    var Relationswitch = $resource('/api/relationswitchin/:relationswitchinId', {
      relationswitchinId: '@shipId'
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
