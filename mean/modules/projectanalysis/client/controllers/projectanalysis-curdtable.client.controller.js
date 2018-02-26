(function () {
  'use strict';

  angular
    .module('projectAnalysis')
    .controller('ProjectAnalysisCURDTableController', ProjectAnalysisCURDTableController);

  ProjectAnalysisCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'ProjectAnalysisService',
    '$uibModal'];
  function ProjectAnalysisCURDTableController($scope, Notification, $log, $window,
                                              uiGridConstants, ProjectAnalysisService, $uibModal) {
    var vm = this;
    var m;
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/projectanalysis/client/views/projectanalysis-modal-form.client.view.html',
        controller: 'ProjectAnalysisModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: angular.extend({
          columnDefs: function () {
            //去掉前1列：id
            return vm.gridOptions.columnDefs.slice(1);
          }
        }, resarg)
      });
    };

    //增加数据
    vm.add = function () {
      var modalInstance = vm._openModal({
        //projectAnalysis会传入modal的controller
        projectAnalysisData: function () {
          //空数据
          return new ProjectAnalysisService();
        },
        //表明是增加
        method: function () {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        result.$save()
          .then(function (res) {
            // vm.gridOptions.data.push(res);
            //-----------------分页1：新增后， 刷新记录总数---------------
            refreshRecordCount(vm.queryParam);

            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> projectAnalysis add saved successfully!'});
          })
          .catch(function (err) {
            // $log.error('projectAnalysis add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' projectAnalysis add save error!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('确定删除?')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          // vm.tableData.splice(rowindex, 1);
          //-----------------分页1：新增后， 刷新记录总数---------------
          refreshRecordCount(vm.queryParam);

          //复位当前行
          // vm.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!'});
        })
          .catch(function (err) {
            // $log.error('projectAnalysis deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              '删除失败!'
            });
          });
      }
    };

    //修改或查看数据
    vm._updateorview = function (isupdate) {
      var modalInstance = vm._openModal({
        projectAnalysisData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? '修改' : '查看';
        }
      });

      modalInstance.result.then(function (result) {
        // $log.log('modal ok:', result);
        if (isupdate) {
          result.$update()
            .then(function (res) {
              //修改表格显示的数据
              // angular.extend(vm.selectedRow, res);
              //-----------------分页1：新增后， 刷新记录总数---------------
              refreshRecordCount(vm.queryParam);

              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!'});
            })
            .catch(function (err) {
              // $log.error('projectAnalysis update save error:', err.data.message);
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
      rowHeight: 100,
      data: vm.tableData,
      columnDefs: [
        // {field: 'ProjectId', displayName: '项目id'},
        {field: 'rid', displayName: '序号', width: 80, cellClass: 'text-center'},
        {field: 'ProjectName', displayName: '项目名称'},
        {field: 'Report', displayName: '上报部门'},
        {field: 'ProjectType', displayName: '项目类型'},
        {field: 'Source', displayName: '项目来源'},
        {field: 'SbTime', displayName: '申报时间'},
        {field: 'FinishTime', displayName: '拟完成时间'},
        {
          field: 'ProjectLogo',
          displayName: '项目logo',
          width: 200,
          enableCellEdit: true,
          // cellClass: 'text-center',
          cellTemplate: '<img width=\"200px\" height=\"100px\" style=\"margin-top: 5px;margin-left: 5px\" src=\"{{grid.getCellValue(row, col)}}\">'
        },
        {field: 'State', displayName: '项目状态', cellClass: 'text-center'}
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

    //取后台ProjectAnalysis表所有数据
    /* ProjectAnalysisService.query().$promise.then(function (data) {
     vm.gridOptions.data = vm.tableData = data;
     });*/
    vm.PartyBranchID = null;
    //分页3参数
    vm.queryParam = {
      projectManagerId: 0,
      limit: 0,
      offset: 0,
      PartyBranchID: vm.PartyBranchID
    };
    //分页4： 刷新记录总数
    refreshRecordCount(vm.queryParam);
    //刷新页面数据
    function refreshPageData(pageNumber, pageSize) {
      vm.gridOptions.paginationCurrentPage = pageNumber;//当前页码
      //页面，记录数限制参数
      var pageParam = {
        projectManagerId: 0,
        limit: (pageNumber - 1) * pageSize,
        offset: pageNumber * pageSize,
        PartyBranchID: vm.PartyBranchID
      };
      //取后台数据，默认按创建时间降序排序
      return ProjectAnalysisService.query(pageParam).$promise
        .then(function (data) {
          //序号列的处理
          if (data.length > 0) {
            for (m = 0; m < data.length; m++) {
              data[m].rid = m + 1 + (pageNumber - 1) * pageSize;
            }
          }
          vm.gridOptions.data = vm.tableData = data;
          // 1.添加 图形数据 柱状图
          vm.options1 = {
            chart: {
              type: 'multiBarChart',
              height: 400,
              margin: {
                top: 20,
                right: 20,
                bottom: 45,
                left: 50
              },
              legend: {
                margin: {
                  top: 10,
                  right: 0,
                  bottom: 0,
                  left: 10
                }
              },
              clipEdge: true,
              duration: 3000,
              stacked: false,
              xAxis: {
                axisLabel: '',
                showMaxMin: false
              },
              yAxis: {
                axisLabel: '',
                axisLabelDistance: 0
              }
            }
          };
// 2数据绑定
          var dataValuesCase = [];
          var dataValuesInfo = [];
          var pieChartdata = [];
          for (m = 0; m < data.length; m++) {
            var caseSum = {x: data[m].ProjectName, y: data[m].People, label: data[m].ProjectName};
            var infoSum = {x: data[m].ProjectName, y: data[m].People, label: data[m].ProjectName};
            var pieSum = {key: data[m].ProjectName, y: data[m].People};
            dataValuesCase.push(caseSum);
            dataValuesInfo.push(infoSum);
            pieChartdata.push(pieSum);
          }
          //
          vm.data1 = [
            {
              key: '案件总数',
              values: dataValuesCase
            }, {
              key: '信息总数',
              values: dataValuesInfo
            }
          ];
//  ---------pieChart--饼状图-------
          vm.options2 = {
            chart: {
              type: 'pieChart',
              height: 400,
              width: 400,
              x: function (d) {
                return d.key;
              },
              y: function (d) {
                return d.y;
              },
              showLabels: true,
              duration: 3000,
              labelThreshold: 0.01,
              labelSunbeamLayout: true,
              legend: {
                margin: {
                  top: 5,
                  right: 35,
                  bottom: 5,
                  left: 0
                }
              }
            }
          };
          vm.data2 = pieChartdata;

          return data;
        })
        .catch(function (err) {
          $log.error('query error:', err);
        });
    }

    //刷新记录总数
    function refreshRecordCount(queryParam) {
      ProjectAnalysisService.query(queryParam).$promise
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
