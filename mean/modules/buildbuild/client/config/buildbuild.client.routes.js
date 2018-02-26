(function () {
  'use strict';

  angular
    .module('buildbuild.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('buildbuild', {
        abstract: true,
        url: '/buildbuild',
        template: '<ui-view/>'
      })
      .state('buildbuild.curd', {
        url: '/curd',
        templateUrl: '/modules/buildbuild/client/views/buildbuild-curdtable.client.view.html',
        controller: 'BuildbuildCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Buildbuild CURD Table'
        }
      });
  }
}());
