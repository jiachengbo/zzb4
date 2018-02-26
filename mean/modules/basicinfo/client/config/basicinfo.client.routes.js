(function () {
  'use strict';

  angular
    .module('basicinfo.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('basicinfo', {
        abstract: true,
        url: '/basicinfo',
        template: '<ui-view/>'
      })
      .state('basicinfo.topvoice', {
        url: '/topvoice',
        templateUrl: '/modules/basicinfo/client/views/basicinfo-topvoicetable.client.view.html',
        controller: 'TopVoiceTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '高层声音'
        },
        params: {
          type: 1
        }
      });
  }
}());
