(function () {
  'use strict';

  angular
    .module('workposition')
    .controller('WorkPositionEditController', WorkPositionEditController);

  WorkPositionEditController.$inject = ['$scope', 'Notification', '$log', '$window', '$state', '$stateParams',
    'treeService'];
  function WorkPositionEditController($scope, Notification, $log, $window, $state, $stateParams,
                                      treeService) {
    var vm = this;
    //当前行数据
    vm.position_row = $stateParams.position_row;
    //权限表所有数据
    vm.role_rows = $stateParams.role_rows;
    //进行的操作
    vm.position_rowop = $stateParams.position_rowop;
    //不能修改
    vm.disabled = vm.position_rowop.disabled;

    //设置cvm，用于回传本控制
    vm.position_rowop.cvm = vm;

    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false,
      multiSelection: true
    };

    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;

    //列表显示的内容
    vm.treeTitle = function(node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //显示选择行
    vm.showSelected = function(sel) {
      if (sel) {
        //展开父
        if (vm.expanded.indexOf(sel.parent) === -1) {
          if (sel.parent) {
            vm.expanded.push(sel.parent);
          } else {
            vm.expanded.push(sel);
          }
        }
        vm.selected = sel;
      }
    };

    vm.changed = function(node) {
      var role = {id: node.value.id};
      //删除当前数据保存的指定role.id的记录
      for (var index = 0; index < vm.position_row.Roles.length; index++) {
        if (vm.position_row.Roles[index].id === role.id) {
          vm.position_row.Roles.splice(index, 1);
          break;
        }
      }

      if (node.value.selected) {
        vm.position_row.Roles.push(role);
      }
    };

    var roles = vm.role_rows.map(function (ele) {
      ele.selected = vm.position_row.Roles.some(function(role) {
        return ele.id === role.id;
      });
      return ele;
    });
    vm.serviceTree = treeService.getTreeData(roles, 'id', 'parentId', 'children');
    vm.treeData = vm.serviceTree.getNodes();
    vm.showSelected(vm.treeData[0]);
  }
}());
