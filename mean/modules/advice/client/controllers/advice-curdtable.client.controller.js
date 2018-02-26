(function () {
  'use strict';

  angular
    .module('advice')
    .controller('AdviceCURDTableController', AdviceCURDTableController);

  AdviceCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'AdviceService',
    '$uibModal', 'baseCodeService', 'appService'];
  function AdviceCURDTableController($scope, Notification, $log, $window,
                                     uiGridConstants, AdviceService, $uibModal, baseCodeService, appService) {
    var vm = this;
    //表数据
    var grade;
    var branch;
    var street;
    var commit;
    var grids;
    var iscomm;
    var role;
    var where = {};
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    if (appService.user) {
      grade = appService.user.user_grade;
      role = appService.user.JCDJ_User_roleID;
      branch = appService.user.branch;
      dj_PartyBranch.forEach(function (v, k) {
        if (v.OrganizationId === branch) {
          street = v.streetID;
          commit = v.communityId;
          grids = v.BelongGrid;
          iscomm = v.belongComm;
        }
      });
      if (grade === 1) {
        where = {};
      } else if (grade === 5 && (role > 31 && role < 41)) {
        where = {
          streetID: street
        };
      } else if ((grade === 10 || grade === 7) && iscomm === 1) {
        where = {
          streetID: street,
          communityID: commit
        };
      } else {
        where = {
          streetID: -1
        };
      }
    }
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    vm.street_info = baseCodeService.getItems('street_info');
    vm.grid = baseCodeService.getItems('grid');
    vm.community = baseCodeService.getItems('community');
    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/advice/client/views/advice-modal-form.client.view.html',
        controller: 'AdviceModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //advice会传入modal的controller
        adviceData: function () {
          //空数据
          return new AdviceService();
        },
        //表明是增加
        method: function () {
          return '增加';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.$save()
          .then(function (res) {
            vm.gridOptions.data.push(res);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 投诉建议新增成功!'});
          })
          .catch(function (err) {
            $log.error('advice add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 投诉建议新增失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('你确定删除此条信息吗?')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          console.log(vm.pageParam);
          pageage(vm.pageParam, where);
          pagesum(vm.pagecount, where);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            $log.error('advice deleted error:', err.data.message);
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
        adviceData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '回复' : '查看';
        }
      });
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          result.$update()
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vm.selectedRow, res);
              pageage(vm.pageParam, where);
              // pagesum(pagecount, where);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              $log.error('advice update save error:', err.data.message);
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
        {field: 'order', displayName: '序号'},
        {field: 'title', displayName: '标题'},
        {field: 'adviceContent', displayName: '内容'},
        {field: 'createDate', displayName: '发布时间'},
        {field: 'modifyUserId', displayName: '发布人'},
        {field: 'releasePerson', displayName: '回复人'},
        {field: 'replyTime', displayName: '回复时间'},
        {field: 'replyContent', displayName: '回复内容'},
        {field: 'street_info.streetName', displayName: '街道'},
        {field: 'communityID', displayName: '社区'},
        {field: 'gridID', displayName: '网格'}
      ],

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
        });
        gridApi.pagination.on.paginationChanged($scope, function (pagecount, countperpage) {
          //(pagecount); //第几页
          //(countperpage); //每页显示多少条数据
          vm.pageParam = {
            offset: (pagecount - 1) * countperpage,
            limit: countperpage
          };
          pageage(vm.pageParam, where);
        });
      },

      //如果不需要在表格左上角菜单显示功能，以下参数可以去掉
      //允许表格左上角菜单
      paginationPageSizes: [20, 50, 100], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      useExternalPagination: true,
      useExternalFiltering: true,
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
    //取后台Advice表所有数据
    function pageage(pageParam, where) {
      AdviceService.query(angular.extend({}, pageParam, where)).$promise.then(function (data) {
        angular.forEach(data, function (v, k) {
          v.order = (k + 1) + ((vm.gridOptions.paginationCurrentPage - 1) * vm.gridOptions.paginationPageSize);
          angular.forEach(vm.grid, function (vauless, key) {
            var strgrid = '' + vauless.gridId;
            var strcomms = '' + vauless.departmentId;
            if (vauless.streetID === v.streetID && strcomms === v.communityID && strgrid === v.gridID) {
              v.gridID = vauless.gridNum;
            }
          });
          angular.forEach(vm.community, function (vaules, key) {
            var stromm = '' + vaules.communityId;
            if (vaules.streetID === v.streetID && stromm === v.communityID) {
              v.communityID = vaules.communityName;
            }
          });
        });
        vm.gridOptions.data = vm.tableData = data;
      });
    }

    function pagesum(pageParam, where) {
      AdviceService.query(angular.extend({}, pageParam, where)).$promise.then(function (data) {
        vm.gridOptions.totalItems = data[0].count;
      });
    }

    vm.pagecount = {
      issum: 1
    };
    vm.pageParam = {
      offset: 0,
      limit: vm.gridOptions.paginationPageSize
    };
    pageage(vm.pageParam, where);
    pagesum(vm.pagecount, where);
  }
}());
