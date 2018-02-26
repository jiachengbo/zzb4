(function () {
  'use strict';

  angular
    .module('teammembers.services')
    .factory('TeammembersService', TeammembersService);

  TeammembersService.$inject = ['$resource', '$log'];

  function TeammembersService($resource, $log) {
    var Teammembers = $resource('/api/teammembers/:teammembersId', {
      teammembersId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Teammembers.prototype, {
      createOrUpdate: function () {
        var teammembers = this;
        return createOrUpdate(teammembers);
      }
    });

    return Teammembers;

    function createOrUpdate(teammembers) {
      if (teammembers.id) {
        return teammembers.$update(onSuccess, onError);
      } else {
        return teammembers.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(teammembers) {
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
