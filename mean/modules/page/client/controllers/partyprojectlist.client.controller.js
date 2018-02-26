(function () {
  'use strict';

  angular
    .module('page')
    .controller('PartyProjectListController', PartyProjectListController);

  PartyProjectListController.$inject = ['$scope', '$rootScope', '$log', '$window', 'baseCodeService', '$location', 'menuService', '$stateParams', '$anchorScroll', 'cityorgsetService', '$timeout', 'appService', '$state', 'ProjectService'];
  function PartyProjectListController($scope, $rootScope, $log, $window, baseCodeService, $location, menuService, $stateParams, $anchorScroll, cityorgsetService, $timeout, appService, $state, ProjectService) {
    var vm = this;

    var project = {};
    project.gradeId = $location.search().grade;
    project.streetID = $location.search().streetID || '';
    project.communityId = $location.search().communityId || undefined;
    project.branch = $location.search().branchId || '';
    project.role = $location.search().role || '';
    project.super = $location.search().super || undefined;
    project.generalBranch = $location.search().generalBranch || undefined;
    project.qita = $location.search().qita || '';
    project.leibie = vm.dataleiixn;
    var countpro = angular.copy(project);
    countpro.count = true;
    var proejectdata = angular.copy(project);
    proejectdata.pageNum = 1;
    vm.page = 1;
    vm.alertMe = function (name) {
      vm.namess = name;
      proejectdata.leibie = name;
      countpro.leibie = name;
      get();
      console.log(name);
    };
    function get() {
      console.log(countpro);
      ProjectService.query(countpro).$promise.then(function (data) {
        vm.countNum = data[0].co;
        console.log(vm.countNum);
        vm.pagecount = Math.ceil(vm.countNum / 8);
        ProjectService.query(proejectdata).$promise.then(function (data) {
          vm.project = data;
        });
      });
    }
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
    vm.nextPage = function () {
      vm.page++;
      if (vm.page >= vm.pagecount) {
        vm.page = vm.pagecount;
      }
      proejectdata.pageNum = vm.page;
      console.log(vm.page, proejectdata);
      ProjectService.query(proejectdata).$promise.then(function (data) {
        vm.project = data;
      });
    };
    vm.prevPage = function () {
      vm.page--;
      if (vm.page <= 1) {
        vm.page = 1;
      }
      proejectdata.pageNum = vm.page;
      console.log(vm.page, proejectdata);
      ProjectService.query(proejectdata).$promise.then(function (data) {
        vm.project = data;
      });
    };
    $timeout(function () {
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops,
        'z-index': 1
      });
    }, 200);
  }
}());
