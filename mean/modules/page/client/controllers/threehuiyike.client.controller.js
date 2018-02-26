(function () {
  'use strict';

  angular
    .module('page')
    .controller('threeHYKController', threeHYKController);

  threeHYKController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', '$state', '$stateParams', '$timeout'];
  function threeHYKController($scope, $window, baseCodeService, menuService, $state, $stateParams, $timeout) {
    var vm = this;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    console.log($stateParams.data);
    vm.wenti = $stateParams.data;
    $timeout(function () {
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops,
        'z-index': 1
      });
    }, 200);
    vm.tocontent = function (num) {
      $state.go('content', {data: num});
    };
  }
}());
