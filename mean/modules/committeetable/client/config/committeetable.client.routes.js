(function () {
  'use strict';

  angular
    .module('committeeTable.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('committeeTable', {
        abstract: true,
        url: '/committeeTable',
        template: '<ui-view/>'
      })
      .state('committeeTable.hmp', {
        url: '/hmp',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 9
        }
      })
      .state('committeeTable.zy', {
        url: '/zy',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 8
        }
      })
      .state('committeeTable.tm', {
        url: '/tm',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 7
        }
      })
      .state('committeeTable.xg', {
        url: '/xg',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 6
        }
      })
      .state('committeeTable.bg', {
        url: '/bg',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 5
        }
      })
      .state('committeeTable.bym', {
        url: '/bym',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 4
        }
      })
      .state('committeeTable.qnl', {
        url: '/qnl',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 3
        }
      })
      .state('committeeTable.ty', {
        url: '/ty',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 2
        }
      })
      .state('committeeTable.hx', {
        url: '/hx',
        templateUrl: '/modules/committeetable/client/views/committeetable-curdtable.client.view.html',
        controller: 'CommitteeTableCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 1
        }
      })

    ;
  }
}());
