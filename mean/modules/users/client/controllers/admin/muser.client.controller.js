(function () {
  'use strict';

  angular
    .module('muser')
    .controller('MUserController', MUserController);

  MUserController.$inject = ['$scope', '$log', '$window', 'Notification', '$state', '$timeout', 'treeService',
    'AdminService', 'departmentResolve', 'workpositionResolve', 'muserResolve', 'appService', 'baseCodeService', '$rootScope'];
  function MUserController($scope, $log, $window, Notification, $state, $timeout, treeService,
                           AdminService, departmentResolve, workpositionResolve, muserResolve, appService, baseCodeService, $rootScope) {
    var vm = this;
    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false,
      //是否是文件,显示不同图标
      isLeaf: function (node) {
        return vm.isMuserNode(node);
      }
    };
    vm.dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    //初始变量必须定义为空对象，当查询数据库，取出数组值时再进行替换
    //如果初始变量定义为空数组，当查询数据库，没有列表时，数值也是空数组，
    //    treecontrol后台监视判断两者相等，就不会记录新的_showEdit空数组 vm.treeData !== treecontrol.socpe.node.children
    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;
    vm.currDepartmentNode = null;
    vm.currMUser = null;
    vm.currMUserOp = {};

    vm.isMuserNode = function (node) {
      return node.value instanceof AdminService;
    };

    //列表显示的内容
    vm.treeTitle = function(node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //拖动处理
    vm.canDrag = function (node) {
      return vm.isMuserNode(node) && vm.disabled;
    };
    vm.canDrop = function (node) {
      return !vm.isMuserNode(node);
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
      $rootScope._openModal();
      //更新用户对应部门编码
      snode.value.department_id = dnode.value.id;
      snode.value.$update()
        .then(function(res) {
          $rootScope.cancel();
          //移动的node设置为当前
          vm.showSelected(vm.serviceTree.moveNode(snode, dnode));
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 部门保存成功!' });
        })
        .catch(function(err) {
          $rootScope.cancel();
          $log.error('workposition update save error:', err.data.message);
          Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 部门保存失败!' });
        });
    };

    //编辑界面操作调用
    vm._showEdit = function (num) {
      vm.currMUserOp = {disabled: vm.disabled, cvm: null};
      $state.go('admin.muser.edit', {
        isupdate: num || 0,
        muser_row: vm.currMUser,
        muser_rowop: vm.currMUserOp,
        workposition_rows: workpositionResolve,
        department_rows: departmentResolve,
        value: vm.valuedata
      });
    };

    //显示选择行
    vm.showSelected = function(sel) {
      vm.disabled = true;
      vm.valuedata = sel;
      if (vm.currMUserOp && vm.currMUserOp.cvm && vm.currMUserOp.cvm.muserForm) {
        //清除form错误提示
        $scope.$broadcast('show-errors-reset', vm.currMUserOp.cvm.muserForm.$name);
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

        //如果选择了用户,跳转到列表，否则跳转到内容
        if (!vm.isMuserNode(sel)) {
          vm.currDepartmentNode = sel;
          vm.currMUser = null;

          var muser_rows = [];
          sel.children.forEach(function (row) {
            if (vm.isMuserNode(row)) {
              muser_rows.push(row.value);
            }
          });
          $timeout(function () {
            $state.go('admin.muser.grid', {muser_rows: muser_rows});
          });
        } else {
          vm.currDepartmentNode = sel.parent;
          vm.currMUser = angular.copy(sel.value);

          //默认查看
          vm._showEdit();
        }

      } else {
        vm.selected = vm.currDepartmentNode = vm.currMUser = null;
      }
    };
    //开始修改
    vm.update = function() {
      vm.disabled = false;
      vm._showEdit(1);
    };

    //取消修改
    vm.cancel = function() {
      vm.showSelected(vm.selected);
    };

    //增加
    vm.add = function() {
      var newvalue = new AdminService();
      //设置岗位空
      newvalue.wps = [];
      //如果存在当前选择的部门，设置工作用户的部门
      if (vm.currDepartmentNode) {
        newvalue.department_id = vm.currDepartmentNode.value.id;
      } else {
        $window.alert('请先在部门管理中，增加部门，然后在增加用户！！！');
        return;
      }

      vm.currMUser = newvalue;
      vm.disabled = false;
      vm._showEdit(0);
    };

    // 删除
    vm.remove = function() {
      if ($window.confirm('确定要删除用户(' + vm.currMUser.displayName + ')吗?')) {
        $rootScope._openModal();
        vm.currMUser.$remove()
          .then(function() {
            $rootScope.cancel();
            vm.showSelected(vm.serviceTree.removeNode(vm.selected));
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 用户已删除!' });
          })
          .catch(function(err) {
            $rootScope.cancel();
            $log.error('muser remove error:', err.data.message);
          });
      }
    };

    //保存
    vm.save = function() {
      if (!vm.currMUser) {
        $log.error('no currValue');
        return;
      }
      if (!vm.currMUserOp.cvm || !vm.currMUserOp.cvm.muserForm) {
        $log.error('edit children vm not set');
        return;
      }

      if (!vm.currMUserOp.cvm.muserForm.$valid || vm.currMUserOp.cvm.yanzhen) {
        $log.error('muserForm input not valid');
        $scope.$broadcast('show-errors-check-validity', vm.currMUserOp.cvm.muserForm.$name);
        return;
      }

      if (vm.currMUser.id) {
        $rootScope._openModal();
        vm.currMUser.$update()
          .then(function(res) {
            //更新变量值
            $rootScope.cancel();
            vm.selected.value = res;
            vm.showSelected(vm.selected);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i>用户修改成功!'});
          })
          .catch(function(err) {
            $rootScope.cancel();
            $log.error('muser update save error:', err.data.message);
            Notification.error({
              message: err.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> 用户修改失败!'
            });
          });
      } else {
        $rootScope._openModal();
        vm.currMUser.$save()
          .then(function(res) {
            $rootScope.cancel();
            vm.showSelected(vm.serviceTree.addValue2Node(res, vm.currDepartmentNode));
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 用户添加成功!'});
          })
          .catch(function(err) {
            $rootScope.cancel();
            $log.error('muser add save error:', err.data.message);
            Notification.error({
              message: err.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> 用户添加失败!'
            });
          });
      }
    };

    //生成树形数据结构
    var arrname;
    vm.serviceTree = treeService.getTreeData(departmentResolve, 'id', 'parentId', 'children',
      muserResolve, 'department_id');
    if (appService.user.user_grade === 1) {
      vm.treeData = vm.serviceTree.getNodes();
    } else if (appService.user.user_grade === 3) {
      arrname = angular.copy(vm.serviceTree.nodes[0].children[0]);
      vm.serviceTree.nodes[0].children = [];
      vm.serviceTree.nodes[0].children.push(arrname);
      vm.treeData = vm.serviceTree.nodes[0];
    } else if (appService.user.user_grade === 2) {
      arrname = angular.copy(vm.serviceTree.nodes[0].children[1]);
      vm.serviceTree.nodes[0].children = [];
      vm.serviceTree.nodes[0].children.push(arrname);
      vm.treeData = vm.serviceTree.nodes[0];
    } else if (appService.user.user_grade === 4) {
      angular.forEach(vm.serviceTree.nodes[0].children[1].children, function (v, k) {
        if (v.value.descText) {
          if (v.value.descText.match(appService.user.firstName)) {
            arrname = angular.copy(vm.serviceTree.nodes[0].children[1].children[k]);
            vm.serviceTree.nodes[0].children[1].children = [];
            vm.serviceTree.nodes[0].children[1].children.push(arrname);
            vm.treeData = vm.serviceTree.nodes[0].children[1];
          }
        }
      });
    } else if (appService.user.user_grade === 5) {
      angular.forEach(vm.serviceTree.nodes[0].children[0].children, function (v, k) {
        if (v.value.descText) {
          if (v.value.descText.match(appService.user.firstName)) {
            arrname = angular.copy(vm.serviceTree.nodes[0].children[0].children[k]);
            vm.serviceTree.nodes[0].children[0].children = [];
            vm.serviceTree.nodes[0].children[0].children.push(arrname);
            vm.treeData = vm.serviceTree.nodes[0].children[0];
          }
        }
      });
    } else if (appService.user.user_grade === 7 || appService.user.user_grade === 6 || appService.user.user_grade === 9 || appService.user.user_grade === 10) {
      console.log('进入等级7');
      angular.forEach(vm.dj_PartyBranch, function (v, k) {
        if (appService.user.branch === v.OrganizationId) {
          vm.superss = v.super;
          vm.gemerbramch = v.generalbranch;
          vm.zhibuname = v.simpleName;
        }
      });
      angular.forEach(vm.dj_PartyGeneralBranch, function (v, k) {
        if (vm.gemerbramch === v.branchID) {
          vm.garename = v.simpleName;
        }
      });
      angular.forEach(vm.dj_PartyOrganization, function (v, k) {
        if (vm.superss === v.typeID) {
          vm.sname = v.simpleName;
        }
      });
      var chrl;
      var names;
      if (appService.user.user_grade === 6 || appService.user.user_grade === 9) {
        chrl = vm.serviceTree.nodes[0].children[1].children;
      } else {
        chrl = vm.serviceTree.nodes[0].children[0].children;
      }
      if (appService.user.user_grade > 7) {
        names = vm.garename;
      } else {
        if (vm.gemerbramch) {
          names = '党总支';
        } else {
          names = '党支部';
        }
      }
      var arr = [];
      angular.forEach(chrl, function (v, k) {
        if (v.value.descText) {
          if (v.value.descText.match(vm.sname)) {
            angular.forEach(v, function (v1, k1) {
              angular.forEach(v1, function (v2, k2) {
                if (v2.value) {
                  if (v2.value.hasOwnProperty('descText')) {
                    if (v2.value.descText.match(names)) {
                      if (appService.user.user_grade > 7) {
                        v1 = [];
                        v1.push(v2);
                        vm.treeData = v1;
                      } else {
                        angular.forEach(v2.children, function (v3, k3) {
                          // if (vm.gemerbramch) {
                          //   console.log(v3);
                          //   if (v3.value.branch === appService.user.branch && v3.value.user_grade === appService.user.user_grade) {
                          //     arr.push(v3);
                          //     vm.treeData = arr;
                          //   }
                          // } else {
                          if (v3.value.hasOwnProperty('descText')) {
                            if (vm.zhibuname.match(v3.value.descText.slice(0, -3))) {
                              v2.children = [];
                              v2.children.push(v3);
                              vm.treeData = v2.children;
                            }
                            // }
                          }
                        });
                      }
                    }
                  }
                }
              });
            });
          }
        }
      });
    }
    // vm.treeData = vm.serviceTree.nodes[0].children[0].children[0];

    // console.log(vm.serviceTree.nodes[0].children[0].children);
    // console.log(vm.treeData);
    //选择第一条
    vm.showSelected(vm.treeData[0]);
  }
}());
