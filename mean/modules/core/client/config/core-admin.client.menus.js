(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    //系统管理
    menuService.addMenuItem('sidemenu', {
      state: 'admin',
      type: 'dropdown',
      roles: ['xtsz'],
      position: 1100
    });
  }
}());
