(function () {
  'use strict';

  angular
    .module('users')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];
  function menuConfig(menuService) {
    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '基本信息',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '图像',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '改密码',
      state: 'settings.password'
    });
/*
    menuService.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });
*/
  }
}());
