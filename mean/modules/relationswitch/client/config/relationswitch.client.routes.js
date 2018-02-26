(function () {
  'use strict';

  angular
    .module('relationswitch.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('relationswitch', {
        abstract: true,
        url: '/relationswitch',
        template: '<ui-view/>',
        data: {
          pageTitle: '党员关系转接管理'
        }
      })
      .state('relationswitch.curd', {
        url: '/curd',
        templateUrl: '/modules/relationswitch/client/views/relationswitch.client.view.html',
        controller: 'RelationswitchController',
        controllerAs: 'vm'
      })
      .state('relationswitch.curd.dwinone', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-dw-one.client.view.html',
            controller: 'RelationswitchDWOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 1
        },
        data: {
          pageTitle: '党委转入一级页面'
        }
      })
      .state('relationswitch.curd.dgwinone', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-dgw-one.client.view.html',
            controller: 'RelationswitchDGWOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 2
        },
        data: {
          pageTitle: '党工委转入一级页面'
        }
      })
      .state('relationswitch.curd.dwoutone', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-dw-one.client.view.html',
            controller: 'RelationswitchDWOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 1
        },
        data: {
          pageTitle: '党委转出一级页面'
        }
      })
      .state('relationswitch.curd.dgwoutone', {
        url: '/one',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-dgw-one.client.view.html',
            controller: 'RelationswitchDGWOneController',
            controllerAs: 'vmo'
          }
        },
        params: {
          typeid: 2
        },
        data: {
          pageTitle: '党工委转出一级页面'
        }
      })
      .state('relationswitch.curd.two', {
        url: '/two',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-two.client.view.html',
            controller: 'RelationswitchTwoController',
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
      .state('relationswitch.curd.three', {
        url: '/three',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-three.client.view.html',
            controller: 'RelationswitchThreeController',
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
      .state('relationswitch.curd.three1', {
        url: '/three1',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-three.client.view.html',
            controller: 'RelationswitchThreeController',
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
      .state('relationswitch.curd.inmain', {
        url: '/main',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-in-main.client.view.html',
            controller: 'RelationswitchInMainController',
            controllerAs: 'vmo'
          }
        },
        params: {
          tj: '',
          orgInfo: ''
        },
        data: {
          pageTitle: '转入主页面'
        }
      })
      .state('relationswitch.curd.outmain', {
        url: '/main',
        views: {
          'buttonview': {
            templateUrl: '/modules/relationswitch/client/views/relationswitch-out-main.client.view.html',
            controller: 'RelationswitchOutMainController',
            controllerAs: 'vmo'
          }
        },
        params: {
          tj: '',
          orgInfo: ''
        },
        data: {
          pageTitle: '转出主页面'
        }
      });
  }
}());
