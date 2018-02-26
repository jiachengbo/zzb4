(function () {
  'use strict';

  angular
    .module('core')
    .factory('httpLoaderInterceptor', httpLoaderInterceptor);

  httpLoaderInterceptor.$inject = ['$q', '$injector'];

  function httpLoaderInterceptor($q, $injector) {
    var appService;

    var service = {
      request: function(config) {
        setMaskOver(config.url, true);
        return config || $q.when(config);
      },
      response: function(response) {
        setMaskOver(response.config.url, false);
        return response || $q.when(response);
      },
      requestError: function(rejection) {
        setMaskOver(rejection.config.url, false);
        return $q.reject(rejection);
      },
      responseError: function(rejection) {
        setMaskOver(rejection.config.url, false);
        return $q.reject(rejection);
      }
    };

    return service;

    function setMaskOver(url, isOpen) {
      if (!appService) {
        appService = $injector.get('appService');
      }
      if (isOpen) {
        appService.openMaskOver(url);
      } else {
        appService.closeMaskOver(url);
      }
    }
  }
}());
