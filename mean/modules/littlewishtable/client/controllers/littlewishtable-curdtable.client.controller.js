(function () {
  'use strict';

  angular
    .module('littleWishTable')
    .controller('LittleWishTableCURDTableController', LittleWishTableCURDTableController);

  LittleWishTableCURDTableController.$inject = ['$stateParams', '$scope', 'Notification', '$log', '$window', 'uiGridConstants', 'LittleWishTableService', '$uibModal', 'baseCodeService', 'appService', 'Upload'];
  function LittleWishTableCURDTableController($stateParams, $scope, Notification, $log, $window, uiGridConstants, LittleWishTableService, $uibModal, baseCodeService, appService, Upload) {
    var vm = this;
    var i;
    var aUser = appService.user;
    var userGrade = aUser.user_grade;
    var userRoleID = aUser.JCDJ_User_roleID;
    var userBranch = aUser.branch;
    var littleStatus = $stateParams.littleStatus;
    vm.littleStatus = littleStatus;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    var _super = -1;
    var OrganizationIds = []; // 党总支 下属党支部ID
    if (userGrade === 1) {
      _super = -3;
    } else if (userGrade === 2) {
      _super = -1330;
    } else if (userGrade === 3) {
      _super = -112;
    } else if (userGrade === 5 || userGrade === 4) {
      // 1-30
      for (i = 0; i < vm.dj_PartyOrganization.length; i++) {
        if (vm.dj_PartyOrganization[i].roleID === userRoleID) {
          _super = vm.dj_PartyOrganization[i].typeID;
        }
      }
    } else if (userGrade === 6 || userGrade === 7) {
      _super = -67; // 党支部 下级上报的问题 默认 -1
    } else if (userGrade === 9 || userGrade === 10) {
      _super = -910; // 获取党总支ID userBranch 下级所有 党支部ID
      // 1-30
      var generalbranch;
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (vm.dj_PartyBranch[i].OrganizationId === userBranch) {
          generalbranch = vm.dj_PartyBranch[i].generalbranch;
        }
      }
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (vm.dj_PartyBranch[i].generalbranch === generalbranch) {
          OrganizationIds.push(vm.dj_PartyBranch[i].OrganizationId);
        }
      }
    }

    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    //判断是否显示 认领人 、认领时间
    switch (littleStatus) {
      case '已认领':
      case '已完成':
        vm.showRl = true;
        break;
      default:
        vm.showRl = false;
        break;
    }
    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-modal-form.client.view.html',
        controller: 'LittleWishTableModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: angular.extend({
          columnDefs: function () {
            return vm.gridOptions.columnDefs.slice(1);
          }
        }, resarg)
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //littleWishTable会传入modal的controller
        littleWishTableData: function () {
          //空数据
          return new LittleWishTableService();
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal 新增 ok:', result);
        //
        result.super = -1;
        if (userGrade <= 3) {
          result.streetID = -1;
        } else if (userGrade === 4) {
          result.streetID = -1;
        } else if (userGrade === 5) {
          //党工委
          if (userRoleID === 32) {
            result.streetID = 3;
          } else if (userRoleID === 33) {
            result.streetID = 4;
          } else if (userRoleID === 34) {
            result.streetID = 5;
          } else if (userRoleID === 35) {
            result.streetID = 9;
          } else if (userRoleID === 36) {
            result.streetID = 6;
          } else if (userRoleID === 37) {
            result.streetID = 7;
          } else if (userRoleID === 38) {
            result.streetID = 1;
          } else if (userRoleID === 39) {
            result.streetID = 2;
          } else if (userRoleID === 40) {
            result.streetID = 8;
          }
        } else if (userGrade === 7 || userGrade === 6) {
          result.streetID = -1;
          // 党支部 社区 1-30 反查党支部常量表
          for (i = 0; i < vm.dj_PartyBranch.length; i++) {
            if (vm.dj_PartyBranch[i].OrganizationId === userBranch) {
              if (vm.dj_PartyBranch[i].generalbranch) {
                result.genersuper = vm.dj_PartyBranch[i].generalbranch;
              }
              result.super = vm.dj_PartyBranch[i].super;
              result.streetID = vm.dj_PartyBranch[i].streetID;
              result.communityID = vm.dj_PartyBranch[i].communityId;
              result.grid = vm.dj_PartyBranch[i].BelongGrid;
            }
          }
        } else if (userGrade === 9 || userGrade === 10) {
          result.streetID = -1;
          // 党总支 本地存储 dj_PartyGeneralBranch
          for (i = 0; i < vm.dj_PartyBranch.length; i++) {
            if (vm.dj_PartyBranch[i].OrganizationId === userBranch) {
              result.super = vm.dj_PartyBranch[i].super;
              result.streetID = vm.dj_PartyBranch[i].streetID;
              result.communityID = vm.dj_PartyBranch[i].communityId;
              result.grid = vm.dj_PartyBranch[i].BelongGrid;
            }
          }
          /*for (i = 0; i < vm.dj_PartyGeneralBranch.length; i++) {
           if (vm.dj_PartyGeneralBranch[i].branchID === userBranch) {
           result.super = vm.dj_PartyGeneralBranch[i].superior;
           result.super = vm.dj_PartyBranch[i].super;
           result.streetID = vm.dj_PartyBranch[i].streetID;
           result.communityID = vm.dj_PartyBranch[i].communityId;
           result.grid = vm.dj_PartyBranch[i].BelongGrid;
           }
           }*/
        }
        Upload.upload({
          url: '/api/littleWishTable',
          data: result
        })
        //result.$save()
          .then(function (res) {
            //-----------------分页1：新增后， 刷新记录总数---------------
            refreshRecordCount(vm.queryParam);
            // vm.gridOptions.data.push(res);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            // $log.error('新增失败:', err.data.message);
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
        vm.selectedRow.$remove(function () {
          //-----------------分页1：新增后， 刷新记录总数---------------
          refreshRecordCount(vm.queryParam);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            // $log.error('littleWishTable deleted error:', err.data.message);
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
        littleWishTableData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          Upload.upload({
            url: '/api/littleWishTable/' + result.id,
            data: result
          })
          // result.$update()
            .then(function (res) {
              //修改表格显示的数据
              // angular.extend(vm.selectedRow, res);
              //-----------------分页1：修改心愿状态后， 刷新记录总数---------------
              refreshRecordCount(vm.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              // $log.error('littleWishTable update save error:', err.data.message);
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
        // {field: 'littleId', displayName: '序号'},
        {field: 'rid', displayName: '序号', width: 80},
        {field: 'littleTitle', displayName: '标题', width: 350},
        {field: 'littleContent', displayName: '内容'},
        {field: 'littleDate', displayName: '发布时间', cellFilter: 'date:"yyyy-MM-dd"', width: 120},
        {field: 'littlePerson', displayName: '发布人', width: 120},
        {field: 'littleClaimant', displayName: '认领人', width: 120, visible: vm.showRl},
        {field: 'littleClaimDate', displayName: '认领时间', cellFilter: 'date:"yyyy-MM-dd"', width: 120, visible: vm.showRl}
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

    //取后台LittleWishTable表所有数据
    /* LittleWishTableService.query().$promise.then(function(data) {
     vm.gridOptions.data = vm.tableData = data;
     });*/
    //分页3参数
    vm.queryParam = {
      cont: true,
      littleStatus: littleStatus,
      _super: _super,
      OrganizationIds: OrganizationIds
    };
    //分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam = {
        sum: true,
        limit: (pageNumber - 1) * pageSize,
        offset: pageNumber * pageSize,
        littleStatus: littleStatus,
        _super: _super,
        OrganizationIds: OrganizationIds
      };
      //取后台数据，默认按创建时间降序排序
      return LittleWishTableService.query(pageParam).$promise
        .then(function (data) {
          //序号列的处理
          if (data.length > 0) {
            for (var m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
            }
          }
          vm.gridOptions.data = vm.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      LittleWishTableService.query(queryParam).$promise
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

  }
}());
