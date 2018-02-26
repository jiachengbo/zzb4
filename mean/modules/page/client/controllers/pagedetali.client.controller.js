(function () {
  'use strict';

  angular
    .module('page')
    .controller('GJDetaliController', GJDetaliController);

  GJDetaliController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function GJDetaliController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    vm.gongjian = $stateParams.data;
    $scope.expression = function () {
      var iframe = $('.myiframe');
      iframe.css({
        'width': '900px',
        'margin': '0 auto'
      });
      var imgs = $(iframe).find('img');
      $(imgs).parent().css(
        {
          'float': 'none',
          'margin': '0 auto'
        }
      );
      $(imgs).css({
        'display': 'block',
        'margin': '0 auto'
      });
      $(imgs).each(function () {
        var h = $(this).height();
        var w = $(this).width();
        var hw = h / w;
        if ($(this).width() > 900) {
          $(this).width(900);
          $(this).height(hw * 900);
        }
      });
    };
    $timeout(function () {
      if ($('.zhangshi')) {
        $('.zhangshi').html(vm.gongjian.details);
      }
      /*var iframe = document.querySelector('.myiframe');
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
    }, 1000);
  }
}());
