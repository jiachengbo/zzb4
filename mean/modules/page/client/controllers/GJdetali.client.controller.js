(function () {
  'use strict';

  angular
    .module('page')
    .controller('DetaliController', DetaliController);

  DetaliController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function DetaliController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    vm.show = false;
    console.log($stateParams.data);
    vm.weixingyuan = $stateParams.data;
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
