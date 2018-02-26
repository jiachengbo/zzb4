(function () {
  'use strict';

  angular
    .module('partymember')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window', '$timeout'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window, $timeout*/) {
    //区委菜单
    menuService.addMenuItem('sidemenu', {
      title: '党员信息管理',
      state: 'partymember',
      type: 'dropdown',
      roles: ['partymer'],
      position: 17
    });
    menuService.addSubMenuItem('sidemenu', 'partymember', {
      title: '党委',
      state: 'partymember.curd.one',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'partymember', {
      title: '党工委',
      state: 'partymember.curd.commone',
      roles: ['*']
    });
    //党委菜单
    menuService.addMenuItem('sidemenu', {
      title: '党员信息管理',
      state: 'partymember.curd.one',
      roles: ['partymerdw'],
      position: 17
    });
    //党工委菜单
    menuService.addMenuItem('sidemenu', {
      title: '党员信息管理',
      state: 'partymember.curd.commone',
      roles: ['partymerdgw'],
      position: 17
    });
    //党总支菜单
    menuService.addMenuItem('sidemenu', {
      title: '党员信息管理',
      state: 'partymember.curd.three',
      roles: ['partymerdzz'],
      position: 17
    });
    //党支部菜单
    menuService.addMenuItem('sidemenu', {
      title: '党员信息管理',
      state: 'partymember.curd.main',
      roles: ['partymerdzb'],
      position: 17
    });
    /* var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
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
     $window.localStorage.setItem('Orgtj11', JSON.stringify(obj));
     $window.localStorage.setItem('Orgtj', JSON.stringify({}));
     menuService.addSubMenuItem('sidemenu', 'partymember', {
     title: arr[0].simpleName,
     state: 'partymember.curd.three',
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
     orgstr = [{'orgid': obj1.super, 'orgname': name}];
     obj.orgInfo = orgstr;
     obj.OrganizationId = obj1.OrganizationId;
     obj.OrganizationName = obj1.simpleName;
     $window.localStorage.setItem('Orgtj11', JSON.stringify({}));
     $window.localStorage.setItem('Orgtj', JSON.stringify(obj));
     menuService.addSubMenuItem('sidemenu', 'partymember', {
     title: obj1.simpleName,
     state: 'partymember.curd.main',
     roles: ['user', 'quwei']
     });
     } else {

     $window.localStorage.setItem('Orgtj11', JSON.stringify(obj));
     $window.localStorage.setItem('Orgtj', JSON.stringify(obj));
     menuService.addSubMenuItem('sidemenu', 'partymember', {
     title: '党委',
     state: 'partymember.curd.one',
     roles: ['dangwei', 'quwei']
     });
     menuService.addSubMenuItem('sidemenu', 'partymember', {
     title: '党工委',
     state: 'partymember.curd.commone',
     roles: ['danggongwei', 'quwei']
     });
     }
     }*/
  }
}());
