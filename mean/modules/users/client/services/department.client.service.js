(function () {
  'use strict';

  angular
    .module('department.services')
    .factory('DepartmentService', DepartmentService);

  DepartmentService.$inject = ['$resource', '$log'];

  function DepartmentService($resource, $log) {
    var Department = $resource('/api/department/:departmentId', {
      departmentId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
    return Department;
  }
}());
