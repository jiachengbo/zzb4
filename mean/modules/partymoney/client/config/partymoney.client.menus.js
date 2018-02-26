(function () {
  'use strict';

  angular
    .module('partymoney')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '党员党费缴纳管理',
      state: 'partymoney',
      type: 'dropdown',
      roles: ['zzzzz'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'partymoney', {
      title: '党委',
      state: 'partymoney.curd',
      roles: ['dangwei', 'quwei']
    });
    menuService.addSubMenuItem('sidemenu', 'partymoney', {
      title: '党工委',
      state: 'partymoney.curd1',
      roles: ['danggongwei', 'quwei']
    });

  }
}());
