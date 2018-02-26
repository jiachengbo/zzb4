(function () {
  'use strict';

  angular
    .module('lianhufeigong')
    .controller('LianhufeigongModalFormController', LianhufeigongModalFormController);

  LianhufeigongModalFormController.$inject = ['$scope', '$uibModalInstance', 'lianhufeigongData', 'method'];
  function LianhufeigongModalFormController($scope, $uibModalInstance, lianhufeigongData, method) {
    var vm = this;
    vm.lianhufeigongData = lianhufeigongData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.lianhufeigongForm');
        return;
      }
      $uibModalInstance.close(vm.lianhufeigongData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
