(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('workzhizeController', workzhizeController);

  workzhizeController.$inject = ['$scope', '$uibModalInstance', 'orgtableData', 'method', 'baseCodeService', 'OrgtableService'];
  function workzhizeController($scope, $uibModalInstance, orgtableData, method, baseCodeService, OrgtableService) {
    var vm = this;
    vm.orgtableData = orgtableData;
    console.log(orgtableData);
    var obj = {};
    if (orgtableData.orgId) {
      obj.orgId = orgtableData.orgId;
    } else {
      obj.Street = orgtableData.Street;
      obj.community = orgtableData.community;
    }
    OrgtableService.query(obj).$promise
      .then(function (data) {
        if (data.length > 0) {
          var duty = data[0].duty;
          vm.orgtableData.duty = duty || '';
          $('#nrr').html(vm.orgtableData.duty);
        }
      });
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.ok = function (isValid) {
      vm.orgtableData.duty = $('#nrr').html();
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.committeeTableForm');
        return;
      }
      vm.orgtableData.community = orgtableData.community;
      $uibModalInstance.close(vm.orgtableData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
