(function () {
  'use strict';

  angular
    .module('regionalization')
    .controller('ProjectModalFormController', ProjectModalFormController);

  ProjectModalFormController.$inject = ['$scope', '$log', '$uibModalInstance', 'projectData', 'method', 'baseCodeService', 'appService', '$timeout'];
  function ProjectModalFormController($scope, $log, $uibModalInstance, projectData, method, baseCodeService, appService, $timeout) {
    var vm = this;
    var grade;
    vm.projectData = projectData;
    vm.method = method;
    var displayName;
    var user_grade;
    var userRoleID;
    var userBranch;
    if (appService.user) {
      displayName = appService.user.displayName;
      user_grade = appService.user.user_grade;
      userRoleID = appService.user.JCDJ_User_roleID;
      userBranch = appService.user.branch;
    }
    var projectSources;
    vm.cenji = [
      {'name': '区委'},
      {'name': '街道部门'},
      {'name': '党总支'},
      {'name': '党支部'}
    ];
    vm.projectData.xuanze = '区委';
    vm.disabled = (method === '查看');
    // 项目来源下拉框
    if (appService.user) {
      grade = appService.user.user_grade;
      console.log(grade);
      if (grade === 1) {
        projectSources = [
          {'projectSourcename': '问卷调查'},
          {'projectSourcename': '兼职委员提议'},
          {'projectSourcename': '区委研究'},
          {'projectSourcename': '驻地单位提议'},
          {'projectSourcename': '其他'}
        ];
      } else if (grade === 5) {
        projectSources = [
          {'projectSourcename': '问卷调查'},
          {'projectSourcename': '兼职委员提议'},
          {'projectSourcename': '党工委研究'},
          {'projectSourcename': '驻地单位提议'},
          {'projectSourcename': '其他'}
        ];
      } else if (grade === 4) {
        projectSources = [
          {'projectSourcename': '问卷调查'},
          {'projectSourcename': '兼职委员提议'},
          {'projectSourcename': '党委研究'},
          {'projectSourcename': '驻地单位提议'},
          {'projectSourcename': '其他'}
        ];
      } else if (grade > 5) {
        projectSources = [
          {'projectSourcename': '问卷调查'},
          {'projectSourcename': '兼职委员提议'},
          {'projectSourcename': '社区党组织发起'},
          {'projectSourcename': '驻地单位提议'},
          {'projectSourcename': '其他'}
        ];
      }
    }

    $scope.projectSourceInfo = projectSources;
    // 项目类型下拉框
    var projectTypes = [
      {'projectTypename': '党的建设'},
      {'projectTypename': '经济发展'},
      {'projectTypename': '城市治理'},
      {'projectTypename': '社会稳定'},
      {'projectTypename': '公共服务'},
      {'projectTypename': '其他'}
    ];
    $scope.projectTypeInfo = projectTypes;
    // 读取本地存储的社区村常量表
    var cvsList = baseCodeService.getItems('community');
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    /*Array.prototype.remove = function (from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };*/
    function remove(arr, from, to) {
      var rest = arr.slice((to || from) + 1 || arr.length);
      arr.length = from < 0 ? arr.length + from : from;
      arr.push.apply(arr, rest);
    }
    //认领列表
    if (method === '新增') {
      vm.remlist = [];
    } else {
      vm.remlist = JSON.parse(vm.projectData.arrlist);
    }
    vm.search = function (name) {
      vm.renlinlist = [];
      if (name) {
        if (vm.projectData.xuanze === '区委') {
          vm.renlinlist = [{
            name: '区委',
            gradeId: 1,
            roleId: 25,
            branchId: -1,
            generalBranch: -1,
            streetID: -1,
            communityId: -1,
            belongGrid: -1,
            super: -1,
            creatUserName: displayName,
            creatuUserGrade: user_grade,
            creatUserRole: userRoleID,
            creatUserBranch: userBranch
          }];
        } else if (vm.projectData.xuanze === '街道部门') {
          angular.forEach(dj_PartyOrganization, function (v, k) {
            if (v.typeName.match(name)) {
              var obj = {
                name: v.typeName,
                gradeId: v.GradeID,
                roleId: v.roleID,
                branchId: -1,
                generalBranch: -1,
                streetID: -1,
                communityId: -1,
                belongGrid: -1,
                super: -1,
                creatUserName: displayName,
                creatuUserGrade: user_grade,
                creatUserRole: userRoleID,
                creatUserBranch: userBranch
              };
              vm.renlinlist.push(obj);
            }
          });
        } else if (vm.projectData.xuanze === '党总支') {
          angular.forEach(dj_PartyGeneralBranch, function (v, k) {
            if (v.simpleName.match(name)) {
              var obj = {
                name: v.simpleName,
                gradeId: v.GradeID,
                branchId: -1,
                generalBranch: v.branchID,
                streetID: -1,
                communityId: -1,
                belongGrid: -1,
                super: v.superior,
                creatUserName: displayName,
                creatuUserGrade: user_grade,
                creatUserRole: userRoleID,
                creatUserBranch: userBranch
              };
              if (v.GradeID === 10) {
                obj.roleId = 73;
              } else {
                obj.roleId = 71;
              }
              vm.renlinlist.push(obj);
            }
          });
        } else if (vm.projectData.xuanze === '党支部') {
          angular.forEach(dj_PartyBranch, function (v, k) {
            if (v.simpleName.match(name)) {
              var obj = {
                name: v.simpleName,
                gradeId: v.GradeID,
                branchId: v.OrganizationId,
                generalBranch: v.generalbranch || -1,
                streetID: v.streetID || -1,
                communityId: v.communityId || -1,
                belongGrid: v.BelongGrid || -1,
                super: v.super,
                creatUserName: displayName,
                creatuUserGrade: user_grade,
                creatUserRole: userRoleID,
                creatUserBranch: userBranch
              };
              if (v.GradeID === 7) {
                obj.roleId = 68;
              } else {
                obj.roleId = 67;
              }
              vm.renlinlist.push(obj);
            }
          });
        }
      }
      console.log(vm.remlist);
      $('.jieguo div .on_check').removeClass('on_check');
      angular.forEach(vm.remlist, function (v, k) {
        angular.forEach(vm.renlinlist, function (vam, ke) {
          if (vam.name === v.name) {
            $timeout(function () {
              var as = ke;
              var element = $('.jieguo div').eq(as);
              $(element).find('span').addClass('on_check');
            });
          }
        });
      });
    };
    vm.check = function ($event, num) {
      angular.element($event.target).toggleClass('on_check');
      angular.forEach(vm.remlist, function (v, k) {
        if (v) {
          if (!$($event.target).hasClass('on_check')) {
            if (v.name === vm.renlinlist[num].name) {
              remove(vm.remlist, k);
             // vm.remlist.remove(k);
            }
          }
        }
      });
      if (vm.remlist.indexOf(vm.renlinlist[num]) === -1) {
        vm.remlist.push(vm.renlinlist[num]);
      }
      if (!$($event.target).hasClass('on_check')) {
        remove(vm.remlist, vm.remlist.indexOf(vm.renlinlist[num]));
        //vm.remlist.remove(vm.remlist.indexOf(vm.renlinlist[num]));
      }
    };
    vm.check1 = function ($event, num) {
      angular.forEach(vm.renlinlist, function (vam, ke) {
        if (vam.name === vm.remlist[num].name) {
          var as = ke;
          $timeout(function () {
            var element = $('.jieguo div').eq(as);
            $(element).find('span').removeClass('on_check');
          });
        }
      });
      remove(vm.remlist, num);
      //vm.remlist.remove(num);
      /*var sub = vm.renlinlist.indexOf(vm.remlist[num]);
       var element = $('.jieguo div').eq(sub);
       $(element).find('span').removeClass('on_check');
       vm.remlist.remove(num);*/
    };
    // vm.submit = function () {
    //   var onCheck = angular.element(document.querySelectorAll('.on_check'));
    // };
    $scope.communityInfo = cvsList;
    if (method === '新增') {
      vm.projectData.Source = projectSources[0].projectSourcename;
      vm.projectData.ProjectType = projectTypes[0].projectTypename;
      if (cvsList.length > 0) {
        vm.projectData.Report = cvsList[0].communityId;
      }
      vm.projectData.State = '待审核';
    }
    if (method === '修改' || method === '查看') {
      vm.projectData.SbTime = new Date(projectData.SbTime);
      vm.projectData.FinishTime = new Date(projectData.FinishTime);
      vm.projectData.Source = projectData.Source;
    }

    // 日期选择器
    $scope.today = function () {
      vm.projectData.SbTime = new Date();
      vm.projectData.FinishTime = new Date();
    };
    $scope.clear = function () {
      vm.projectData.SbTime = null;
      vm.projectData.FinishTime = null;
    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.popup2 = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }

    // 在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.projectForm');
        return;
      }
      var h_start_y = vm.projectData.SbTime.getTime();
      var h_end_y = vm.projectData.FinishTime.getTime();
      if (parseInt(h_start_y, 10) >= parseInt(h_end_y, 10)) {
        vm.yzSbTimeAndFinishTime = true;
        return;
      } else {
        vm.yzSbTimeAndFinishTime = false;
      }
      if (vm.projectData.ProjectSummary === undefined || vm.projectData.ProjectSummary === '') {
        vm.yzProjectsummary = true;
        return;
      } else {
        vm.yzProjectsummary = false;
      }
      if (vm.projectData.Measure === undefined || vm.projectData.Measure === '') {
        vm.yzMeasure = true;
        return;
      } else {
        vm.yzMeasure = false;
      }
      if (vm.picFile) {
        vm.projectData.ProjectLogo = vm.picFile;
      }
      if (appService.user) {
        if (appService.user.user_grade === 1) {
          vm.projectData.streetID = 10;
        } else {
          angular.forEach(dj_PartyBranch, function (v, k) {
            if (v.OrganizationId === appService.user.branch) {
              vm.projectData.streetID = v.streetID || 0;
              vm.projectData.communityid = v.communityId || 0;
              // vm.projectData.Report = v.communityId || 0;
              if (appService.user.user_grade > 5) {
                vm.projectData.super = v.super;
              } else {
                vm.projectData.super = vm.projectData.super || 0;
              }
            }
          });
        }
        vm.projectData.PartyBranchID = appService.user.branch;
        vm.projectData.gradeId = appService.user.user_grade;
        vm.projectData.roleid = appService.user.JCDJ_User_roleID;
        vm.projectData.arrlist = JSON.stringify(vm.remlist);
      }
      console.log(vm.projectData);
      $uibModalInstance.close(vm.projectData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
