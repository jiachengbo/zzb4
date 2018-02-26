(function () {
  'use strict';

  angular
    .module('partyorganization.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partyorganization', {
        abstract: true,
        url: '/partyorganization',
        template: '<ui-view/>',
        data: {
          pageTitle: '党组织信息管理'
        }
      })
      .state('partyorganization.curd', {
        url: '/curd',
        templateUrl: '/modules/partyorganization/client/views/partyorganization-curdtable.client.view.html',
        controller: 'PartyorganizationCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党委'
        }
      })
      .state('partyorganization.curd.dw', {
        url: '/dw',
        views: {
          'buttonview': {
            templateUrl: '/modules/partyorganization/client/views/partyorganization-dw.client.view.html',
            controller: 'PartyorganizationDWController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0,
          typename: '',
          type: 2
        },
        data: {
          pageTitle: '部门党委'
        }
      })
      .state('partyorganization.curd.dgw', {
        url: '/dgw',
        views: {
          'buttonview': {
            templateUrl: '/modules/partyorganization/client/views/partyorganization-dgw.client.view.html',
            controller: 'PartyorganizationDGWController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0,
          typename: '',
          type: 3
        },
        data: {
          pageTitle: '街道党工委'
        }
      })
      .state('partyorganization.curd.main', {
        url: '/main',
        views: {
          'buttonview': {
            templateUrl: '/modules/partyorganization/client/views/partyorganization-main.client.view.html',
            controller: 'PartyorganizationMainController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 0,
          typename: '',
          type: 0
        },
        data: {
          pageTitle: '主页面'
        }
      })
      .state('partyorganization.curd.chart', {
        url: '/chart',
        views: {
          'buttonview': {
            templateUrl: '/modules/partyorganization/client/views/partyorganization-chart.client.view.html',
            controller: 'PartyorganizationChartController',
            controllerAs: 'cmo'
          }
        },
        data: {
          pageTitle: '统计页面'
        }
      });
  }
}());
