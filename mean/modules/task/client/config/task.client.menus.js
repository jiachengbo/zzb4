(function () {
  'use strict';

  angular
    .module('task')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '任务下派',
      state: 'task.curd',
      // type: 'dropdown',
      roles: ['xxx'],
      position: 0
    });

    // Add the dropdown list item
    // menuService.addSubMenuItem('sidemenu', 'task', {
    //   title: 'manager Task Table',
    //   state: 'task.curd',
    //   roles: ['*']
    // });

  }
}());
