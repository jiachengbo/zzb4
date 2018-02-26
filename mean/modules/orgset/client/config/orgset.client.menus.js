(function () {
  'use strict';

  angular
    .module('orgset')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'/*, 'appService', 'baseCodeService', '$window'*/];

  function menuConfig(menuService/*, appService, baseCodeService, $window*/) {
    /*var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var supers;
    var iscomm;
    var names;
    if (appService.user) {
      if (appService.user.user_grade === 7 || appService.user.user_grade === 8 || appService.user.user_grade === 9 || appService.user.user_grade === 10) {
        angular.forEach(PartyBranch, function (v, k) {
          if (v.OrganizationId === appService.user.branch) {
            if (v.belongComm === 1) {
              iscomm = true;
            } else {
              iscomm = false;
            }
            if (v.super < 10) {
              supers = v.super;
            }
          }
        });
      } else {
        supers = null;
      }
      if (appService.user.user_grade === 1) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '区委党建领导小组',
          state: 'orgset.ldxz',
          roles: ['*']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '区城市基层党建联席会',
          state: 'orgset.lxh',
          roles: ['*']
        });
        // Add the dropdown list item
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '区城市基层党建指挥平台',
          state: 'orgset.zhpt',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '环西街道联席会',
          state: 'orgset.hx',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '桃园街道联席会',
          state: 'orgset.ty',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '青年路街道联席会',
          state: 'orgset.qnl',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '北院门街道联席会',
          state: 'orgset.bym',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '北关街道联席会',
          state: 'orgset.bg',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '西关街道联席会',
          state: 'orgset.xg',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '土门街道联席会',
          state: 'orgset.tm',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '枣园街道联席会',
          state: 'orgset.zy',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '红庙坡街道联席会',
          state: 'orgset.hmp',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 3) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '环西街道联席会',
          state: 'orgset.hx',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '桃园街道联席会',
          state: 'orgset.ty',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '青年路街道联席会',
          state: 'orgset.qnl',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '北院门街道联席会',
          state: 'orgset.bym',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '北关街道联席会',
          state: 'orgset.bg',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '西关街道联席会',
          state: 'orgset.xg',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '土门街道联席会',
          state: 'orgset.tm',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '枣园街道联席会',
          state: 'orgset.zy',
          roles: ['*']
        });
        // 街道党工委 联席会
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: '红庙坡街道联席会',
          state: 'orgset.hmp',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 32 || supers === 1 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '青年路街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.qnl',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 33 || supers === 2 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '北院门街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.bym',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 34 || supers === 3 && iscomm) {
        console.log('aaaaaaa');
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '北关街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.bg',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 35 || supers === 4 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '红庙坡街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.hmp',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 36 || supers === 5 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '西关街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.xg',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 37 || supers === 6 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '土门街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.tm',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 38 || supers === 7 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '环西街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.hx',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 39 || supers === 8 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '桃园街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.ty',
          roles: ['*']
        });
      } else if (appService.user.user_grade === 5 && appService.user.JCDJ_User_roleID === 40 || supers === 9 && iscomm) {
        menuService.addMenuItem('sidemenu', {
          title: '组织设置',
          state: 'orgset',
          type: 'dropdown',
          roles: ['cityjcdj'],
          position: -1
        });
        if (supers) {
          names = '社区党建联合会';
        } else {
          names = '枣园街道联席会';
        }
        menuService.addSubMenuItem('sidemenu', 'orgset', {
          title: names,
          state: 'orgset.zy',
          roles: ['*']
        });
      }
    }*/
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset',
      type: 'dropdown',
      roles: ['orgset'],
      position: -10
    });
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '区委党建领导小组',
      state: 'orgset.ldxz',
      roles: ['*']
    });
    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '区城市基层党建联席会',
      state: 'orgset.lxh',
      roles: ['*']
    });
    // Add the dropdown list item
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '区城市基层党建指挥平台',
      state: 'orgset.zhpt',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '环西街道联席会',
      state: 'orgset.hx',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '桃园街道联席会',
      state: 'orgset.ty',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '青年路街道联席会',
      state: 'orgset.qnl',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '北院门街道联席会',
      state: 'orgset.bym',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '北关街道联席会',
      state: 'orgset.bg',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '西关街道联席会',
      state: 'orgset.xg',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '土门街道联席会',
      state: 'orgset.tm',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '枣园街道联席会',
      state: 'orgset.zy',
      roles: ['*']
    });
    // 街道党工委 联席会
    menuService.addSubMenuItem('sidemenu', 'orgset', {
      title: '红庙坡街道联席会',
      state: 'orgset.hmp',
      roles: ['*']
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.hx',
     /* type: 'dropdown',*/
      roles: ['orgsethx'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.ty',
      /* type: 'dropdown',*/
      roles: ['orgsetty'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.qnl',
      /* type: 'dropdown',*/
      roles: ['orgsetqnl'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.bym',
      /* type: 'dropdown',*/
      roles: ['orgsetbym'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.bg',
      /* type: 'dropdown',*/
      roles: ['orgsetbg'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.xg',
      /* type: 'dropdown',*/
      roles: ['orgsetxg'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.tm',
      /* type: 'dropdown',*/
      roles: ['orgsettm'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.zy',
      /* type: 'dropdown',*/
      roles: ['orgsetzy'],
      position: -10
    });
    menuService.addMenuItem('sidemenu', {
      title: '组织设置',
      state: 'orgset.hmp',
      /* type: 'dropdown',*/
      roles: ['orgsethmp'],
      position: -10
    });
  }
}());
