(function () {
  'use strict';

  angular
    .module('partymoney')
    .controller('PartymoneyModalFormController', PartymoneyModalFormController);

  PartymoneyModalFormController.$inject = ['$scope', '$uibModalInstance', 'partymoneyData', 'method'];
  function PartymoneyModalFormController($scope, $uibModalInstance, partymoneyData, method) {
    var vm = this;
    vm.partymoneyData = partymoneyData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.partymoneyForm');
        return;
      }
      $uibModalInstance.close(vm.partymoneyData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
