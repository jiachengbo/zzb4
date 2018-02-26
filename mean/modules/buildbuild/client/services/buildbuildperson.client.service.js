(function () {
  'use strict';

  angular
    .module('buildbuild.services')
    .factory('BuildbuildPersonService', BuildbuildPersonService);

  BuildbuildPersonService.$inject = ['$resource', '$log'];

  function BuildbuildPersonService($resource, $log) {
    var BuildbuildPerson = $resource('/api/buildbuildperson');

    angular.extend(BuildbuildPerson.prototype, {
      createOrUpdate: function () {
        var buildbuildperson = this;
        return createOrUpdate(buildbuildperson);
      }
    });

    return BuildbuildPerson;

    function createOrUpdate(buildbuildperson) {
      if (buildbuildperson.id) {
        return buildbuildperson.$update(onSuccess, onError);
      } else {
        return buildbuildperson.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(buildbuildperson) {
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
