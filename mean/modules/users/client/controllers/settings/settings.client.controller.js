(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'appService'];

  function SettingsController($scope, appService) {
    var vm = this;

    vm.user = appService.user;
  }
}());
