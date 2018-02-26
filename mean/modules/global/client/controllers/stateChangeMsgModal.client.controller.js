(function () {
  'use strict';

  angular
    .module('global')
    .controller('StateChangeMsgController', StateChangeMsgController);

  StateChangeMsgController.$inject = ['$scope', 'Notification', '$log', '$uibModalInstance', 'msgData'];

  function StateChangeMsgController($scope, Notification, $log, $uibModalInstance, msgData) {
    var vm = this;
    vm.close = function () {
      $uibModalInstance.close();
    };
    vm.data = msgData;
  }
}());
