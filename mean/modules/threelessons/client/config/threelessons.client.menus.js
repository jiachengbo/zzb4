(function () {
  'use strict';

  angular
    .module('threelessons')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService'*/];

  function menuConfig(menuService/*, appService*/) {
   /* var grade;
    if (appService.user) {
      grade = appService.user.user_grade;
      if (grade === 6 || grade === 7 || grade === 10 || grade === 9) {
        menuService.addMenuItem('sidemenu', {
          title: '三会一课',
          state: 'threelessons.curd',
          // type: 'dropdown',
          roles: ['jcxxgl'],
          position: 0
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '三会一课',
          state: 'threelessons.curd',
          // type: 'dropdown',
          roles: ['aaaaa'],
          position: 0
        });
      }
    }*/
    // Add the dropdown list item
    menuService.addMenuItem('sidemenu', {
      title: '三会一课',
      state: 'threelessons.curd',
      // type: 'dropdown',
      roles: ['sanhui'],
      position: 12
    });

  }
}());
