(function () {
  'use strict';

  angular
    .module('global')
    .controller('homeWelcomeController', homeWelcomeController);

  homeWelcomeController.$inject = ['$state', '$scope', 'menuService', 'appService'];
  function homeWelcomeController($state, $scope, menuService, appService) {
    if (appService.user) {
      menuService.leftMenusCollapsed = true;
    }
    if (appService.user2) {
      menuService.leftMenusCollapsed = false;
    }
  }
}());
