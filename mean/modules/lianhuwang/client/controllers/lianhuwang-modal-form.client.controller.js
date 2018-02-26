(function () {
  'use strict';

  angular
    .module('lianhuwang')
    .controller('LianhuwangModalFormController', LianhuwangModalFormController);

  LianhuwangModalFormController.$inject = ['$scope', '$uibModalInstance', 'lianhuwangData', 'method'];
  function LianhuwangModalFormController($scope, $uibModalInstance, lianhuwangData, method) {
    var vm = this;
    vm.lianhuwangData = lianhuwangData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.lianhuwangForm');
        return;
      }
      $uibModalInstance.close(vm.lianhuwangData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
