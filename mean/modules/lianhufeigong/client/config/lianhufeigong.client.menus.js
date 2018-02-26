(function () {
  'use strict';

  angular
    .module('lianhufeigong')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '莲湖区非公网校',
      state: 'lianhufeigong',
      type: 'dropdown',
      roles: ['zzzz'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'lianhufeigong', {
      title: '莲湖区非公网校',
      state: 'lianhufeigong.curd',
      roles: ['*']
    });

  }
}());
