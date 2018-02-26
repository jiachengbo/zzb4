(function () {
  'use strict';

  angular
    .module('partymap')
    .controller('PartymapModalFormController', PartymapModalFormController);

  PartymapModalFormController.$inject = ['$scope', '$uibModalInstance', 'partymapData', 'method'];
  function PartymapModalFormController($scope, $uibModalInstance, partymapData, method) {
    var vm = this;
    vm.partymapData = partymapData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.partymapForm');
        return;
      }
      $uibModalInstance.close(vm.partymapData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
