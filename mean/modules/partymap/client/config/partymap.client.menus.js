(function () {
  'use strict';

  angular
    .module('partymap')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '党建地图',
      state: 'partymap',
      roles: ['partymap'],
      position: -5
    });
    /*
   menuService.addMenuItem('sidemenu', {
      title: '党建地图',
      state: 'partymap',
      // type: 'dropdown',
      roles: ['*'],
      position: 0
    });

   // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'partymap', {
      title: 'manager Partymap Table',
      state: 'partymap.curd',
      roles: ['*']
    });*/

  }
}());
