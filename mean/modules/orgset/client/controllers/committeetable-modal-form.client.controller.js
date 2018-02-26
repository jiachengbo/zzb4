(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('CommitteeTableModalFormController', CommitteeTableModalFormController);

  CommitteeTableModalFormController.$inject = ['$scope', '$uibModalInstance', 'committeeTableData', 'method', 'columnDefs', 'baseCodeService'];
  function CommitteeTableModalFormController($scope, $uibModalInstance, committeeTableData, method, columnDefs, baseCodeService) {
    var vm = this;
    var i;
    var cvs_Type;
    vm.committeeTableData = committeeTableData;
    console.log(committeeTableData);
    if (committeeTableData.community !== '0') {
      vm.showa = true;
      cvs_Type = [
        {name: '社区委员'},
        {name: '社区兼职委员'}
      ];
    } else {
      vm.showa = false;
      cvs_Type = [
        {name: '街道委员'},
        {name: '街道兼职委员'}
      ];
    }
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.shis = (method === '查看');
    vm.columnDefs = columnDefs;
    vm.committeeTableData.Street = committeeTableData.Street;
    vm.committeeTableData.community = committeeTableData.community;
    // console.info('committeeTableData', committeeTableData);
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.committeeTableForm');
        return;
      }
      if (vm.picFile1) {
        vm.committeeTableData.CommitteePhotoPath = vm.picFile1;
      }
      console.log(vm.committeeTableData);
      $uibModalInstance.close(vm.committeeTableData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    // 委员类型

    $scope.cvs_Type = cvs_Type;

    if (method === '新增') {
      if (cvs_Type.length > 0) {
        vm.committeeTableData.CommitteeType = cvs_Type[0].name;
      }
    } else if (method === '修改' || method === '查看') {
      vm.committeeTableData.CommitteeType = committeeTableData.CommitteeType;
    }
    // 社区
    var cvs_communitysNew = [];
    var cvs_communitys = baseCodeService.getItems('community');
    for (i = 0; i < cvs_communitys.length; i++) {
      if (vm.committeeTableData.Street === cvs_communitys[i].streetID && cvs_communitys[i].communityId === committeeTableData.community) {
        cvs_communitysNew.push(cvs_communitys[i]);
      }
    }
    $scope.cvs_communitys = cvs_communitysNew;

    if (method === '新增') {
      if (cvs_communitysNew.length > 0) {
        vm.committeeTableData.community = committeeTableData.community;
      }
    } else if (method === '修改' || method === '查看') {
      vm.committeeTableData.community = committeeTableData.community;
    }
    // 网格
    vm.selectCommunityIdChange = function () {
      var problemGrid = [];
      var problemGridNew = [];
      $scope.cvs_grids = null;
      var communityId = vm.committeeTableData.community;
      //根据大类型 id 获取小类型列表
      problemGrid = baseCodeService.getItems('grid');
      for (i = 0; i < problemGrid.length; i++) {
        if (problemGrid[i].departmentId === communityId && problemGrid[i].streetID === vm.committeeTableData.Street) {
          problemGridNew.push(problemGrid[i]);
        }
      }
      $scope.cvs_grids = problemGridNew;

      if (method === '新增') {
        if (problemGridNew.length > 0) {
          vm.committeeTableData.GridID = problemGridNew[0].gridId;
        }
      } else if (method === '修改' || method === '查看') {
        vm.committeeTableData.GridID = committeeTableData.GridID;
      }
    };

    vm.selectCommunityIdChange();
  }
}());
