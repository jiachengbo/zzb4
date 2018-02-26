(function () {
  'use strict';

  angular
    .module('relationswitch')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window*/) {
    menuService.addMenuItem('sidemenu', {
      title: '党员关系转接管理',
      state: 'relationswitch',
      type: 'dropdown',
      roles: ['jcxxglhhj'],
      position: -7
    });

    /*// Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'relationswitch', {
     title: '党委党员关系转入',
     state: 'relationswitch.curd.dwinone',
     roles: ['*']
     });
     // Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'relationswitch', {
     title: '党工委党员关系转入',
     state: 'relationswitch.curd.dgwinone',
     roles: ['*']
     });
     // Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'relationswitch', {
     title: '党委党员关系转出',
     state: 'relationswitch.curd.dwoutone',
     roles: ['*']
     });
     // Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'relationswitch', {
     title: '党工委党员关系转出',
     state: 'relationswitch.curd.dgwoutone',
     roles: ['*']
     });*/
    /*var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    if (appService.user) {
      var arr = [];
      var obj = {};
      var obj1;
      var name;
      var orgstr;
      if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
        angular.forEach(PartyBranch, function (value, key) {
          if (value.OrganizationId === appService.user.branch) {
            obj1 = value;
            angular.forEach(PartyGeneralBranch, function (v, i) {
              if (obj1.generalbranch === v.branchID) {
                this.push(v);
              }
            }, arr);
            console.log(arr);
          }
        });
        angular.forEach(PartyOrganization, function (value, key) {
          if (value.typeID === arr[0].superior) {
            name = value.typeName;
          }
        });
        orgstr = [{'orgid': arr[0].superior, 'orgname': name}];
        obj.orgInfo = orgstr;
        obj.id = arr[0].branchID;
        $window.localStorage.setItem('relation1', JSON.stringify(obj));
        $window.localStorage.setItem('relation', JSON.stringify({}));
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: arr[0].simpleName + '党员关系转入',
          state: 'relationswitch.curd.three',
          roles: ['user', 'quwei']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: arr[0].simpleName + '党员关系转出',
          state: 'relationswitch.curd.three1',
          roles: ['user', 'quwei']
        });
      } else if (appService.user.user_grade === 6 || appService.user.user_grade === 7 || appService.user.user_grade === 8) {
        angular.forEach(PartyBranch, function (value, key) {
          if (value.OrganizationId === appService.user.branch) {
            obj1 = value;
          }
        });
        angular.forEach(PartyOrganization, function (value, key) {
          if (value.typeID === obj1.super) {
            name = value.typeName;
          }
        });
        obj.OrganizationId = obj1.OrganizationId;
        obj.OrganizationName = obj1.simpleName;
        $window.localStorage.setItem('relation1', JSON.stringify({}));
        $window.localStorage.setItem('relation', JSON.stringify(obj));
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: obj1.simpleName + '党员关系转入',
          state: 'relationswitch.curd.inmain',
          roles: ['user', 'quwei']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: obj1.simpleName + '党员关系转出',
          state: 'relationswitch.curd.outmain',
          roles: ['user', 'quwei']
        });
      } else {
        $window.localStorage.setItem('relation1', JSON.stringify(obj));
        $window.localStorage.setItem('relation', JSON.stringify(obj));
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: '党委党员关系转入',
          state: 'relationswitch.curd.dwinone',
          roles: ['dangwei', 'quwei']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: '党工委党员关系转入',
          state: 'relationswitch.curd.dgwinone',
          roles: ['danggongwei', 'quwei']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: '党委党员关系转出',
          state: 'relationswitch.curd.dwoutone',
          roles: ['dangwei', 'quwei']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'relationswitch', {
          title: '党工委党员关系转出',
          state: 'relationswitch.curd.dgwoutone',
          roles: ['danggongwei', 'quwei']
        });
      }
    }*/
  }
}());
