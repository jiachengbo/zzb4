(function () {
  'use strict';

  angular
    .module('threelessons')
    .controller('ThreelessonsModalFormController', ThreelessonsModalFormController);

  ThreelessonsModalFormController.$inject = ['$scope', '$uibModalInstance', 'threelessonsData', 'method', 'UserMsg'];
  function ThreelessonsModalFormController($scope, $uibModalInstance, threelessonsData, method, UserMsg) {
    var vm = this;
    UserMsg.func();
    vm.threelessonsData = threelessonsData;
    vm.method = method;
    if (vm.method === 'add') {
      vm.method = '新增';
    } else if (vm.method === 'update') {
      vm.method = '修改';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    }
    vm.disabled = (method === 'view');
//日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      // $scope.dt1 = now;
      $scope.dt1 = new Date(); // 开始时间
      $scope.dt2 = new Date(); // 结束时间
      vm.worktime = new Date();
      vm.resttime = new Date();
    };
    $scope.today();
    if (vm.method === '修改' || vm.method === '查看') {
      $scope.dt1 = new Date(vm.threelessonsData.starttime); // 开始时间
      $scope.dt2 = new Date(vm.threelessonsData.endtime); // 结束时间
      vm.worktime = new Date(vm.threelessonsData.starttime);
      vm.resttime = new Date(vm.threelessonsData.endtime);
    }
    $scope.clear = function () {
      $scope.dt1 = null;
      $scope.dt2 = null;
      vm.worktime = null;
      vm.resttime = null;
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

    $scope.hstep_am1 = 1;
    $scope.mstep_am1 = 1;
    $scope.ismeridian_am1 = false;
    //下班时间
    $scope.hstep_am2 = 1;
    $scope.mstep_am2 = 1;
    $scope.ismeridian_am2 = false;
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.threelessonsForm');
        return;
      }
      var years = $scope.dt1.getFullYear();
      var month = $scope.dt1.getMonth();
      var date = $scope.dt1.getDate();
      var hours = vm.worktime.getHours() - 8;
      var mins = vm.worktime.getMinutes();
      var time = new Date(years, month, date, hours, mins);
      var years1 = $scope.dt2.getFullYear();
      var month1 = $scope.dt2.getMonth();
      var date1 = $scope.dt2.getDate();
      var hours1 = vm.resttime.getHours() - 8;
      var mins1 = vm.resttime.getMinutes();
      var time1 = new Date(years1, month1, date1, hours1, mins1);
      if (vm.method === '新增' || vm.method === '修改') {
        console.log(vm.threelessonsData);
        vm.threelessonsData.starttime = time;
        vm.threelessonsData.endtime = time1;
      }
      if (vm.create_photoPicFile) {
        vm.threelessonsData.photo = vm.create_photoPicFile;
      }
      if (vm.fileFile) {
        vm.threelessonsData.file_path = vm.fileFile;
      }
      vm.threelessonsData.gradeId = UserMsg.gradeId;
      vm.threelessonsData.objId = UserMsg.objId;
      $uibModalInstance.close(vm.threelessonsData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
