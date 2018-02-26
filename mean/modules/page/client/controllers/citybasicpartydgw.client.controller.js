(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageCityBasicdgwController', PageCityBasicdgwController);

  PageCityBasicdgwController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'ProjectService', 'menuService', 'appService', 'citybasicpartyService', 'memberNumService', 'prowallService', 'litterxinService', '$state', 'Timer'];
  function PageCityBasicdgwController($scope, Notification, $log, $window,
                                        baseCodeService, ProjectService, menuService, appService, citybasicpartyService, memberNumService, prowallService, litterxinService, $state, Timer) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    //JCDJ_User_roleID branch  user_grade
    // console.log(appService.user);
    var user_grade = 3;
    // if(appService.user.user_grade === 3){
    //   user_grade = appService.user.user_grade;
    // }else {
    //   user_grade = 3;
    // }
    citybasicpartyService.query({
      grade: user_grade
    }).$promise.then(function (data) {
      vm.gongzhu = data;
      vm.imgshuju = [];
      angular.forEach(data, function (v, k) {
        var obj = {};
        obj.id = k;
        obj.image = v.photo;
        obj.text = v.title;
        this.push(obj);
        v.sbtime = Timer.format(v.sbtime, 'day');
      }, vm.imgshuju);
      lunbo(vm.imgshuju);
    });
    ProjectService.query({
      gradeId: user_grade
    }).$promise.then(function (data) {
      vm.project = data;
    });
    prowallService.query({grade: user_grade}).$promise.then(function (data) {
      angular.forEach(data, function (v, k) {
        if (v.super === 32) {
          v.superName = '区委';
        } else if (v.super === 31) {
          v.superName = '党工委';
        } else if (v.super < 31) {
          angular.forEach(dj_PartyOrganization, function (value, key) {
            if (value.typeID === v.super) {
              v.superName = value.typeName;
            }
          });
        }
      });
      vm.prowall = data;
    });
    litterxinService.query({gradeId: user_grade}).$promise.then(function (data) {
      vm.litterxin = data;
    });
    // 共驻共建
    function lunbo(num) {
      vm.imgdata = num;
      vm.myslides = vm.imgdata;
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      var slides = $scope.slides = [];
      var currIndex = 0;
      $scope.addSlide = function (i) {
        slides.push({
          image: vm.myslides[i].image,
          text: vm.myslides[i].text,
          id: currIndex++
        });
      };
      for (var i = 0; i < vm.myslides.length; i++) {
        $scope.addSlide(i);
      }
    }
    vm.street_info = baseCodeService.getItems('street_info');
    vm.arr = [];
    angular.forEach(vm.street_info, function (v, k) {
      if (v.streetID !== 0 && v.streetID !== 10) {
        this.push(v);
      }
    }, vm.arr);
    vm.weixingyuan = function (num) {
      $state.go('weixindetail', {data: vm.litterxin[num]});
    };
    vm.gongj = function (num) {
      $state.go('gongjiandetail', {data: vm.gongzhu[num]});
    };
    vm.proll = function (num) {
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
  }
}());
