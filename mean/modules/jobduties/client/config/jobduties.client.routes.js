(function () {
  'use strict';

  angular
    .module('jobduties.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('jobduties', {
        abstract: true,
        url: '/jobduties',
        template: '<ui-view/>'
      })
      .state('jobduties.curd', {
        url: '/curd',
        templateUrl: '/modules/jobduties/client/views/jobduties-curdtable.client.view.html',
        controller: 'JobdutiesCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Jobduties CURD Table'
        }
      });
  }
}());
