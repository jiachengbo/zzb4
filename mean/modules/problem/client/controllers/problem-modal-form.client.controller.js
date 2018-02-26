(function () {
  'use strict';

  angular
    .module('problem')
    .controller('ProblemModalFormController', ProblemModalFormController);

  ProblemModalFormController.$inject = ['$scope', '$uibModalInstance', 'problemData', 'method', 'baseCodeService', 'appService'];
  function ProblemModalFormController($scope, $uibModalInstance, problemData, method, baseCodeService, appService) {
    var vm = this;
    vm.problemData = problemData;
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.grid = baseCodeService.getItems('grid');
    vm.community = baseCodeService.getItems('community');
    $scope.street = [];
    $scope.grid = [];
    $scope.community = [];
    angular.forEach(vm.street_info, function (v, k) {
      if (v.streetID > 0 && v.streetID < 10) {
        $scope.street.push(v);
      }
      if (vm.method !== '增加') {
        if (v.streetName === vm.problemData.streetID) {
          vm.problemData.streetID = v.streetID;
        }
      }
    });
    angular.forEach(vm.community, function (v, k) {
      if (v.streetID === vm.problemData.streetID) {
        $scope.community.push(v);
      }
      if (vm.method !== '增加') {
        if (v.communityName === vm.problemData.communityID) {
          vm.problemData.communityID = v.communityId;
        }
      }
    });
    angular.forEach(vm.grid, function (v, k) {
      if (v.streetID === vm.problemData.streetID && v.departmentId === vm.problemData.communityID) {
        $scope.grid.push(v);
      }
      if (vm.method !== '增加') {
        if (v.gridNum === vm.problemData.gridID) {
          vm.problemData.gridID = v.gridId;
        }
      }
    });
    //在这里处理要进行的操作
    if (!vm.problemData.releasePerson) {
      vm.problemData.releasePerson = appService.user.displayName;
    }
    if (!vm.problemData.replyTime) {
      var time = new Date();
      vm.problemData.replyTime = time.toLocaleString();
    }
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.problemForm');
        return;
      }
      if (vm.problemData.replyContent) {
        vm.problemData.issend = 1;
      }
      $uibModalInstance.close(vm.problemData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
