(function () {
  'use strict';

  angular
    .module('survey')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('sidemenu', {
      title: '党建概况',
      state: 'survey.curd',
      // type: 'dropdown',
      roles: ['partygk'],
      position: 13
    });

    // Add the dropdown list item
    /*menuService.addSubMenuItem('sidemenu', 'survey', {
      title: 'manager Survey Table',
      state: 'survey.curd',
      roles: ['*']
    });*/

  }
}());
