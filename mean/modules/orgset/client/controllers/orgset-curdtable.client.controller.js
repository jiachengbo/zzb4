(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('OrgsetCURDTableController', OrgsetCURDTableController);

  OrgsetCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'OrgsetService', '$uibModal', '$stateParams', 'baseCodeService', 'Upload', 'appService', 'OrgtableService', '$timeout'];
  function OrgsetCURDTableController($scope, Notification, $log, $window, uiGridConstants, OrgsetService, $uibModal, $stateParams, baseCodeService, Upload, appService, OrgtableService, $timeout) {
    var vm = this;
    var m;
    var user_grade;
    var branch;
    vm.commName;
    vm.streetName;
    vm.commNames;
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    if (appService.user) {
      user_grade = appService.user.user_grade;
      branch = appService.user.branch;
    }
    vm.orgId = $stateParams.orgId;
    console.log(vm.orgId);
    var obj = {};
    vm.communityname = baseCodeService.getItems('community');
    vm.street = baseCodeService.getItems('street_info');
    angular.forEach(vm.street, function (value, key) {
      if (value.streetID === vm.orgId - 3) {
        obj.communityId = '0';
        obj.communityName = value.streetName;
      }
    });
    var communityname;
    if (user_grade === 7 || user_grade === 10) {
      communityname = [];
      angular.forEach(vm.dj_PartyBranch, function (values, key) {
        if (values.OrganizationId === branch) {
          vm.commName = values.communityId;
          vm.streetName = values.streetID;
        }
      });
    } else {
      communityname = [obj];
    }
    $timeout(function () {
      if (user_grade) {
        if (user_grade > 5) {
          $scope.shows = false;
          vm.title = vm.commNames + '党建联合会';
        } else {
          $scope.shows = true;
          vm.title = $stateParams.title;
        }
      }
      if (vm.orgId < 4) {
        $scope.shows = false;
      }
    }, 200);
    if (user_grade === 7 || user_grade === 10) {
      angular.forEach(vm.communityname, function (v, k) {
        if (v.streetID === vm.streetName && v.communityId === vm.commName) {
          communityname.push(v);
          vm.commNames = v.communityName;
        }
      });
    } else {
      for (var s = 0; s < vm.communityname.length; s++) {
        if (vm.communityname[s].streetID === vm.orgId - 3) {
          communityname.push(vm.communityname[s]);
        }
      }
    }

    $scope.communityname = communityname;
    vm.datashuju = (user_grade === 7 || user_grade === 10) ? vm.commName : '0';

    // 获取组织机构常量表，根据对应关系，页面列表展示不同的数据
    var cvs_org = baseCodeService.getItems('OrgTable');
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/orgset/client/views/orgset-modal-form.client.view.html',
        controller: 'OrgsetModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: angular.extend({
          //列定义
          columnDefs: function () {
            //去掉前两列：id
            return vm.gridOptions.columnDefs.slice(0);
          }
        }, resarg)
      });
    };
