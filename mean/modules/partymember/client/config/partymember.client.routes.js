(function () {
  'use strict';

  angular
    .module('partymember.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partymember', {
        abstract: true,
        url: '/partymember',
        template: '<ui-view/>',
        data: {
          pageTitle: '党员信息管理'
        }
      })
      .state('partymember.curd', {
        url: '/curd',
        templateUrl: '/modules/partymember/client/views/partymember-curdtable.client.view.html',
        controller: 'PartymemberCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党委'
        }
      })
      .state('partymember.curd.one', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-one.client.view.html',
            controller: 'PartymemberOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0
        },
        data: {
          pageTitle: '党委一级页面'
        }
      })
      .state('partymember.curd.commone', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-committee-one.client.view.html',
            controller: 'PartymemberCommOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0
        },
        data: {
          pageTitle: '党工委一级页面'
        }
      })
      .state('partymember.curd.two', {
        url: '/two',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-two.client.view.html',
            controller: 'PartymemberTwoController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0,
          typename: ''
        },
        data: {
          pageTitle: '二级页面'
        }
      })
      .state('partymember.curd.three', {
        url: '/three',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-three.client.view.html',
            controller: 'PartymemberThreeController',
            controllerAs: 'vmo'
          }
        },
        params: {
          tj: '',
          orgInfo: ''
        },
        data: {
          pageTitle: '三级页面'
        }
      })
      .state('partymember.curd.main', {
        url: '/main',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-main.client.view.html',
            controller: 'PartymemberMainController',
            controllerAs: 'vmo'
          }
        },
        params: {
          tj: '',
          orgInfo: ''
        },
        data: {
          pageTitle: '主页面'
        }
      })
      .state('partymember.curd.chart', {
        url: '/chart',
        views: {
          'buttonview': {
            templateUrl: '/modules/partymember/client/views/partymember-chart.client.view.html',
            controller: 'PartymemberChartController',
            controllerAs: 'cmo'
          }
        },
        data: {
          pageTitle: '统计页面'
        }
      });
  }
}());
