(function () {
  'use strict';

  angular
    .module('littleWishTable.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('littleWishTable', {
        abstract: true,
        url: '/littleWishTable',
        template: '<ui-view/>'
      })
      .state('littleWishTable.drl', {
        url: '/drl',
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-curdtable.client.view.html',
        controller: 'LittleWishTableCURDTableController',
        controllerAs: 'vm',
        params: {
          littleStatus: '待认领'
        },
        data: {
          pageTitle: '待认领'
        }
      })
      .state('littleWishTable.dsh', {
        url: '/dsh',
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-curdtable.client.view.html',
        controller: 'LittleWishTableCURDTableController',
        controllerAs: 'vm',
        params: {
          littleStatus: '待审核'
        },
        data: {
          pageTitle: '待审核'
        }
      })
      .state('littleWishTable.wtg', {
        url: '/wtg',
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-curdtable.client.view.html',
        controller: 'LittleWishTableCURDTableController',
        controllerAs: 'vm',
        params: {
          littleStatus: '未通过'
        },
        data: {
          pageTitle: '未通过'
        }
      })
      .state('littleWishTable.yrl', {
        url: '/yrl',
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-curdtable.client.view.html',
        controller: 'LittleWishTableCURDTableController',
        controllerAs: 'vm',
        params: {
          littleStatus: '已认领'
        },
        data: {
          pageTitle: '已认领'
        }
      })
      .state('littleWishTable.ywc', {
        url: '/ywc',
        templateUrl: '/modules/littlewishtable/client/views/littlewishtable-curdtable.client.view.html',
        controller: 'LittleWishTableCURDTableController',
        controllerAs: 'vm',
        params: {
          littleStatus: '已完成'
        },
        data: {
          pageTitle: '已完成'
        }
      });
  }
}());
