(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];
  function menuConfig(menuService) {
    //用户工具
    menuService.addMenuItem('sidemenu', {
      state: 'tools',
      type: 'dropdown',
      roles: ['aaaa'],
      position: 1000
    });
  }
}());
