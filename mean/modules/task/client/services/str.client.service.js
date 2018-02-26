(function () {
  'use strict';

  angular
    .module('task.services')
    .factory('StrService', StrService);

  StrService.$inject = ['$resource', '$log'];

  function StrService($resource, $log) {
    var str = $resource('/api/str');

    // angular.extend(Task.prototype, {
    //   createOrUpdate: function () {
    //     var task = this;
    //     return createOrUpdate(task);
    //   }
    // });

    return str;

    function createOrUpdate(task) {
      if (task.id) {
        return task.$update(onSuccess, onError);
      } else {
        return task.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(task) {
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
