(function () {
  'use strict';

  angular
    .module('global')
    .controller('TaskMsgModalController', TaskMsgModalController);

  TaskMsgModalController.$inject = ['$scope', 'Notification', '$log', '$uibModalInstance', 'taskData'];

  function TaskMsgModalController($scope, Notification, $log, $uibModalInstance, taskData) {
    var vm = this;
    vm.close = function () {
      $uibModalInstance.close();
    };
    vm.data = taskData;
  }
}());
