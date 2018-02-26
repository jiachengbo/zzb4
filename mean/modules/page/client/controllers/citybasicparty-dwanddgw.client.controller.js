(function () {
  'use strict';

  angular
    .module('page')
    .controller('DgworDwController', DgworDwController);

  DgworDwController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'appService', 'menuService', 'litterxinService', 'citybasicpartyService', 'ProjectService', '$state', '$location', '$timeout', 'Timer', 'prowallService', 'UserMsg'];
  function DgworDwController($scope, Notification, $log, $window, baseCodeService, appService, menuService, litterxinService, citybasicpartyService, ProjectService, $state, $location, $timeout, Timer, prowallService, UserMsg) {
    var vm = this;
    UserMsg.func();
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dgwparty = $window.parseInt($location.search().party);
    $scope.dgwparty = [];
    //区委 或 党工委点击进入
    if (vm.dgwparty === 0) {
      $scope.name = '党工委';
      angular.forEach(dj_PartyOrganization, function (v, k) {
        if (v.typeID > 9 && v.typeID < 13) {
          $scope.dgwparty.push(v);
        }
      });
    } else if (vm.dgwparty === 1) {
      angular.forEach(dj_PartyOrganization, function (v, k) {
        if (v.typeID > 9) {
          if (v.typeID === 27) {
            v.typeName = '西安大兴新区管委会机关党委';
          }
          $scope.dgwparty.push(v);
        }
      });
      $scope.name = '其他党(工)委';
    }
    menuService.leftMenusCollapsed = true;
    var litter = {};
    var project = {};
    var param = {};
    var problemWallQuery = {};
    var grade = 2;
    if (appService.user.user_grade === 1) {
      grade = 2;
      vm.hrefs = '/page/citybasicparty';
    } else {
      grade = appService.user.user_grade;
      vm.hrefs = '/dgwordw';
    }
    litter.gradeId = 0;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    var roleID = appService.user.JCDJ_User_roleID;
    if (appService.user) {
      if (appService.user.user_grade === 2) {
        angular.forEach(dj_PartyOrganization, function (v, k) {
          if (v.typeID > 12) {
            if (v.typeID === 27) {
              v.typeName = '西安大兴新区管委会机关党委';
            }
            $scope.dgwparty.push(v);
          }
        });
        $scope.name = '党委';
        //党工委其他进入 或 党委部门进入
      } else if (appService.user.user_grade === 4 || appService.user.user_grade === 5 && (appService.user.JCDJ_User_roleID < 44 && appService.user.JCDJ_User_roleID > 40)) {
        angular.forEach(dj_PartyOrganization, function (v, k) {
          if (v.roleID === appService.user.JCDJ_User_roleID) {
            $scope.dgwparty.push(v);
          }
        });
        $scope.name = '其他党(工)委';
      }
    }
    vm.dgwbutton = function (role, grade, $event) {
      param.roleId = role;
      param.grade = grade;
      litter.roleId = role;
      project.qita = true;
      project.role = role;
      project.gradeId = grade;
      problemWallQuery.grade = grade;
      problemWallQuery.roleID = role;
      vm.problemWallGrade = grade;
      vm.problemWallroleID = role;
      $scope.qita = true;
      $scope.role = role;
      $scope.gradeId = grade;
      city(param);
      litterx(litter);
      projecr(project);
      problemWall(problemWallQuery);
      $('.listpart li > a').removeClass('listactive');
      if ($event.target.tagName === 'A') {
        $($event.target).addClass('listactive');
      }
    };
    //共驻共建
    function city(param) {
      citybasicpartyService.query(param).$promise.then(function (data) {
        console.log(data);
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
    }

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

    //微心愿
    function litterx(litter) {
      litterxinService.query(litter).$promise.then(function (data) {
        vm.litterxin = data;
      });
    }

    //党建项目
    function projecr(project) {
      ProjectService.query(project).$promise.then(function (data) {
        vm.project = data;
      });
    }
    // 问题墙
    function problemWall(problemWallQuery) {
      prowallService.query(problemWallQuery).$promise.then(function (data) {
        vm.prowall = data;
      });
    }
    //默认显示第一个的数据
    function dgwbuttons(role, grade) {
      param.roleId = role;
      param.grade = grade;
      litter.roleId = role;
      project.qita = true;
      project.role = role;
      project.gradeId = grade;
      if (grade === 5) {
        problemWallQuery.streetID = 0;
      }
      problemWallQuery.grade = grade;
      problemWallQuery.roleID = role;
      vm.problemWallGrade = grade;
      vm.problemWallroleID = role;
      $scope.qita = true;
      $scope.role = role;
      $scope.gradeId = grade;
      city(param);
      litterx(litter);
      projecr(project);
      problemWall(problemWallQuery);
      $timeout(function () {
        $('.listpart li:first > a').addClass('listactive');
      }, 200);
    }
    dgwbuttons($scope.dgwparty[0].roleID, $scope.dgwparty[0].GradeID);
    vm.weixingyuan = function (num) {
      $state.go('weixindetail', {data: vm.litterxin[num]});
    };
    vm.gongj = function (num) {
      $state.go('gongjiandetail', {data: vm.gongzhu[num]});
    };
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
  }
}());
