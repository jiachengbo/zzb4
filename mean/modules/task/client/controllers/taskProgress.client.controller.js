(function () {
  'use strict';

  angular
    .module('task')
    .controller('TaskProgressController', TaskProgressController);

  TaskProgressController.$inject = ['$scope', '$log', '$window', '$uibModal', 'baseCodeService', '$state', '$stateParams', 'PayoutBMService'];
  function TaskProgressController($scope, $log, $window, $uibModal, baseCodeService, $state, $stateParams, PayoutBMService) {
    var vm = this;
    if ($stateParams.id === 0) {
      vm.AssignedId = $window.localStorage.getItem('taskProgressAssignedId');
    } else {
      vm.AssignedId = $stateParams.id;
      $window.localStorage.setItem('taskProgressAssignedId', vm.AssignedId);
    }
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization'); // 部门党委、街道党工委
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch'); // 党支部
    vm.dj_PartyCommitteeType = baseCodeService.getItems('dj_PartyCommitteeType'); // 党委党工委
    PayoutBMService.query({AssignedId: vm.AssignedId}).$promise.then(function (data) {
      for (var j = 0; j < data.length; j ++) {
        data[j].order = (j + 1);
        if (data[j].TaskProgress === 1) {
          data[j].TaskProgress = '未领取';
        } else if (data[j].TaskProgress === 2) {
          data[j].TaskProgress = '推进中';
        } else if (data[j].TaskProgress === 3) {
          data[j].TaskProgress = '已完成';
        }
      }
      vm.gridOptions.data = vm.tableData = data;
    });
    vm.paginationCurrentPage = $stateParams.pagenum;
    vm.gridOptions = {
      //表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'order', displayName: '序号'},
        {field: 'SendObjectName', displayName: '派遣单位'},
        {field: 'TaskProgress', displayName: '任务进度'}
        // {field: 'FinishedTime', displayName: '完成时间', cellFilter: 'date: "yyyy-MM-dd"'},
        // {field: 'isOnTime', displayName: '是否按时'}
      ],
      enableFiltering: false,
      paginationCurrentPage: vm.paginationCurrentPage,
      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        vm.offset = 0;
        vm.limit = vm.gridOptions.paginationPageSize;
        // vm.getTableData = function () {
        //   TaskService.query({offset: vm.offset, limit: vm.limit}).$promise.then(function (data) {
        //     vm.gridOptions.data = vm.tableData = data;
        //   });
        // };
        // vm.getTableData();
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
          console.log(vm.selectedRow);
          vm.openDetailsInstance();
        });
        gridApi.pagination.on.paginationChanged($scope, function (pagecount, countperpage) {
          // 第几页 pagecount
          // 每页有几个 countperpage
          // vm.limit = countperpage;
          // vm.offset = (pagecount - 1) * countperpage;
          // vm.getTableData();
        });
      },
      //如果不需要在表格左上角菜单显示功能，以下参数可以去掉
      //允许表格左上角菜单
      enableGridMenu: false
    };
    vm.openDetails = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/taskProgressDetails.client.view.html',
        controller: 'TaskProgressDetailsController',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        resolve: resarg
      });
    };
    vm.openDetailsInstance = function () {
      $window.localStorage.setItem('taskpagenum', vm.gridOptions.paginationCurrentPage);
      vm.assigned_jb_bm_id = vm.selectedRow.Id;
      $state.go('task.progresslist', {id: vm.assigned_jb_bm_id, person: 'leader'});
    };
    vm.goback = function () {
      // var detailsInstance = vm.openDetails();
      $state.go('task.curd');
    };
  }
}());
