(function () {
  'use strict';

  angular
    .module('page')
    .controller('wentiDetaliController', wentiDetaliController);

  wentiDetaliController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function wentiDetaliController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    vm.wenti = $stateParams.data;
    $timeout(function () {
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops
      });
    }, 200);
  }
}());
