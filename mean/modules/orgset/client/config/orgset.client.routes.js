(function () {
  'use strict';

  angular
    .module('orgset.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('orgset', {
        abstract: true,
        url: '/orgset',
        template: '<ui-view/>'
      })
      .state('orgset.ldxz', {
        url: '/ldxz',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 1,
          title: '区委党建领导小组'
        },
        data: {
          pageTitle: '领导小组'
        }
      })
      .state('orgset.lxh', {
        url: '/lxh',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 2,
          title: '区城市基层党建联席会'
        },
        data: {
          pageTitle: '联席会'
        }
      })
      .state('orgset.zhpt', {
        url: '/zhpt',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 3,
          title: '区城市基层党建指挥平台'
        },
        data: {
          pageTitle: '指挥平台'
        }
      })
      .state('orgset.hx', {
        url: '/hx',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 4,
          title: '环西街道联席会'
        },
        data: {
          pageTitle: '环西街道平台'
        }
      })
      .state('orgset.ty', {
        url: '/ty',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 5,
          title: '桃园街道联席会'
        },
        data: {
          pageTitle: '桃园街道平台'
        }
      })
      .state('orgset.qnl', {
        url: '/qnl',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 6,
          title: '青年路街道联席会'
        },
        data: {
          pageTitle: '青年路街道平台'
        }
      })
      .state('orgset.bym', {
        url: '/bym',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 7,
          title: '北院门街道联席会'
        },
        data: {
          pageTitle: '北院门街道平台'
        }
      })
      .state('orgset.bg', {
        url: '/bg',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 8,
          title: '北关街道联席会'
        },
        data: {
          pageTitle: '北关街道平台'
        }
      })
      .state('orgset.xg', {
        url: '/xg',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 9,
          title: '西关街道联席会'
        },
        data: {
          pageTitle: '西关街道平台'
        }
      })
      .state('orgset.tm', {
        url: '/tm',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 10,
          title: '土门街道联席会'
        },
        data: {
          pageTitle: '土门街道平台'
        }
      })
      .state('orgset.zy', {
        url: '/zy',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 11,
          title: '枣园街道联席会'
        },
        data: {
          pageTitle: '枣园街道平台'
        }
      })
      .state('orgset.hmp', {
        url: '/hmp',
        templateUrl: '/modules/orgset/client/views/orgset-curdtable.client.view.html',
        controller: 'OrgsetCURDTableController',
        controllerAs: 'vm',
        params: {
          orgId: 12,
          title: '红庙坡街道联席会'
        },
        data: {
          pageTitle: '红庙坡街道平台'
        }
      });
  }
}());
