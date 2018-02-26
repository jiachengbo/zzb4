(function () {
  'use strict';

  angular
    .module('partygeneral')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '党总支信息管理',
      state: 'partygeneral.curd',
      roles: ['partygeneral'],
      position: 15
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('sidemenu', 'partygeneral', {
      title: 'manager Partygeneral Table',
      state: 'partygeneral.curd',
      roles: ['*']
    });*/

  }
}());
