(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageCityBasicPartyStrController', PageCityBasicPartyStrController);

  PageCityBasicPartyStrController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'PageService', 'menuService', '$location', 'appService', 'citybasicpartyService', 'cityorgsetService', 'prowallService', 'litterxinService', 'ProjectService', '$state', 'Timer', '$interval'];
  function PageCityBasicPartyStrController($scope, Notification, $log, $window, baseCodeService, PageService, menuService, $location, appService, citybasicpartyService, cityorgsetService, prowallService, litterxinService, ProjectService, $state, Timer, $interval) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    var streetid;
    var litter = {};
    var grade = 5;
    vm.commid = $window.parseInt($location.search().id);
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var community = baseCodeService.getItems('community');
    var dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    if (appService.user.user_grade === 5) {
      vm.hrefs = '/page/citybasicparty-str';
      vm.roleId = appService.user.JCDJ_User_roleID;
      litter.roleId = vm.roleId;
      litter.gradeId = grade;
      angular.forEach(dj_JCDJ_UserRole, function (value, key) {
        if (value.UserRoleID === appService.user.JCDJ_User_roleID) {
          vm.community = [];
          streetid = value.streetID;
          angular.forEach(community, function (v, k) {
            if (v.streetID === value.streetID) {
              this.push(v);
            }
          }, vm.community);
        }
      });
    } else {
      vm.hrefs = '/page/citybasicparty';
      streetid = vm.commid;
      litter.streetID = streetid;
      litter.gradeId = grade;
      angular.forEach(dj_JCDJ_UserRole, function (v, k) {
        if (v.streetID === vm.commid) {
          vm.roleId = v.UserRoleID;
        }
      });
      vm.community = [];
      angular.forEach(community, function (v, k) {
        if (v.streetID === vm.commid) {
          this.push(v);
        }
      }, vm.community);
    }
    vm.orgid = Number(streetid) + 3;
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

    citybasicpartyService.query({
      roleId: vm.roleId,
      grade: grade
    }).$promise.then(function (data) {
      vm.gzgj = data;
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
    cityorgsetService.query({
      orgId: vm.orgid,
      community: '0'
    }).$promise.then(function (data) {
      console.log(data);
      vm.Orgset = data[0].OrgSet;
      if (vm.Orgset.length > 0) {
        $('.orgpenduty').html(vm.Orgset[0].OrgTable.duty);
      }
      vm.OrgPerson = [];
      angular.forEach(data[0].zz, function (v, k) {
        if (k < 4) {
          this.push(v);
        }
      }, vm.OrgPerson);
      vm.dataorgset = vm.Orgset[0];
    });
    vm.grade = grade;
    vm.streetID = streetid;
    prowallService.query({
      grade: grade,
      streetID: streetid
    }).$promise.then(function (data) {
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
      if (data.length < 8) {
        $interval.cancel($scope.tableguns);
      }
    });
    litterxinService.query(litter).$promise.then(function (data) {
      vm.litterxin = data;
    });
    ProjectService.query({
      gradeId: grade,
      streetID: streetid,
      role: vm.roleId
    }).$promise.then(function (data) {
      vm.project = data;
    });
    $scope.tableguns = $interval(function () {
      console.log('aaaaaa');
      angular.element(document.querySelector('.prowalllnbo')).css({'top': '0px'});
      $('.prowalllnbo').animate({
        top: '-45px'
      }, 1000);
      // angular.element(document.querySelector('.tableboxinner')).ani({'top':  '-40px'});
      angular.element(document.querySelector('.prowalllnbo')).append(angular.element(document.querySelector('.prowalllnbo>tr:nth-child(1)')).remove()[0]);
    }, 2000);
    $scope.$on('$destroy', function () {
      $interval.cancel($scope.tableguns);
    });
    vm.weixingyuan = function (num) {
      $state.go('weixindetail', {data: vm.litterxin[num]});
    };
    vm.gongj = function (num) {
      $state.go('gongjiandetail', {data: vm.gzgj[num]});
    };
    vm.proll = function ($event) {
      var num;
      if ($event.target.tagName === 'P') {
        num = angular.element($event.target).parent().parent().parent().attr('id');
      } else if ($event.target.tagName === 'TD') {
        num = angular.element($event.target).parent().attr('id');
      } else if ($event.target.tagName === 'A') {
        num = angular.element($event.target).parent().parent().attr('id');
      }
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
  }
}());
