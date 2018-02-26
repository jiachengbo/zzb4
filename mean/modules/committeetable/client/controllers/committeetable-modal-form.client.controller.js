(function () {
  'use strict';

  angular
    .module('committeeTable')
    .controller('CommitteeTableModalFormController', CommitteeTableModalFormController);

  CommitteeTableModalFormController.$inject = ['$scope', '$uibModalInstance', 'committeeTableData', 'method', 'columnDefs', 'baseCodeService'];
  function CommitteeTableModalFormController($scope, $uibModalInstance, committeeTableData, method, columnDefs, baseCodeService) {
    var vm = this;
    var i;
    vm.committeeTableData = committeeTableData;
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.columnDefs = columnDefs;
    vm.committeeTableData.Street = committeeTableData.Street;

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.committeeTableForm');
        return;
      }
      if (vm.picFile1) {
        vm.committeeTableData.CommitteePhotoPath = vm.picFile1;
      }
      $uibModalInstance.close(vm.committeeTableData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    var cv_Type = [{name: '街道委员'}, {name: '社区委员'}, {name: '街道兼职委员'}, {name: '社区兼职委员'}];
    $scope.cv_Type = cv_Type;

    if (method === '新增') {
      if (cv_Type.length > 0) {
        vm.committeeTableData.cv_Type = cv_Type[0].name;
      }
    } else if (method === '修改' || method === '查看') {
      vm.committeeTableData.cv_Type = committeeTableData.cv_Type;
    }
    var cvs_communitysNew = [];
    var cvs_communitys = baseCodeService.getItems('community');
    for (i = 0; i < cvs_communitys.length; i++) {
      if (vm.committeeTableData.Street === cvs_communitys[i].streetID) {
        cvs_communitysNew.push(cvs_communitys[i]);
      }
    }
    $scope.cvs_communitys = cvs_communitysNew;
    if (method === '新增') {
      if (cvs_communitys.length > 0) {
        vm.committeeTableData.community = cvs_communitys[0].communityId;
      }
    } else if (method === '修改' || method === '查看') {
      var cid = committeeTableData.community;
      for (i = 0; i < cvs_communitys.length; i++) {
        if (cid === cvs_communitys[i].communityId + '') {
          vm.committeeTableData.community = cvs_communitys[i].communityId;
        }
      }
    }
    var cvs_grids = baseCodeService.getItems('grid');
    $scope.cvs_grids = cvs_grids;
    if (method === '新增') {
      if (cvs_grids.length > 0) {
        vm.committeeTableData.GridID = cvs_grids[0].gridId;
      }
    } else if (method === '修改' || method === '查看') {
      var cid2 = committeeTableData.GridID;
      for (i = 0; i < cvs_grids.length; i++) {
        if (cid2 === cvs_grids[i].gridId + '') {
          vm.committeeTableData.GridID = cvs_grids[i].gridId;
        }
      }
    }

    vm.type = ['街道委员', '社区委员', '街道兼职委员', '社区兼职委员'];

    vm.selectCommunityIdChange = function () {

      var problemGrid = [];
      var problemGridNew = [];
      $scope.cvs_grids = null;
      var communityId = vm.committeeTableData.community;
      // console.info(bigTypeId + '==bigTypeId==大类型下拉事件');
      //根据大类型 id 获取小类型列表
      problemGrid = baseCodeService.getItems('grid');


      for (i = 0; i < problemGrid.length; i++) {

        if (problemGrid[i].departmentId === communityId && problemGrid[i].streetID === vm.committeeTableData.Street) {
          console.log('--=======================================--');
          problemGridNew.push(problemGrid[i]);
        }
      }
      $scope.cvs_grids = problemGridNew;
    };
    vm.selectCommunityIdChange();
  }
}());
