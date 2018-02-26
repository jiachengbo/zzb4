(function () {
  'use strict';

  angular
    .module('appeal.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('appeal', {
        abstract: true,
        url: '/appeal',
        template: '<ui-view/>'
      })
      .state('appeal.djappeal', {
        url: '/djappeal',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 0
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.curd', {
        url: '/hmp',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 9
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.zy', {
        url: '/zy',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 8
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.hx', {
        url: '/hx',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 1
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.ty', {
        url: '/ty',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 2
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.qnl', {
        url: '/qnl',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 3
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.bym', {
        url: '/bym',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 4
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.bg', {
        url: '/bg',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 5
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.xg', {
        url: '/xg',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 6
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
      .state('appeal.tm', {
        url: '/tm',
        templateUrl: '/modules/appeal/client/views/appeal-curdtable.client.view.html',
        controller: 'AppealCURDTableController',
        controllerAs: 'vm',
        params: {
          jb: 7
        },
        data: {
          pageTitle: 'Appeal CURD Table'
        }
      })
    ;


  }
}());
