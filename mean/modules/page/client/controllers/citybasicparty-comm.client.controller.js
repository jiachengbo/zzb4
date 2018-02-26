(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageCityBasicPartyCommController', PageCityBasicPartyCommController);

  PageCityBasicPartyCommController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'PageService', 'menuService', '$location', 'citybasicpartyService', 'appService', 'cityorgsetService', 'prowallService', 'litterxinService', 'ProjectService', '$state', 'Timer', '$interval'];
  function PageCityBasicPartyCommController($scope, Notification, $log, $window, baseCodeService, PageService, menuService, $location, citybasicpartyService, appService, cityorgsetService, prowallService, litterxinService, ProjectService, $state, Timer, $interval) {
    var vm = this;
    var grade = 7;
    var branch;
    var brach1;
    var arr = [];
    var litter = {};
    vm.showcomm = true;
    var genearBranch = [];
    vm.hrefs = '/page/citybasicparty-str?id={{vm.street}}';
    menuService.leftMenusCollapsed = true;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    angular.forEach(dj_PartyBranch, function (v, k) {
      if (v.generalbranch) {
        genearBranch.push(v.OrganizationId);
      }
    });
    if (appService.user.user_grade === 7 || appService.user.user_grade === 10) {
      grade = appService.user.user_grade;
      vm.hrefs = '/page/citybasicparty-comm';
      angular.forEach(dj_PartyBranch, function (v, k) {
        if (v.OrganizationId === appService.user.branch) {
          if (v.belongComm === 1) {
            vm.showcomm = true;
          } else {
            vm.showcomm = false;
          }
          vm.comm = v.communityId;
          vm.street = v.streetID;
          vm.GeneralBranch = v.generalbranch;
          if (appService.user.user_grade === 7) {
            branch = v.OrganizationId;
          } else {
            angular.forEach(dj_PartyBranch, function (value, key) {
              if (value.generalbranch === vm.GeneralBranch) {
                arr.push(value.OrganizationId);
              }
            });
            if (arr.length > 0) {
              branch = arr;
            } else {
              branch = [-2];
            }

          }
        }
      });
    } else {
      vm.comm = $location.search().id;
      vm.street = $window.parseInt($location.search().street);
      branch = null;
      brach1 = null;
      vm.hrefs = '/page/citybasicparty-str?id=' + vm.street;
    }
    litter.streetID = vm.street;
    litter.communityId = vm.comm;
    litter.gradeId = grade;
    litter.branch = branch;
    litter.generalBranch = vm.GeneralBranch;
    vm.orgid = Number(vm.street) + 3;
    var dj_grid = baseCodeService.getItems('grid');
    vm.dj_grid = [];
    angular.forEach(dj_grid, function (v, k) {
      if (v.departmentId === vm.comm && v.streetID === vm.street) {
        this.push(v);
      }
    }, vm.dj_grid);
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
      comm: vm.comm,
      street: vm.street,
      grade: grade,
      branch: branch
    }).$promise.then(function (data) {
      vm.gzgj = data;
      vm.imgshuju = [];
      angular.forEach(data, function (v, k) {
        var obj = {};
        obj.id = k;
        obj.image = v.photo;
        obj.text = v.title;
        v.sbtime = Timer.format(v.sbtime, 'day');
        this.push(obj);
      }, vm.imgshuju);
      lunbo(vm.imgshuju);
    });
    cityorgsetService.query({
      orgId: vm.orgid,
      Street: vm.street,
      community: vm.comm
    }).$promise.then(function (data) {
      console.log(data);
      vm.Orgset = data[0].OrgSet;
      vm.OrgPerson = [];
      angular.forEach(data[0].zz, function (v, k) {
        if (k < 4) {
          this.push(v);
        }
      }, vm.OrgPerson);
      vm.dataorgset = vm.Orgset[0];
      //console.log(vm.Orgset[0]['OrgTable.duty']);
      if (vm.Orgset.length > 0) {
        $('.duty').html(vm.Orgset[0]['OrgTable.duty']);
      }
    });
    vm.grade = grade;
    vm.branch = branch;
    prowallService.query({
      grade: grade,
      streetID: vm.street,
      communityId: vm.comm,
      genersuper: vm.GeneralBranch,
      branchId: branch
    }).$promise.then(function (data) {
      angular.forEach(data, function (v, k) {
        if (v.super === 32) {
          v.superName = '区委';
        } else if (v.super === 31) {
          v.superName = '党工委';
        } else if (v.super < 31) {
          if (v.genersuper) {
            angular.forEach(dj_PartyGeneralBranch, function (value, key) {
              if (value.branchID === v.genersuper) {
                v.superName = value.simpleName;
              }
            });
          } else {
            angular.forEach(dj_PartyOrganization, function (value, key) {
              if (value.typeID === v.super) {
                v.superName = value.typeName;
              }
            });
          }

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
    ProjectService.query(litter).$promise.then(function (data) {
      vm.project = data;
    });
    $scope.tableguns = $interval(function () {
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
