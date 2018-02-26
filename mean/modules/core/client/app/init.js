(function (app) {
  'use strict';

  // Start by defining the main module and adding the module dependencies
  angular
    .module(app.applicationModuleName, app.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  angular
    .module(app.applicationModuleName)
    .config(bootstrapConfig);

  bootstrapConfig.$inject = ['$compileProvider', '$locationProvider', '$httpProvider', '$logProvider', '$urlRouterProvider'];
  function bootstrapConfig($compileProvider, $locationProvider, $httpProvider, $logProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('!');

    $httpProvider.interceptors.push('httpLoaderInterceptor');
    $httpProvider.interceptors.push('authInterceptor');

    // Disable debug data for production environment
    // @link https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(app.applicationEnvironment !== 'production');
    $logProvider.debugEnabled(app.applicationEnvironment !== 'production');
    $urlRouterProvider.deferIntercept();
  }

  //执行时间计算
  var calcPerformance = window.calcPerformance;
  var beginTime = calcPerformance.beginRunTime.getTime();

  // Then define the init function for starting up the application
  angular.element(document).ready(init);
  function init() {
    calcPerformance.delay_ready = Date.now() - beginTime;

    // Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    // Then init the app,返回app加载器
    app.injector = angular.bootstrap(document, [app.applicationModuleName]);
    calcPerformance.timing_bootstrap = Date.now() - beginTime - calcPerformance.delay_ready;
    //下一ready = onload
    angular.element(document).ready(onload);
  }

  //加载完成
  function onload () {
    calcPerformance.delay_onload = Date.now() - beginTime;
    var utilService = app.injector.get('utilService');
    utilService.sendMessage(calcPerformance);
  }
}(ApplicationConfiguration));
