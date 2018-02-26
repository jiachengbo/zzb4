(function () {
  'use strict';

  angular
    .module('page')
    .controller('firstSJController', firstSJController);

  firstSJController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function firstSJController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    vm.fristsj = $stateParams.data;
    $timeout(function () {
     /* var iframe = document.querySelector('.myiframe');
      var bHeight = iframe.contentWindow.document.body.scrollHeight;
      var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
      var height = Math.max(bHeight, dHeight);
      iframe.height = height;
      iframe.contentWindow.document.body.style.margin = '0 auto';*/
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops,
        'z-index': 1
      });
    }, 500);
  }
}());
