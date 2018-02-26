(function () {
  'use strict';

  angular
    .module('littleWishTable')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '微心愿',
      state: 'littleWishTable',
      type: 'dropdown',
      roles: ['litterwish'],
      position: -7
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'littleWishTable', {
      title: '待审核',
      state: 'littleWishTable.dsh',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'littleWishTable', {
      title: '待认领',
      state: 'littleWishTable.drl',
      roles: ['*']
    });
    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'littleWishTable', {
      title: '未通过',
      state: 'littleWishTable.wtg',
      roles: ['*']
    });
    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'littleWishTable', {
      title: '已认领',
      state: 'littleWishTable.yrl',
      roles: ['*']
    });
    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'littleWishTable', {
      title: '已完成',
      state: 'littleWishTable.ywc',
      roles: ['*']
    });

  }
}());
