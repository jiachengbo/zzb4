(function () {
  'use strict';

  angular
    .module('core')
    .controller('PageFrameController', PageFrameController);

  PageFrameController.$inject = ['$scope', 'Notification', '$log', 'appService'];

  function PageFrameController($scope, Notification, $log, appService) {
    var vm = this;
    vm.headerViewUrl = '/modules/core/client/views/header.client.view.html';
    vm.menuViewUrl = '/modules/core/client/views/sidebarmenu.client.view.html';
    vm.footerViewUrl = '/modules/core/client/views/footer.client.view.html';
  }
}());
