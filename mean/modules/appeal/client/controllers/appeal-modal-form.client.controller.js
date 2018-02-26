(function () {
  'use strict';

  angular
    .module('appeal')
    .controller('AppealModalFormController', AppealModalFormController);

  AppealModalFormController.$inject = ['$scope', '$uibModalInstance', 'appealData', 'method', 'columnDefs', 'baseCodeService', 'appService', '$timeout', 'appealZQService', 'Notification', 'type'];
  function AppealModalFormController($scope, $uibModalInstance, appealData, method, columnDefs, baseCodeService, appService, $timeout, appealZQService, Notification, type) {
    var vm = this;
    var i;
    vm.appealData = appealData;
    if (appService.user.displayName !== vm.appealData.createUser) {
      vm.getOther = true;
    }
    if (type === 0) {
      vm.getOther = false;
    }
    vm.method = method;
    console.log(vm.method);
    if (vm.method === '查看' || vm.method === '修改') {
      $timeout(function () {
        $('#appealContext').html(appealData.appealContext);
      }, 200);
    } else {
      $timeout(function () {
        $('#appealContext').html('');
      }, 200);
    }
    vm.disabled = (method === '查看');
    vm.columnDefs = columnDefs;
    var user = appService.user;
    vm.userga = appService.user.user_grade;
    var user_grade = user.user_grade;
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.appealForm');
        return;
      }
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.appealForm');
        return;
      }
      if (vm.picFile1) {
        vm.appealData.phoneOnePath = vm.picFile1;
      }

      if (vm.picFile2) {
        vm.appealData.photoTwoimagePath = vm.picFile2;
      }

      if (vm.picFile3) {
        vm.appealData.photoThreeimagePath = vm.picFile3;
      }
      vm.appealData.appealContext = $('#appealContext').html();
      if (vm.appealData.appealContext.length > 8000) {
        return;
      }
      vm.appealData.sbtime = $scope.sbtime;
      $uibModalInstance.close(vm.appealData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    vm.updatebuildP = function () {
      console.log(vm.appealData);
      appealZQService.query({
        appealId: vm.appealData.appealId,
        gradeId: 1,
        roleId: 25,
        PartyBranchID: 39,
        ishow: 1,
        sbtime: new Date(),
        isdelete: 0
      }).$promise.then(function (data) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 抓取成功!'});
      });
    };
    var cvs_ishow = [{id: 0, name: '否'}, {id: 1, name: '是'}];
    var cvs_issb = [{id: 0, name: '否'}, {id: 1, name: '是'}];
    if (user_grade === 1) {
      cvs_issb = [{id: 0, name: '否'}];
    }
    $scope.cvs_ishow = cvs_ishow;
    $scope.cvs_issb = cvs_issb;
    // vm.appealData.ishow = 0;
    // vm.appealData.issb = 0;

    var cvs_state = [{name: '正在上报'}, {name: '处理中'}, {name: '已完成'}];
    $scope.cvs_state = cvs_state;

    if (method === '新增') {
      vm.appealData.ishow = 0;
      vm.appealData.issb = 0;

      vm.appealData.streetID = appealData.Street;
      if (cvs_state.length > 0) {
        vm.appealData.state = cvs_state[0].name;
      }
    } else if (method === '修改' || method === '查看') {
      vm.appealData.streetID = appealData.streetID;
      vm.appealData.state = appealData.state;
      vm.appealData.ishow = appealData.ishow;
    }
    /*
     //var cvs_street_info = baseCodeService.getItems('street_info');
     var cvs_communitysNew = [];
     var cvs_communitys = baseCodeService.getItems('community');
     for (i = 0; i < cvs_communitys.length; i++) {
     if (vm.appealData.streetID === cvs_communitys[i].streetID) {
     cvs_communitysNew.push(cvs_communitys[i]);
     }
     }
     $scope.cvs_communitys = cvs_communitysNew;
     if (method === '新增') {
     if (cvs_communitys.length > 0) {
     vm.appealData.communityId = cvs_communitys[0].communityId;
     }
     } else if (method === '修改' || method === '查看') {
     var cid = appealData.communityId;
     for (i = 0; i < cvs_communitys.length; i++) {
     if (cid === cvs_communitys[i].communityId + '') {
     vm.appealData.communityId = cvs_communitys[i].communityId;
     }
     }
     }
     var cvs_grids = baseCodeService.getItems('grid');
     $scope.cvs_grids = cvs_grids;
     if (method === '新增') {
     if (cvs_grids.length > 0) {
     vm.appealData.gridId = cvs_grids[0].gridId;
     }
     } else if (method === '修改' || method === '查看') {
     var cid2 = appealData.gridId;
     for (i = 0; i < cvs_grids.length; i++) {
     if (cid2 === cvs_grids[i].gridId + '') {
     vm.appealData.gridId = cvs_grids[i].gridId;
     }
     }
     }
     vm.selectCommunityIdChange = function () {

     var problemGrid = [];
     var problemGridNew = [];
     $scope.cvs_grids = null;


     var communityId = vm.appealData.communityId;
     // console.info(bigTypeId + '==bigTypeId==大类型下拉事件');
     //根据大类型 id 获取小类型列表
     problemGrid = baseCodeService.getItems('grid');
     for (i = 0; i < problemGrid.length; i++) {
     if (problemGrid[i].departmentId === communityId && problemGrid[i].streetID === vm.appealData.streetID) {
     problemGridNew.push(problemGrid[i]);
     }
     }
     $scope.cvs_grids = problemGridNew;
     };
     vm.selectCommunityIdChange();*/
    //日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      // $scope.sbtime = now;
      $scope.sbtime = new Date();
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
