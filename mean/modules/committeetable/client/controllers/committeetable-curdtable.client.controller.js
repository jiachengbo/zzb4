(function () {
  'use strict';

  angular
    .module('committeeTable')
    .controller('CommitteeTableCURDTableController', CommitteeTableCURDTableController);

  CommitteeTableCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'CommitteeTableService',
    '$uibModal', '$stateParams', 'baseCodeService', 'Upload'];
  function CommitteeTableCURDTableController($scope, Notification, $log, $window,
                                             uiGridConstants, CommitteeTableService, $uibModal,
                                             $stateParams, baseCodeService, Upload) {
    var vm = this;
    var m;
    var jb = $stateParams.jb;
    //读取本地存储的社区村常量表
    var streets = baseCodeService.getItems('street_info');
    var communitys = baseCodeService.getItems('community');
    var grids = baseCodeService.getItems('grid');
    var ptypes = baseCodeService.getItems('dj_current_pt_type');
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/committeetable/client/views/committeetable-modal-form.client.view.html',
        controller: 'CommitteeTableModalFormController',
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

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //committeeTable会传入modal的controller
        committeeTableData: function () {
          //空数据
          var committeeTable = new CommitteeTableService();
          committeeTable.Street = jb;
          return committeeTable;
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        Upload.upload({
          url: '/api/committeeTable',
          data: result
        })
          .then(function (res) {
            vm.gridOptions.data.push(res);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i>新增成功!'});
          })
          .catch(function (err) {
            $log.error('committeeTable add save error:', err.data.message);
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
      if ($window.confirm('你确定你想要删除选定的记录?')) {
        vm.selectedRow.$remove(function () {
          //  var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          // vm.tableData.splice(rowindex, 1);
          //复位当前行
          // vm.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            $log.error('committeeTable deleted error:', err.data.message);
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
        committeeTableData: function () {
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
          //result.$update()
          Upload.upload({
            url: '/api/committeeTable/' + result.CommitteeId,
            data: result
          })
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vm.selectedRow, res);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              $log.error('committeeTable update save error:', err.data.message);
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
        {field: 'CommitteeId', displayName: '序号'},
        {field: 'CommitteeName', displayName: '姓名'},
        {field: 'CommitteeType', displayName: '类型'}
        //{field: 'User.displayName', displayName: '类型'}
      ],
      //-------------分页1.页面操作参数---------------
      paginationPageSizes: [20, 30, 40], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      //使用自定义翻页控制
      useExternalPagination: true,

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

    //取后台CommitteeTable表所有数据
    // CommitteeTableService.query().$promise.then(function(data) {
    //   vm.gridOptions.data = vm.tableData = data;
    // });
    //取后台Appeal表所有数据
    //分页3参数
    vm.queryParam = {
      committeeTableId: 0,
      limit: 0,
      offset: 0,
      jb: jb
    };

//分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam = {
        committeeTableId: 0,
        limit: (pageNumber - 1) * pageSize,
        offset: pageNumber * pageSize,
        jb: jb
      };
      //取后台数据，默认按创建时间降序排序
      return CommitteeTableService.query(pageParam).$promise
        .then(function (data) {
          //序号列的处理
          if (data.length > 0) {
            for (m = 0; m < data.length; m++) {
              // 编号
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              // 社区
              for (var n = 0; n < communitys.length; n++) {
                if (communitys[n].communityId === data[m].communityId && communitys[n].streetID === jb) {
                  data[m].communityName = communitys[n].communityName;
                  break;
                }
              }
              // 网格编号
              for (var p = 0; p < grids.length; p++) {
                if (grids[p].departmentId === data[m].communityId && grids[p].streetID === jb && grids[p].gridId === data[m].gridId) {
                  data[m].gridNum = grids[p].gridNum;
                  break;
                }
              }
              // 当前处理平台
              for (var q = 0; q < ptypes.length; q++) {
                if (ptypes[q].typeID === data[m].current_PT_type) {
                  data[m].ptName = ptypes[q].typeName;
                  break;
                }
              }
            }
          }
          $log.info('级联查询街道社区网格', data);
          vm.gridOptions.data = vm.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      CommitteeTableService.query(queryParam).$promise
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
