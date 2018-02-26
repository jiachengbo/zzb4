(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchInModalFormController', RelationswitchInModalFormController);

  RelationswitchInModalFormController.$inject = ['$scope', '$uibModalInstance', 'RelationswitchInData', 'method', 'baseCodeService', 'branchData', 'appService'];
  function RelationswitchInModalFormController($scope, $uibModalInstance, RelationswitchInData, method, baseCodeService, branchData, appService) {
    var vm = this;
    vm.userid = appService.user.id;
    vm.RelationswitchInData = RelationswitchInData;
    vm.method = method;
    vm.disabled = (method === '查看');
    //性别下拉框
    var sexs = [
      {'name': '男'},
      {'name': '女'}
    ];
    $scope.sexInfo = sexs;
    //读取本地存储的民族常量表
    var nationList = baseCodeService.getItems('nationconstant');
    $scope.nationInfo = nationList;
    //读取本地存储的全国省市常量表
    var nationplaceList = baseCodeService.getItems('nationplaceconstant');
    $scope.nationPlaceInfo = nationplaceList;
    $scope.outBranchInfo = branchData;
    vm.RelationswitchInData.outBranch = branchData[0].branchid;
    //读取本地存储的党支部常量表
    var partyBranchList = baseCodeService.getItems('dj_PartyBranch');
    $scope.names = partyBranchList;
    if (method === '新增') {
      vm.RelationswitchInData.sex = sexs[0].name;
      vm.RelationswitchInData.nation = nationList[0].name;
      vm.RelationswitchInData.place = nationplaceList[0].name;
    } else if (method === '修改' || method === '查看') {
      vm.RelationswitchInData.birth = new Date(RelationswitchInData.birth);
      vm.RelationswitchInData.jointime = new Date(RelationswitchInData.jointime);
      var inBranchName = '';
      if (partyBranchList.length !== 0) {
        for (var i = 0; i < partyBranchList.length; i++) {
          if (partyBranchList[i].OrganizationId === parseInt(RelationswitchInData.inBranch, 10)) {
            inBranchName = partyBranchList[i].OrganizationName;
            break;
          }
        }
      }
      vm.inBranchId = inBranchName;
    }
    //日期选择器
    $scope.today = function () {
      vm.RelationswitchInData.birth = new Date();
      vm.RelationswitchInData.jointime = new Date();
    };
    $scope.clear = function () {
      vm.RelationswitchInData.birth = null;
      vm.RelationswitchInData.jointime = null;
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

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.RelationswitchInForm');
        return;
      }
      var inBranchId = 0;
      if (vm.inBranchId) {
        if (partyBranchList.length !== 0) {
          for (var i = 0; i < partyBranchList.length; i++) {
            if (partyBranchList[i].OrganizationName === vm.inBranchId) {
              inBranchId = partyBranchList[i].OrganizationId;
              break;
            }
          }
        }
      }
      vm.RelationswitchInData.inBranch = inBranchId;
      if (vm.picFile) {
        vm.RelationswitchInData.phonePath = vm.picFile;
      }
      if (vm.File1) {
        vm.RelationswitchInData.filePath1 = vm.File1;
      }
      vm.RelationswitchInData.createUser = vm.userid;
      $uibModalInstance.close(vm.RelationswitchInData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
