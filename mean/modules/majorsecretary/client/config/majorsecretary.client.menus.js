(function () {
  'use strict';

  angular
    .module('majorsecretary')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService'*/];

  function menuConfig(menuService/*, appService, baseCodeService*/) {
    /*var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var grade;
    var branch;
    var belongComm;
    if (appService.user) {
      grade = appService.user.user_grade;
      branch = appService.user.branch;
      angular.forEach(dj_PartyBranch, function (v, k) {
        if (v.OrganizationId === branch) {
          belongComm = v.belongComm;
        }
      });
      if ((grade === 6 || grade === 7 || grade === 10 || grade === 9) && belongComm) {
        console.log('aaaaaaa');
        menuService.addMenuItem('sidemenu', {
          title: '第一书记',
          state: 'majorsecretary.curd',
          // type: 'dropdown',
          roles: ['jcxxgl'],
          position: 0
        });
      } else {
        menuService.addMenuItem('sidemenu', {
          title: '第一书记',
          state: 'majorsecretary.curd',
          // type: 'dropdown',
          roles: ['aaaa'],
          position: 0
        });
      }
    }*/

    menuService.addMenuItem('sidemenu', {
      title: '第一书记',
      state: 'majorsecretary.curd',
      // type: 'dropdown',
      roles: ['firstshuji'],
      position: 10
    });
    // Add the dropdown list item
    // menuService.addSubMenuItem('sidemenu', 'majorsecretary', {
    //   title: 'manager Majorsecretary Table',
    //   state: 'majorsecretary.curd',
    //   roles: ['*']
    // });

  }
}());
