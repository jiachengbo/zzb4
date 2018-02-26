(function () {
  'use strict';

  angular
    .module('partyorganization')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window*/) {
    //区委菜单
    menuService.addMenuItem('sidemenu', {
      title: '党支部信息管理',
      state: 'partyorganization',
      type: 'dropdown',
      roles: ['partyzuzhi'],
      position: 15
    });
    menuService.addSubMenuItem('sidemenu', 'partyorganization', {
      title: '党委',
      state: 'partyorganization.curd.dw',
      roles: ['*']
    });
    menuService.addSubMenuItem('sidemenu', 'partyorganization', {
      title: '党工委',
      state: 'partyorganization.curd.dgw',
      roles: ['*']
    });
    //党委党工委党总支党支部菜单
    menuService.addMenuItem('sidemenu', {
      title: '党支部信息管理',
      state: 'partyorganization.curd.main',
      roles: ['partyzuzhidwordgw'],
      position: 16
    });
    /*//菜单
    menuService.addMenuItem('sidemenu', {
      title: '党组织信息管理',
      state: 'partyorganization.curd.main',
      roles: ['partyzuzhidzzordzb'],
      position: 0
    });*/
    /*var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
     var PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
     var PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
     if (appService.user) {
     var arr = [];
     var obj = {};
     var obj1;
     var name;
     var genera;
     var grade = appService.user.user_grade;
     var branch = appService.user.branch;
     var zhibuname;
     var orgstr = {};
     if (branch) {
     angular.forEach(PartyBranch, function (value, key) {
     if (value.OrganizationId === appService.user.branch) {
     obj1 = value;
     if (!obj1.generalbranch) {
     zhibuname = value.simpleName;
     }
     }
     });
     angular.forEach(PartyOrganization, function (value, key) {
     if (value.typeID === obj1.super) {
     name = value;
     }
     });
     angular.forEach(PartyGeneralBranch, function (value, key) {
     if (value.branchID === obj1.generalbranch) {
     genera = value;
     zhibuname = value.simpleName;
     }
     });
     }
     if (appService.user.user_grade === 5 || appService.user.user_grade === 4) {
     menuService.addMenuItem('sidemenu', {
     title: '党组织信息管理',
     state: 'partyorganization',
     type: 'dropdown',
     roles: ['jcxxgl'],
     position: -7
     });
     obj.typeid = name.typeID;
     obj.typename = name.typeName;
     $window.localStorage.setItem('Orgparty', JSON.stringify(obj));
     // $window.localStorage.setItem('Orgtj', JSON.stringify({}));
     menuService.addSubMenuItem('sidemenu', 'partyorganization', {
     title: name.typeName,
     state: 'partyorganization.curd.main',
     roles: ['user', 'quwei']
     });
     } else if (appService.user.user_grade === 6 || appService.user.user_grade === 7 || appService.user.user_grade === 8 || appService.user.user_grade === 9 || appService.user.user_grade === 10) {
     menuService.addMenuItem('sidemenu', {
     title: '党组织信息管理',
     state: 'partyorganization',
     type: 'dropdown',
     roles: ['jcxxgl'],
     position: -7
     });
     menuService.addSubMenuItem('sidemenu', 'partyorganization', {
     title: zhibuname,
     state: 'partyorganization.curd.main',
     roles: ['user']
     });
     orgstr.typeid = name.typeID;
     orgstr.typename = name.typeName;
     if (grade === 6 || grade === 7) {
     orgstr.OrganizationId = obj1.OrganizationId;
     } else if (grade === 9 || grade === 10) {
     orgstr.generalbranch = obj1.generalbranch;
     }
     $window.localStorage.setItem('Orgparty', JSON.stringify(orgstr));
     } else {
     menuService.addMenuItem('sidemenu', {
     title: '党组织信息管理',
     state: 'partyorganization',
     type: 'dropdown',
     roles: ['jcxxgl'],
     position: -7
     });
     $window.localStorage.setItem('Orgparty', JSON.stringify(obj));
     menuService.addSubMenuItem('sidemenu', 'partyorganization', {
     title: '党委',
     state: 'partyorganization.curd.dw',
     roles: ['dangwei', 'quwei']
     });
     // Add the dropdown list item
     menuService.addSubMenuItem('sidemenu', 'partyorganization', {
     title: '党工委',
     state: 'partyorganization.curd.dgw',
     roles: ['danggongwei', 'quwei']
     });
     }
     }*/
  }
}());
