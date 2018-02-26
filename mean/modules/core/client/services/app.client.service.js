(function () {
  'use strict';

  angular
    .module('core')
    .factory('appService', appService);

  appService.$inject = ['$q', '$rootScope', '$window', '$timeout', '$state', '$log',
    '$localStorage', 'menuService'];

  function appService($q, $rootScope, $window, $timeout, $state, $log,
                      $localStorage, menuService) {
    var openTopUseMenu = $window.sharedConfig.openTopUseMenu;
    var dispItemVertical = $window.sharedConfig.dispItemVertical;
    /*显示顶部用户菜单，就没有左栏菜单*/
    var sideMenuShow = !openTopUseMenu;

    //默认标题
    var defaultTitle = $window.sharedConfig.title.split('-')[0];
    var service = {
      //使用顶部用户菜单
      openTopUseMenu: openTopUseMenu,
      //顶部图标字体垂直结构
      dispItemVertical: dispItemVertical,
      //左栏菜单是否显示
      sideMenuShow: sideMenuShow,
      //显示消息、通知栏
      headerMessageShow: false,

      //标题url
      headerViewUrl: '/modules/core/client/views/header.client.view.html',
      //边栏菜单
      sideMenuViewUrl: '/modules/core/client/views/sidebarmenu.client.view.html',
      //底边栏
      footerViewUrl: '/modules/core/client/views/footer.client.view.html',

      //当前的子系统包含的状态数组， 空数组[]表示没有任何子状态
      childSystem: null,
      //当前的子系统的标题栏logo后文字
      childHeaderTitle: defaultTitle,
      setChildSystem: setChildSystem,

      //菜单
      accountMenu: null,
      sideMenu: null,
      //topUseMenu: null,

    //跳转地址或路由
      gotoDefine: {
        home: {
          state: 'home',
          params: null
        },
        first: {
          state: '',
          params: null
        },
        childHome: {
          state: '',
          params: null
        },
        signin: {
          state: 'authentication.signin',
          params: null
        },
        signup: {
          state: 'authentication.signup',
          params: null
        },
        signout: {
          state: 'authentication.signout',
          params: null
        }
      },
      //设置跳转定义
      setGotoDefine: setGotoDefine,

      //跳转函数
      gotoHome: gotoHome,
      gotoFirst: gotoFirst,
      gotoChildHome: gotoChildHome,
      gotoSignin: gotoSignin,
      gotoSignup: gotoSignup,
      gotoSignout: gotoSignout,
      gotoBack: gotoBack,

      //用户登录信息
      user: $window.user,
      //检查用户的权限
      checkUserRoles: checkUserRoles,

      //登录窗口打开
      signinOpen: signinOpen,
      //用户已经登录
      signin: userSignin,
      signup: userSignup,
      //用户已经下线
      userOffline: userOffline,

      //显示隐藏遮罩
      maskOverIsOpen: false,
      maskOverTitle: '',
      //打开次数
      maskOverOpenTimes: 0,
      //不打开遮罩的url
      maskOverExcludeUrl: [],
      excludeUrlMaskOver: excludeUrlMaskOver,
      openMaskOver: openMaskOver,
      closeMaskOver: closeMaskOver
    };

    //是否显示标题和封底
    service.headerShow = !!service.headerViewUrl;
    service.footerShow = !!service.footerViewUrl;

    //初始化参数信息
    befor_init();

    angular.element($window).bind('resize', function() {
      $timeout(window_resize);
    });
    window_resize();

    //延迟执行
    $timeout(function () {
      //延迟初始化
      after_init();
    });
    return service;

    /************************************************************************
     * 以下为实现函数
     ************************************************************************/
    //遮罩打开关闭
    function openMaskOver(url, title) {
      if (typeof(title) === 'string') {
        service.maskOverTitle = title;
      }
      if (urlInExcludeMaskOver(url)) {
        return;
      }
      if (service.maskOverOpenTimes <= 0) {
        service.maskOverOpenTimes = 0;
        service.maskOverIsOpen = true;
      }
      service.maskOverOpenTimes ++;
    }
    function closeMaskOver(url) {
      if (urlInExcludeMaskOver(url)) {
        return;
      }
      service.maskOverOpenTimes --;
      if (service.maskOverOpenTimes <= 0) {
        service.maskOverOpenTimes = 0;
        service.maskOverIsOpen = false;
      }
    }
    function excludeUrlMaskOver(urlmask) {
      if (urlmask) {
        if (service.maskOverExcludeUrl.indexOf(urlmask) === -1) {
          service.maskOverExcludeUrl.push(urlmask);
        }
      } else {
        $log.error('excludeUrlMaskOver argument error:', urlmask);
      }
    }
    function urlInExcludeMaskOver(url) {
      if (!url) {
        return false;
      }
      return !!service.maskOverExcludeUrl.find(function (v) {
        if (v === url) {
          return true;
        }
        if (v instanceof RegExp) {
          return v.test(url);
        }
        return false;
      });
    }

    //跳转路由
    function _gotoSref(name, params, options) {
      var def = service.gotoDefine[name];
      if (!def) {
        $log.warn('gotoSref %s,but not define in appService', name);
        return null;
      } else {
        //如果没有定义，默认跳到home
        if (!def.state) {
          $log.warn('gotoSref %s,but sref state not define,use sref home', name);
          def = service.gotoDefine.home;
        }

        return $state.go(def.state, params || def.params, options);
      }
    }

    function gotoHome(params, options) {
      return _gotoSref('home', params, options);
    }
    function gotoFirst(params, options) {
      return _gotoSref('first', params, options);
    }
    function gotoChildHome(params, options) {
      return _gotoSref('childHome', params, options);
    }
    function gotoSignup(params, options) {
      return _gotoSref('signup', params, options);
    }
    //登录
    function gotoSignin(params, options) {
      return _gotoSref('signin', params, angular.extend({location: false}, options));
    }

    //退出登录
    function gotoSignout(params, options) {
      return _gotoSref('signout', params, angular.extend({location: false}, options))
        .then(function () {
          //用户下线
          service.userOffline();
          //跳转home路由,强制重新加载，防止home路由有权限
          service.gotoHome(null, {reload: true});
        });
    }

    //返回上一页面
    function gotoBack() {
      if ($state.current.name !== service.gotoDefine.home.state &&
        $state.current.name !== service.gotoDefine.signin.state &&
        $state.current.name !== service.gotoDefine.signup.state) {
        $window.history.back();
      }
    }

    //设置跳转定义
    function setGotoDefine(name, params, state) {
      var def = service.gotoDefine[name];
      if (!def) {
        $log.error('gotoSref %s,but not define in appService', name);
      } else {
        def.params = params;
        if (arguments.length > 2) {
          def.state = state;
        }
      }
      return def;
    }

    //设置子系统
    function setChildSystem(state) {
      var ret = false;
      if (state && state.data) {
        var stateData = state.data;
        //子系统状态数组有效
        if (stateData.childSystem && Array.isArray(stateData.childSystem) &&
          !angular.equals(stateData.childSystem, service.childSystem)) {
          $localStorage.childSystem = service.childSystem = stateData.childSystem;
          ret = true;
        }
        //子系统标题有效，记录标题，记录返回路由
        if (stateData.childHeaderTitle &&
          !angular.equals(stateData.childHeaderTitle, service.childHeaderTitle)) {
          $localStorage.childHeaderTitle = service.childHeaderTitle = stateData.childHeaderTitle;
          //返回路由有效
          if (stateData.childHome) {
            if (typeof(stateData.childHome) === 'object') {
              service.gotoDefine.childHome.state = stateData.childHome.state;
              service.gotoDefine.childHome.params = angular.copy(stateData.childHome.params);
            } else {
              service.gotoDefine.childHome.state = String(stateData.childHome);
              service.gotoDefine.childHome.params = null;
            }
          } else {
            //使用当前路由作为返回路由
            service.gotoDefine.childHome.state = state.name;
            service.gotoDefine.childHome.params = angular.copy(state.params);
          }
          $localStorage.childHome = service.gotoDefine.childHome;

          ret = true;
        }
      }
      return ret;
    }

    //检查用户权限
    function checkUserRoles(roles) {
      if (roles && roles.length > 0) {
        for (var i = 0; i < roles.length; i++) {
          if ((roles[i] === 'guest') || (roles[i] === '*') ||
            (service.user && service.user.roles && service.user.roles.length > 0 && service.user.roles.indexOf(roles[i]) !== -1)) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    }

    //设置路由定义，在跳转登录页面打开时调用
    function signinOpen(currState) {
      var signinParams;
      var previous = currState.previous;
      //直接调用登录路由，传递参数
      if (currState.params && currState.params.pageTitle) {
        signinParams = currState.params;
      } else if (previous && previous.state && previous.state.data && previous.state.data.signin) {
        //通过访问其他有权限路由而跳转到登录界面
        signinParams = previous.state.data.signin;
        //改变首页
        service.gotoDefine.home.state = service.gotoDefine.first.state = previous.state.name;
        service.gotoDefine.home.params = service.gotoDefine.first.params = angular.copy(previous.params);

        //记录到本地存储
        $localStorage.home = service.gotoDefine.home;
        $localStorage.first = service.gotoDefine.first;
      }

      if (signinParams) {
        //记录登录参数,$state.params内容会被清除，应该拷贝
        service.gotoDefine.signin.params = angular.copy(signinParams);
      } else {
        //如果都无效，使用定义中的参数
        signinParams = service.gotoDefine.signin.params;
      }

      return signinParams;
    }

    //注册成功
    function userSignup(user) {
      service.user = user;
      $rootScope.$broadcast('userLogin');

      _userInit();
      service.gotoFirst();
    }

    //登录成功
    function userSignin(user) {
      service.user = user;
      $rootScope.$broadcast('userLogin');

      _userInit();
      service.gotoFirst();
    }

    //用户下线
    function userOffline() {
      // Deauthenticate the global user
      $rootScope.$broadcast('userOffline');

      service.user = null;

      //清除会话存储
      delete $localStorage.home;
      delete $localStorage.first;
      delete $localStorage.childHome;
      delete $localStorage.childSystem;
      delete $localStorage.childHeaderTitle;
/*
      //清除顶部菜单
      if (service.topUseMenu) {
        //清除first跳转的路由
        if (service.gotoDefine.first.state) {
          service.gotoDefine.first.state = '';
        }
        service.topUseMenu = null;
      }
*/
    }

    //初始化参数信息
    function befor_init() {
      //取得登录窗口的默认参数
      var homeState = $state.get(service.gotoDefine.home.state);
      if (homeState && homeState.data && homeState.data.signin) {
        service.setGotoDefine('signin', homeState.data.signin);
      }

      if (service.user) {
        _loadGotoDef('home');
        _loadGotoDef('first');
        _loadGotoDef('childHome');
        //从本地存储加载当前子系统
        service.childSystem = $localStorage.childSystem;
        service.childHeaderTitle = $localStorage.childHeaderTitle;
      }

      //从本地存储加载跳转定义
      function _loadGotoDef(state) {
        var def = $localStorage[state];
        if (def) {
          if (def.state) {
            service.gotoDefine[state].state = def.state;
          }
          if (def.params) {
            service.gotoDefine[state].params = def.params;
          }
        }
      }
    }

    //用户登录/注册后/after_int中 根据用户，配置系统参数
    function _userInit() {
      if (service.user) {
        //如果没有定义first路由，设置第一个顶部菜单对应的路由为first
        if (!service.gotoDefine.first.state &&
          service.openTopUseMenu && service.sideMenu.items.length > 0) {
          var firstMenu = menuService.getFirstMenuItem(service.sideMenu, service.user, service.childSystem);
          if (firstMenu) {
            service.gotoDefine.first.state = firstMenu.subitem ? firstMenu.subitem.state : firstMenu.item.state;
          }
        }
        /*
         var firstState = $uiRouter.stateService.get(vm.topUseMenu.items[0].state);
         if (firstState) {
         $state.previous = {
         state: firstState,
         params: null,
         href: $state.href(firstState)
         };
         }
         */
      }
    }

    //用户登录完成后，或初始化时调用
    function after_init() {
      service.accountMenu = menuService.orderMenu('account').items[0];
      service.sideMenu = menuService.orderMenu('sidemenu');
      //service.topUseMenu = menuService.orderMenu('topusemenu');
      _userInit();
    }

    //窗口改变大小
    function window_resize() {
      service.openTopUseMenu = openTopUseMenu && $window.innerWidth > 767;
      service.dispItemVertical = dispItemVertical && $window.innerWidth > 767;
      service.sideMenuShow = sideMenuShow && $window.innerWidth > 767;
    }

    //移动端浏览器
    function IsMobile() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = !!sUserAgent.match(/ipad/i);
      var bIsIphone = !!sUserAgent.match(/iphone os/i);
      var bIsMidp = !!sUserAgent.match(/midp/i);
      var bIsUc7 = !!sUserAgent.match(/rv:1.2.3.4/i);
      var bIsUc = !!sUserAgent.match(/ucweb/i);
      var bIsCE = !!sUserAgent.match(/windows ce/i);
      var bIsWM = !!sUserAgent.match(/windows mobile/i);
      var bIsAndroid = !!sUserAgent.match(/android/i);

      return (bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid);
    }
  }
}());
