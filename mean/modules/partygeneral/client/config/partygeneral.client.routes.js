(function () {
  'use strict';

  angular
    .module('partygeneral.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('partygeneral', {
        abstract: true,
        url: '/partygeneral',
        template: '<ui-view/>'
      })
      .state('partygeneral.curd', {
        url: '/curd',
        templateUrl: '/modules/partygeneral/client/views/partygeneral-curdtable.client.view.html',
        controller: 'PartygeneralCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Partygeneral CURD Table'
        }
      });
  }
}());
