(function () {
  'use strict';

  angular
    .module('task')
    .controller('TaskCURDTableController', TaskCURDTableController);

  TaskCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'ReplyService', 'TaskService',
    '$uibModal', 'jcdjuserService', 'AddService', 'baseCodeService', 'appService', 'Upload', 'AppealService', 'AddRelationService', 'DataCountService', '$state', 'PayoutBMService', 'UserMsg', 'GetTaskProgressService', 'Socket'];
  function TaskCURDTableController($scope, Notification, $log, $window,
                                   ReplyService, TaskService, $uibModal, jcdjuserService, AddService, baseCodeService, appService, Upload, AppealService, AddRelationService, DataCountService, $state, PayoutBMService, UserMsg, GetTaskProgressService, Socket) {
    var vm = this;
    UserMsg.func();
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    //表数据
    vm.tableData = [];
    // 设置本地存储
    // $window.localStorage.setItem('aaaa', 'nnnn');
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    vm.addF = true;
    if (appService.user) {
      vm.grade = appService.user.user_grade;
      vm.userId = appService.user.id;
      if (vm.grade === 2) {
        //  党委账号
        vm.objID = 1;
      } else if (vm.grade === 3) {
        //  党工委账号
        vm.objID = 2;
      } else if (vm.grade === 4) {
        //  部门党委账号
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var a = 0; a < vm.dj_PartyOrganization.length; a++) {
          if (vm.dj_PartyOrganization[a].roleID === vm.roleID) {
            vm.objID = vm.dj_PartyOrganization[a].typeID;
          }
        }
      } else if (vm.grade === 5) {
        //  街道党工委账号
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var o = 0; o < vm.dj_PartyOrganization.length; o++) {
          if (vm.dj_PartyOrganization[o].roleID === vm.roleID) {
            vm.objID = vm.dj_PartyOrganization[o].typeID;
          }
        }
      } else if (vm.grade === 6) {
        vm.addF = false;
        vm.branch4 = appService.user.branch;
        for (var v = 0; v < vm.dj_PartyBranch.length; v++) {
          if (vm.branch4 === vm.dj_PartyBranch[v].OrganizationId) {
            vm.objID = vm.dj_PartyBranch[v].OrganizationId;
          }
        }
      } else if (vm.grade === 7) {
        vm.addF = false;
        vm.branch3 = appService.user.branch;
        for (var b = 0; b < vm.dj_PartyBranch.length; b++) {
          if (vm.branch3 === vm.dj_PartyBranch[b].OrganizationId) {
            vm.objID = vm.dj_PartyBranch[b].OrganizationId;
          }
        }
      } else if (vm.grade === 9) {
        vm.branch1 = appService.user.branch;
        for (var f = 0; f < vm.dj_PartyBranch.length; f++) {
          if (vm.branch1 === vm.dj_PartyBranch[f].OrganizationId) {
            vm.objID = vm.dj_PartyBranch[f].generalbranch;
          }
        }
      } else if (vm.grade === 10) {
        vm.branch = appService.user.branch;
        for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
          if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
            vm.objID = vm.dj_PartyBranch[x].generalbranch;
          }
        }
      }
    }
    //打开模态框,返回模态框实例
    vm._openModal = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/task-modal-form.client.view.html',
        controller: 'TaskModalFormController',
        controllerAs: 'vm',
        backdrop: 'static',
        resolve: resarg
      });
    };

    //增加数据
    vm.add123 = function () {
      var modalInstance = vm._openModal({
        //task会传入modal的controller
        taskData: function () {
          //空数据
          return new TaskService();
        },
        //表明是增加
        method: function () {
          return 'add';
        }
      });

      // 模态窗口关闭之后返回的值
      modalInstance.result.then(function (result) {
        $log.log('modal 123 ok:', result);
        var appeal = new AppealService();
        appeal.streetID = '9';
        appeal.appealTitle = '999';
        // result.$save()\
        Upload.upload({
          url: '/api/appeal',
          data: appeal
        })
          .then(function (res) {
            vm.gridOptions.data.push(res);
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> task add saved successfully!'});
          })
          .catch(function (err) {
            $log.error('task add save error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' task add save error!'
            });
          });
      })
        .catch(function (reason) {
          $log.log('Modal dismissed:', reason);
        });
    };

    //删除数据
    vm.remove = function () {
      if ($window.confirm('你确定你想要删除选定的记录?')) {
        vm.selectedRow.$remove(function () {
          var rowindex = vm.tableData.indexOf(vm.selectedRow);
          //去掉表格中的数据
          vm.tableData.splice(rowindex, 1);
          //复位当前行
          vm.selectedRow = null;
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> task deleted successfully!'});
        })
          .catch(function (err) {
            $log.error('task deleted error:', err.data.message);
            Notification.error({
              message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
              ' task delete error!'
            });
          });
      }
    };

    //修改或查看数据
    vm._updateorview = function (isupdate) {
      var modalInstance = vm._openModal({
        taskData: function () {
          //复制当前选择的数据, 不要直接修改，否则表格上会直接显示模态框中修改后的内容
          return angular.copy(vm.selectedRow);
        },
        method: function () {
          return isupdate ? 'update' : 'view';
        }
      });

      modalInstance.result.then(function (result) {
        $log.log('modal ok:', result);
        if (isupdate) {
          result.$update()
            .then(function (res) {
              //修改表格显示的数据
              angular.extend(vm.selectedRow, res);
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> task update saved successfully!'});
            })
            .catch(function (err) {
              $log.error('task update save error:', err.data.message);
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
                'task update save error!'
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
        {field: 'AssignedTitle', displayName: '标题'},
        {field: 'AssignedContent', displayName: '内容'},
        {field: 'payoutName', displayName: '派发部门'},
        {field: 'payout', displayName: '派发部门'},
        {field: 'state', displayName: '状态'}
      ],
      useExternalPagination: true,
      enableFiltering: false,
      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        vm.offset = 0;
        vm.limit = vm.gridOptions.paginationPageSize;

        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
        });
        gridApi.pagination.on.paginationChanged($scope, function (pagecount, countperpage) {
          // 第几页 pagecount
          // 每页有几个 countperpage
          vm.limit = countperpage;
          vm.offset = (pagecount - 1) * countperpage;
          if (vm.getSendTaskFlag) {
            vm.getSendTask();
          } else {
            vm.getTableData();
          }
        });
      },
      //允许表格左上角菜单
      enableGridMenu: false
    };
    vm.gridOptions.columnDefs[2].visible = true;
    vm.gridOptions.columnDefs[3].visible = false;
    vm.gridOptions.columnDefs[4].visible = true;
    // 获取接收任务的数据
    vm.getTableData = function () {
      TaskService.query({
        GradeID: vm.grade,
        SendObjectId: vm.objID
      }).$promise.then(function (data) {
        vm.relationData = data;
        vm.AssignedIds = [];
        for (var f = 0; f < data.length; f++) {
          if (vm.AssignedIds.indexOf(data[f].AssignedId) === -1) {
            vm.AssignedIds.push(data[f].AssignedId);
          }
        }
        DataCountService.query({AssignedId: vm.AssignedIds}).$promise.then(function (data) {
          vm.gridOptions.totalItems = data[0].count;
        });
        TaskService.query({
          offset: vm.offset,
          limit: vm.limit,
          AssignedId: vm.AssignedIds
        }).$promise.then(function (data) {
          angular.forEach(vm.relationData, function (value, k) {
            angular.forEach(data, function (value1, k) {
              if (value1.AssignedId === value.AssignedId) {
                if (value.TaskProgress === 1) {
                  value1.state = '未领取';
                } else if (value.TaskProgress === 2) {
                  value1.state = '推进中';
                } else if (value.TaskProgress === 3) {
                  value1.state = '已完成';
                }
              }
            });
          });
          vm.gridOptions.data = vm.tableData = data;
        });
      });
    };
    // 获取发送任务的数据
    vm.getSendTask = function () {
      TaskService.query({
        createUserId: vm.userId,
        offset: vm.offset,
        limit: vm.limit
      }).$promise.then(function (data) {
        vm.gridOptions.data = vm.tableData = data;
      });
    };

    // 发送任务
    vm.sendTask = function () {
      angular.element(document.querySelector('.acceptTask')).removeClass('act');
      angular.element(document.querySelector('.sendTask')).addClass('act');
      vm.getSendTaskFlag = true;
      vm.acceptTaskF = false;
      vm.selectedRow = false;
      vm.gridOptions.columnDefs[2].visible = false;
      vm.gridOptions.columnDefs[3].visible = true;
      vm.gridOptions.columnDefs[4].visible = false;
      DataCountService.query({createUserId: vm.userId}).$promise.then(function (data) {
        vm.gridOptions.totalItems = data[0].count;
        vm.getSendTask();
      });
    };
    vm.acceptTaskF = true;
    // 接收任务
    vm.acceptTask = function () {
      angular.element(document.querySelector('.acceptTask')).addClass('act');
      angular.element(document.querySelector('.sendTask')).removeClass('act');
      vm.selectedRow = false;
      vm.getSendTaskFlag = false;
      vm.acceptTaskF = true;
      vm.gridOptions.columnDefs[2].visible = true;
      vm.gridOptions.columnDefs[3].visible = false;
      vm.gridOptions.columnDefs[4].visible = true;
      TaskService.query({
        GradeID: vm.grade,
        SendObjectId: vm.objID
      }).$promise.then(function (data) {
        vm.AssignedIds = [];
        for (var f = 0; f < data.length; f++) {
          if (vm.AssignedIds.indexOf(data[f].AssignedId) === -1) {
            vm.AssignedIds.push(data[f].AssignedId);
          }
        }
        DataCountService.query({AssignedId: vm.AssignedIds}).$promise.then(function (data) {
          vm.gridOptions.totalItems = data[0].count;
        });
        vm.getTableData();
      });
    };
    if (vm.grade === 1) {
      vm.sendTask();
    } else {
      vm.getTableData();
    }
    // vm.gridOptions.data = vm.tableData = data;
    vm.openReply = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/reply.client.view.html',
        controller: 'replyController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    // 回复任务
    vm.reply = function () {
      if (vm.selectedRow) {
        angular.element(document.querySelectorAll('.taskbtn')).removeClass('act');
        angular.element(document.querySelectorAll('.taskbtn')).eq(0).addClass('act');
        var replyInstance = vm.openReply({
          data: function () {
            return vm.selectedRow;
          },
          type: function () {
            return vm.acceptTaskF;
          }
        });
        replyInstance.result.then(function (result) {
          var content = result.replyContent;
          var AssignedId = result.AssignedId;
          var HF_name = result.HF_name;
          var fromPersonId = result.fromPersonId;
          var toPersonId = result.toPersonId;
          ReplyService.query({content: content, Id: AssignedId, HF_name: HF_name, fromPersonId: fromPersonId, toPersonId: toPersonId}).$promise.then(function (data) {
            Socket.emit('reply', {replydata: result});
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 回复成功!'});
          });
        });
      } else {
        $window.alert('请选择要回复的案件！');
      }
    };
    vm.openAdd = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/add.client.view.html',
        controller: 'addController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    // 查看任务详情
    vm.seek = function () {
      if (vm.selectedRow) {
        angular.element(document.querySelectorAll('.taskbtn')).removeClass('act');
        angular.element(document.querySelectorAll('.taskbtn')).eq(1).addClass('act');
        var addInstance = vm.openAdd({
          AddService: function () {
            return vm.selectedRow;
          },
          type: function () {
            return vm.acceptTaskF;
          }
        });
        addInstance.result.then(function (result) {

        });
      } else {
        $window.alert('请选择要查看的数据！');
      }
    };
    // 新增任务
    vm.add2 = function () {
      angular.element(document.querySelectorAll('.taskbtn')).removeClass('act');
      angular.element(document.querySelectorAll('.taskbtn')).eq(2).addClass('act');
      var addInstance = vm.openAdd({
        AddService: function () {
          return new AddService();
        },
        type: function () {
          return '';
        }
      });
      addInstance.result.then(function (result) {
        var Relation = result.Relation;
        var createUserId = result.createUserId;
        Upload.upload({
          url: '/api/addtask1',
          data: result
        }).then(function (res) {
          console.log(res);
          vm.addTaskData = res.data;
          var AssignedId = res.data.AssignedId;
          // vm.AssignedIds.push(AssignedId);
          TaskService.query({
            offset: vm.offset,
            limit: vm.limit,
            AssignedId: vm.AssignedIds
          }).$promise.then(function (data) {
            if (vm.getSendTaskFlag) {
              vm.sendTask();
            } else {
              vm.gridOptions.data = vm.tableData = data;
            }
            AddRelationService.query({
              AssignedId: AssignedId,
              Relation: Relation
              // createUserId: createUserId
            }).$promise.then(function (data) {
              Socket.emit('task', {Relation: Relation, taskdata: vm.addTaskData});
              Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 保存成功!'});
            }).catch(function () {
              Notification.error({message: '<i class="glyphicon glyphicon-ok"></i> 保存失败!'});
            });
          });
        }).catch(function (err) {
          // $log.error('save error:', err);
          Notification.error({
            message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
            ' 保存失败!'
          });
        });
      }).catch(function (reason) {
        $log.log('Modal dismissed:', reason);
      });
    };
    vm.openTaskProgress = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/taskProgress.client.view.html',
        controller: 'TaskProgressController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };

    vm.taskProgress = function () {
      var AssignedId;
      if (vm.selectedRow) {
        if (!vm.acceptTaskF) {
          AssignedId = vm.selectedRow.AssignedId;
          $state.go('task.progress', {id: AssignedId});
        } else {
          AssignedId = vm.selectedRow.AssignedId;
          angular.forEach(vm.relationData, function (value, k) {
            if (value.AssignedId === AssignedId && value.GradeID === UserMsg.gradeId && value.SendObjectId === UserMsg.objId) {
              vm.Assigned_jb_bm_id = value.Id;
            }
          });
          $state.go('task.progresslist', {id: vm.Assigned_jb_bm_id, person: 'own'});
        }
      } else {
        $window.alert('请选择要查看的数据！');
      }
    };
    vm.getTask = function () {
      if (vm.selectedRow) {
        if (vm.selectedRow.state === '未领取') {
          angular.element(document.querySelectorAll('.taskbtn')).removeClass('act');
          angular.element(document.querySelectorAll('.taskbtn')).eq(4).addClass('act');
          var AssignedId = vm.selectedRow.AssignedId;
          PayoutBMService.query({
            AssignedId: AssignedId,
            GradeID: UserMsg.gradeId,
            SendObjectId: UserMsg.objId
          }).$promise.then(function (res) {
            vm.acceptTask();
            Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 领取任务成功!'});
          });
        } else {
          $window.alert('选择的任务已经领取！');
        }
      } else {
        $window.alert('请选择要领取的任务！');
      }
    };
    vm.addTaskProgress = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/task/client/views/addTaskProgress.client.view.html',
        controller: 'addTaskProgressController',
        controllerAs: 'vm',
        backdrop: 'static',
        size: 'lg',
        resolve: resarg
      });
    };
    // vm.relationData
    vm.uploadTaskProgress = function () {
      if (vm.selectedRow) {
        if (vm.selectedRow.state === '推进中') {
          angular.element(document.querySelectorAll('.taskbtn')).removeClass('act');
          angular.element(document.querySelectorAll('.taskbtn')).eq(2).addClass('act');
          angular.forEach(vm.relationData, function (value, k) {
            if (value.AssignedId === vm.selectedRow.AssignedId) {
              vm.assigned_jb_bm_id = value.Id;
            }
          });
          var instance = vm.addTaskProgress({
            assigned_jb_bm_id: function () {
              return vm.assigned_jb_bm_id;
            }
          });
          instance.result.then(function (result) {
            Upload.upload({
              url: '/api/addtaskprogress',
              data: result
            }).then(function (res) {
              if (result.remarks === '已完成') {
                GetTaskProgressService.query({
                  isend: true,
                  assigned_jb_bm_id: result.assigned_jb_bm_id
                }).$promise.then(function () {
                  vm.selectedRow.state = '已完成';
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上传任务进度成功!'});
                }).catch(function () {
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上传任务进度失败!'});
                });
              } else {
                GetTaskProgressService.query({assigned_jb_bm_id: result.assigned_jb_bm_id}).$promise.then(function () {
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上传任务进度成功!'});
                }).catch(function () {
                  Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 上传任务进度失败!'});
                });
              }
            }).catch(function (err) {
              Notification.error({
                message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i>' +
                ' 上传失败!'
              });
            });
          }).catch(function (reason) {
            $log.log('Modal dismissed:', reason);
          });
        } else if (vm.selectedRow.state === '未领取') {
          $window.alert('选择案件还未领取！');
        } else if (vm.selectedRow.state === '已完成') {
          $window.alert('选择案件已经完成！');
        }
      } else {
        $window.alert('请选择案件！');
      }
    };
  }
}());

