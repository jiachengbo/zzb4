(function () {
  'use strict';

  angular
    .module('jobduties')
    .controller('JobdutiesCURDTableController', JobdutiesCURDTableController);

  JobdutiesCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'JobdutiesService',
    '$uibModal', 'baseCodeService', 'appService'];
  function JobdutiesCURDTableController($scope, Notification, $log, $window,
                                        uiGridConstants, JobdutiesService, $uibModal, baseCodeService, appService) {
    var vm = this;
    //表数据
    vm.tableData = [];
    var usergrade;
    var userRole;
    var branch;
    var paramcount;
    var pagramdata;
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    vm.street_info = baseCodeService.getItems('street_info');
    vm.grid = baseCodeService.getItems('grid');
    vm.community = baseCodeService.getItems('community');
    vm.dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    //打开模态框,返回模态框实例
    if (appService.user) {
      usergrade = appService.user.user_grade;
      userRole = appService.user.JCDJ_User_roleID;
      branch = appService.user.branch;
      console.log(usergrade, userRole, branch);
      if (usergrade === 5 && (userRole > 30 && userRole < 41)) {
        angular.forEach(vm.dj_JCDJ_UserRole, function (v, k) {
          if (userRole === v.UserRoleID) {
            vm.street = v.streetID || '';
          }
        });
      } else if (usergrade === 7 || usergrade === 10) {
        angular.forEach(vm.dj_PartyBranch, function (v, k) {
          if (branch === v.OrganizationId) {
            vm.street = v.streetID || '';
            vm.communityid = v.communityId || '';
          }
        });
      }
    }
    vm.street = vm.street || '';
    vm.communityid = vm.communityid || '';
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/jobduties/client/views/jobduties-modal-form.client.view.html',
        controller: 'JobdutiesModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //jobduties会传入modal的controller
        jobdutiesData: function () {
          //空数据
          return new JobdutiesService();
        },
        //表明是增加
        method: function () {
          return 'add';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.$save()
          .then(function (res) {
            // vm.gridOptions.data.push(res);
            getcount(paramcount);
            getdata(pagramdata);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增职责成功!'});
          })
          .catch(function (err) {
            $log.error('jobduties add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 新增职责失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('确认删除吗？')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          getcount(paramcount);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            $log.error('jobduties deleted error:', err.data.message);
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
        jobdutiesData: function () {
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
          result.$update()
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vm.selectedRow, res);
              getcount(paramcount);
              getdata(pagramdata);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              $log.error('jobduties update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                '修改失败!'
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
        {field: 'id', displayName: '职责ID'},
        {field: 'streetid', displayName: '所属街道'},
        {field: 'communityid', displayName: '所属社区'},
        {field: 'gridId', displayName: '所属网格'},
        {field: 'dutycontent', displayName: '职责描述'}
      ],

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          pagramdata = {
            limit: pageSize,
            offset: (newPage - 1) * pageSize,
            street: vm.street,
            communityid: vm.communityid
          };
          getdata(pagramdata);
        });
      },

      //如果不需要在表格左上角菜单显示功能，以下参数可以去掉
      //允许表格左上角菜单
      paginationPageSizes: [20], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      //使用自定义翻页控制
      useExternalPagination: true,
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

    //取后台Jobduties表所有数据
    paramcount = {
      count: true,
      street: vm.street,
      communityid: vm.communityid
    };
    pagramdata = {
      limit: 20,
      offset: 0,
      street: vm.street,
      communityid: vm.communityid
    };

    function getcount(paramcount) {
      JobdutiesService.query(paramcount).$promise.then(function (data) {
        console.log(data);
        vm.gridOptions.totalItems = data[0].shuliang;
      });
    }

    function getdata(pagramdata) {
      JobdutiesService.query(pagramdata).$promise.then(function (data) {
        angular.forEach(data, function (v, k) {
          angular.forEach(vm.grid, function (vauless, key) {
            var strgrid = '' + vauless.gridId;
            var strcomms = '' + vauless.departmentId;
            if (vauless.streetID === v.streetid && strcomms === v.communityid && strgrid === v.gridId) {
              v.gridId = vauless.gridName;
            }
          });
          angular.forEach(vm.community, function (vaules, key) {
            var stromm = '' + vaules.communityId;
            if (vaules.streetID === v.streetid && stromm === v.communityid) {
              v.communityid = vaules.communityName;
              console.log(v);
            }
          });
          angular.forEach(vm.street_info, function (vaule, key) {
            if (vaule.streetID === v.streetid) {
              v.streetid = vaule.streetName;
            }
          });
        });
        vm.gridOptions.data = vm.tableData = data;
      });
    }

    getcount(paramcount);
    getdata(pagramdata);
  }
}());
