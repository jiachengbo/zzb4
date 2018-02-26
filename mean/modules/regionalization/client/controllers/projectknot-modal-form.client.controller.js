(function () {
  'use strict';

  angular
    .module('regionalization')
    .controller('ProjectKnotModalFormController', ProjectKnotModalFormController);

  ProjectKnotModalFormController.$inject = ['$scope', '$log', '$window', '$uibModalInstance', 'projectData', 'method', 'ProgressService', 'Notification', 'Upload', 'baseCodeService'];
  function ProjectKnotModalFormController($scope, $log, $window, $uibModalInstance, projectData, method, ProgressService, Notification, Upload, baseCodeService) {
    var vm = this;
    vm.projectData = projectData;
    vm.method = method;
    vm.disabled = (method === '结项');
    //项目来源下拉框
    var projectSources = [
      {'projectSourcename': '问卷调查'},
      {'projectSourcename': '街道党工委研究'},
      {'projectSourcename': '在职党员上报'},
      {'projectSourcename': '成员单位上报'},
      {'projectSourcename': '社区发起'},
      {'projectSourcename': '其他'}
    ];
    $scope.projectSourceInfo = projectSources;
    //项目类型下拉框
    var projectTypes = [
      {'projectTypename': '社会稳定'},
      {'projectTypename': '经济发展'},
      {'projectTypename': '社会服务保障'},
      {'projectTypename': '社会综合治理'},
      {'projectTypename': '其他'}
    ];
    $scope.projectTypeInfo = projectTypes;
    //读取本地存储的社区村常量表
    var cvsList = baseCodeService.getItems('community');
    $scope.communityInfo = cvsList;
    //是否结项下拉框
    var knots = [
      {'knotid': -1, 'knotname': '是'},
      {'knotid': 0, 'knotname': '否'}
    ];
    $scope.knotInfo = knots;
    if (method === '结项') {
      vm.projectData.isfinish = knots[0].knotid;
      vm.projectData.Source = projectData.Source;
      vm.projectData.SbTime = new Date(projectData.SbTime);
      vm.projectData.FinishTime = new Date(projectData.FinishTime);
    }

    //日期选择器
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

    //在这里处理要进行的操作
    vm.knot = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.kontForm');
        return;
      }
      if (vm.projectData.isfinish === -1) {
        vm.projectData.State = '结项';
      }
      $uibModalInstance.close(vm.projectData);
    };
    //在这里处理要进行的操作
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
