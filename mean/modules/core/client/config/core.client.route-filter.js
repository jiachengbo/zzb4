(function () {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state', 'appService'];

  function routeFilter($rootScope, $state, appService) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      // Check authentication before changing state
      //没有设置路由字段，或为guest，具有权限
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = appService.checkUserRoles(toState.data.roles);
/*
        for (var i = 0, roles = toState.data.roles; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (roles[i] === '*') ||
            (appService.user && appService.user.roles !== undefined && appService.user.roles.indexOf(roles[i]) !== -1)) {
            allowed = true;
            break;
          }
        }
*/
        if (!allowed) {
          event.preventDefault();
          if (appService.user !== null && typeof appService.user === 'object') {
            var message = 'client tostate: ' + toState.name +
                ' roles: ' + toState.data.roles.join(',') +
                ' current user roles:' + (appService.user && appService.user.roles && appService.user.roles.join(','));
            $state.transitionTo('forbidden', { message: message});
          } else {
            //$state.go('authentication.signin')
            appService.gotoSignin()
              .then(function () {
                // Record previous state
                storePreviousState(toState, toParams);
              });
          }
        } else {
          //在此设置子系统状态组,防止目的状态有redirectTo
          appService.setChildSystem(toState);
        }
      }
    }

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());
