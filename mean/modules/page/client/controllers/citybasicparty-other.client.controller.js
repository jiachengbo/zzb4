(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageCityBasicPartyOtherController', PageCityBasicPartyOtherController);

  PageCityBasicPartyOtherController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'appService', 'menuService', 'litterxinService', 'citybasicpartyService', 'ProjectService', '$state', 'Timer', 'prowallService', 'UserMsg'];
  function PageCityBasicPartyOtherController($scope, Notification, $log, $window, baseCodeService, appService, menuService, litterxinService, citybasicpartyService, ProjectService, $state, Timer, prowallService, UserMsg) {
    var vm = this;
    UserMsg.func();
    menuService.leftMenusCollapsed = true;
    var litter = {};
    var project = {};
    var param = null;
    var grade = 2;
    var supers;
    var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    angular.forEach(PartyBranch, function (v, k) {
      if (v.OrganizationId === appService.user.branch) {
        supers = v.super;
      }
    });
    if (appService.user.user_grade === 1) {
      grade = 2;
      vm.hrefs = '/page/citybasicparty';
    } else {
      grade = appService.user.user_grade;
      vm.hrefs = '/page/citybasicparty-other';
    }
    litter.gradeId = 0;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    var roleID = appService.user.JCDJ_User_roleID;
    if (roleID !== 25) {
      if (roleID < 30 || (roleID > 40 && roleID < 62)) {
        litter.roleId = roleID;
      } else if (roleID === 67 || roleID === 68) {
        litter.roleId = roleID;
        litter.branch = appService.user.branch;
      } else if (roleID === 71 || roleID === 73) {
        angular.forEach(dj_PartyBranch, function (v, k) {
          if (v.OrganizationId === appService.user.branch) {
            vm.GeneralBranch = v.generalbranch;
          }
        });
        litter.roleId = roleID;
        litter.branch = appService.user.branch;
        litter.genersuper = vm.GeneralBranch;
      }
    } else {
      litter.roleId = 29;
    }
    if (appService.user.user_grade === 2) {
      param = {grade: appService.user.user_grade};
    } else if (appService.user.user_grade === 4 || appService.user.user_grade === 5 && (appService.user.JCDJ_User_roleID < 44 && appService.user.JCDJ_User_roleID > 40)) {
      param = {
        roleId: roleID,
        grade: appService.user.user_grade
      };
      project.role = roleID;
      angular.forEach(dj_JCDJ_UserRole, function (v, k) {
        if (roleID === v.UserRoleID) {
          project.super = v.departy;
        }
      });
    } else if (appService.user.user_grade === 6 || appService.user.user_grade === 9 || (appService.user.user_grade === 7 && supers > 9) || (appService.user.user_grade === 10 && supers > 9)) {
      param = {
        branch: appService.user.branch,
        grade: appService.user.user_grade
      };
      project.branch = appService.user.branch;
      project.generalBranch = vm.GeneralBranch;
    } else {
      param = {grade: 2};
    }
    project.gradeId = grade;
    project.qita = true;
    citybasicpartyService.query(param).$promise.then(function (data) {
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
    // 基层党建动态
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

    litterxinService.query(litter).$promise.then(function (data) {
      vm.litterxin = data;
    });
    $scope.project = project;
    ProjectService.query(project).$promise.then(function (data) {
      vm.project = data;
    });
    vm.weixingyuan = function (num) {
      $state.go('weixindetail', {data: vm.litterxin[num]});
    };
    vm.gongj = function (num) {
      $state.go('gongjiandetail', {data: vm.gongzhu[num]});
    };
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
    // 问题墙数据
    vm.userGrade = appService.user.user_grade;

    vm.roleId = appService.user.JCDJ_User_roleID;
    var queryparams;
    if (vm.userGrade === 4) {
      queryparams = {
        grade: vm.userGrade,
        roleID: vm.roleId
      };
    } else if (vm.userGrade === 5) {
      queryparams = {
        grade: vm.userGrade,
        roleID: vm.roleId,
        streetID: 0
      };
    } else if (vm.userGrade === 9 || vm.userGrade === 10) {
      vm.generalBranch = UserMsg.objId;
      queryparams = {
        grade: vm.userGrade,
        generalBranch: UserMsg.objId
      };
    } else if (vm.userGrade === 6) {
      vm.branchId = UserMsg.objId;
      queryparams = {
        grade: vm.userGrade,
        branchId: UserMsg.objId
      };
    } else if (vm.userGrade === 7) {
      vm.branchId = UserMsg.objId;
      queryparams = {
        grade: vm.userGrade,
        branchId2: UserMsg.objId
      };
    }
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    prowallService.query(queryparams).$promise.then(function (data) {
      vm.prowall = data;
      angular.forEach(data, function (v, k) {
        if (v.super === 0) {
          v.superName = '区委';
        } else if (v.super === 32) {
          v.superName = '区委';
        } else if (v.super === 31) {
          v.superName = '党工委';
        } else if (v.super === 33) {
          v.superName = '党委';
        } else if (v.super < 31) {
          angular.forEach(dj_PartyOrganization, function (value, key) {
            if (value.typeID === v.super) {
              v.superName = value.typeName;
            }
          });
        }
      });
    });
    vm.proll = function (num) {
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
  }
}());
