(function () {
  'use strict';

  angular
    .module('threefive')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window', '$timeout'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window, $timeout*/) {
   /* var user_grade;
    var branch;
    var supers;
    var iscomm;
    var JCDJ_User_roleID;
    var PartyBranch = baseCodeService.getItems('dj_PartyBranch');

    if (appService.user) {
      user_grade = appService.user.user_grade;
      user_grade = appService.user.user_grade;
      JCDJ_User_roleID = appService.user.JCDJ_User_roleID;
      branch = appService.user.branch;
      angular.forEach(PartyBranch, function (v, k) {
        if (v.OrganizationId === branch) {
          supers = v.super;
          if (v.belongComm === 1) {
            iscomm = true;
          } else {
            iscomm = false;
          }
        }

      });
      if (user_grade === 1 || user_grade === 3 || (user_grade === 5 && JCDJ_User_roleID > 31 && JCDJ_User_roleID < 41) || (user_grade === 7 && supers < 10 && iscomm) || (user_grade === 10 && supers < 10 && iscomm)) {
        menuService.addMenuItem('sidemenu', {
          title: '网格三长五员',
          state: 'threefive.curd',
          /!* type: 'dropdown',*!/
          roles: ['cityjcdj'],
          position: 0
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'threefive', {
          title: 'manager Threefive Table',
          state: 'threefive.curd',
          roles: ['*']
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '网格三长五员',
          state: 'threefive.curd',
          roles: ['aaaa'],
          position: 0
        });

        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'threefive', {
          title: 'manager Threefive Table',
          state: 'threefive.curd',
          roles: ['*']
        });
      }
    }*/
    menuService.addMenuItem('sidemenu', {
      title: '网格三长五员',
      state: 'threefive.curd',
      /* type: 'dropdown',*/
      roles: ['threefive'],
      position: -4
    });

  }
}());
