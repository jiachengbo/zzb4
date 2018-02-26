(function () {
  'use strict';

  angular
    .module('users')
    .controller('appServiceController', appServiceController);

  appServiceController.$inject = ['$scope', '$state', '$location', '$window', '$timeout',
    'appService', 'UsersService', 'PasswordValidator', 'Notification', 'menuService'];

  function appServiceController($scope, $state, $location, $window, $timeout,
                                appService, UsersService, PasswordValidator, Notification, menuService) {
    var vm = this;
    vm.authentication = appService;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;


    //加密
    function compile(code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length);
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
      }
      return escape(c);
    }

    //解密
    function uncompile(code) {
      code = unescape(code);
      var c = String.fromCharCode(code.charCodeAt(0) - code.length);
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
      }
      return c;
    }

    vm.credentials = {};
    var username = $window.localStorage.getItem('userss');
    if (username) {
      if (username === '{}') {
        vm.check = false;
      } else {
        var str = uncompile(username);
        var usernamepass = JSON.parse(str);
        vm.check = true;
        vm.credentials.password = usernamepass.password;
        vm.credentials.usernameOrEmail = usernamepass.usernameOrEmail;
      }
    }
    $timeout(function () {
      if ($state.previous && $state.previous.state && $state.previous.state.data && $state.previous.state.data.pageTitle) {
        vm.signTitle = $state.previous.state.data.pageTitle;
      } else {
        vm.signTitle = $window.sharedConfig.longTitle;
      }
    });

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({message: $location.search().err});
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }


    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({message: $location.search().err});
    }

    // If user is signed in then redirect back home
    if (appService.user) {
      //$location.path('/');
      return appService.gotoHome();
    }
    /*
     //不能直接访问登录地址
     if (!$state.previous || !$state.previous.state ||
     !$state.previous.state.name || $state.previous.state.name === '') {
     appService.gotoHome();
     }
     */
    if ($state.current && $state.current.name === appService.gotoDefine.signin.state) {
      $timeout(function () {
        //默认显示标题
        vm.titleStyle = {
          diaplay: 'block'
        };

        //默认标题背景
        vm.signTitle = $window.sharedConfig.longTitle;
        vm.signImgUrl = '/modules/users/client/img/sign-bg.png';

        //设置跳转定义，并返回登录参数
        var data = appService.signinOpen($state);
        if (data) {
          if (data.pageTitle) {
            vm.signTitle = data.pageTitle;
          }
          if (data.titleStyle) {
            vm.titleStyle = data.titleStyle;
          }

          if (data.imgUrl) {
            vm.signImgUrl = data.imgUrl;
          }

          //form显示设置
          if (data.formFill) {
            vm.formFill = data.formFill;
          }
        }
        vm.style = {
          'background-image': 'url(' + vm.signImgUrl + ')'
        };
      });
    }


    function signup(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    function signin() {
      //使用ng-submit提交时，防止浏览器自动填充信息还没有更新到绑定数据
      $timeout(function () {
        if (vm.check) {
          $window.localStorage.setItem('userss', compile(JSON.stringify(vm.credentials)));
        } else {
          $window.localStorage.setItem('userss', JSON.stringify({}));
        }
        if (!vm.userForm.$valid) {
          $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        } else {
          UsersService.userSignin(vm.credentials)
            .then(onUserSigninSuccess)
            .catch(onUserSigninError);
        }
      }, 200);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // appService Callbacks
    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      //注册成功
      appService.signup(response);
      Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!'});
      // And redirect to the previous or home page
      //$state.go(($state.previous && $state.previous.state && $state.previous.state.name) || 'home', $state.previous && $state.previous.params);
    }

    function onUserSignupError(response) {
      Notification.error({
        message: response.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!',
        delay: 6000
      });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      //登录成功
      appService.signin(response);

      Notification.info({message: '欢迎使用 ' + response.firstName});

      // And redirect to the previous or home page
      /*$window.open('/', '_parent')*/
      $state.go(($state.previous && $state.previous.state && $state.previous.state.name) || 'home', $state.previous && $state.previous.params, {reload: true});
     // parent.location.reload();
    }

    function onUserSigninError(response) {
      Notification.error({
        message: response.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!',
        delay: 6000
      });
    }

    var a = 1;
    vm.donghua = function () {
      if (a) {
        $('.shang').animate({
          height: '500px',
          top: '-270px'
        }, 3000);
        $('.xia').animate({
          height: '368px',
          top: '755px'
        }, 3000);
        a = 0;
      } else {
        $('.shang').animate({
          height: '500px',
          top: '0px'
        }, 3000);
        $('.xia').animate({
          height: '600px',
          top: '390px'
        }, 3000);
        a = 1;
      }
    };
  }
}());
