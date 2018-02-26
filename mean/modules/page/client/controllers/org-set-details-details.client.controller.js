(function () {
  'use strict';

  angular
    .module('page')
    .controller('OrgSetDetailsDetailsController', OrgSetDetailsDetailsController);

  OrgSetDetailsDetailsController.$inject = ['$scope', '$rootScope', '$log', '$window', 'baseCodeService', '$location', 'menuService', '$stateParams', '$anchorScroll', 'cityorgsetService', '$timeout', 'appService'];
  function OrgSetDetailsDetailsController($scope, $rootScope, $log, $window, baseCodeService, $location, menuService, $stateParams, $anchorScroll, cityorgsetService, $timeout, appService) {
    var vm = this;
    $window.scrollTo(0, 0);
    vm.data = $stateParams.data;
    // vm.data.quest = JSON.parse(vm.data.quest);
    $timeout(function () {
      var iframe = document.querySelector('.myiframe');
      var bHeight = iframe.contentWindow.document.body.scrollHeight;
      var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
      var height = Math.max(bHeight, dHeight);
      iframe.height = height;
      iframe.contentWindow.document.body.style.margin = '0 auto';
    }, 1000);
    /*$scope.expression = function () {
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
        var hw = h/w;
        if($(this).width() > 900){
          $(this).width(900);
          $(this).height(hw * 900);
        }
      });
    };*/
  }
}());
