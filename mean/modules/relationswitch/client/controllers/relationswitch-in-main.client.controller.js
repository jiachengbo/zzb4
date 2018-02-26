(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchInMainController', RelationswitchInMainController);

  RelationswitchInMainController.$inject = ['$scope', 'Notification', '$log', '$window',
    '$stateParams', 'RelationswitchInService', '$uibModal', 'appService', 'Upload'];
  function RelationswitchInMainController($scope, Notification, $log, $window,
                                          $stateParams, RelationswitchInService, $uibModal, appService, Upload) {
    var vmo = this;
    //获取参数
    var storage = $window.localStorage.getItem('relation');
    var storagedata = JSON.parse(storage);
    if (storage === '{}') {
      vmo.branch = $stateParams.tj.OrganizationId;//所属支部ID
      vmo.zbName = $stateParams.tj.OrganizationName;//所属支部名称
    } else {
      vmo.branch = storagedata.OrganizationId;//所属支部ID
      vmo.zbName = storagedata.OrganizationName;//所属支部名称
    }
   /* vmo.branch = $stateParams.tj.OrganizationId;//所属支部ID
    vmo.zbName = $stateParams.tj.OrganizationName;//所属支部名称*/
    vmo.userid = appService.user.id;
    var branchInfo = [
      {'branchid': vmo.branch, 'branchname': vmo.zbName}
    ];
    //表数据
    vmo.tableData = [];
    //ui-grid 当前选择的行
    vmo.selectedRow = null;
    //打开模态框,返回模态框实例
    vmo._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/relationswitch/client/views/relationswitch-in-modal-form.client.view.html',
        controller: 'RelationswitchInModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };

    //增加数据
    vmo.add = function () {
      var modalInstance = vmo._openModal({
        RelationswitchInData: function () {
          //空数据
          return new RelationswitchInService();
        },
        //表明是增加
        method: function () {
          return '新增';
        },
        //当前登录用户所属党支部
        branchData: function () {
          return branchInfo;
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        Upload.upload({
          url: '/api/relationswitchin',
          data: result
        })
        // result.$save()
          .then(function (res) {
            refreshRecordCount(vmo.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员关系转入新增成功!'});
          })
          .catch(function (err) {
            $log.error('dj_MemberRelationIn add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党员关系转入新增失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vmo.remove = function () {
      if ($window.confirm('确定要删除吗?')) {
        vmo.selectedRow.$remove(function () {
          var rowindex = vmo.tableData.indexOf(vmo.selectedRow);
          //去掉表格中的数据
          vmo.tableData.splice(rowindex, 1);
          //复位当前行
          vmo.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员关系转入删除成功!'});
        })
          .catch(function (err) {
            $log.error('dj_MemberRelationIn deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党员关系转入删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vmo._updateorview = function (isupdate) {
      var modalInstance = vmo._openModal({
        RelationswitchInData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vmo.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        },
        //当前登录用户所属党支部
        branchData: function () {
          return branchInfo;
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          Upload.upload({
            url: '/api/relationswitchin/' + result.shipId,
            data: result
          })
          // result.$update()
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vmo.selectedRow, res.data);
              refreshRecordCount(vmo.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员关系转入修改成功!'});
            })
            .catch(function (err) {
              $log.error('dj_MemberRelationIn update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                '党员关系转入修改失败!'
              });
            });
        }
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };

    //修改
    vmo.update = function () {
      return vmo._updateorview(true);
    };
    //查看
    vmo.view = function () {
      return vmo._updateorview(false);
    };
    vmo.gridOptions = {
      //表数据
      data: vmo.tableData,
      columnDefs: [
        {field: 'memberName', displayName: '姓名'},
        {field: 'card', displayName: '身份证号'},
        {field: 'jointime', displayName: '入党时间', cellFilter: 'date:\"yyyy-MM-dd HH:mm:ss\"'},
        {field: 'place', displayName: '籍贯'},
        {field: 'tel', displayName: '联系电话'},
        // {field: 'outBranch', displayName: '原所在党支部'},
        // {field: 'inBranch', displayName: '转入党支部'},
        {field: 'createDate', displayName: '创建时间', cellFilter: 'date:\"yyyy-MM-dd HH:mm:ss\"'}
      ],

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vmo.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vmo.selectedRow = row.isSelected ? row.entity : null;
        });
        //分页按钮事件
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          refreshPageData(newPage, pageSize);
        });
      },
      paginationPageSizes: [20, 30, 40], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      //使用自定义翻页控制
      useExternalPagination: true,
      //不允许表格左上角菜单
      enableGridMenu: false
    };

    vmo.queryParam = {
      relationswitchinId: 0,
      limit: 0,
      offset: 0,
      type: vmo.branch
    };
    //刷新记录总数
    refreshRecordCount(vmo.queryParam);
    //刷新记录总数
    function refreshRecordCount(queryParam) {
      RelationswitchInService.query(queryParam).$promise
        .then(function (result) {
          vmo.gridOptions.totalItems = result[0].sum;
        })
        .then(function () {
          refreshPageData(1, vmo.gridOptions.paginationPageSize);
        })
        .catch(function (err) {
          $log.error('getCount error:', err);
        });
    }

    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vmo.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam = {
        relationswitchinId: 0,
        limit: (pageNumber - 1) * pageSize,
        offset: pageNumber * pageSize,
        type: vmo.branch
      };
      //取后台数据，默认按创建时间降序排序
      return RelationswitchInService.query(pageParam).$promise
        .then(function (data) {
          vmo.gridOptions.data = vmo.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }
  }
}());
