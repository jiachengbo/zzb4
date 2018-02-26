(function () {
  'use strict';

  angular
    .module('appeal')
    .controller('AppealCURDTableController', AppealCURDTableController);

  AppealCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'AppealService', '$uibModal', '$stateParams', 'baseCodeService', 'Upload', 'appService', 'AppealsbService', '$filter', 'Timer', 'Socket'];
  function AppealCURDTableController($scope, Notification, $log, $window, uiGridConstants, AppealService, $uibModal,
                                     $stateParams, baseCodeService, Upload, appService, AppealsbService, $filter, Timer, Socket) {
    var vm = this;
    var m;
    var n;
    var jb = $stateParams.jb;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    var user = appService.user;
    var user_gradeId = user.user_grade;
    vm.usergrade = user.user_grade;
    var user_roleId = user.JCDJ_User_roleID;
    var user_branchId = user.branch;
    var up_gradleId;
    var up_roleId;
    var user_super;
    var generalbranch;
    var streetID = 0;
    var communityId;

    $scope.PartyOrganization = angular.copy(vm.dj_PartyOrganization);
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

    function getUserSuperStreetCommunityId() {
      // 通过当支部Id 获取1-30
      for (n = 0; n < vm.dj_PartyBranch.length; n++) {
        if (vm.dj_PartyBranch[n].OrganizationId === user_branchId) {
          user_super = vm.dj_PartyBranch[n].super;
          generalbranch = vm.dj_PartyBranch[n].generalbranch;
          streetID = vm.dj_PartyBranch[n].streetID;
          communityId = vm.dj_PartyBranch[n].communityId;
          /*      alert('user_branchId=' + user_branchId + 'user_super=' + user_super + 'streetID=' + streetID + '--- ' + communityId);*/
        }
      }
      if (generalbranch && (user_gradeId === 7 || user_gradeId === 6)) {
        angular.forEach(vm.dj_PartyGeneralBranch, function (v, k) {
          console.log(v);
          if (generalbranch === v.branchID) {
            if (v.mold === 2) {
              up_roleId = 73;
              up_gradleId = 10;
            } else {
              up_roleId = 71;
              up_gradleId = 9;
            }
          }
        });
      } else {
        for (n = 0; n < vm.dj_PartyOrganization.length; n++) {
          if (vm.dj_PartyOrganization[n].typeID === user_super) {
            up_roleId = vm.dj_PartyOrganization[n].roleID;
            up_gradleId = vm.dj_PartyOrganization[n].GradeID;
          }
        }
      }
    }

    // 党总支
    if (user_gradeId === 9 || user_gradeId === 10) {
      getUserSuperStreetCommunityId();
    }
    if (user_gradeId === 7 || user_gradeId === 6) {
      // 通过当支部Id 获取1-30
      getUserSuperStreetCommunityId();
    }
    if (user_gradeId === 5 || user_gradeId === 4) {
      if (user_gradeId === 5) {
        up_roleId = 30;
        up_gradleId = 3;
      } else {
        up_roleId = 29;
        up_gradleId = 2;
      }
    }
    if (user_gradeId === 3 || user_gradeId === 2) {
      up_roleId = 25;
      up_gradleId = 1;
    }

    //读取本地存储的社区村常量表
    // var streets = baseCodeService.getItems('street_info');
    // var communitys = baseCodeService.getItems('community');
    // var grids = baseCodeService.getItems('grid');
    var ptypes = baseCodeService.getItems('dj_current_pt_type');
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/appeal/client/views/appeal-modal-form.client.view.html',
        controller: 'AppealModalFormController',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        resolve: angular.extend({
          //列定义
          columnDefs: function () {
            //去掉前两列：id
            return vm.gridOptions.columnDefs.slice(0);
          }
        }, resarg)

      });
    };
    vm.typeIDa = 0;
    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //appeal会传入modal的controller
        appealData: function () {
          //空数据
          var appeal = new AppealService();
          // appeal.Street = jb;
          appeal.createUser = user.displayName;
          appeal.streetID = streetID;
          appeal.communityId = communityId;
          appeal.PartyBranchID = generalbranch;
          return appeal;
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
        $log.log('modal ok add:', result);
        // 街道社区 来自 user branch

        Upload.upload({
          url: '/api/appeal',
          data: result
        }).then(function (res) {
          // 增加成功。是否推送
          // console.info(res.data);
          var issb = result.issb;
          if (issb === 1) {
            // 增加 数据到 appealsb
            var appealsb = new AppealsbService();
            appealsb.appealId = res.data;
            appealsb.sbtime = result.sbtime;
            appealsb.gradeId = up_gradleId;
            appealsb.roleId = up_roleId;
            appealsb.PartyBranchID = generalbranch || -1;
            appealsb.ishow = 0;
            appealsb.issb = 0;
            AppealsbService.query({appealsb: appealsb}).$promise
              .then(function (result) {
                Socket.emit('appeal', {appealdata: result});
                Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上报成功!'});
              })
              .catch(function (err) {
                $log.error('getCount error:', err);
                console.info('新增上报异常');
              });
          }
        })
          .then(function (res) {
            //vm.gridOptions.data.push(res);
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            $log.error('appeal add save error:', err.data.message);
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
      if ($window.confirm('是否删除?')) {
        // var appealId = vm.selectedRow.appealId;
        var id = vm.selectedRow.id;//sb id
        AppealsbService.query({id: id}).$promise
          .then(function () {
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
          })
          .catch(function (err) {
            console.info(err);
          });
      }
    };

    //修改或查看数据
    vm._updateorview = function (isupdate) {
      var modalInstance = vm._openModal({
        appealData: function () {
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
      var appealsb;
      modalInstance.result.then(function (result) {
        // $log.log('modal  ok:', result);
        if (isupdate) {
          // result.$update()
          Upload.upload({
            url: '/api/appeal/' + result.appealId,
            data: result
          }).then(function (res) {
            // 增加成功。是否推送
            // console.info(res.data);
            var issb = result.issb;
            var issbOld = vm.selectedRow.issb;
            // 防止重复上报
            if (issb === 1 && issbOld !== 1) {
              // 增加 数据到 appealsb
              appealsb = new AppealsbService();
              appealsb.appealId = result.appealId;
              appealsb.sbtime = result.sbtime;
              appealsb.gradeId = up_gradleId;
              appealsb.roleId = up_roleId;
              appealsb.PartyBranchID = generalbranch || -1;
              appealsb.ishow = 0;
              appealsb.issb = 0;
              AppealsbService.query({appealsb: appealsb}).$promise
                .then(function (result) {
                  Socket.emit('appeal', {appealdata: result});
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上报成功!'});
                })
                .catch(function (err) {
                  $log.error('getCount error:', err);
                  console.info('上报异常');
                });
            }
            // 上报 以后 ，取消上报
            if (issb === 0 && issbOld === 1) {
              // 删除上报的 数据 appealsb
              appealsb = new AppealsbService();
              var appealId = vm.selectedRow.appealId;
              appealsb.gradeId = up_gradleId;
              appealsb.roleId = up_roleId;
              appealsb.appealId = appealId;
              appealsb.issb = 1;
              AppealsbService.query({appealsb: appealsb}).$promise
                .then(function (result) {
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上报取消成功!'});
                })
                .catch(function (err) {
                  $log.error('getCount error:', err);
                  console.info('上报删除异常');
                });
            }
          })
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vm.selectedRow, res);
              refreshRecordCount(vm.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              $log.error('appeal update save error:', err.data.message);
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
        {field: 'rid', displayName: '序号', width: 80},
        {field: 'appealTitle', displayName: '活动标题'},
        {field: 'appealContext', displayName: '活动内容'},
        {field: 'state', displayName: '状态', width: 100},
        // {field: 'current_PT_type', displayName: '当前处理平台'},
        {field: 'createUser', displayName: '创建者', width: 150},
        // {field: 'ptName', displayName: '当前处理平台'},
        // {field: 'communityId', displayName: '社区'},
        // {field: 'communityName', displayName: '社区'},
        // {field: 'gridId', displayName: '网格编号'},
        // {field: 'gridNum', displayName: '网格编号'},
        {field: 'sbtime', displayName: '申报时间', cellFilter: 'date: "yyyy-MM-dd HH:mm:ss"', width: 150}
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
//时间格式化
    function dateFormat(time) {
      return $filter('date')(time, 'yyyy-MM-dd HH:mm:ss');
    }

    //取后台Appeal表所有数据
    //分页3参数
    if (user_gradeId === 1) {
      vm.grade = 1;
      vm.roles = 25;
      vm.queryParam = {
        cont: true,
        gradeId: vm.grade,
        role: vm.roles,
        jb: jb
      };
    } else {
      vm.queryParam = {
        cont: true,
        PartyBranchID: generalbranch,
        jb: jb
      };
    }

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
        gradeId: vm.grade,
        PartyBranchID: generalbranch,
        role: vm.roles,
        jb: jb
      };
      //取后台数据，默认按创建时间降序排序
      return AppealService.query(pageParam).$promise
        .then(function (data) {
          console.log(data);
          //序号列的处理
          if (data.length > 0) {
            for (m = 0; m < data.length; m++) {
              // 编号
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              // createDate 多8小时
              var date = new Date(data[m].createDate);
              data[m].createDate = dateFormat(date.setHours(date.getHours() - 8));

              /*// 社区
               for (var n = 0; n < communitys.length; n++) {
               if (communitys[n].communityId === data[m].communityId && communitys[n].streetID === jb) {
               data[m].communityName = communitys[n].communityName;
               break;
               }
               }*/
              /*// 网格编号
               for (var p = 0; p < grids.length; p++) {
               if (grids[p].departmentId === data[m].communityId && grids[p].streetID === jb && grids[p].gridId === data[m].gridId) {
               data[m].gridNum = grids[p].gridNum;
               break;
               }
               }*/
              // 当前处理平台
              for (var q = 0; q < ptypes.length; q++) {
                if (ptypes[q].typeID === data[m].current_PT_type) {
                  data[m].ptName = ptypes[q].typeName;
                  break;
                }
              }
            }
          }
          // $log.info('级联查询街道社区网格', data);
          if (data.length !== 0) {
            angular.forEach(data, function (value, k) {
              if (value.sbtime) {
                value.sbtime = Timer.format(value.sbtime, 'day');
              }
              if (value.appealContext) {
                value.appealContext = value.appealContext.replace(/<[^>]+>/g, '');
              }
            });
          }
          vm.gridOptions.data = vm.tableData = data;
          console.log(data);
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      AppealService.query(queryParam).$promise
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
        jb: jb,
        gradeId: vm.grade,
        role: vm.roles
      };
      refreshRecordCount(vm.queryParam);
    };
    /*AppealService.query({streetID:9}).$promise.then(function(data) {
     vm.gridOptions.data = vm.tableData = data;
     });*/
  }
}());
