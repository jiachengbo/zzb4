(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('RoleController', RoleController);

  RoleController.$inject = ['$scope', '$log', '$window', 'Notification', 'RoleService', 'treeService'];
  function RoleController($scope, $log, $window, Notification, RoleService, treeService) {
    var vm = this;
    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false
    };

    vm.serviceTree = null;
    vm.disabled = true;

    //初始变量必须定义为空对象，当查询数据库，取出数组值时再进行替换
    //如果初始变量定义为空数组，当查询数据库，没有列表时，数值也是空数组，
    //    treecontrol后台监视判断两者相等，就不会记录新的空数组 vm.treeData !== treecontrol.socpe.node.children
    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;
    vm.currValue = null;

    //取所有数据
    RoleService.query().$promise
    .then(function (data) {
      vm.serviceTree = treeService.getTreeData(data, 'id', 'parentId', 'children');

      vm.treeData = vm.serviceTree.getNodes();
      //选择第一条
      vm.showSelected(vm.treeData[0]);
    })
    .catch(function (error) {
      $log.error('RoleService query() ret error:', error);
    });

    //拖动处理
    vm.canDrag = function (node) {
      return node !== vm.treeData[0];
    };
    vm.canDrop = function (node) {
      return true;
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

      //更新数据
      snode.value.parentId = dnode.value.id;
      snode.value.$update()
      .then(function(res) {
        //移动的node设置为当前
        vm.showSelected(vm.serviceTree.moveNode(snode, dnode));
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> role draggdrop saved successfully!' });
      })
      .catch(function(err) {
        $log.error('role update save error:', err.data.message);
        Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> role draggdrop save error!' });
      });
    };

    //列表显示的内容
    vm.treeTitle = function(node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //显示选择行
    vm.showSelected = function(sel) {
      vm.disabled = true;
      //清除错误提示
      $scope.$broadcast('show-errors-reset', 'vm.roleForm');
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
        vm.currValue = angular.copy(sel.value);
      } else {
        vm.selected = vm.currValue = null;
      }
    };

    //开始修改
    vm.update = function() {
      vm.disabled = false;
    };

    //取消修改
    vm.cancel = function() {
      vm.showSelected(vm.selected);
    };

    //增加
    vm.add = function() {
      var newvalue = new RoleService();
      //如果存在当前选择的记录，增加记录的父id是选择行的id
      if (vm.currValue) {
        newvalue.parentId = vm.currValue.id;
      }

      vm.currValue = newvalue;
      vm.disabled = false;
    };

    // 删除
    vm.remove = function() {
      if ($window.confirm('确认要删除当前选择的权限吗?')) {
        vm.currValue.$remove(function() {
          vm.showSelected(vm.serviceTree.removeNode(vm.selected));
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 权限已删除!' });
        })
        .catch(function(err) {
          $log.error('role remove error:', err.data.message);
        });
      }
    };

    //保存
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.roleForm');
        return;
      }

      if (!vm.currValue) {
        $log.error('no currValue');
        return;
      }

      if (vm.currValue.id) {
        vm.currValue.$update()
          .then(function(res) {
            vm.selected.value = res;
            vm.showSelected(vm.selected);
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> role update saved successfully!' });
          })
          .catch(function(err) {
            $log.error('role update save error:', err.data.message);
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> role update save error!' });
          });
      } else {
        vm.currValue.$save()
          .then(function(res) {
            vm.showSelected(vm.serviceTree.addValue2Node(res, vm.selected));
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> role add saved successfully!' });
          })
          .catch(function(err) {
            $log.error('role add save error:', err.data.message);
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> role add save error!' });
          });
      }
    };
  }
}());
