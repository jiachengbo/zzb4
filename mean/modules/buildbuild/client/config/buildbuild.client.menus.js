(function () {
  'use strict';

  angular
    .module('buildbuild')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '共驻共建',
      state: 'buildbuild.curd',
      roles: ['build'],
      position: -8
    });
/*

    menuService.addMenuItem('sidemenu', {
      title: '共驻共建',
      state: 'buildbuild',
      type: 'dropdown',
      roles: ['cityjcdj'],
      position: -1
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'buildbuild', {
      title: '共驻共建',
      state: 'buildbuild.curd',
      roles: ['*']
    });
*/

  }
}());
