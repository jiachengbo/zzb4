(function () {
  'use strict';

  angular
    .module('workposition')
    .controller('WorkPositionGridController', WorkPositionGridController);

  WorkPositionGridController.$inject = ['$scope', 'Notification', '$log', '$window', '$state',
    'uiGridConstants', '$stateParams'];
  function WorkPositionGridController($scope, Notification, $log, $window, $state,
                                       uiGridConstants, $stateParams) {
    var vm = this;
    //部门下所有岗位数据
    vm.position_rows = $stateParams.position_rows;

    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.position_rows,
      columnDefs: [
        {field: 'name', displayName: '岗位名'},
        {field: 'displayName', displayName: '显示名'},
        {field: 'descText', displayName: '描述'}
      ]
    };
  }
}());
