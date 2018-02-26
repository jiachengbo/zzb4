(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', {message: $location.url() + ' not find'}, {
        location: false
      });
    });

    $stateProvider
      .state('tools', {
        abstract: true,
        url: '/tools',
        data: {
          roles: ['aaaa'],
          childSystem: ['tools.**'],
          pageTitle: '应用工具'
        }
      });

    //如果没有定义home
    if (!$stateProvider.stateService.get('home')) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/modules/core/client/views/home.client.view.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        });
    }
    if (!$stateProvider.stateService.get('not-found')) {
      $stateProvider
        .state('not-found', {
          url: '/not-found',
          templateUrl: '/modules/core/client/views/404.client.view.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          params: {
            message: function ($stateParams) {
              return $stateParams.message;
            }
          },
          data: {
            ignoreState: true,
            pageTitle: 'Not Found'
          }
        });
    }
    if (!$stateProvider.stateService.get('bad-request')) {
      $stateProvider
        .state('bad-request', {
          url: '/bad-request',
          templateUrl: '/modules/core/client/views/400.client.view.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          params: {
            message: function ($stateParams) {
              return $stateParams.message;
            }
          },
          data: {
            ignoreState: true,
            pageTitle: 'Bad Request'
          }
        });
    }
    if (!$stateProvider.stateService.get('forbidden')) {
      $stateProvider
        .state('forbidden', {
          url: '/forbidden',
          templateUrl: '/modules/core/client/views/403.client.view.html',
          controller: 'ErrorController',
          controllerAs: 'vm',
          params: {
            message: function ($stateParams) {
              return $stateParams.message;
            }
          },
          data: {
            ignoreState: true,
            pageTitle: 'Forbidden'
          }
        });
    }
  }
}());
