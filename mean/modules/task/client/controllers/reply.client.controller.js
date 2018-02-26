(function () {
  'use strict';

  angular
    .module('task')
    .controller('replyController', replyController);

  replyController.$inject = ['$scope', 'ReplyService', '$window', '$uibModalInstance', 'type', 'appService', 'data', 'Timer', 'UserMsg'];
  function replyController($scope, ReplyService, $window, $uibModalInstance, type, appService, data, Timer, UserMsg) {
    var vm = this;
    UserMsg.func();
    //在这里处理要进行的操作
    vm.AssignedId = data.AssignedId;
    vm.fromPersonId = data.payoutName;
    vm.replyContent = '';
    vm.type = type;
    vm.person = data.payout.split('，');
    vm.HF_name = appService.user.displayName;
    vm.toPersonId = UserMsg.objName;
    $scope.replayperson = [];
    vm.ok = function() {
      if (vm.replyContent.replace(' ', '') !== '') {
        if (vm.type) {
          // 在接收任务的分类下
          $uibModalInstance.close({replyContent: vm.replyContent, AssignedId: vm.AssignedId, HF_name: vm.HF_name, fromPersonId: vm.toPersonId, toPersonId: vm.fromPersonId});
        } else {
          vm.toPerson = [];
          angular.forEach($scope.replayperson, function (value, k) {
            if (value) {
              this.push(vm.person[k]);
            }
          }, vm.toPerson);
          // 在发送任务的分类下
          if ($scope.replayperson.length !== 0) {
            $uibModalInstance.close({replyContent: vm.replyContent, AssignedId: vm.AssignedId, HF_name: vm.HF_name, fromPersonId: vm.toPersonId, toPersonId: vm.toPerson});
          } else {
            $window.alert('请选择要回复的对象！');
          }
        }
      } else {
        $window.alert('请输入回复内容！');
      }
    };
    vm.changeAllReply = function (f) {
      if (f) {
        angular.forEach(vm.person, function (value, k) {
          $scope.replayperson[k] = true;
        });
      } else {
        angular.forEach(vm.person, function (value, k) {
          $scope.replayperson[k] = false;
        });
      }
    };
    if (vm.type) {
      // 在接收任务的分类下
      ReplyService.query({Id: vm.AssignedId, fromPersonId: vm.fromPersonId, toPersonId: vm.toPersonId}).$promise.then(function(data) {
        angular.forEach(data, function (value, k) {
          value.createDate = Timer.format(value.createDate);
        });
        vm.history = data;

      });
    } else {
      // 在发送任务的分类下
      ReplyService.query({Id: vm.AssignedId, fromPersonId: vm.fromPersonId, toPersonId: vm.person}).$promise.then(function(data) {
        angular.forEach(data, function (value, k) {
          value.createDate = Timer.format(value.createDate);
        });
        vm.history = data;
        console.log(data);
      });
    }

    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
