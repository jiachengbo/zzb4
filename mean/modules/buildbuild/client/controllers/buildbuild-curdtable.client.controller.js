(function () {
  'use strict';

  angular
    .module('buildbuild')
    .controller('BuildbuildCURDTableController', BuildbuildCURDTableController);

  BuildbuildCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window', 'uiGridConstants', 'BuildbuildService', '$uibModal', 'baseCodeService', 'Upload', 'BuildbuildPersonService', 'appService'];
  function BuildbuildCURDTableController($scope, Notification, $log, $window, uiGridConstants, BuildbuildService, $uibModal, baseCodeService, Upload, BuildbuildPersonService, appService) {
    var vm = this;
    //表数据
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    var dzzbranch = [];
    var usergrade;
    var userbranch;
    $scope.PartyOrganization = angular.copy(dj_PartyOrganization);
    var objs = {
      GradeID: 1,
      comType: 2,
      roleID: 25,
      simpleName: '区委',
      typeID: 0,
      typeName: '区委'
    };
    if ($scope.PartyOrganization.length < 31) {
      $scope.PartyOrganization.unshift(objs);
    }
    console.log($scope.PartyOrganization);
    if (appService.user) {
      vm.usergrade = usergrade = appService.user.user_grade;
      userbranch = appService.user.branch;
      if (usergrade === 9 || usergrade === 10) {
        angular.forEach(dj_PartyBranch, function (value, key) {
          if (value.OrganizationId === userbranch) {
            angular.forEach(dj_PartyBranch, function (v, k) {
              if (v.generalbranch === value.generalbranch) {
                dzzbranch.push(v.OrganizationId);
              }
            });
          }
        });
      }
    }
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/buildbuild/client/views/buildbuild-modal-form.client.view.html',
        controller: 'BuildbuildModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    vm.typeIDa = 0;
    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //buildbuild会传入modal的controller
        buildbuildData: function () {
          //空数据
          return new BuildbuildService();
        },
        //表明是增加
        method: function () {
          return '新增';
        },
        type: function () {
          return vm.typeIDa;
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal 派发 ok:', result);
        // result.$save()
        Upload.upload({
          url: '/api/buildbuild',
          data: result
        })
          .then(function (res) {
            // $log.log('派发 ok res:', res);
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            // $log.error('buildbuild add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 新增失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('确定删除?')) {
        var hdId = vm.selectedRow.hdId;
        BuildbuildPersonService.query({id: hdId, ishow: -1}).$promise.then(function (data) {
          refreshRecordCount(vm.queryParam);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        }).catch(function (err) {
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
        buildbuildData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        },
        type: function () {
          return vm.typeIDa;
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          // result.$update()
          Upload.upload({
            url: '/api/buildbuild/' + result.hdId,
            data: result
          })
            .then(function (res) {
              refreshRecordCount(vm.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              // $log.error('buildbuild update save error:', err.data.message);
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
    // ----新样式-----
    $scope.goToUpdate = function (row) {
      vm.update();
    };
    $scope.goToView = function (row) {
      vm.view();
    };
    $scope.goToDelete = function (row) {
      vm.remove();
    };
    //------end---
    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.tableData,
      enableHorizontalScrollbar: 1, //表格的水平滚动条
      columnDefs: [
        {field: 'rid', displayName: '编号', width: 80, cellClass: 'text-center'},
        {field: 'title', displayName: '活动标题', width: 240},
        {field: 'details', displayName: '活动内容'},
        {field: 'branchId', displayName: '所属支部'},
        {field: 'ifshow', displayName: '是否已推送', width: 120, cellClass: 'text-center'},
        {
          visible: false,
          field: 'action',
          width: 200,
          displayName: '操作',
          cellTemplate: '<div class="container-fluid"><div class="row cell-action-style">' +
          '<div class="col-xs-4 text-center"><div class="div-click"  ng-click="grid.appScope.goToView(row)"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></div></div>' +
          '<div class="col-xs-4 text-center"><div class="div-click"  ng-click="grid.appScope.goToUpdate(row)"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></div></div>' +
          '<div class="col-xs-4 text-center" ><div class="div-click"  ng-click="grid.appScope.goToDelete(row)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></div></div><div></div>' +
          '</div></div>'
        }
      ],
//-------------分页1.页面操作参数---------------
      paginationPageSizes: [20], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      //使用自定义翻页控制
      useExternalPagination: true,

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        // ---------分页2.分页按钮事件---------------
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          refreshPageData(newPage, pageSize);
        });
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
//分页3参数
    if (usergrade === 9 || usergrade === 10) {
      vm.queryParam = {
        cont: true,
        branch: dzzbranch
      };
    } else if (usergrade === 1) {
      vm.grade = 1;
      vm.roles = 25;
      vm.queryParam = {
        cont: true,
        gradeId: vm.grade,
        role: vm.roles
      };
    } else {
      vm.queryParam = {
        cont: true
      };
    }
    //分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam;
      if (usergrade === 9 || usergrade === 10) {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageSize,
          branch: dzzbranch
        };
      } else {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          gradeId: vm.grade,
          role: vm.roles,
          offset: pageSize
        };
      }

      //取后台数据，默认按创建时间降序排序
      return BuildbuildService.query(pageParam).$promise
        .then(function (data) {
          //序号
          if (data.length > 0) {
            for (var m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              if (data[m].ishow === 0) {
                data[m].ifshow = '否';
              } else {
                data[m].ifshow = '是';
              }
            }
          }
          angular.forEach(data, function (v, k) {
            v.details = !v.details || v.details.replace(/<[^>]+>/g, '');
            if (v.gradeId < 6) {
              angular.forEach(dj_JCDJ_UserRole, function (value, key) {
                if (v.roleId === value.UserRoleID) {
                  v.branchId = value.UserRoleName;
                }
              });
            } else if (v.gradeId === 6 || v.gradeId === 7) {
              angular.forEach(dj_PartyBranch, function (values, key) {
                if (values.OrganizationId === v.branchId) {
                  v.branchId = values.simpleName;
                }
              });
            } else if (v.gradeId === 9 || v.gradeId === 10) {
              angular.forEach(dj_PartyBranch, function (valuess, key) {
                if (valuess.OrganizationId === v.branchId) {
                  angular.forEach(dj_PartyGeneralBranch, function (valuea, key) {
                    if (valuess.generalbranch === valuea.branchID) {
                      v.branchId = valuea.simpleName;
                    }
                  });
                }
              });
            }
          });
          console.log(data);
          vm.gridOptions.data = vm.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      BuildbuildService.query(queryParam).$promise
        .then(function (result) {
          vm.gridOptions.totalItems = result[0].sum;
        })
        .then(function () {
          refreshPageData(1, vm.gridOptions.paginationPageSize);
        })
        .catch(function (err) {
          $log.error('getCount error:', err);
        });
    }

    vm.partyorg = function (i) {
      var data = $scope.PartyOrganization[i];
      vm.grade = data.GradeID;
      vm.roles = data.roleID;
      vm.queryParam = {
        cont: true,
        gradeId: vm.grade,
        role: vm.roles
      };
      refreshRecordCount(vm.queryParam);
    };
    /*
     //取后台Buildbuild表所有数据
     BuildbuildService.query().$promise.then(function (data) {
     vm.gridOptions.data = vm.tableData = data;
     });*/
  }
}());
