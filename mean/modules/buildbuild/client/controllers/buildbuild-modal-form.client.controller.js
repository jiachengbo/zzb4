(function () {
  'use strict';

  angular
    .module('buildbuild')
    .controller('BuildbuildModalFormController', BuildbuildModalFormController);

  BuildbuildModalFormController.$inject = ['$scope', '$uibModalInstance', 'buildbuildData', 'method', 'appService', 'baseCodeService', 'BuildbuildPersonService', 'Notification', '$timeout', 'buildpersonService', 'type'];
  function BuildbuildModalFormController($scope, $uibModalInstance, buildbuildData, method, appService, baseCodeService, BuildbuildPersonService, Notification, $timeout, buildpersonService, type) {
    var vm = this;
    vm.buildbuildData = buildbuildData;
    // console.info('vm.buildbuildData', vm.buildbuildData);
    vm.method = method;
    vm.disabled = (method === '查看');
    var user = appService.user;
    vm.userga = appService.user.user_grade;
    if (vm.userga === 1) {
      vm.showss = true;
    }
    if (type === 0) {
      vm.showss = false;
    }
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    if (method === '新增') {
      vm.showMembers = true;
    } else {
      vm.showMembers = false;
      $timeout(function () {
        $('.fenhang').html(buildbuildData.details);
      }, 200);
    }
    // 打开页面 取消推送/推送
    var ishow = vm.buildbuildData.ishow;
    if (ishow === 0) {
      vm.ts = '推送该活动';
    } else {
      vm.ts = '取消推送该活动';
    }

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      vm.buildbuildData.details = $('.fenhang').html();
      if (vm.buildbuildData.details.length > 4000) {
        return;
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.buildbuildForm');
        return;
      }
      // 会议图片
      if (vm.photo) {
        vm.buildbuildData.photo = vm.photo;
      }
      // 会议文件
      if (vm.docFile) {
        vm.buildbuildData.docFile = vm.docFile;
      }
      vm.buildbuildData.sbtime = $scope.sbtime;
      // 添加 成员列表 数据 到 请求数据中
      if (appService.user) {
        angular.forEach(vm.dj_PartyBranch, function (v, k) {
          if (v.OrganizationId === appService.user.branch) {
            vm.streetID = v.streetID || 0;
            vm.communityid = v.communityId || 0;
          }
        });
      }
      vm.buildbuildData.Relation = [];
      // 首先将 创建者 添加到 成员列表中
      vm.buildbuildData.Relation.push({
        gradeId: user.user_grade,
        roleId: user.JCDJ_User_roleID,
        branchId: user.branch,
        communityId: vm.communityid,
        streetID: vm.streetID
      });
      // 将 选择的参与成员 遍历添加到 数组中
      for (var j = 0; j < vm.mebs.length; j++) {
        if (vm.mebs[j].GradeID <= 5) {
          // 1-30
          vm.buildbuildData.Relation.push({
            gradeId: vm.mebs[j].GradeID,
            roleId: vm.mebs[j].roleID,
            branchId: -1,
            communityId: vm.communityid,
            streetID: vm.streetID
          });
        } else if (vm.mebs[j].GradeID >= 6 && vm.mebs[j].GradeID <= 7) {
          // 党支部支部
          var obj = {
            gradeId: vm.mebs[j].GradeID,
            roleId: -1,
            branchId: vm.mebs[j].OrganizationId,
            communityId: vm.communityid,
            streetID: vm.streetID
          };
          if (vm.mebs[j].GradeID === 6) {
            obj.roleId = 67;
          } else {
            obj.roleId = 68;
          }
          vm.buildbuildData.Relation.push(obj);
        }
      }

      $uibModalInstance.close(vm.buildbuildData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    // 修改 活动成员表BuildbuildPerson 中的ishow 字段，0-不推送（默认) 1-推送
    vm.updateBbpIshow = function () {
      var id = vm.buildbuildData.id;
      var ishow = vm.buildbuildData.ishow;
      if (ishow === 0) {
        ishow = 1;
      } else {
        ishow = 0;
      }
      BuildbuildPersonService.query({id: id, ishow: ishow}).$promise.then(function () {
        var msg = '';
        if (ishow === 0) {
          msg = '取消推送成功!';
        } else {
          msg = '推送成功!';
        }
        $uibModalInstance.close(vm.buildbuildData);
        // Notification.success({message: '<i class="glyphicon glyphicon-ok">' + msg + '</i> '});
        vm.cancel();
      }).catch(function () {
        /*
         var _msg = '';
         if (ishow === 0) {
         _msg = '取消推送失败!';
         } else {
         _msg = '推送失败!';
         }

         Notification.error({
         message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ' +
         _msg
         });*/
      });
    };
    //result.$save();
    vm.updatebuildP = function () {
      console.log(vm.buildbuildData.hdId
      );
      buildpersonService.query({
        hdId: vm.buildbuildData.hdId,
        gradeId: 1,
        roleId: 25,
        branchId: 39,
        ishow: 1,
        isdelete: 0,
        communityId: 2,
        streetID: 4
      }).$promise.then(function (data) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 抓取成功!'});
      });
    };

    //加入 逻辑层级
    $scope.dwdgws = [
      {id: 1, name: '党委'},
      {id: 2, name: '党工委'}
    ];
    // 初始化一下下
    vm.dwdgw = $scope.dwdgws[0].id;
    var i;
    // 选中的index
    $scope.xmembers = [];
    vm.members = [];
    vm.mebs = [];
    $scope.xmemberx = [];
    $scope.dzzzbmember = [];
    $scope.dzzmember = [];
    vm.memberx = [];
    vm.mebx = [];
    // 党委党工委 级联 街道部门

    vm.selectDwdgwChange = function () {
      $scope.xmembers = [];
      vm.dzzname = [];
      vm.jdbms = [];
      var comType = vm.dwdgw;
      for (i = 0; i < vm.dj_PartyOrganization.length; i++) {
        if (vm.dj_PartyOrganization[i].comType === comType) {
          vm.jdbms.push(vm.dj_PartyOrganization[i]);
        }
      }
      $scope.jdbms = vm.jdbms;
      vm.jdbm = vm.jdbms[0].roleID;
      vm.members = vm.jdbms;
      // 根据右侧选择的名字 ，反显是否选中
      for (var mi = 0; mi < vm.mebs.length; mi++) {
        var simpleName1 = vm.mebs[mi].simpleName;
// 遍历 当前显示列表
        for (var mj = 0; mj < vm.members.length; mj++) {
          var simpleName2 = vm.members[mj].simpleName;
          if (simpleName1 === simpleName2) {
            $scope.xmembers[mj] = true;
          }
        }
      }
    };
    // 街道部门 级联 党支部
    vm.selectJdbmChange = function () {
      $scope.xmembers = [];
      vm.dzbs = [];
      vm.dzzs = [];
      vm.dzzname = [];
      vm.dzzzb = [];
      var _super = vm.jdbm - 31;
      for (var i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (vm.dj_PartyBranch[i].super === _super) {
          if (vm.dj_PartyBranch[i].generalbranch) {
            if (vm.dzzs.indexOf(vm.dj_PartyBranch[i].generalbranch) === -1) {
              var obj = {};
              for (var ii = 0; ii < vm.dj_PartyGeneralBranch.length; ii++) {
                if (vm.dj_PartyGeneralBranch[ii].branchID === vm.dj_PartyBranch[i].generalbranch) {
                  obj.name = vm.dj_PartyGeneralBranch[ii];
                }
              }
              // angular.forEach(vm.dj_PartyGeneralBranch, function (value, key) {
              //   if (value.branchID === vm.dj_PartyBranch[i].generalbranch) {
              //     obj.name = value;
              //   }
              // });
              vm.dzzname.push(obj);
              vm.dzzs.push(vm.dj_PartyBranch[i].generalbranch);
            }
          } else {
            vm.dzbs.push(vm.dj_PartyBranch[i]);
          }
        }
      }
      angular.forEach(vm.dzzname, function (v, k) {
        v.arr = [];
        angular.forEach(vm.dj_PartyBranch, function (value, key) {
          if (value.generalbranch === v.name.branchID) {
            v.arr.push(value);
          }
        });
      });
      $scope.dzbs = vm.dzbs;
      vm.members = vm.dzbs;
      $('.dangzongzhi').removeAttr('checked');
      for (var mi = 0; mi < vm.mebs.length; mi++) {
        var simpleName1 = vm.mebs[mi].simpleName;
// 遍历 当前显示列表
        for (var mj = 0; mj < vm.members.length; mj++) {
          var simpleName2 = vm.members[mj].simpleName;
          if (simpleName1 === simpleName2) {
            $scope.xmembers[mj] = true;
          }
        }
      }
    };

    vm.selectDwdgwChange();
    // vm.selectJdbmChange();
    vm.isSelected = function (param) {
      if (vm.mebs.indexOf(param) !== -1) {
        var index = vm.mebs.indexOf(param);
        vm.mebs.splice(index, 1);
      } else {
        vm.mebs.push(param);
      }
      var str = '';
      for (var m = 0; m < vm.mebs.length; m++) {
        str += '[' + vm.mebs[m].simpleName + ']';

      }
      vm.sbmebs = str;
    };
    $scope.ischecked = function (num) {
      return vm.mebs.indexOf(num) >= 0;
    };
    vm.changedzz = function (num) {
      //if($scope.dzzmember[num]){
      angular.forEach(vm.dzzname[num].arr, function (value, key) {
        vm.isSelected(value);
      });
      // }
    };
    vm.changMembers = function (param) {
      if (vm.mebs.indexOf(param) !== -1) {
        var index = vm.mebs.indexOf(param);
        vm.mebs.splice(index, 1);
      } else {
        vm.mebs.push(param);
      }
      var str = '';
      for (var m = 0; m < vm.mebs.length; m++) {
        str += '[' + vm.mebs[m].simpleName + ']';

      }
      vm.sbmebs = str;
    };
    //日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      // $scope.sbtime = now;
      if (vm.buildbuildData.sbtime) {
        $scope.sbtime = new Date(vm.buildbuildData.sbtime);
      } else {
        $scope.sbtime = new Date();
      }
    };
    $scope.today();
    $scope.clear = function () {
      $scope.sbtime = null;
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
  }
}());
