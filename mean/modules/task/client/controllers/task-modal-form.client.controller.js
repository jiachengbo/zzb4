(function () {
  'use strict';

  angular
    .module('task')
    .controller('TaskModalFormController', TaskModalFormController);

  TaskModalFormController.$inject = ['$scope', '$uibModalInstance', 'taskData', 'method'];
  function TaskModalFormController($scope, $uibModalInstance, taskData, method) {
    var vm = this;
    vm.taskData = taskData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.taskForm');
        return;
      }
      $uibModalInstance.close(vm.taskData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
