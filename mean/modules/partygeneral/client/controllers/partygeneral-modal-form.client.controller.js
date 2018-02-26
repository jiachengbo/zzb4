(function () {
  'use strict';

  angular
    .module('partygeneral')
    .controller('PartygeneralModalFormController', PartygeneralModalFormController);

  PartygeneralModalFormController.$inject = ['$scope', '$uibModalInstance', 'partygeneralData', 'method', 'baseCodeService', 'appService'];
  function PartygeneralModalFormController($scope, $uibModalInstance, partygeneralData, method, baseCodeService, appService) {
    var vm = this;
    vm.partygeneralData = partygeneralData;
    vm.method = method;
    vm.disabled = (method === '查看');
    var branch = appService.user.branch;
    var grade = appService.user.user_grade;
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyOrganization = dj_PartyOrganization;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    angular.forEach(dj_PartyBranch, function (v, k) {
      if (branch === v.OrganizationId) {
        vm.typeID = v.super;
      }
    });
    vm.mold = [
      {id: 1, name: '党委党总支'},
      {id: 2, name: '党工委党总支'}
    ];
    vm.showmold = false;
    vm.showdis = false;
    if (grade) {
      if (grade === 1) {
        vm.showmold = false;
        if (vm.partygeneralData.mold === 1) {
          vm.partygeneralData.GradeID = 9;
        } else {
          vm.partygeneralData.GradeID = 10;
        }
      } else if (grade === 4) {
        vm.showdis = true;
        vm.partygeneralData.superior = vm.typeID;
        vm.partygeneralData.GradeID = 9;
        vm.partygeneralData.mold = 1;
      } else if (grade === 5) {
        vm.showdis = true;
        vm.partygeneralData.superior = vm.typeID;
        vm.partygeneralData.GradeID = 10;
        vm.partygeneralData.mold = 2;
      }
    }
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.partygeneralForm');
        return;
      }
      $uibModalInstance.close(vm.partygeneralData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
