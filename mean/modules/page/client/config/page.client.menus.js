(function () {
  'use strict';

  angular
    .module('page')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: 'Page',
      state: 'page',
      type: 'dropdown',
      roles: ['ddd'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'page', {
      title: 'manager Page Table',
      state: 'page.curd',
      roles: ['ddd']
    });

  }
}());
