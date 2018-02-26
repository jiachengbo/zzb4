(function () {
  'use strict';

  angular
    .module('problemWall')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window', '$timeout'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window, $timeout*/) {
   /* var user_grade;
    var branch;
    var supers;
    var JCDJ_User_roleID;
    var PartyBranch = baseCodeService.getItems('dj_PartyBranch');*/
    /*if (appService.user) {
      user_grade = appService.user.user_grade;
      user_grade = appService.user.user_grade;
      JCDJ_User_roleID = appService.user.JCDJ_User_roleID;
      branch = appService.user.branch;
      angular.forEach(PartyBranch, function (v, k) {
        if (v.OrganizationId === branch) {
          supers = v.super;
        }
      });
      if (user_grade === 1 || user_grade === 3 || (user_grade === 5 && JCDJ_User_roleID > 31 && JCDJ_User_roleID < 41) || user_grade === 6 || user_grade === 7 || user_grade === 10 || user_grade === 9) {
        menuService.addMenuItem('sidemenu', {
          title: '问题墙',
          state: 'problemWall.curd',
          type: '',
          roles: ['cityjcdj'],
          position: 0
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '问题墙',
          state: 'problemWall.curd',
          type: '',
          roles: ['aaaa'],
          position: 0
        });
      }
    }*/
    menuService.addMenuItem('sidemenu', {
      title: '问题墙',
      state: 'problemWall.curd',
      /*type: '',*/
      roles: ['prowall'],
      position: -6
    });
     /*menuService.addMenuItem('sidemenu', {
     title: '问题墙',
     state: 'problemWall',
     type: 'dropdown',
     roles: ['cityjcdj'],
     position: 0
     });
     // Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'problemWall', {
     title: '问题墙',
     state: 'problemWall.curd',
     roles: ['*']
     });*/
  }
}());
