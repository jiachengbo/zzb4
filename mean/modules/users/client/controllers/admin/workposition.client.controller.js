(function () {
  'use strict';

  angular
    .module('workposition')
    .controller('WorkPositionController', WorkPositionController);

  WorkPositionController.$inject = ['$scope', '$log', '$window', 'Notification', '$state', '$timeout', 'treeService',
    'WorkPositionService', 'departmentResolve', 'workpositionResolve', 'roleResolve'];
  function WorkPositionController($scope, $log, $window, Notification, $state, $timeout, treeService,
                                  WorkPositionService, departmentResolve, workpositionResolve, roleResolve) {
    var vm = this;
    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false,
      //是否是文件,显示不同图标
      isLeaf: function (node) {
        return vm.isWorkPositionNode(node);
      }
    };

    //初始变量必须定义为空对象，当查询数据库，取出数组值时再进行替换
    //如果初始变量定义为空数组，当查询数据库，没有列表时，数值也是空数组，
    //    treecontrol后台监视判断两者相等，就不会记录新的空数组 vm.treeData !== treecontrol.socpe.node.children
    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;
    vm.currDepartmentNode = null;
    vm.currWorkPosition = null;
    vm.currWorkPositionOp = {};

    vm.isWorkPositionNode = function (node) {
      return node.value instanceof WorkPositionService;
    };

    //列表显示的内容
    vm.treeTitle = function(node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //拖动处理
    vm.canDrag = function (node) {
      return vm.isWorkPositionNode(node) && vm.disabled;
    };
    vm.canDrop = function (node) {
      return !vm.isWorkPositionNode(node);
    };
    //参数：$data=>移动的node数据
    //参数：node=>移动的目标
    vm.dropComplete = function(snode, dnode) {
      if (!snode || !dnode) {
        $log.error('drop complete move node error:', snode, dnode);
        return;
      }

      //没有改变父
      if (snode.parent === dnode) {
        return;
      }

      //更新岗位对应部门编码
      snode.value.department_id = dnode.value.id;
      snode.value.$update()
        .then(function(res) {
          //移动的node设置为当前
          vm.showSelected(vm.serviceTree.moveNode(snode, dnode));
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> workposition draggdrop saved successfully!' });
        })
        .catch(function(err) {
          $log.error('workposition update save error:', err.data.message);
          Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> workposition draggdrop save error!' });
        });
    };

    //编辑界面操作调用
    vm._showEdit = function () {
      vm.currWorkPositionOp = {disabled: vm.disabled, cvm: null};
      $state.go('admin.workposition.edit', {
        position_row: vm.currWorkPosition,
        position_rowop: vm.currWorkPositionOp,
        role_rows: roleResolve});
    };

    //显示选择行
    vm.showSelected = function(sel) {
      vm.disabled = true;
      if (vm.currWorkPositionOp && vm.currWorkPositionOp.cvm && vm.currWorkPositionOp.cvm.workpositionForm) {
        //清除form错误提示
        $scope.$broadcast('show-errors-reset', vm.currWorkPositionOp.cvm.workpositionForm.$name);
      }

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

        //如果选择了岗位,跳转到列表，否则跳转到内容
        if (!vm.isWorkPositionNode(sel)) {
          vm.currDepartmentNode = sel;
          vm.currWorkPosition = null;

          var position_rows = [];
          sel.children.forEach(function (row) {
            if (vm.isWorkPositionNode(row)) {
              position_rows.push(row.value);
            }
          });
          $timeout(function () {
            $state.go('admin.workposition.grid', {position_rows: position_rows});
          });
        } else {
          vm.currDepartmentNode = sel.parent;
          vm.currWorkPosition = angular.copy(sel.value);
          //默认查看
          vm._showEdit();
        }

      } else {
        vm.selected = vm.currDepartmentNode = vm.currWorkPosition = null;
      }
    };

    //开始修改
    vm.update = function() {
      vm.disabled = false;
      vm._showEdit();
    };

    //取消修改
    vm.cancel = function() {
      vm.showSelected(vm.selected);
    };

    //增加
    vm.add = function() {
      var newvalue = new WorkPositionService();
      newvalue.Roles = [];
      //如果存在当前选择的部门，设置工作岗位的部门
      if (vm.currDepartmentNode) {
        newvalue.department_id = vm.currDepartmentNode.value.id;
      } else {
        $window.alert('请先在部门管理中，增加部门，然后在增加岗位！！！');
        return;
      }

      vm.currWorkPosition = newvalue;
      vm.update();
    };

    // 删除
    vm.remove = function() {
      if ($window.confirm('确认要删除当前选择的工作岗位吗?')) {
        vm.currWorkPosition.$remove()
          .then(function() {
            vm.showSelected(vm.serviceTree.removeNode(vm.selected));
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 工作岗位已删除!' });
          })
          .catch(function(err) {
            $log.error('workposition remove error:', err.data.message);
          });
      }
    };

    //保存
    vm.save = function() {
      if (!vm.currWorkPosition) {
        $log.error('no currValue');
        return;
      }
      if (!vm.currWorkPositionOp.cvm || !vm.currWorkPositionOp.cvm.workpositionForm) {
        $log.error('edit children vm not set');
        return;
      }

      if (!vm.currWorkPositionOp.cvm.workpositionForm.$valid) {
        $log.error('workpositionForm not valid');
        $scope.$broadcast('show-errors-check-validity', vm.currWorkPositionOp.cvm.workpositionForm.$name);
        return;
      }

      if (vm.currWorkPosition.id) {
        vm.currWorkPosition.$update()
          .then(function(res) {
            vm.selected.value = res;
            vm.showSelected(vm.selected);
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> workposition update saved successfully!' });
          })
          .catch(function(err) {
            $log.error('workposition update save error:', err.data.message);
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> workposition update save error!' });
          });
      } else {
        vm.currWorkPosition.$save()
          .then(function(res) {
            vm.showSelected(vm.serviceTree.addValue2Node(res, vm.currDepartmentNode));
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> workposition add saved successfully!' });
          })
          .catch(function(err) {
            $log.error('workposition add save error:', err.data.message);
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> workposition add save error!' });
          });
      }
    };

    //生成树形数据结构
    vm.serviceTree = treeService.getTreeData(departmentResolve, 'id', 'parentId', 'children',
      workpositionResolve, 'department_id');
    vm.treeData = vm.serviceTree.getNodes();
    //选择第一条
    vm.showSelected(vm.treeData[0]);
  }
}());
