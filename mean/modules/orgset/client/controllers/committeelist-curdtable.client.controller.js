(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('CommitteeListModalFormController', CommitteeListModalFormController);

  CommitteeListModalFormController.$inject = ['$scope', 'Notification', '$log', '$window',
    '$uibModalInstance', '$uibModal', '$stateParams', 'baseCodeService', 'CommitteeTableService', 'Upload', 'Street'];
  function CommitteeListModalFormController($scope, Notification, $log, $window, $uibModalInstance, $uibModal, $stateParams, baseCodeService, CommitteeTableService, Upload, Street) {
    // 委员表-各街道社区委员
    var vm = this;
    var m;
    vm.Street = Street.orgId;
    vm.community = Street.community;
    if (vm.community === '0') {
      vm.showss = false;
    } else {
      vm.showss = true;
    }
    console.log(Street);
    // 获取组织机构常量表，根据对应关系，页面列表展示不同的数据
    var cvs_org = baseCodeService.getItems('OrgTable');

    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
//----------------------人员新增模态框--------------
    //打开人员新增 模态框,返回模态框实例
    vm._openPersonModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/orgset/client/views/committeetable-modal-form.client.view.html',
        controller: 'CommitteeTableModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: angular.extend({
          columnDefs: function () {
            return vm.gridOptions.columnDefs.slice(0);
          }
        }, resarg)
      });
    };
    // -------------------------------人员新增-----------------
    //增加数据
    vm.addPerson = function () {
      var modalInstance = vm._openPersonModal({
        //orgset会传入modal的controller
        committeeTableData: function () {
          //空数据
          var committeetableservice = new CommitteeTableService();
          committeetableservice.Street = vm.Street;
          committeetableservice.community = vm.community;
          return committeetableservice;
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal person ok:', result);
        // result.$save()
        Upload.upload({
          url: '/api/committeeTable',
          data: result
        })
          .then(function (res) {
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            // $log.error('orgperson add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              '新增失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };
//--------------------------------人员新增-----------------
    //删除数据
    vm.removePerson = function () {
      if ($window.confirm('确定删除?')) {
        vm.selectedRow.$remove(function () {
          refreshRecordCount(vm.queryParam);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            // $log.error('orgperson deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vm._updateorview = function (isupdate) {
      var modalInstance = vm._openPersonModal({
        committeeTableData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        }
      });

      modalInstance.result.then(function (result) {
        // $log.log('modal 委员 ok:', result);
        if (isupdate) {
          // result.$update()
          Upload.upload({
            url: '/api/committeeTable/' + result.CommitteeId,
            data: result
          })
            .then(function (res) {
              //修改表格显示的数据
              // angular.extend(vm.selectedRow, res);
              refreshRecordCount(vm.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              // $log.error('orgset update save error:', err.data.message);
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
    vm.updatePerson = function () {
      return vm._updateorview(true);
    };
    //查看
    vm.viewPerson = function () {
      return vm._updateorview(false);
    };

    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      rowHeight: 45,
      data: vm.tableData,
      columnDefs: [
        {field: 'rid', displayName: '编号', width: 80},
        {field: 'CommitteeName', displayName: '人员名称', width: 280},
        {field: 'CommitteeType', displayName: '人员类型'},
        {field: 'CommitteePostion', displayName: '职位'},
        {field: 'duty', displayName: '工作职责'},
        /*{field: 'community', displayName: '社区', visible: vm.showss},
         {field: 'GridID', displayName: '网格', visible: vm.showss},*/
        {
          field: 'CommitteePhotoPath',
          visible: false,
          displayName: '人员照片',
          cellTemplate: '<div style="text-align: center;width: 100%" > <img width=\"100px\" ' +
          'height=\"100px\" ' +
          'style=\"margin-top: 5px;margin-left: 5px;\"  ' +
          'ng-src=\"{{grid.getCellValue(row, col)}}\"' +
          'lazy-src></div>'
        }
      ],
      //-------------分页1.页面操作参数---------------
      paginationPageSizes: [10], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 10,
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
          // $log.log('row selected ' + row.isSelected, row);
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
    //取后台Appeal表所有数据
    //分页3参数
    vm.queryParam = {
      committeeTableId: 0,
      limit: 0,
      offset: 0,
      Street: vm.Street,
      community: vm.community
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
        Street: vm.Street,
        community: vm.community
      };
      //取后台数据，默认按创建时间降序排序
      return CommitteeTableService.query(pageParam).$promise
        .then(function (data) {
          //序号列的处理
          if (data.length > 0) {
            for (m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              if (data[m].duty) {
                data[m].duty = data[m].duty.replace(/<[^>]+>/g, '');
              }
            }
          }
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

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
