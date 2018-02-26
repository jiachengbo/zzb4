(function () {
  'use strict';

  angular
    .module('committeeTable')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '委员 ',
      state: 'committeeTable',
      type: 'dropdown',
      roles: ['zzzz'],
      position: 0
    });
// 九个街办
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '环西街道',
      state: 'committeeTable.hx',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '桃园街道',
      state: 'committeeTable.ty',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '青年路街道',
      state: 'committeeTable.qnl',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '北院门街道',
      state: 'committeeTable.bym',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '北关街道',
      state: 'committeeTable.bg',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '西关街道',
      state: 'committeeTable.xg',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '土门街道',
      state: 'committeeTable.tm',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '枣园街道',
      state: 'committeeTable.zy',
      roles: ['*']
    });

    menuService.addSubMenuItem('sidemenu', 'committeeTable', {
      title: '红庙坡街道',
      state: 'committeeTable.hmp',
      roles: ['*']
    });

  }
}());
