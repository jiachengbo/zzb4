(function () {
  'use strict';

  angular
    .module('task')
    .controller('TaskProgressListController', TaskProgressListController);

  TaskProgressListController.$inject = ['$scope', '$log', '$window', '$uibModal', 'baseCodeService', '$state', '$stateParams', 'GetTaskProgressService', 'Timer'];
  function TaskProgressListController($scope, $log, $window, $uibModal, baseCodeService, $state, $stateParams, GetTaskProgressService, Timer) {
    var vm = this;
    if ($stateParams.id === 0) {
      vm.assigned_jb_bm_id = $window.localStorage.getItem('assigned_jb_bm_id');
      vm.person = $stateParams.person;
    } else {
      vm.assigned_jb_bm_id = $stateParams.id;
      vm.person = $stateParams.person;
      $window.localStorage.setItem('assigned_jb_bm_id', vm.assigned_jb_bm_id);
    }
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization'); // 部门党委、街道党工委
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch'); // 党支部
    vm.dj_PartyCommitteeType = baseCodeService.getItems('dj_PartyCommitteeType'); // 党委党工委
    GetTaskProgressService.query({assigned_jb_bm_id: vm.assigned_jb_bm_id}).$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        value.order = k + 1;
        value.createDate = Timer.format(value.createDate, 'day');
      });
      vm.gridOptions.data = vm.tableData = data;
    });
    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'order', displayName: '序号'},
        {field: 'progressContent', displayName: '进度内容'},
        {field: 'createDate', displayName: '创建时间', cellFilter: 'date: "yyyy-MM-dd"'}
      ],
      enableFiltering: false,
      onRegisterApi: function (gridApi) {
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
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
      var detailsInstance = vm.openDetails({
        detailsdata: function () {
          return angular.copy(vm.selectedRow);
        }
      });
      detailsInstance.result.then(function (result) {
        vm.selectedRow = null;
      });
    };
    vm.goback = function () {
      // var detailsInstance = vm.openDetails();
      if (vm.person === 'own') {
        $state.go('task.curd');
      } else {
        vm.pageNum = Number($window.localStorage.getItem('taskpagenum'));
        $state.go('task.progress', {pagenum: vm.pageNum});
      }
    };
  }
}());
