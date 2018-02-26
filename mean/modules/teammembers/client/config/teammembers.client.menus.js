(function () {
  'use strict';

  angular
    .module('teammembers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService'*/];

  function menuConfig(menuService/*, appService*/) {
    /*var grade;
    if (appService.user) {
      grade = appService.user.user_grade;
      if (grade > 3) {
        menuService.addMenuItem('sidemenu', {
          title: '班子成员',
          state: 'teammembers.curd',
          // type: 'dropdown',
          roles: ['jcxxgl'],
          position: 0
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '班子成员',
          state: 'teammembers.curd',
          // type: 'dropdown',
          roles: ['aaaaaaa'],
          position: 0
        });
      }
    }*/


    // // Add the dropdown list item
    menuService.addMenuItem('sidemenu', {
      title: '班子成员',
      state: 'teammembers.curd',
      // type: 'dropdown',
      roles: ['banzi'],
      position: 11
    });

  }
}());
