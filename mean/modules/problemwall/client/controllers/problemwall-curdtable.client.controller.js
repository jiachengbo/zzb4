(function () {
  'use strict';

  angular
    .module('problemWall')
    .controller('ProblemWallCURDTableController', ProblemWallCURDTableController);

  ProblemWallCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window', 'uiGridConstants', 'ProblemWallService',
    '$uibModal', 'Upload', 'appService', 'baseCodeService', 'ProblemWallRecService', '$filter', 'Socket'];
  function ProblemWallCURDTableController($scope, Notification, $log, $window, uiGridConstants, ProblemWallService, $uibModal, Upload, appService, baseCodeService, ProblemWallRecService, $filter, Socket) {
    var vm = this;
    var i;
    var aUser = appService.user;
    var userGrade = aUser.user_grade;
    var userRoleID = aUser.JCDJ_User_roleID;
    var userBranch = aUser.branch;
    var orgbranch = [];
    // 用户角色 常量表
    vm.dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    // vm.showAdd = true;
    // 获取上级组织的id 1-30 31 32  _super
    var _super;
    var genersuper;
    if (userGrade === 1) {
      // vm.showAdd = false;
      _super = 32;
    } else if (userGrade === 3) {
      _super = 31; // 区委
    } else if (userGrade === 5 || userGrade === 4) {
      for (i = 0; i < vm.dj_PartyOrganization.length; i++) {
        if (vm.dj_PartyOrganization[i].roleID === userRoleID) {
          _super = vm.dj_PartyOrganization[i].typeID;
        }
      }
    } else if (userGrade === 7 || userGrade === 6) {
      _super = -1; // 党支部 下级上报的问题 默认 -1
    } else if (userGrade === 10 || userGrade === 9) {
      vm.branch = appService.user.branch;
      for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
        if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
          vm.objID = vm.dj_PartyBranch[x].generalbranch;
          angular.forEach(vm.dj_PartyBranch, function (value, key) {
            if (value.generalbranch === vm.objID) {
              orgbranch.push(value.OrganizationId);
            }
          });
          genersuper = vm.dj_PartyBranch[x].generalbranch;
        }
      }
    }


    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/problemwall/client/views/problemwall-modal-form.client.view.html',
        controller: 'ProblemWallModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //problemWall会传入modal的controller
        problemWallData: function () {
          //空数据
          var problemWallService = new ProblemWallService();
          return problemWallService;
        },
        problemWallRecData: function () {
          //空数据
          var problemWallRecData = [];
          return problemWallRecData;
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        vm.problemWallRecData = result.problemWallRecData;
        vm._sbs = result.sbs;
        vm._xfs = result.xfs;
        vm.sbsChecked = result.sbsChecked;
        vm.xfsChecked = result.xfsChecked;
        // 上级党组织
        if (userGrade === 1) {
          result.super = 0;
          result.pt = '区级平台';
        } else if (userGrade === 3 || userGrade === 2) {
          result.super = 32; // 区委
          result.pt = '区级平台';
        } else if (userGrade === 5 || userGrade === 4) {
          result.super = 32;
           //党工委
          for (i = 0; i < vm.dj_JCDJ_UserRole.length; i++) {
            if (vm.dj_JCDJ_UserRole[i].UserRoleID === userRoleID) {
              result.streetID = vm.dj_JCDJ_UserRole[i].streetID;
            }
          }
          result.pt = '街道平台';
        } else if (userGrade > 5) {
          result.pt = '社区平台';
          // 党支部 社区 1-30 反查党支部常量表
          for (i = 0; i < vm.dj_PartyBranch.length; i++) {
            if (vm.dj_PartyBranch[i].OrganizationId === userBranch) {
              var generalbranch = vm.dj_PartyBranch[i].generalbranch;
              if (generalbranch === null) {
                result.genersuper = -1;
              } else if (generalbranch > 0) {
                result.genersuper = generalbranch;
              } else {
                result.genersuper = -1;
              }
              result.super = vm.dj_PartyBranch[i].super;
              result.streetID = vm.dj_PartyBranch[i].streetID;
              result.communityId = vm.dj_PartyBranch[i].communityId;
              result.gridId = vm.dj_PartyBranch[i].BelongGrid;
            }
          }
        }
        Upload.upload({
          url: '/api/problemWall',
          data: result
        })
          .then(function (res) {
            // console.info('插入wtId ', res.data);
            //  插入成功以后的问题Id
            //空数据

            var problemWallRecService = new ProblemWallRecService();
            problemWallRecService.wtId = res.data;
            // console.log(vm.problemWallRecData);
            var queryParams1 = {
              wtId: res.data,
              problemWallRecData: JSON.stringify(vm.problemWallRecData),
              sbs: vm._sbs,
              xfs: vm._xfs,
              method: '1'
            };
            // console.log(queryParams);
            ProblemWallRecService.query(queryParams1).$promise.then(function (data) {
              // console.info('插入问题id 成功 ', data);
            });
          })
          .then(function (res) {

            vm.problewalldata = {
              sb: vm.sbsChecked,
              xf: vm.xfsChecked
            };
            Socket.emit('problewall', {problewalldata: vm.problewalldata});
            refreshRecordCount(vm.queryParam);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!'});
            // $log.log('问题墙:', '新增问题成功');
          })
          .catch(function (err) {
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
    //添加上报 新增数据2017-12-13 unused
    vm.addInfo = function (res) {
      //将修改的内容传过来，获取标题内容，图片
      var result = new ProblemWallService();
      result.wtTitle = res.wtTitle;
      result.wtContent = res.wtContent;
      // result.wtContent = res.wtContent;
      result.photoPath1 = res.photoPath1;
      result.photoPath2 = res.photoPath2;
      // 上级党组织
      if (userGrade === 1) {
        result.super = 0;
        result.pt = '区级平台';
      } else if (userGrade === 3 || userGrade === 2) {
        result.super = 32; // 区委
        result.pt = '区级平台';
      } else if (userGrade === 4) {
        result.super = 32; // 区委
      } else if (userGrade === 5) {
        console.log('就是这。。。。。。。。。。。');
        result.super = 32; // 区委
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
        result.pt = '街道平台';
      } else if (userGrade > 5) {
        result.pt = '社区平台';
        // 党支部 社区 1-30 反查党支部常量表
        for (i = 0; i < vm.dj_PartyBranch.length; i++) {
          if (vm.dj_PartyBranch[i].OrganizationId === userBranch) {
            var generalbranch = vm.dj_PartyBranch[i].generalbranch;
            if (generalbranch === null) {
              result.genersuper = -1;
            } else if (generalbranch > 0) {
              result.genersuper = generalbranch;
            } else {
              result.genersuper = -1;
            }
            result.super = vm.dj_PartyBranch[i].super;
            result.streetID = vm.dj_PartyBranch[i].streetID;
            result.communityId = vm.dj_PartyBranch[i].communityId;
            result.gridId = vm.dj_PartyBranch[i].BelongGrid;
          }
        }
      }
      // console.info('227', result);
      result.issb = 1;
      Upload.upload({
        url: '/api/problemWall',
        data: result
      })
        .then(function (res) {
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上报成功!'});
        })
        .catch(function (err) {
          $log.error('problemWall add save error:', err.data.message);
          Notification.error({
            message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
            ' 上报失败!'
          });
        });
    };

    //删除数据
    vm.remove = function () {
      var id = vm.selectedRow.id;
      if ($window.confirm('确实删除?')) {
        var deleteParams = {
          problemWallRecId: id
        };
        ProblemWallRecService.query(deleteParams).$promise.then(function () {
          refreshRecordCount(vm.queryParam);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            $log.error('problemWallRec deleted error:', err.data.message);
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
        problemWallData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        }
      });

      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        // $log.log('修改 problemWallRecData:', result.problemWallRecData);
        if (isupdate) {
          vm.problemWallRecData = [];
          vm.problemWallRecData = result.problemWallRecData;
          vm.sbs = result.sbs;
          vm.xfs = result.xfs;
          vm.delRec = result.delRec;
          // vm.delSbRec = result.delSbRec;
          // vm.delXfRec = result.delXfRec;
          // console.info('vm.delRec', JSON.stringify(vm.delRec));

          // console.info('vm.delXfRec', vm.delXfRec);
          // result.$update()
          Upload.upload({
            url: '/api/problemWall/' + result.wtId,
            data: result
          })
            .then(function () {
              //  插入修改 上报下发问题 Id
              var queryParams = {
                wtId: result.wtId,
                problemWallRecData: JSON.stringify(vm.problemWallRecData),
                sbs: vm.sbs,
                xfs: vm.xfs,
                method: '2'
              };
              // console.log(queryParams);
              ProblemWallRecService.query(queryParams).$promise.then(function (data) {
                // console.info('修改 插入关系表 成功 ', data);
              });

            })
            .then(function () {
              //  删除 取消 上报下发对象
              if (vm.delRec !== [] && vm.delRec !== undefined && vm.delRec !== null) {
                // console.info('vm.delRec=*=', vm.delRec);
                var queryParamsk = {
                  wtId: result.wtId,
                  delRec: JSON.stringify(vm.delRec),
                  method: '3'
                };
                ProblemWallRecService.query(queryParamsk).$promise.then(function (data) {
                  // console.info('删除成功 ', data);
                  vm.delRec = [];
                });
              }
            })
            .then(function (res) {
              refreshRecordCount(vm.queryParam);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              $log.error('problemWall update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                ' 修改失败!'
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
        {field: 'ProblemWall.wtTitle', displayName: '问题标题', width: 400},
        {field: 'ProblemWall.wtContent', displayName: '问题内容'},
        {field: 'createUserName', displayName: '党组织', width: 200},
        // {field: 'superName', displayName: '上报党组织', width: 200},
        // {field: 'hasHf', displayName: '是否已回复', width: 100},
        {field: 'ProblemWall.pt', displayName: '处理平台', width: 100},
        {field: 'createDate', displayName: '创建时间', width: 200}
        // {field: 'issbStr', displayName: '是否已经再次上报', width: 140}
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
//分页3参数
    if (userGrade === 10) {
      vm.queryParam = {
        cont: true,
        genersuper: genersuper,
        orgbranch: orgbranch
      };
    } else if (userGrade === 9) {
      vm.queryParam = {
        cont: true,
        genersuper: genersuper,
        orgbranch: orgbranch
      };
    } else {
      vm.queryParam = {
        cont: true,
        _super: _super
      };
    }
    //分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    var genearBranch = [];
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    angular.forEach(vm.dj_PartyBranch, function (v, k) {
      if (v.generalbranch) {
        genearBranch.push(v.OrganizationId);
      }
    });
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam;
      if (userGrade === 10) {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageSize,
          genersuper: genersuper,
          orgbranch: orgbranch
        };
      } else if (userGrade === 9) {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageSize,
          genersuper: genersuper,
          orgbranch: orgbranch
        };
      } else {
        pageParam = {
          sum: true,
          limit: (pageNumber - 1) * pageSize,
          offset: pageSize,
          _super: _super
        };
      }
      //取后台数据，默认按创建时间降序排序
      return ProblemWallService.query(pageParam).$promise
        .then(function (data) {
          //序号
          if (data.length > 0) {
            for (var m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
              data[m].createDate = $filter('date')(new Date(data[m].createDate).setHours(new Date(data[m].createDate).getHours() - 8), 'yyyy-MM-dd HH:mm:ss');

              /*              var issb = data[m].issb;
               if (issb === 1) {
               if (userGrade === data[m].gradeId) {
               data[m].issbStr = '已再次上报';
               } else {
               data[m].issbStr = '已再次上报';
               }
               } else {
               data[m].issbStr = '未再次上报';
               }*/
              /*
               // 添加是否已回复
               if (data[m].hfContent !== '' && data[m].hfContent !== null) {
               data[m].hasHf = '已回复';
               } else {
               data[m].hasHf = '未回复';
               }*/
              /*
               // 上级党组织 名称
               if (data[m].super === 32) {
               data[m].superName = '区委';
               } else if (data[m].super === 31) {
               data[m].superName = '党工委';
               } else if (data[m].super < 31) {

               if (data[m].genersuper > 0 && data[m].gradeId !== 10) {
               for (var rr = 0; rr < dj_PartyGeneralBranch.length; rr++) {
               if (dj_PartyGeneralBranch[rr].branchID === data[m].genersuper) {
               data[m].superName = dj_PartyGeneralBranch[rr].simpleName;
               }
               }
               // angular.forEach(dj_PartyGeneralBranch, function (value, key) {
               //   if (value.branchID === data[m].genersuper) {
               //     data[m].superName = value.simpleName;
               //   }
               // });
               } else {
               for (var tt = 0; tt < vm.dj_PartyOrganization.length; tt ++) {
               if (vm.dj_PartyOrganization[tt].typeID === data[m].super) {
               data[m].superName = vm.dj_PartyOrganization[tt].typeName;
               }
               }
               // angular.forEach(vm.dj_PartyOrganization, function (values, keys) {
               //   if (values.typeID === data[m].super) {
               //     data[m].superName = values.typeName;
               //   }
               // });
               }
               }*/
            }
          }
          // console.info('474', data);
          vm.gridOptions.data = vm.tableData = data;
          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      ProblemWallService.query(queryParam).$promise
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

    /*
     //取后台ProblemWall表所有数据
     ProblemWallService.query().$promise.then(function(data) {
     vm.gridOptions.data = vm.tableData = data;
     });*/
  }
}());
