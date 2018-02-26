(function () {
  'use strict';

  angular
    .module('muser')
    .controller('MUserGridController', MUserGridController);

  MUserGridController.$inject = ['$timeout', '$stateParams'];
  function MUserGridController($timeout, $stateParams) {
    var vm = this;
    //部门下所有岗位数据
    vm.muser_rows = $stateParams.muser_rows;

    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.muser_rows,
      columnDefs: [
        {field: 'id', displayName: '用户编号'},
        {field: 'username', displayName: '登录名'},
        {field: 'displayName', displayName: '显示名称'},
        {field: 'roles', displayName: '特殊权限'},
        {field: 'email', displayName: '邮箱'},
        {field: 'mobilePhone', displayName: '手机'},
        {field: 'homePhone', displayName: '固话'},
        {field: 'address', displayName: '地址'}
      ]
    };
  }
}());
