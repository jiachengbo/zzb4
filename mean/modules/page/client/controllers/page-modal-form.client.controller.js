(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageModalFormController', PageModalFormController);

  PageModalFormController.$inject = ['$scope', '$uibModalInstance', 'pageData', 'method'];
  function PageModalFormController($scope, $uibModalInstance, pageData, method) {
    var vm = this;
    vm.pageData = pageData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.pageForm');
        return;
      }
      $uibModalInstance.close(vm.pageData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
