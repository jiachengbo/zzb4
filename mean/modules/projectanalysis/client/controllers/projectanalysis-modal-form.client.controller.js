(function () {
  'use strict';

  angular
    .module('projectAnalysis')
    .controller('ProjectAnalysisModalFormController', ProjectAnalysisModalFormController);

  ProjectAnalysisModalFormController.$inject = ['$scope', '$uibModalInstance', 'projectAnalysisData', 'method'];
  function ProjectAnalysisModalFormController($scope, $uibModalInstance, projectAnalysisData, method) {
    var vm = this;
    vm.projectAnalysisData = projectAnalysisData;
    vm.method = method;
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.projectAnalysisForm');
        return;
      }
      $uibModalInstance.close(vm.projectAnalysisData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
