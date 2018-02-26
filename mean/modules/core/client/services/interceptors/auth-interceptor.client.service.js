(function () {
  'use strict';

  angular
    .module('core')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$q', '$injector'];

  function authInterceptor($q, $injector) {
    var service = {
      responseError: responseError
    };

    return service;

    function responseError(rejection) {
      var Notification = $injector.get('Notification');
      if (!rejection.config.ignoreAuthModule) {
        switch (rejection.status) {
          case 400:
            $injector.get('$state').go('bad-request', {message: rejection.data.message});
            break;
          case 401: {
            Notification.error({message: '用户登录信息已经过期或没有登录.', delay: 5000 });
            var appService = $injector.get('appService');
            //用户下线
            appService.userOffline();
            //$injector.get('$state').transitionTo('authentication.signin');
            appService.gotoSignin();
            break;
          }
          case 403:
            $injector.get('$state').transitionTo('forbidden');
            break;
          case 404:
            $injector.get('$state').go('not-found', {message: rejection.data.message});
            break;
          case -1:  // Handle error if no response from server(Network Lost or Server not responding)
            Notification.error({message: 'No response received from server. Please try again later.', title: 'Error processing request!', delay: 5000 });
            break;
        }
      }
      // otherwise, default behaviour
      return $q.reject(rejection);
    }
  }
}());
