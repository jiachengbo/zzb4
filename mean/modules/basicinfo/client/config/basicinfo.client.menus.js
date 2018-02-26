(function () {
  'use strict';

  angular
    .module('basicinfo')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService'*/];

  function menuConfig(menuService/*, appService*/) {
    /*var grade;
    if (appService.user) {
      grade = appService.user.user_grade;
      if (grade === 1) {
        menuService.addMenuItem('sidemenu', {
          title: '通知文件',
          state: 'basicinfo.topvoice',
          // type: 'dropdown',
          roles: ['jcxxgl'],
          position: 0
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '通知文件',
          state: 'basicinfo.topvoice',
          // type: 'dropdown',
          roles: ['aaaaa'],
          position: 0
        });
      }
    }*/

    menuService.addMenuItem('sidemenu', {
      title: '通知文件',
      state: 'basicinfo.topvoice',
      // type: 'dropdown',
      roles: ['notice'],
      position: 9
    });
  }
}());
