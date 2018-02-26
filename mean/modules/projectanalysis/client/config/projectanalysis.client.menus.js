(function () {
  'use strict';

  angular
    .module('projectAnalysis')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '项目分析',
      state: 'projectAnalysis',
      type: 'dropdown',
      roles: ['zzzzzz'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'projectAnalysis', {
      title: '项目分析',
      state: 'projectAnalysis.curd',
      roles: ['*']
    });

  }
}());
