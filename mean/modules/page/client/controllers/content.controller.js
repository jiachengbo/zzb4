(function () {
  'use strict';

  angular
    .module('page')
    .controller('contentController', contentController);

  contentController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function contentController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    vm.gongjian = $stateParams.data;
    var iframe = document.querySelector('.myiframe');
    var bHeight;
    var dHeight;
    var height;
    var imgs;
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function() {
        // var iframe = document.querySelector('.myiframe');
        bHeight = iframe.contentWindow.document.body.scrollHeight;
        dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        height = Math.max(bHeight, dHeight);
        iframe.height = height;
        iframe.contentWindow.document.body.style.margin = '0 auto';
        vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
        vm.show = true;
        $('.footers').css({
          position: 'absolute',
          width: '100%',
          top: vm.tops,
          'z-index': 1
        });
      });
    } else {
      iframe.onload = function () {
        // var iframe = document.querySelector('.myiframe');
        bHeight = iframe.contentWindow.document.body.scrollHeight;
        dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        height = Math.max(bHeight, dHeight);
        iframe.height = height;
        iframe.contentWindow.document.body.style.margin = '0 auto';
        imgs = iframe.contentWindow.document.getElementsByTagName('img');
        angular.forEach(imgs, function (value, k) {
          var cmW = parseFloat(value.style.width);
          var pxW = cmW * 25;
          var cmH = parseFloat(value.style.height);
          var pxH = cmH * 25;
          if (pxW > 900) {
            $(value).parent().css({'width': '900px', 'height': (900 / pxW * pxH) + 'px'});
            value.style.width = '900px';
            value.style.height = (900 / pxW * pxH) + 'px';
          }
        });
        vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
        vm.show = true;
        $('.footers').css({
          position: 'absolute',
          width: '100%',
          top: vm.tops,
          'z-index': 1
        });
      };
    }
  }
}());
