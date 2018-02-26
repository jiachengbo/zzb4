(function () {
  'use strict';

  // https://gist.github.com/rhutchison/c8c14946e88a1c8f9216

  angular
    .module('global')
    .factory('UserMsg', UserMsg);

  UserMsg.$inject = ['$timeout', '$interpolate', 'appService', 'baseCodeService'];

  function UserMsg($timeout, $interpolate, appService, baseCodeService) {
    var obj = {};
    var vm = this;
    // 判断当前用户的层级id和对象id
    obj.func = function () {
      if (appService.user) {
        vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
        vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
        vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
        vm.grade = appService.user.user_grade;
        if (vm.grade === 1) {
          //  区委账号
          vm.objId = 0;
          vm.objName = '区委';
        } else if (vm.grade === 2) {
          //  党委账号
          vm.objId = 1;
          vm.objName = '党委';
        } else if (vm.grade === 3) {
          //  党工委账号
          vm.objId = 2;
          vm.objName = '党工委';
        } else if (vm.grade === 4) {
          //  部门党委账号
          vm.xxDW = true;
          vm.roleID = appService.user.JCDJ_User_roleID;
          for (var m = 0; m < vm.dj_PartyOrganization.length; m++) {
            if (vm.dj_PartyOrganization[m].roleID === vm.roleID) {
              vm.objId = vm.dj_PartyOrganization[m].typeID;
              vm.objName = vm.dj_PartyOrganization[m].typeName;
            }
          }
        } else if (vm.grade === 5) {
          //  街道党工委账号
          vm.xxDGW = true;
          vm.roleID = appService.user.JCDJ_User_roleID;
          for (var o = 0; o < vm.dj_PartyOrganization.length; o++) {
            if (vm.dj_PartyOrganization[o].roleID === vm.roleID) {
              vm.objId = vm.dj_PartyOrganization[o].typeID;
              vm.objName = vm.dj_PartyOrganization[o].typeName;
            }
          }
        } else if (vm.grade === 6) {
          //  xx党委党支部账号
          vm.objId = appService.user.branch;
          angular.forEach(vm.dj_PartyBranch, function (value, k) {
            if (value.OrganizationId === vm.objId) {
              vm.objName = value.OrganizationName;
            }
          });

        } else if (vm.grade === 7) {
          //  xx党工委党支部账号
          vm.objId = appService.user.branch;
          angular.forEach(vm.dj_PartyBranch, function (v, k) {
            if (v.OrganizationId === appService.user.branch) {
              vm.shangji = v.super;
              vm.objName = v.OrganizationName;
            }
          });
        } else if (vm.grade === 9) {
          vm.xxDWDZZ = true;
          vm.branch1 = appService.user.branch;
          vm.xxDWDZZSon = [];
          for (var n = 0; n < vm.dj_PartyBranch.length; n++) {
            if (vm.branch1 === vm.dj_PartyBranch[n].OrganizationId) {
              vm.objId = vm.dj_PartyBranch[n].generalbranch;
              angular.forEach(vm.dj_PartyGeneralBranch, function (value, k) {
                if (vm.objId === value.branchID) {
                  vm.objName = value.branchName;
                }
              });
            }
          }
        } else if (vm.grade === 10) {
          vm.xxDGWDZZ = true;
          vm.branch = appService.user.branch;
          vm.xxDGWDZZSon = [];
          for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
            if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
              vm.objId = vm.dj_PartyBranch[x].generalbranch;
              angular.forEach(vm.dj_PartyGeneralBranch, function (value, k) {
                if (vm.objId === value.branchID) {
                  vm.objName = value.branchName;
                }
              });
            }
          }
        }
      }
      if (vm.grade > 5) {
        angular.forEach(vm.dj_PartyBranch, function (v, k) {
          if (v.OrganizationId === appService.user.branch) {
            vm.shangji = v.super;
            vm.belongComm = v.belongComm;
          }
        });
      } else {
        vm.shangji = 0;
      }
      obj.gradeId = vm.grade;
      obj.objId = vm.objId;
      obj.shangji = vm.shangji;
      obj.objName = vm.objName;
      obj.belongComm = vm.belongComm;
    };
    return obj;
  }
}());
