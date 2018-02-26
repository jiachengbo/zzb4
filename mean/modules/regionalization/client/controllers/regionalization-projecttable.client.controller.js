(function () {
  'use strict';

  angular
    .module('regionalization')
    .controller('projectProjectController', projectProjectController);

  projectProjectController.$inject = ['$scope', 'Notification', '$log', '$window',
    'Upload', 'ProjectService', '$uibModal', 'baseCodeService', 'ProjectApprovalService', 'ProjectKnotService', 'appService'];
  function projectProjectController($scope, Notification, $log, $window,
                                    Upload, ProjectService, $uibModal, baseCodeService, ProjectApprovalService, ProjectKnotService, appService) {
    var vm = this;
    // 表数据
    vm.tableData = [];
    // ui-grid 当前选择的行
    vm.selectedRow = null;
    var branch = [];
    var generalBranch;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    vm.roleid = appService.user.JCDJ_User_roleID;
    //console.log(vm.roleid);
    angular.forEach(dj_JCDJ_UserRole, function (v, k) {
      if (vm.roleid === v.UserRoleID) {
        vm.super = v.departy;
      }
    });
    angular.forEach(dj_PartyBranch, function (v, k) {
      if (appService.user.branch === v.OrganizationId) {
        if (v.generalbranch) {
          generalBranch = v.generalbranch;
          angular.forEach(dj_PartyBranch, function (value, key) {
            if (v.generalbranch === value.generalbranch) {
              branch.push(value.OrganizationId);
            }
          });
        }
      }
    });
    // 打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/regionalization/client/views/project-modal-form.client.view.html',
        controller: 'ProjectModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };
    // 项目进展模态框
    vm._openProgressModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/regionalization/client/views/progress-modal-form.client.view.html',
        controller: 'ProgressModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };
    // 项目审核模态框
    vm._openApprovalModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/regionalization/client/views/projectapproval-modal-form.client.view.html',
        controller: 'ProjectApprovalModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };
    // 项目结项模态框
    vm._openknotModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/regionalization/client/views/projectknot-modal-form.client.view.html',
        controller: 'ProjectKnotModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg,
        size: 'lg'
      });
    };

    // 增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        projectData: function () {
          // 空数据
          return new ProjectService();
        },
        // 表明是增加
        method: function () {
          return '新增';
        }
      });
      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        Upload.upload({
          url: '/api/regionalization/project',
          data: result
        })
          .then(function (res) {
            // var data2 = [];
            // data2.push(res.data);
            // var data1 = getCommName(data2);
            // vm.gridOptions.data.push(new ProjectService(data1[0]));
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增项目成功!'});
          })
          .catch(function (err) {
            // $log.error('project add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 新增项目失败!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    // 删除数据
    vm.remove = function () {
      if ($window.confirm('你确定要删除吗?')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 项目删除成功!'});
        })
          .catch(function (err) {
            // $log.error('project deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 项目删除失败!'
            });
          });
      }
    };

    // 修改或查看数据
    vm._updateorview = function (isupdate) {
      if (vm.selectedRow.State === '实施中') {
        $window.confirm('该项目正在实施中不能修改！');
        return;
      } else if (vm.selectedRow.State === '未通过') {
        $window.confirm('该项目审核未通过不能修改！');
        return;
      } else if (vm.selectedRow.State === '结项') {
        $window.confirm('该项目已结项不能修改！');
        return;
      }
      var modalInstance = vm._openModal({
        projectData: function () {
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
            url: '/api/regionalization/project/' + result.ProjectId,
            data: result
          })
            .then(function (res) {
              //修改表格显示的数据
              var data3 = [];
              data3.push(res.data);
              var data2 = getCommName(data3);
              angular.extend(vm.selectedRow, data2[0]);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 项目修改成功!'});
            })
            .catch(function (err) {
              // $log.error('project update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                '项目修改失败!'
              });
            });
        }
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };
    // 查看数据
    vm._view = function () {
      var modalInstance = vm._openProgressModal({
        projectData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return '查看';
        }
      });
    };
    // 项目审核
    vm._approval = function () {
      if (vm.selectedRow.State === '实施中') {
        $window.confirm('该项目正在实施中无法审核！');
        return;
      } else if (vm.selectedRow.State === '未通过') {
        $window.confirm('该项目已审核过不能再次审核！\n未通过原因：' + vm.selectedRow.refuse + '');
        return;
      } else if (vm.selectedRow.State === '结项') {
        $window.confirm('该项目已结项不能审核！');
        return;
      }
      var modalInstance = vm._openApprovalModal({
        projectData: function () {
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return '审核';
        }
      });
      modalInstance.result.then(function (result) {
        var projectApprovalService = new ProjectApprovalService();
        projectApprovalService.ProjectId = result.ProjectId;
        projectApprovalService.approvedDepartment = result.approvedDepartment;
        projectApprovalService.ispast = result.ispast;
        projectApprovalService.refuse = result.refuse;
        projectApprovalService.State = result.State;
        projectApprovalService.ApprovedTime = new Date();
        // $log.log('modal ok:', result);
        projectApprovalService.$update()
          .then(function (res) {
            $log.info(res);
            //修改表格显示的数据
            var data3 = [];
            data3.push(res);
            var data2 = getCommName(data3);
            angular.extend(vm.selectedRow, data2[0]);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 项目审核成功!'});
          })
          .catch(function (err) {
            // $log.error('project update save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
              '项目审核失败!'
            });
          });
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };
    // 项目结项
    vm._knot = function () {
      var FinishTime = new Date(vm.selectedRow.FinishTime).getTime();
      var nowTime = new Date().getTime();
      // $log.info(finishTime);
      // $log.info(nowTime);
      if (vm.selectedRow.State === '待审核' || vm.selectedRow.State === '未通过') {
        $window.confirm('该项目未审核或审核未通过不能结项！');
        return;
      } else if (vm.selectedRow.State === '结项') {
        $window.confirm('该项目已结项！');
        return;
      }
      if (nowTime >= FinishTime) {
        $window.confirm('该项目拟完成时间已过无法结项！');
        return;
      }
      var modalInstance = vm._openknotModal({
        projectData: function () {
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return '结项';
        }
      });
      modalInstance.result.then(function (result) {
        var projectKnotService = new ProjectKnotService();
        projectKnotService.ProjectId = result.ProjectId;
        projectKnotService.isfinish = result.isfinish;
        projectKnotService.State = result.State;
        // $log.log('modal ok:', result);
        projectKnotService.$update()
          .then(function (res) {
            $log.info(res);
            //修改表格显示的数据
            var data3 = [];
            data3.push(res);
            var data2 = getCommName(data3);
            angular.extend(vm.selectedRow, data2[0]);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 项目结项成功!'});
          })
          .catch(function (err) {
            // $log.error('project update save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
              '项目结项失败!'
            });
          });
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };
    // 修改
    vm.update = function () {
      return vm._updateorview(true);
    };
    // 查看
    vm.view = function () {
      // return vm._updateorview(false);
      return vm._view();
    };
    // 审核
    vm.approval = function () {
      return vm._approval();
    };
    // 结项
    vm.knot = function () {
      return vm._knot();
    };

    // ui-gird 基本配置参数
    vm.gridOptions = {
      // 表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'rid', displayName: '序号', width: 80},
        {field: 'ProjectName', displayName: '项目名称', width: 200},
        {field: 'ProjectSummary', displayName: '项目简介', width: 400},
        {field: 'ProjectType', displayName: '项目类型'},
        {field: 'Source', displayName: '项目来源'},
        {field: 'Head', displayName: '负责人'},
        {field: 'SbTime', displayName: '上报时间', cellFilter: 'date:\"yyyy-MM-dd\"'},
        {field: 'FinishTime', displayName: '拟完成时间', cellFilter: 'date:\"yyyy-MM-dd\"'},
        {field: 'State', displayName: '状态'},
        // {field: 'communityName', displayName: '上报社区'},
        {field: 'People', displayName: '受益人数（单位：人）'},
        {field: 'company', displayName: '认领单位'}
      ],

      onRegisterApi: function (gridApi) {
        // 保存api调用对象
        vm.gridApi = gridApi;
        // 监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          // $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
          if (!vm.selectedRow.hasOwnProperty('isPhoneDJ')) {
            vm.iscanyu = false;
          } else {
            vm.iscanyu = true;
          }
          //console.log(row);
        });
        // 分页按钮事件
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          refreshPageData(newPage, pageSize);
        });
      },
      paginationPageSizes: [20], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      // 使用自定义翻页控制
      useExternalPagination: true,
      // 不允许表格左上角菜单
      enableGridMenu: false
    };
    //分页参数
    if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
      vm.queryParam = {
        cont: true,
        role: vm.roleid,
        super: vm.super,
        branch: branch,
        generalBranch: generalBranch
      };
    } else {
      vm.queryParam = {
        cont: true,
        role: vm.roleid,
        super: vm.super,
        generalBranch: generalBranch
      };
    }
    // 刷新记录总数
    if (vm.roleid === 25) {
      vm.showtab = false;
      vm.dataleiixn = '创建';
      vm.queryParam.leibie = vm.dataleiixn;
      console.log(vm.queryParam);
      refreshRecordCount(vm.queryParam);
    } else {
      vm.showtab = true;
    }
    //refreshRecordCount(vm.queryParam);
    // 刷新记录总数
    function refreshRecordCount(queryParam) {
      ProjectService.query(queryParam).$promise
        .then(function (result) {
          console.log(result);
          if (result.length > 0) {
            vm.gridOptions.totalItems = result[0].sum;
          } else {
            vm.gridOptions.totalItems = 0;
          }
        })
        .then(function () {
          refreshPageData(1, vm.gridOptions.paginationPageSize);
        })
        .catch(function (err) {
          $log.error('getCount error:', err);
        });
    }

    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      // 页面，记录数限制参数
      var pageParam;
      if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
        pageParam = {
          sum: true,
          role: vm.roleid,
          super: vm.super,
          branch: branch,
          leibie: vm.dataleiixn,
          generalBranch: generalBranch,
          limit: (pageNumber - 1) * pageSize,
          offset: pageNumber * pageSize
        };
      } else {
        pageParam = {
          sum: true,
          role: vm.roleid,
          super: vm.super,
          leibie: vm.dataleiixn,
          generalBranch: generalBranch,
          limit: (pageNumber - 1) * pageSize,
          offset: pageNumber * pageSize
        };
      }
      // 取后台数据，默认按创建时间降序排序
      return ProjectService.query(pageParam).$promise
        .then(function (data) {
          var projectData;
          // 获取所在党支部 ？
          if (data.length !== 0) {
            projectData = getCommName(data);
          } else {
            projectData = data;
          }
          // 序号列的处理
          if (data.length > 0) {
            for (var m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
            }
          }
          //console.log(projectData);
          vm.tableData = [];
          angular.forEach(projectData, function (v, k) {
            if (v.ProjectTable) {
              v.ProjectTable.rid = v.rid;
              vm.tableData.push(v.ProjectTable);
            } else {
              vm.tableData.push(v);
            }
          });
          vm.gridOptions.data = vm.tableData;
          return vm.tableData;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //获取对应的社区信息
    function getCommName(_data) {
      for (var i = 0; i < _data.length; i++) {
        if (_data[i].communityId !== 0) {
          var cvsList = baseCodeService.getItems('community');
          for (var j = 0; j < cvsList.length; j++) {
            var cmmid = parseInt(_data[i].communityId, 10);
            _data[i].communityId = cmmid;
            if (cvsList[j].id === cmmid) {
              _data[i].communityName = cvsList[j].name;
              break;
            } else {
              _data[i].communityName = '无';
            }
          }
        } else {
          _data[i].communityName = '无';
        }
      }
      return _data;
    }

    vm.alertMe = function (name) {
      vm.selectedRow = null;
      vm.dataleiixn = name;
      vm.queryParam.leibie = name;
      refreshRecordCount(vm.queryParam);
      // console.log(name);
    };
  }
}());
