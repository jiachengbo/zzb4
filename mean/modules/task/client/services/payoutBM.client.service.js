(function () {
  'use strict';

  angular
    .module('task.services')
    .factory('PayoutBMService', PayoutBMService);

  PayoutBMService.$inject = ['$resource', '$log'];

  function PayoutBMService($resource, $log) {
    var Task = $resource('/api/payoutbm');
    // angular.extend(Task.prototype, {
    //   createOrUpdate: function () {
    //     var task = this;
    //     return createOrUpdate(task);
    //   }
    // });

    return Task;

    function createOrUpdate(task) {
      if (task.addtaskId) {
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
