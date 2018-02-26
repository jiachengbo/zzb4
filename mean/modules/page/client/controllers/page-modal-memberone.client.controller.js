(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageModalMemberOneController', PageModalMemberOneController);

  PageModalMemberOneController.$inject = ['$scope', '$uibModalInstance', 'data', 'branchName', 'Timer', 'baseCodeService'];
  function PageModalMemberOneController($scope, $uibModalInstance, data, branchName, Timer, baseCodeService) {
    var vm = this;
    vm.pageData = data;
    if (vm.pageData.isFlow_party === 1) {
      vm.pageData.isFlow_party = '是';
    } else {
      vm.pageData.isFlow_party = '否';
    }
    if (vm.pageData.isConcat === 1) {
      vm.pageData.isConcat = '是';
    } else {
      vm.pageData.isConcat = '否';
    }
    vm.pageData.PartyBirth = Timer.format(vm.pageData.PartyBirth, 'day');
    vm.pageData.JoinTime = Timer.format(vm.pageData.JoinTime, 'day');
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.community = baseCodeService.getItems('community');
    vm.grid = baseCodeService.getItems('grid');
    angular.forEach(vm.dj_PartyOrganization, function (value, k) {
      if (value.typeID === vm.pageData.workbranch) {
        vm.pageData.workbranch = value.typeName;
      }
    });
    vm.branchName = branchName;
    // console.log(vm.pageData.branch);
    // angular.forEach(vm.dj_PartyBranch, function (value, k) {
    //   if (value.OrganizationId === vm.pageData.branch) {
    //     vm.branchName = value.OrganizationName;
    //   }
    // });

    angular.forEach(vm.street_info, function (value, k) {
      if (value.streetID === vm.pageData.streetID) {
        vm.pageData.streetIDname = value.streetName;
      }
    });
    angular.forEach(vm.community, function (value, k) {
      if (value.communityId + '' === vm.pageData.communityId + '' && value.streetID + '' === vm.pageData.streetID + '') {
        vm.pageData.communityIdname = value.communityName;
      }
    });
    angular.forEach(vm.grid, function (value, k) {
      if (value.gridId + '' === vm.pageData.BelongGrid + '' && value.streetID + '' === vm.pageData.streetID + '') {
        vm.pageData.BelongGridname = value.gridName;
        vm.pageData.gridNum = value.gridNum;
      }
    });
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
