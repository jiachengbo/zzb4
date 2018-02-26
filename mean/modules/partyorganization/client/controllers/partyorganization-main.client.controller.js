(function () {
  'use strict';

  angular
    .module('partyorganization')
    .controller('PartyorganizationMainController', PartyorganizationMainController);

  PartyorganizationMainController.$inject = ['$scope', '$log', '$window', '$stateParams', '$uibModal', '$state', 'appService', 'PartyorganizationService', 'Notification'];
  function PartyorganizationMainController($scope, $log, $window, $stateParams, $uibModal, $state, appService, PartyorganizationService, Notification) {
    var vmo = this;
    var grade;
    if (appService.user) {
      grade = appService.user.user_grade;
      if (grade === 7 || grade === 6) {
        vmo.show = false;
      } else {
        vmo.show = true;
      }
    }

    //获取参数
    var storage = $window.localStorage.getItem('Orgparty');
    var storagedata = JSON.parse(storage);
    if (storage === '{}') {
      vmo.organizationId = $stateParams.typeid;//所属部门党委或街道党工委ID
      vmo.organizationName = $stateParams.typename;//所属部门党委或街道党工委name
    } else {
      vmo.organizationId = storagedata.typeid || undefined;//所属部门党委或街道党工委ID
      vmo.OrganizationId = storagedata.OrganizationId || undefined; //获取支部ID
      vmo.generalbranch = storagedata.generalbranch || undefined;
      vmo.organizationName = storagedata.typename;//所属部门党委或街道党工委name
    }
    /* vmo.organizationId = $stateParams.typeid;//所属部门党委或街道党工委ID
     vmo.organizationName = $stateParams.typename;//所属部门党委或街道党工委name*/
    vmo.type = $stateParams.type;//党委党工委类型
    vmo.userid = appService.user.id;
    var roles = appService.user.JCDJ_User_roleID;
    if (roles === 68 || roles === 73 || (roles > 31 && roles < 44)) {
      vmo.GradeID = 7;
    } else if (roles === 67 || roles === 71 || (roles > 43 && roles < 62)) {
      vmo.GradeID = 6;
    }
    if (vmo.type === 2) {
      vmo.GradeID = 6;
    } else if (vmo.type === 3) {
      vmo.GradeID = 7;
    }
    console.log($stateParams);
    var organizationInfo = [
      {'organizationid': vmo.organizationId, 'organizationname': vmo.organizationName}
    ];
    //表数据
    vmo.tableData = [];
    //ui-grid 当前选择的行
    vmo.selectedRow = null;
    //打开模态框,返回模态框实例
    vmo._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/partyorganization/client/views/partyorganization-modal-form.client.view.html',
        controller: 'PartyorganizationModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };

    //增加数据
    vmo.add = function () {
      var modalInstance = vmo._openModal({
        PartyorganizationData: function () {
          //空数据
          return new PartyorganizationService();
        },
        //表明是增加
        method: function () {
          return '新增';
        },
        //当前组织的上级党组织
        organizationData: function () {
          return organizationInfo;
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.createUserId = vmo.userid;
        result.GradeID = vmo.GradeID;
        result.$save()
          .then(function (res) {
            refreshRecordCount(vmo.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党组织信息新增成功!'});
          })
          .catch(function (err) {
            $log.error('dj_PartyBranch add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党组织信息新增失败!'
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
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党组织信息删除成功!'});
        })
          .catch(function (err) {
            $log.error('dj_PartyBranch deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党组织信息删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vmo._updateorview = function (isupdate) {
      var modalInstance = vmo._openModal({
        PartyorganizationData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vmo.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        },
        //当前组织的上级党组织
        organizationData: function () {
          return organizationInfo;
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.modifyUserId = vmo.userid;
        if (isupdate) {
          result.$update()
            .then(function (res) {
              //修改表格显示的数据
              //angular.extend(vmo.selectedRow, res.data);
              refreshRecordCount(vmo.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党组织信息修改成功!'});
            })
            .catch(function (err) {
              $log.error('dj_PartyBranch update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                '党组织信息修改失败!'
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
        {field: 'OrganizationName', displayName: '党组织名称', width: 450},
        {field: 'OrganizationNum', displayName: '党员人数'},
        {field: 'Secretary', displayName: '书记'},
        {field: 'Head', displayName: '党务专干'},
        {field: 'TelNumber', displayName: '联系电话'},
        {field: 'Address', displayName: '联系地址'}/*,
        {field: 'createDate', displayName: '创建时间', cellFilter: 'date:\"yyyy-MM-dd HH:mm:ss\"'}*/
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
      cont: true,
      OrganizationId: vmo.OrganizationId,
      generalbranch: vmo.generalbranch,
      type: vmo.organizationId
    };
    //刷新记录总数
    refreshRecordCount(vmo.queryParam);
    //刷新记录总数
    function refreshRecordCount(queryParam) {
      PartyorganizationService.query(queryParam).$promise
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
        sum: true,
        limit: (pageNumber - 1) * pageSize,
        offset: pageNumber * pageSize,
        OrganizationId: vmo.OrganizationId,
        generalbranch: vmo.generalbranch,
        type: vmo.organizationId
      };
      //取后台数据，默认按创建时间降序排序
      return PartyorganizationService.query(pageParam).$promise
        .then(function (data) {
          vmo.gridOptions.data = vmo.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //统计
    vmo.tj = function () {
      $state.go('partyorganization.curd.chart');
    };
  }
}());
