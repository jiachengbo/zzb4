(function () {
  'use strict';

  angular
    .module('worknode')
    .controller('WorknodeModalFormController', WorknodeModalFormController);

  WorknodeModalFormController.$inject = ['$scope', '$uibModalInstance', 'worknodeData', 'method', 'baseCodeService', 'appService'];
  function WorknodeModalFormController($scope, $uibModalInstance, worknodeData, method, baseCodeService, appService) {
    var vm = this;
    var role = appService.user.JCDJ_User_roleID;
    var branch = appService.user.branch;
    var rolelist = baseCodeService.getItems('dj_JCDJ_UserRole');
    var branchlist = baseCodeService.getItems('dj_PartyBranch');
    var commid;
    vm.worknodeData = worknodeData;
    vm.method = method;
    vm.disabled = (method === 'view');
    if (vm.method === 'add') {
      vm.method = '增加';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    } else if (vm.method === 'update') {
      vm.method = '修改';
    }
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
        if (v.streetName === vm.worknodeData.streetid) {
          vm.worknodeData.streetid = v.streetID;
        }
      }
    });
    if (role > 31 && role < 41) {
      angular.forEach(rolelist, function (v, k) {
        if (v.UserRoleID === role) {
          vm.worknodeData.streetid = v.streetID;
        }
      });
    }
    if (role === 68 || role === 73) {
      angular.forEach(branchlist, function (v, k) {
        if (v.OrganizationId === branch) {
          vm.worknodeData.streetid = v.streetID;
          commid = v.communityId;
        }
      });
    }
    angular.forEach(vm.community, function (v, k) {
      if (v.streetID === vm.worknodeData.streetid) {
        $scope.community.push(v);
      }
      if (vm.method !== '增加') {
        if (v.communityName === vm.worknodeData.communityid) {
          vm.worknodeData.communityid = v.communityId;
        }
      }
    });
    if (role === 68 || role === 73) {
      vm.worknodeData.communityid = commid;
    }
    angular.forEach(vm.grid, function (v, k) {
      if (v.streetID === vm.worknodeData.streetid && v.departmentId === vm.worknodeData.communityid) {
        $scope.grid.push(v);
      }
      if (vm.method !== '增加') {
        if (v.gridNum === vm.worknodeData.gridId) {
          console.log(v.gridId);
          vm.worknodeData.gridId = v.gridId;
        }
      }
    });
    vm.strchang = function (num) {
      $scope.community = [];
      angular.forEach(vm.community, function (v, k) {
        if (v.streetID === num) {
          $scope.community.push(v);
        }
      });
    };
    vm.commchange = function (street, comm) {
      $scope.grid = [];
      angular.forEach(vm.grid, function (v, k) {
        if (v.streetID === street && v.departmentId === comm) {
          $scope.grid.push(v);
        }
      });
    };
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.worknodeForm');
        return;
      }
      $uibModalInstance.close(vm.worknodeData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
