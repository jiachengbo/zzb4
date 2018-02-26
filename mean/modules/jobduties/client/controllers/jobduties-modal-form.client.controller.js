(function () {
  'use strict';

  angular
    .module('jobduties')
    .controller('JobdutiesModalFormController', JobdutiesModalFormController);

  JobdutiesModalFormController.$inject = ['$scope', '$uibModalInstance', 'jobdutiesData', 'method', 'baseCodeService', 'appService'];
  function JobdutiesModalFormController($scope, $uibModalInstance, jobdutiesData, method, baseCodeService, appService) {
    var vm = this;
    var role = appService.user.JCDJ_User_roleID;
    var branch = appService.user.branch;
    var rolelist = baseCodeService.getItems('dj_JCDJ_UserRole');
    var branchlist = baseCodeService.getItems('dj_PartyBranch');
    var commid;
    vm.jobdutiesData = jobdutiesData;
    console.log(jobdutiesData);
    vm.method = method;
    vm.disabled = (method === 'view');
    if (vm.method === 'add') {
      vm.method = '增加';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    } else if (vm.method === 'update') {
      vm.method = '更新';
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
        if (v.streetName === vm.jobdutiesData.streetid) {
          vm.jobdutiesData.streetid = v.streetID;
        }
      }
    });
    if (role > 31 && role < 41) {
      angular.forEach(rolelist, function (v, k) {
        if (v.UserRoleID === role) {
          vm.jobdutiesData.streetid = v.streetID;
        }
      });
    }
    if (role === 68 || role === 73) {
      angular.forEach(branchlist, function (v, k) {
        if (v.OrganizationId === branch) {
          vm.jobdutiesData.streetid = v.streetID;
          commid = v.communityId;
        }
      });
    }
    angular.forEach(vm.community, function (v, k) {
      if (v.streetID === vm.jobdutiesData.streetid) {
        $scope.community.push(v);
      }
      if (vm.method !== '增加') {
        if (v.communityName === vm.jobdutiesData.communityid) {
          vm.jobdutiesData.communityid = v.communityId;
        }
      }
    });
    if (role === 68 || role === 73) {
      vm.jobdutiesData.communityid = commid;
    }
    angular.forEach(vm.grid, function (v, k) {
      if (v.streetID === vm.jobdutiesData.streetid && v.departmentId === vm.jobdutiesData.communityid) {
        $scope.grid.push(v);
      }
      if (vm.method !== '增加') {
        if (v.gridName === vm.jobdutiesData.gridId) {
          vm.jobdutiesData.gridId = v.gridId;
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
        $scope.$broadcast('show-errors-check-validity', 'vm.jobdutiesForm');
        return;
      }
      $uibModalInstance.close(vm.jobdutiesData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
