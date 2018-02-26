(function () {
  'use strict';

  angular
    .module('teammembers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('teammembers', {
        abstract: true,
        url: '/teammembers',
        template: '<ui-view/>'
      })
      .state('teammembers.curd', {
        url: '/curd',
        templateUrl: '/modules/teammembers/client/views/teammembers-curdtable.client.view.html',
        controller: 'TeammembersCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Teammembers CURD Table'
        }
      });
  }
}());
