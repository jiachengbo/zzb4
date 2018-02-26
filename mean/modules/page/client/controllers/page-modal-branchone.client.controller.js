(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageModalBranchOneController', PageModalBranchOneController);

  PageModalBranchOneController.$inject = ['$scope', '$uibModalInstance', 'data', 'Timer', 'baseCodeService'];
  function PageModalBranchOneController($scope, $uibModalInstance, data, Timer, baseCodeService) {
    var vm = this;
    vm.PartyorganizationData = data;

    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.community = baseCodeService.getItems('community');
    vm.grid = baseCodeService.getItems('grid');
    angular.forEach(vm.dj_PartyOrganization, function (value, k) {
      if (vm.PartyorganizationData.super === value.typeID) {
        vm.PartyorganizationData.superName = value.typeName;
      }
    });
    angular.forEach(vm.street_info, function (value, k) {
      if (value.streetID === vm.PartyorganizationData.streetID) {
        vm.PartyorganizationData.streetIDname = value.streetName;
      }
    });
    angular.forEach(vm.community, function (value, k) {
      if (value.communityId + '' === vm.PartyorganizationData.communityId + '' && value.streetID + '' === vm.PartyorganizationData.streetID + '') {
        vm.PartyorganizationData.communityIdname = value.communityName;
      }
    });
    angular.forEach(vm.grid, function (value, k) {
      if (value.gridId + '' === vm.PartyorganizationData.BelongGrid + '' && value.streetID + '' === vm.PartyorganizationData.streetID + '') {
        vm.PartyorganizationData.BelongGridname = value.gridName;
        vm.PartyorganizationData.gridNum = value.gridNum;
      }
    });
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
