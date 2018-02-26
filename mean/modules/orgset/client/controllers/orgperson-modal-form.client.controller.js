(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('OrgpersonModalFormController', OrgpersonModalFormController);

  OrgpersonModalFormController.$inject = ['$scope', '$uibModalInstance', 'orgpersonData', 'method', 'baseCodeService'];
  function OrgpersonModalFormController($scope, $uibModalInstance, orgpersonData, method, baseCodeService) {
    var vm = this;
    vm.orgpersonData = orgpersonData;
    console.log(orgpersonData.orgId);
    if (orgpersonData.orgId === 2) {
      vm.orgname = [
        {name: '召集人', value: '组长'},
        {name: '副召集人', value: '副组长'},
        {name: '成员', value: '成员'}
      ];
    } else if (orgpersonData.orgId === 1) {
      vm.orgname = [
        {name: '组长', value: '组长'},
        {name: '副组长', value: '副组长'},
        {name: '成员', value: '成员'}
      ];
    } else if (orgpersonData.orgId === 3) {
      vm.orgname = [
        {name: '负责人', value: '组长'},
        {name: '成员', value: '成员'}
      ];
    }
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.showa = (method === '查看');
    var cvs_org = baseCodeService.getItems('OrgTable');
    $scope.cvs_org = cvs_org;

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.orgpersonForm');
        return;
      }
      if (vm.personPhoto) {
        vm.orgpersonData.personPhoto = vm.personPhoto;
      }
      $uibModalInstance.close(vm.orgpersonData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }
}());
