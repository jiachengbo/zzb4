(function () {
  'use strict';

  angular
    .module('regionalization')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '项目管理',
      state: 'regionalization.project',
      type: '',
      roles: ['project'],
      position: -9
    });
   /*
    menuService.addMenuItem('sidemenu', {
      title: '项目管理',
      state: 'regionalization',
      type: 'dropdown',
      roles: ['cityjcdj'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'regionalization', {
      title: '项目管理',
      state: 'regionalization.project',
      roles: ['*']
    });
*/
  }
}());
