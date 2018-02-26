/*
 (function () {
 'use strict';

 angular
 .module('core')
 .controller('SidebarMenuController', SidebarMenuController);

 SidebarMenuController.$inject = ['$rootScope', '$state', '$window', 'appService'];

 function SidebarMenuController($rootScope, $state, $window, appService) {
 var vm = this;

 //只能有一个展开的菜单
 var prevMenuItem = null;
 vm.toggleMenuItem = function(menuitem) {
 if (!prevMenuItem) {
 menuitem.isCollapsed = false;
 } else if (prevMenuItem !== menuitem) {
 prevMenuItem.isCollapsed = true;
 menuitem.isCollapsed = false;
 } else {
 menuitem.isCollapsed = !menuitem.isCollapsed;
 }

 prevMenuItem = menuitem;
 };

 vm.clickMenuItem = function(menuitem) {
 //console.log('inwidth: %d, height: %d', $window.innerWidth, $window.innerHeight);
 if ($window.innerWidth <= 767) {
 appService.sideMenuShow = false;
 }
 //滚动到页面顶部
 $window.scrollTo(0, 0);
 };
 }
 }());
 */
(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarMenuController', SidebarMenuController);

  SidebarMenuController.$inject = ['$rootScope', '$state', '$window', 'menuService', '$timeout', 'appService'];

  function SidebarMenuController($rootScope, $state, $window, menuService, $timeout, appService) {
    var vm = this;
    if (appService.user) {
      vm.authentication = appService;
    }
    $rootScope.sidemenu = menuService.getMenu('sidemenu');
    $rootScope.menus = menuService;
    for (var i = 0; i < $rootScope.sidemenu.items.length; i++) {
      $rootScope.sidemenu.items[i].icon2 = '/modules/core/client/img/header/符号.png';
      $rootScope.sidemenu.items[i].icon1 = '/modules/core/client/img/header/符号.png';
    }
    //只能有一个展开的菜单
    var prevMenuItem = null;
    vm.toggleMenuItem = function (menuitem) {
      if (!prevMenuItem) {
        menuitem.isCollapsed = false;
      } else if (prevMenuItem !== menuitem) {
        prevMenuItem.isCollapsed = true;
        menuitem.isCollapsed = false;
      } else {
        menuitem.isCollapsed = !menuitem.isCollapsed;
      }

      prevMenuItem = menuitem;
    };
    vm.iii = 'background-image: url(/modules/core/client/img/header/02.png);background-size: 100% 100%;color:#fff;';
    vm.aaa = 'background-image: url(/modules/core/client/img/header/按钮.png);background-size: 100% 100%';
    vm.clickMenuItem = function (menuitem) {
      //console.log('inwidth: %d, height: %d', $window.innerWidth, $window.innerHeight);
      collapsedMenu();
      //滚动到页面顶部
      $window.scrollTo(0, 0);
    };

    //如果路由改变
    $rootScope.$on('$stateChangeSuccess', collapsedMenu);

    //根据屏幕宽度，缩回菜单
    function collapsedMenu() {
      /*和core.css 对应
       @media (max-width: 767px) {
       body>.page-container {
       display: block;
       }
       }
       */
      if ($window.innerWidth <= 767) {
        menuService.leftMenusCollapsed = true;
      }
    }

    //初始化显示
    collapsedMenu();
    $rootScope.showmuse1 = false;
    vm.showmuse2 = false;
    var shoe1 = true;
    var shoe2 = true;
    vm.changemues = function (num) {
      if (num === 1) {
        if (shoe1) {
          $rootScope.showmuse1 = true;
          shoe1 = false;
        } else {
          $rootScope.showmuse1 = false;
          shoe1 = true;
        }
        if (!shoe2) {
          vm.showmuse2 = false;
          shoe2 = true;
        }
      } else {
        if (shoe2) {
          vm.showmuse2 = true;
          shoe2 = false;
        } else {
          vm.showmuse2 = false;
          shoe2 = true;
        }
        if (!shoe1) {
          $rootScope.showmuse1 = false;
          shoe1 = true;
        }
      }

    };
    vm.changemues1 = function () {

    };
  }
}());
