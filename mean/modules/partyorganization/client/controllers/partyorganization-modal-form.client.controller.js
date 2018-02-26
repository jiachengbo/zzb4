(function () {
  'use strict';

  angular
    .module('partyorganization')
    .controller('PartyorganizationModalFormController', PartyorganizationModalFormController);

  PartyorganizationModalFormController.$inject = ['$scope', '$window', '$timeout', '$uibModalInstance', 'PartyorganizationData', 'method', 'baseCodeService', 'organizationData', 'appService'];
  function PartyorganizationModalFormController($scope, $window, $timeout, $uibModalInstance, PartyorganizationData, method, baseCodeService, organizationData, appService) {
    var vm = this;
    vm.PartyorganizationData = PartyorganizationData;
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = angular.copy(dj_PartyGeneralBranch);
    var obj = {
      branchID: null,
      GradeID: 10,
      branchName: '无',
      generalbranch: null,
      mold: 2,
      simpleName: '无',
      superior: 2
    };
    vm.dj_PartyGeneralBranch.unshift(obj);
    if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
      angular.forEach(dj_PartyBranch, function (v, k) {
        if (v.OrganizationId === appService.user.branch) {
          vm.PartyorganizationData.generalbranch = v.generalbranch;
        }
      });
    }
    vm.method = method;
    vm.disabled = (method === '查看');
    //组织类别下拉框
    var organizationCategorys = [
      {'name': '党委'},
      {'name': '党工委'},
      {'name': '党总支'},
      {'name': '党支部'}
    ];
    $scope.organizationCategoryInfo = organizationCategorys;
    //隶属关系下拉框
    var relations = [
      {'name': '区内'},
      {'name': '驻地'}
    ];
    $scope.relationsInfo = relations;
    $scope.superInfo = organizationData;
    vm.PartyorganizationData.super = organizationData[0].organizationid;
    //读取本地存储的街道常量表
    var streetList = baseCodeService.getItems('street_info');
    $scope.streetInfo = streetList;
    var commList = baseCodeService.getItems('community');
    $scope.communityInfo = [];
    var gridList = baseCodeService.getItems('grid');
    $scope.gridInfo = [];
    $scope.gridNumInfo = [];
    angular.forEach(commList, function (v, k) {
      if (v.streetID === vm.PartyorganizationData.streetID) {
        $scope.communityInfo.push(v);
      }
    });
    angular.forEach(gridList, function (v, k) {
      if (v.streetID === vm.PartyorganizationData.streetID && v.departmentId === vm.PartyorganizationData.communityId) {
        $scope.gridInfo.push(v);
        $scope.gridNumInfo.push(v);
      }
    });
    vm.changeStreet = function () {
      vm.PartyorganizationData.communityId = '-1';//所属社区
      vm.PartyorganizationData.BelongGrid = '-1';//所属网格
      vm.PartyorganizationData.gridNum = '-1';
      vm.requiredStreetInfoFlag = false;
      $scope.communityInfo = [];
      angular.forEach(commList, function (v, k) {
        console.log(v, vm.PartyorganizationData.streetID);
        if (v.streetID + '' === vm.PartyorganizationData.streetID) {
          $scope.communityInfo.push(v);
        }
      });
      console.log($scope.communityInfo);
    };
    //读取本地存储的社区常量表

    vm.changeCommunity = function () {
      vm.PartyorganizationData.BelongGrid = '-1';//所属网格
      vm.PartyorganizationData.gridNum = '-1';
      vm.requiredCommunityInfoFlag = false;
      $scope.gridInfo = [];
      angular.forEach(gridList, function (v, k) {
        if (v.streetID + '' === vm.PartyorganizationData.streetID && v.departmentId + '' === vm.PartyorganizationData.communityId) {
          $scope.gridInfo.push(v);
        }
      });
    };
    //读取本地存储的网格常量表

    vm.changeNetGrid = function () {
      vm.PartyorganizationData.gridNum = '-1';
      vm.requiredNetGridFlag = false;
      $scope.gridNumInfo = [];
      angular.forEach(gridList, function (v, k) {
        if (v.streetID + '' === vm.PartyorganizationData.streetID && v.departmentId + '' === vm.PartyorganizationData.communityId && v.gridId === vm.PartyorganizationData.BelongGrid) {
          $scope.gridNumInfo.push(v);
        }
      });
    };

    vm.changeNetGridNum = function () {
      vm.requiredNetGridNumFlag = false;
    };
    //读取本地存储的单位类别常量
    var djorgclassList = baseCodeService.getItems('dj_org_class');
    $scope.categoryInfo = djorgclassList;
    //党组织所在单位情况下拉框
    var unitsitus = [
      {'name': '与上级组织相同'},
      {'name': '法人单位'},
      {'name': '联合支部'}
    ];
    $scope.unitsituInfo = unitsitus;
    //单位建立党组织情况下拉框
    var unitorgsitus = [
      {'name': '建立党委的'},
      {'name': '建立党总支的'},
      {'name': '建立党支部的'}
    ];
    $scope.unitorgsituInfo = unitorgsitus;
    if (method === '新增') {
      vm.PartyorganizationData.generalbranch = null;
      vm.PartyorganizationData.OrganizationCategory = organizationCategorys[0].name;
      vm.PartyorganizationData.Relations = relations[0].name;
      vm.PartyorganizationData.streetID = '-1';
      vm.PartyorganizationData.communityId = '-1';
      vm.PartyorganizationData.BelongGrid = '-1';
      vm.PartyorganizationData.gridNum = '-1';
      vm.PartyorganizationData.Category = djorgclassList[0].class_Name;
      vm.PartyorganizationData.unitsitu = unitsitus[0].name;
      vm.PartyorganizationData.unitorgsitu = unitorgsitus[0].name;
    } else if (method === '修改' || method === '查看') {
      vm.PartyorganizationData.OrganizationTime = new Date(PartyorganizationData.OrganizationTime);
      if (PartyorganizationData.streetID !== null) {
        vm.PartyorganizationData.streetID = PartyorganizationData.streetID.toString();
      } else {
        vm.PartyorganizationData.streetID = 0;
      }
      vm.PartyorganizationData.gridNum = PartyorganizationData.BelongGrid;
    }
    //百度地图API
    function map(a) {
      var map = new $window.BMap.Map('allmap', {minZoom: a});
      map.centerAndZoom(new $window.BMap.Point(108.95346, 34.265725), a);
      map.enableScrollWheelZoom(true);
      // map.addControl(new $window.BMap.MapTypeControl());
      map.addEventListener('click', function (e) {
        var poi = e.point;
        var lng = poi.lng;
        var lat = poi.lat;
        $timeout(function () {
          vm.PartyorganizationData.longitude = lng;
          vm.PartyorganizationData.latitude = lat;
          map.clearOverlays();//清除定位图标
          var point = new $window.BMap.Point(lng, lat);
          addMarker('/modules/core/client/img/bdmap/dw.png', point, '');
        }, 500);
      });
      function addMarker(icon, point, sContent) {  // 创建图标对象
        var myIcon = new $window.BMap.Icon(icon, new $window.BMap.Size(32, 32), {
          anchor: new $window.BMap.Size(10, 25)
        });
        // 创建标注对象并添加到地图
        var marker = new $window.BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
      }
    }

    //地图点击事件
    vm.visible = false;
    vm.disvisible = true;
    vm.showMap = function () {
      vm.visible = true;
      vm.disvisible = false;
      $timeout(function () {
        map(15);
      }, 500);
    };
    vm.return = function () {
      vm.visible = false;
      vm.disvisible = true;
    };
    //日期选择器
    $scope.today = function () {
      vm.PartyorganizationData.OrganizationTime = new Date();
    };
    $scope.clear = function () {
      vm.PartyorganizationData.OrganizationTime = null;
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

    $scope.popup1 = {
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
        $scope.$broadcast('show-errors-check-validity', 'vm.partyorganizationForm');
        return;
      }
      $uibModalInstance.close(vm.PartyorganizationData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
