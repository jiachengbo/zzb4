(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('PageService', PageService);

  PageService.$inject = ['$resource', '$log'];

  function PageService($resource, $log) {
    var Page = $resource('/api/page/:pageId', {
      pageId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Page.prototype, {
      createOrUpdate: function () {
        var page = this;
        return createOrUpdate(page);
      }
    });

    return Page;

    function createOrUpdate(page) {
      if (page.id) {
        return page.$update(onSuccess, onError);
      } else {
        return page.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(page) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
