(function () {
  'use strict';

  angular
    .module('page')
    .controller('EduController', EduController);

  EduController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', '$state', 'menuService'];
  function EduController($scope, Notification, $log, $window,
                                  baseCodeService, $state, menuService) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    console.log(vm.dj_PartyOrganization);
    // 基层党建动态
  }
}());
