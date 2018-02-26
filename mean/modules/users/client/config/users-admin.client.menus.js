(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('sidemenu', 'admin', {
      icon: '/modules/users/client/img/icon/部门管理.png',
      state: 'admin.department',
      position: 100
    });
    menuService.addSubMenuItem('sidemenu', 'admin', {
      icon: '/modules/users/client/img/icon/权限管理.png',
      roles: ['aaa'],
      state: 'admin.role',
      position: 101
    });
    menuService.addSubMenuItem('sidemenu', 'admin', {
      icon: '/modules/users/client/img/icon/工作岗位.png',
      state: 'admin.workposition',
      roles: ['aaa'],
      position: 102
    });
    menuService.addSubMenuItem('sidemenu', 'admin', {
      icon: '/modules/users/client/img/icon/用户及权限.png',
      state: 'admin.muser',
      position: 103
    });
  }
}());
