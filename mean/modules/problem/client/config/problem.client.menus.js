(function () {
  'use strict';

  angular
    .module('problem')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '问题咨询',
      state: 'problem.curd',
      roles: ['problems'],
      position: 0
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('sidemenu', 'problem', {
      title: 'manager Problem Table',
      state: 'problem.curd',
      roles: ['*']
    });*/

  }
}());