//----------------------人员新增模态框--------------
    //打开人员新增 模态框,返回模态框实例
    vm._openworkModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/orgset/client/views/workzhize-modal-form.client.view.html',
        controller: 'workzhizeController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    //打开人员列表 模态框,返回模态框实例
    vm._openPersonListModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/orgset/client/views/orgpersonlist-modal-form.client.view.html',
        controller: 'OrgpersonListModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    //打开街道文员表-人员列表 模态框,返回模态框实例
    vm._openStreetPersonListModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/orgset/client/views/committeelist-modal-form.client.view.html',
        controller: 'CommitteeListModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };

    //--------------------------------------
    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //orgset会传入modal的controller
        orgsetData: function () {
          //空数据
          var orgsetservice = new OrgsetService();
          orgsetservice.orgId = vm.orgId;
          orgsetservice.community = vm.datashuju;
          return orgsetservice;
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        // result.$save()
        Upload.upload({
          url: '/api/orgset',
          data: result
        })
          .then(function (res) {
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            $log.error('orgset add save error:', err.data.message);
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
//    工作职责
    vm.work = function () {
      var modalInstance = vm._openworkModal({
        //orgset会传入modal的controller
        orgtableData: function () {
          //空数据
          var orgtableService;
          if (vm.datashuju === '0') {
            orgtableService = new OrgtableService();
            orgtableService.orgId = vm.orgId;
          } else {
            orgtableService = new OrgtableService();
            orgtableService.Street = vm.orgId - 3;
            orgtableService.community = vm.datashuju;
          }
          return orgtableService;
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.$save()
          .then(function (res) {
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
          })
          .catch(function (err) {
            $log.error('orgset add save error:', err.data);
            Notification.error({
              message: err.data, title: '<i class="glyphicon glyphicon-remove"></i>' +
              '新增失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };
//--------------------------------人员新增-----------------
    // 获取组织人员列表
    vm.viewPerson = function () {
      var orgId = vm.orgId;
      var obj = {};
      var modalInstance;
      if (orgId <= 3) {
        // 区级
        modalInstance = vm._openPersonListModal({
          //orgId 传入 model
          orgIdData: function () {
            orgId = vm.orgId;
            return orgId;
          }
        });
      } else if (orgId > 3 && orgId <= 12) {
        modalInstance = vm._openStreetPersonListModal({
          //orgId 传入 model
          Street: function () {
            obj.orgId = vm.orgId - 3;
            obj.community = vm.datashuju;
            return obj;
          }
        });
      }
    };
//--------------------------------人员新增-----------------
    //删除数据
    vm.remove = function () {
      if ($window.confirm('确定删除?')) {
        vm.selectedRow.$remove(function () {
          refreshRecordCount(vm.queryParam);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            // $log.error('orgset deleted error:', err.data.message);
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
        orgsetData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        }
      });
      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        result.community = result.community || vm.datashuju;
        if (isupdate) {
          Upload.upload({
            url: '/api/orgset/' + result.id,
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
        {field: 'rid', displayName: '编号', width: 80},
        // {field: 'orgId', displayName: '领导机构'},
        {field: 'orgName', displayName: '领导机构', width: 280},
        // {field: 'OrgTable.orgName', displayName: '领导机构', width: 280},
        {field: 'duty', displayName: '标题'},
        {field: 'quest', displayName: '内容'},
        {field: 'createTime', displayName: '会议召开时间', width: 180, cellFilter: 'date: "yyyy-MM-dd HH:mm:ss"'}

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
          refreshPageData(newPage, pageSize, vm.datashuju);
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
    //取后台Appeal表所有数据
    //分页3参数
    vm.showchange = function (num) {
      vm.queryParam = {
        cont: true,
        street: vm.orgId - 3,
        orgId: vm.orgId,
        community: num
      };
      refreshRecordCount(vm.queryParam);
    };
    if (vm.orgId > 3) {
      vm.queryParam = {
        cont: true,
        street: vm.orgId - 3,
        orgId: vm.orgId,
        community: vm.datashuju
      };
    } else {
      vm.queryParam = {
        cont: true,
        orgId: vm.orgId
      };
    }
    console.log(vm.orgId);
    //分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    function refreshPageData(pageNumber, pageSize, comm) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam;
      if (vm.orgId > 3) {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageNumber * pageSize,
          street: vm.orgId - 3,
          orgId: vm.orgId,
          community: comm
        };
      } else {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageNumber * pageSize,
          orgId: vm.orgId
        };
      }
      //取后台数据，默认按创建时间降序排序
      return OrgsetService.query(pageParam).$promise
        .then(function (data) {
          //序号列的处理
          if (data.length > 0) {
            for (m = 0; m < data.length; m++) {
              // 编号
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              // 机构orgId --> orgName
              for (var n = 0; n < cvs_org.length; n++) {
                if (cvs_org[n].orgId === data[m].orgId) {
                  data[m].orgName = cvs_org[n].orgName;
                  break;
                }
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
      OrgsetService.query(queryParam).$promise
        .then(function (result) {
          vm.gridOptions.totalItems = result[0].sum;
        })
        .then(function () {
          refreshPageData(1, vm.gridOptions.paginationPageSize, queryParam.community);
        })
        .catch(function (err) {
          $log.error('getCount error:', err);
        });
    }

    /*
     //取后台Orgset表所有数据
     OrgsetService.query({orgId: vm.orgId}).$promise.then(function (data) {
     // $log.log('data ', data);
     vm.gridOptions.data = vm.tableData = data;
     });*/

  }
}());
