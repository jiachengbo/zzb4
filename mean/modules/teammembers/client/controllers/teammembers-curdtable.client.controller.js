(function () {
  'use strict';

  angular
    .module('teammembers')
    .controller('TeammembersCURDTableController', TeammembersCURDTableController);

  TeammembersCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'TeammembersService',
    '$uibModal', 'Upload', 'appService'];
  function TeammembersCURDTableController($scope, Notification, $log, $window,
                                          baseCodeService, TeammembersService, $uibModal, Upload, appService) {
    var vm = this;
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    // 判断当前用户的层级id和对象id
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    if (appService.user) {
      vm.grade = appService.user.user_grade;
      vm.branch = appService.user.branch;
      if (vm.grade === 1) {
        //  区委账号
        vm.objId = 0;
      } else if (vm.grade === 2) {
        //  党委账号
        vm.objId = 1;
      } else if (vm.grade === 3) {
        //  党工委账号
        vm.objId = 2;
      } else if (vm.grade === 4) {
        //  部门党委账号
        vm.xxDW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var a = 0; a < vm.dj_PartyOrganization.length; a++) {
          if (vm.dj_PartyOrganization[a].roleID === vm.roleID) {
            vm.objId = vm.dj_PartyOrganization[a].typeID;
          }
        }
      } else if (vm.grade === 5) {
        //  街道党工委账号
        vm.xxDGW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var o = 0; o < vm.dj_PartyOrganization.length; o++) {
          if (vm.dj_PartyOrganization[o].roleID === vm.roleID) {
            vm.objId = vm.dj_PartyOrganization[o].typeID;
          }
        }
      } else if (vm.grade === 6 || vm.grade === 7) {
        //  街道党工委账号
        vm.objId = vm.branch;
      } else if (vm.grade === 9) {
        vm.xxDWDZZ = true;
        vm.branch1 = appService.user.branch;
        vm.xxDWDZZSon = [];
        for (var b = 0; b < vm.dj_PartyBranch.length; b ++) {
          if (vm.branch1 === vm.dj_PartyBranch[b].OrganizationId) {
            vm.objId = vm.dj_PartyBranch[b].generalbranch;
          }
        }
      } else if (vm.grade === 10) {
        vm.xxDGWDZZ = true;
        vm.branch = appService.user.branch;
        vm.xxDGWDZZSon = [];
        for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
          if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
            vm.objId = vm.dj_PartyBranch[x].generalbranch;
          }
        }
      }
    }
    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/teammembers/client/views/teammembers-modal-form.client.view.html',
        controller: 'TeammembersModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //teammembers会传入modal的controller
        teammembersData: function () {
          //空数据
          return new TeammembersService();
        },
        //表明是增加
        method: function () {
          return 'add';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        // result.$save()
        //   .then(function(res) {
        //     vm.gridOptions.data.push(res);
        //     Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> teammembers add saved successfully!' });
        //   })
        //   .catch(function(err) {
        //     $log.error('teammembers add save error:', err.data.message);
        //     Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
        //       ' teammembers add save error!' });
        //   });
        Upload.upload({
          url: '/api/teammembers',
          data: result
        }).then(function (res) {
          // var AssignedId = res.data.AssignedId;
          TeammembersService.query({gradeId: vm.grade, objId: vm.objId}).$promise.then(function (data) {
            vm.gridOptions.data = vm.tableData = data;
          });
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
        })
          .catch(function (err) {
            // $log.error('save error:', err);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 保存失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('你确定你想要删除选定的记录?')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            $log.error('teammembers deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vm._updateorview = function (isupdate) {
      var modalInstance = vm._openModal({
        teammembersData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? 'update' : 'view';
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          // result.$update()
          //   .then(function(res) {
          //     //修改表格显示的数据
          //     angular.extend(vm.selectedRow, res);
          //     Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> teammembers update saved successfully!' });
          //   })
          //   .catch(function(err) {
          //     $log.error('teammembers update save error:', err.data.message);
          //     Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
          //     'teammembers update save error!' });
          //   });
          Upload.upload({
            url: '/api/teammembers/' + result.id,
            data: result
          }).then(function (res) {
            // var AssignedId = res.data.AssignedId;
            TeammembersService.query({gradeId: vm.grade, objId: vm.objId}).$promise.then(function (data) {
              vm.gridOptions.data = vm.tableData = data;
            });
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
          })
            .catch(function (err) {
              // $log.error('save error:', err);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
                ' 修改失败!'
              });
            });
        }
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };

    //修改
    vm.update = function () {
      return vm._updateorview(true);
    };
    //查看
    vm.view = function () {
      return vm._updateorview(false);
    };

    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'name', displayName: '姓名'},
        {field: 'sex', displayName: '性别'},
        {field: 'duty', displayName: '职务'}
      ],

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
        });
      },

      //如果不需要在表格左上角菜单显示功能，以下参数可以去掉
      //允许表格左上角菜单
      enableGridMenu: true,
      //添加自定义菜单
      gridMenuCustomItems: [
        {
          //标题
          title: '增加记录',
          //点击动作
          action: vm.add,
          //是否显示,返回true显示
          shown: function () {
            return true;
          },
          //次序，从200-300
          order: 210
        },
        {
          title: '编辑选择记录',
          action: vm.update,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 220
        },
        {
          title: '删除选择记录',
          action: vm.remove,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 230
        },
        {
          title: '查看选择记录',
          action: vm.view,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 240
        }
      ]
    };

    //取后台Teammembers表所有数据
    TeammembersService.query({gradeId: vm.grade, objId: vm.objId}).$promise.then(function (data) {
      vm.gridOptions.data = vm.tableData = data;
    });
  }
}());
