(function () {
  'use strict';

  angular
    .module('appeal')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '党建动态',
      state: 'appeal.djappeal',
      roles: ['partydt'],
      position: 14
    });

    /*
    menuService.addMenuItem('sidemenu', {
      title: '党建活动',
      state: 'appeal',
      type: 'dropdown',
      roles: ['cityjcdj'],
      position: 0
    });
    // 九个街办
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '党建活动',
      state: 'appeal.djappeal',
      roles: ['*']
    });

    // 九个街办
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '环西街道',
      state: 'appeal.hx',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '桃园街道',
      state: 'appeal.ty',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '青年路街道',
      state: 'appeal.qnl',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '北院门街道',
      state: 'appeal.bym',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '北关街道',
      state: 'appeal.bg',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '西关街道',
      state: 'appeal.xg',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '土门街道',
      state: 'appeal.tm',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '枣园街道',
      state: 'appeal.zy',
      roles: ['*']
    });

    menuService.addSubMenuItem('sidemenu', 'appeal', {
      title: '红庙坡街道',
      state: 'appeal.curd',
      roles: ['*']
    });

*/
  }
}());
