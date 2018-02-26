(function () {
  'use strict';

  angular
    .module('survey')
    .controller('SurveyCURDTableController', SurveyCURDTableController);

  SurveyCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'SurveyService',
    '$uibModal', 'Upload', 'appService', 'UserMsg'];
  function SurveyCURDTableController($scope, Notification, $log, $window,
                                       uiGridConstants, SurveyService, $uibModal, Upload, appService, UserMsg) {
    var vm = this;
    //表数据
    UserMsg.func();
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function(resarg) {
      return $uibModal.open({
        templateUrl: '/modules/survey/client/views/survey-modal-form.client.view.html',
        controller: 'SurveyModalFormController',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function() {
      var modalInstance = vm._openModal({
        //survey会传入modal的controller
        surveyData: function() {
          //空数据
          return new SurveyService();
        },
        //表明是增加
        method: function() {
          return '新增';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function(result) {
        $log.log('modal ok:', result);
        Upload.upload({
          url: '/api/survey',
          data: result
        })
          .then(function(res) {
            vm.gridOptions.data.push(res.data);
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!' });
          })
          .catch(function(err) {
            $log.error('survey 新增 save error:', err.data.message);
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 新增出错!' });
          });
      })
      .catch(function(reason) {
        $log.log('Modal dismissed:', reason);
      });
    };

    //删除数据
    vm.remove = function() {
      if ($window.confirm('确认删除此条信息吗？')) {
        vm.selectedRow.$remove(function() {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!' });
        })
        .catch(function(err) {
          $log.error('survey deleted error:', err.data.message);
          Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
          ' 删除失败!' });
        });
      }
    };

    //修改或查看数据
    vm._updateorview = function(isupdate) {
      var modalInstance = vm._openModal({
        surveyData: function() {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function() {
          return isupdate ? '修改' : '查看';
        }
      });
      modalInstance.result.then(function(result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          Upload.upload({
            url: '/api/survey/' + result.id,
            data: result
          })
            .then(function(res) {
              //修改表格显示的数据
              angular.extend(vm.selectedRow, res.data);
              console.log(vm.selectedRow);
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!' });
            })
            .catch(function(err) {
              $log.error('survey 修改 save error:', err.data.message);
              Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
              '修改失败!' });
            });
        }
      }).catch(function(reason) {
        $log.log('Modal dismissed:', reason);
      });
    };

    //修改
    vm.update = function() {
      return vm._updateorview(true);
    };
    //查看
    vm.view = function() {
      return vm._updateorview(false);
    };

    //ui-gird 基本配置参数
    vm.gridOptions = {
      //表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'content', displayName: '概况', width: '80%'},
        {field: 'creatdate', displayName: '创建时间', width: '20%', cellFilter: 'date:\"yyyy-MM-dd HH:mm:ss\"'}/*,
        {field: 'User.displayName', displayName: 'UserDisplayName'}*/
      ],

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
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
    var surerobj = {};
    if (UserMsg.gradeId < 4) {
      surerobj.objid = UserMsg.gradeId;
    } else {
      surerobj.objid = UserMsg.objId;
    }
    surerobj.grade = UserMsg.gradeId;

    //取后台Survey表所有数据
    SurveyService.query(surerobj).$promise.then(function(data) {
      vm.gridOptions.data = vm.tableData = data;
    });
  }
}());
