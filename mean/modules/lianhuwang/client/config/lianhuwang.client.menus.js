(function () {
  'use strict';

  angular
    .module('lianhuwang')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '莲湖区党建网',
      state: 'lianhuwang',
      type: 'dropdown',
      roles: ['zzzz'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'lianhuwang', {
      title: '莲湖区党建网',
      state: 'lianhuwang.curd',
      roles: ['*']
    });

  }
}());
