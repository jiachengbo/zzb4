(function () {
  'use strict';

  angular
    .module('role.services')
    .factory('RoleService', RoleService);

  RoleService.$inject = ['$resource', '$log'];

  function RoleService($resource, $log) {
    var Role = $resource('/api/role/:roleId', {
      roleId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Role.prototype, {
      createOrUpdate: function () {
        var role = this;
        return createOrUpdate(role);
      }
    });

    return Role;

    function createOrUpdate(role) {
      if (role.id) {
        return role.$update(onSuccess, onError);
      } else {
        return role.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(role) {
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
