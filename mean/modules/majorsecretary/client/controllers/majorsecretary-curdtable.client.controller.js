(function () {
  'use strict';

  angular
    .module('majorsecretary')
    .controller('MajorsecretaryCURDTableController', MajorsecretaryCURDTableController);

  MajorsecretaryCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'UserMsg', 'MajorsecretaryService', '$uibModal', 'Upload'];
  function MajorsecretaryCURDTableController($scope, Notification, $log, $window,
                                             UserMsg, MajorsecretaryService, $uibModal, Upload) {
    var vm = this;
    UserMsg.func();
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;

    //打开模态框,返回模态框实例
    vm._openModal = function(resarg) {
      return $uibModal.open({
        templateUrl: '/modules/majorsecretary/client/views/majorsecretary-modal-form.client.view.html',
        controller: 'MajorsecretaryModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg
      });
    };

    //增加数据
    vm.add = function() {
      var modalInstance = vm._openModal({
        //majorsecretary会传入modal的controller
        majorsecretaryData: function() {
          //空数据
          return new MajorsecretaryService();
        },
        //表明是增加
        method: function() {
          return 'add';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function(result) {
      //   $log.log('modal ok:', result);
      //   result.$save()
      //     .then(function(res) {
      //       vm.gridOptions.data.push(res);
      //       Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> majorsecretary add saved successfully!' });
      //     })
      //     .catch(function(err) {
      //       $log.error('majorsecretary add save error:', err.data.message);
      //       Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
      //         ' majorsecretary add save error!' });
      //     });
      // })
      // .catch(function(reason) {
      //   $log.log('Modal dismissed:', reason);
      // });
        Upload.upload({
          url: '/api/majorsecretary',
          data: result
        }).then(function (res) {
          // var AssignedId = res.data.AssignedId;
          MajorsecretaryService.query({gradeId: UserMsg.gradeId, objId: UserMsg.objId}).$promise.then(function(data) {
            vm.gridOptions.data = vm.tableData = data;
          });
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 新增成功!' });
        })
          .catch(function (err) {
            // $log.error('save error:', err);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' 保存失败!'
            });
          });
      })
        .catch(function(reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function() {
      if ($window.confirm('你确定你想要删除选定的记录?')) {
        vm.selectedRow.$remove(function() {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 删除成功!' });
        })
        .catch(function(err) {
          $log.error('majorsecretary deleted error:', err.data.message);
          Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
          ' 删除失败!' });
        });
      }
    };

    //修改或查看数据
    vm._updateorview = function(isupdate) {
      var modalInstance = vm._openModal({
        majorsecretaryData: function() {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function() {
          return isupdate ? 'update' : 'view';
        }
      });

      modalInstance.result.then(function(result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          // result.$update()
          //   .then(function(res) {
          //     //修改表格显示的数据
          //     angular.extend(vm.selectedRow, res);
          //     Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> majorsecretary update saved successfully!' });
          //   })
          //   .catch(function(err) {
          //     $log.error('majorsecretary update save error:', err.data.message);
          //     Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
          //     'majorsecretary update save error!' });
          //   });
          Upload.upload({
            url: '/api/majorsecretary/' + result.id,
            data: result
          }).then(function (res) {
            // var AssignedId = res.data.AssignedId;
            MajorsecretaryService.query({gradeId: UserMsg.gradeId, objId: UserMsg.objId}).$promise.then(function(data) {
              vm.gridOptions.data = vm.tableData = data;
            });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!' });
          })
            .catch(function (err) {
              // $log.error('save error:', err);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
                ' 修改失败!'
              });
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
        {field: 'name', displayName: '名字'},
        {field: 'sex', displayName: '性别'},
        {field: 'duty', displayName: '职务'},
        {field: 'deeds', displayName: '简介'}
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

    //取后台Majorsecretary表所有数据
    MajorsecretaryService.query({gradeId: UserMsg.gradeId, objId: UserMsg.objId}).$promise.then(function(data) {
      vm.gridOptions.data = vm.tableData = data;
    });
  }
}());
