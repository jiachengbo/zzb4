(function () {
  'use strict';

  angular
    .module('advice')
    .controller('AdviceModalFormController', AdviceModalFormController);

  AdviceModalFormController.$inject = ['$scope', '$uibModalInstance', 'adviceData', 'method', 'baseCodeService', 'appService'];
  function AdviceModalFormController($scope, $uibModalInstance, adviceData, method, baseCodeService, appService) {
    var vm = this;
    vm.adviceData = adviceData;
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
        if (v.streetName === vm.adviceData.streetID) {
          vm.adviceData.streetID = v.streetID;
        }
      }
    });
    angular.forEach(vm.community, function (v, k) {
      if (v.streetID === vm.adviceData.streetID) {
        $scope.community.push(v);
      }
      if (vm.method !== '增加') {
        if (v.communityName === vm.adviceData.communityID) {
          vm.adviceData.communityID = v.communityId;
        }
      }
    });
    angular.forEach(vm.grid, function (v, k) {
      if (v.streetID === vm.adviceData.streetID && v.departmentId === vm.adviceData.communityID) {
        $scope.grid.push(v);
      }
      if (vm.method !== '增加') {
        if (v.gridNum === vm.adviceData.gridID) {
          vm.adviceData.gridID = v.gridId;
        }
      }
    });
    //在这里处理要进行的操作
    if (!vm.adviceData.releasePerson) {
      vm.adviceData.releasePerson = appService.user.displayName;
    }
    if (!vm.adviceData.replyTime) {
      var time = new Date();
      vm.adviceData.replyTime = time.toLocaleString();
    }
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.adviceForm');
        return;
      }
      if (vm.adviceData.replyContent) {
        vm.adviceData.issend = 1;
      }
      $uibModalInstance.close(vm.adviceData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
