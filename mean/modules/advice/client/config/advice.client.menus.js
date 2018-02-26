(function () {
  'use strict';

  angular
    .module('advice')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '投诉建议',
      state: 'advice.curd',
      roles: ['advice'],
      position: -1
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('sidemenu', 'advice', {
      title: 'manager Advice Table',
      state: 'advice.curd',
      roles: ['*']
    });*/

  }
}());
