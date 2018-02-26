(function () {
  'use strict';

  angular
    .module('teammembers')
    .controller('TeammembersModalFormController', TeammembersModalFormController);

  TeammembersModalFormController.$inject = ['$scope', '$uibModalInstance', 'teammembersData', 'method', 'appService', 'baseCodeService'];
  function TeammembersModalFormController($scope, $uibModalInstance, teammembersData, method, appService, baseCodeService) {
    var vm = this;
    vm.teammembersData = teammembersData;
    vm.method = method;
    if (vm.method === 'add') {
      vm.method = '新增';
    } else if (vm.method === 'update') {
      vm.method = '修改';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    }
    vm.disabled = (method === 'view');
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    if (appService.user) {
      vm.grade = appService.user.user_grade;
      vm.branch = appService.user.branch;
      if (vm.grade === 1) {
        //  区委账号
        vm.objId = 0;
      } else if (vm.grade === 2) {
        //  党委账号
        vm.objId = 1;
      } else if (vm.grade === 3) {
        //  党工委账号
        vm.objId = 2;
      } else if (vm.grade === 4) {
        //  部门党委账号
        vm.xxDW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var a = 0; a < vm.dj_PartyOrganization.length; a++) {
          if (vm.dj_PartyOrganization[a].roleID === vm.roleID) {
            vm.objId = vm.dj_PartyOrganization[a].typeID;
          }
        }
      } else if (vm.grade === 5) {
        //  街道党工委账号
        vm.xxDGW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var o = 0; o < vm.dj_PartyOrganization.length; o++) {
          if (vm.dj_PartyOrganization[o].roleID === vm.roleID) {
            vm.objId = vm.dj_PartyOrganization[o].typeID;
          }
        }
      } else if (vm.grade === 6 || vm.grade === 7) {
        //  街道党工委账号
        vm.xxDGW = true;
        vm.objId = vm.branch;
      } else if (vm.grade === 9) {
        vm.xxDWDZZ = true;
        vm.branch1 = appService.user.branch;
        vm.xxDWDZZSon = [];
        for (var b = 0; b < vm.dj_PartyBranch.length; b++) {
          if (vm.branch1 === vm.dj_PartyBranch[b].OrganizationId) {
            vm.objId = vm.dj_PartyBranch[b].generalbranch;
          }
        }
      } else if (vm.grade === 10) {
        vm.xxDGWDZZ = true;
        vm.branch = appService.user.branch;
        vm.xxDGWDZZSon = [];
        for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
          if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
            vm.objId = vm.dj_PartyBranch[x].generalbranch;
          }
        }
      }
    }
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.teammembersForm');
        return;
      }
      vm.teammembersData.photo = vm.create_photoPicFile;
      vm.teammembersData.gradeId = vm.grade;
      vm.teammembersData.objId = vm.objId;
      $uibModalInstance.close(vm.teammembersData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
