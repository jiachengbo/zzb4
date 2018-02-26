(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', 'Notification', '$log', '$uibModal', '$state', '$uiRouter',
    'appService', 'Socket'];

  function HeaderController($scope, Notification, $log, $uibModal, $state, $uiRouter,
                            appService, Socket) {
    var vm = this;
    vm.$state = $state;
    //用户待处理任务
    vm.waitHandles = [];
    vm.stateChangeMsg = [];

    //顶部更多菜单打开
    vm.manyMenuIsOpen = false;
  }
}());
