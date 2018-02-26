(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartymemberMainController', PartymemberMainController);

  PartymemberMainController.$inject = ['$scope', '$log', '$state', '$uibModal', '$stateParams', '$window', 'PartymemberService', 'Notification', 'appService', 'baseCodeService', 'SearchService'];
  function PartymemberMainController($scope, $log, $state, $uibModal, $stateParams, $window, PartymemberService, Notification, appService, baseCodeService, SearchService) {
    var vmo = this;
    var orgInfo;
    vmo.superss;
    //获取参数
    var storage = $window.localStorage.getItem('Orgtj');
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vmo.orgid = 1;
    var partyorg = baseCodeService.getItems('dj_PartyOrganization');
    vmo.dj_PartyOrganization = [];
    vmo.searchPartyMeber = function (key) {
      PartymemberService.query({key2: key, workbranch: vmo.orgid}).$promise.then(function (data) {
        vmo.gridOptions.totalItems = data.length;
        vmo.gridOptions.data = vmo.tableData = data;
      });
    };
    var storagedata = JSON.parse(storage);
    if (storage === '{}') {
      vmo.branch = $stateParams.tj.OrganizationId;//所属支部ID
      vmo.zbName = $stateParams.tj.OrganizationName;//所属支部名称
      orgInfo = $stateParams.orgInfo;//所属组织名称、ID
    } else {
      vmo.branch = storagedata.OrganizationId;//所属支部ID
      vmo.zbName = storagedata.OrganizationName;//所属支部名称
      orgInfo = storagedata.orgInfo;//所属组织名称、ID
    }
    /*vmo.branch = $stateParams.tj.OrganizationId;//所属支部ID
     vmo.zbName = $stateParams.tj.OrganizationName;//所属支部名称
     var orgInfo = $stateParams.orgInfo;//所属组织名称、ID*/
    angular.forEach(dj_PartyBranch, function (v, k) {
      if (v.OrganizationId === vmo.branch) {
        vmo.superss = v.super;
      }
    });
    partyorg.forEach(function (v, k) {
      if (v.typeID === vmo.superss) {
        vmo.dj_PartyOrganization.push(v);
      }
    });
    vmo.orgid = vmo.superss;
    vmo.userid = appService.user.id;
    var branchInfo = [
      {'branchid': vmo.branch, 'branchname': vmo.zbName}
    ];
    //表数据
    vmo.tableData = [];
    //{title: '我的标题', content: '内容', starttime: '2017-09-26', address: '地址'}
    //ui-grid 当前选择的行
    vmo.selectedRow = null;
    //打开模态框,返回模态框实例
    vmo._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/partymember/client/views/partymember-modal-form.client.view.html',
        controller: 'PartyMemberModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };

    //增加数据
    vmo.add = function () {
      var modalInstance = vmo._openModal({
        PartyMemberData: function () {
          //空数据
          return new PartymemberService();
        },
        //表明是增加
        method: function () {
          return '新增';
        },
        //当前登录用户所属党组织
        orgData: function () {
          return orgInfo;
        },
        //当前登录用户所属党支部
        branchData: function () {
          return branchInfo;
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.createUserId = vmo.userid;
        result.$save()
          .then(function (res) {
            refreshRecordCount(vmo.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员信息新增成功!'});
          })
          .catch(function (err) {
            $log.error('dj_PartyMember add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党员信息新增失败!'
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
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员信息删除成功!'});
        })
          .catch(function (err) {
            $log.error('dj_PartyMember deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 党员信息删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vmo._updateorview = function (isupdate) {
      var modalInstance = vmo._openModal({
        PartyMemberData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vmo.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        },
        //当前登录用户所属党组织
        orgData: function () {
          return orgInfo;
        },
        //当前登录用户所属党支部
        branchData: function () {
          return branchInfo;
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
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 党员信息修改成功!'});
            })
            .catch(function (err) {
              $log.error('dj_PartyMember update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                '党员信息修改失败!'
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
        {field: 'PartyName', displayName: '姓名'},
        {field: 'PartySex', displayName: '性别'},
        {field: 'PartyNation', displayName: '民族'},
        {field: 'IDNumber', displayName: '身份证号'},
        {field: 'WorkPlace', displayName: '工作单位'},
        {field: 'TelNumber', displayName: '联系电话'},
        {field: 'preson_category', displayName: '党员类别'},
        {field: 'dj_PartyBranch.simpleName', displayName: '所属党支部'},
        {field: 'sections', displayName: '认领单位（报到社区）'}/*,
         {field: 'createDate', displayName: '创建时间', cellFilter: 'date:\"yyyy-MM-dd\"'}*/
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
      /*partymemberId: 0,*/
      cont: true,
      workbranch: vmo.superss,
      type: vmo.branch
    };
    //刷新记录总数
    refreshRecordCount(vmo.queryParam);
    //刷新记录总数
    function refreshRecordCount(queryParam) {
      PartymemberService.query(queryParam).$promise
        .then(function (result) {
          vmo.gridOptions.totalItems = result[0].sum;
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
        /*partymemberId: 0,*/
        sum: true,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
        workbranch: vmo.superss,
        type: vmo.branch
      };
      //取后台数据，默认按创建时间降序排序
      return PartymemberService.query(pageParam).$promise
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
      $state.go('partymember.curd.chart');
    };
  }
}());
