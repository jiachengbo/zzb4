(function () {
  'use strict';

  angular
    .module('task.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('task', {
        abstract: true,
        url: '/task',
        template: '<ui-view/>'
      })
      .state('task.curd', {
        url: '/curd',
        templateUrl: '/modules/task/client/views/task-curdtable.client.view.html',
        controller: 'TaskCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Task CURD Table'
        }
      })
      .state('task.progress', {
        url: '/progress',
        templateUrl: '/modules/task/client/views/taskProgress.client.view.html',
        controller: 'TaskProgressController',
        controllerAs: 'vm',
        params: {
          id: 0,
          pagenum: 1
        },
        data: {
          pageTitle: 'Task CURD Table'
        }
      })
      .state('task.progresslist', {
        url: '/progresslist',
        templateUrl: '/modules/task/client/views/taskProgresslist.client.view.html',
        controller: 'TaskProgressListController',
        controllerAs: 'vm',
        params: {
          id: 0,
          person: 'own'
        },
        data: {
          pageTitle: 'Task CURD Table'
        }
      });
  }
}());
