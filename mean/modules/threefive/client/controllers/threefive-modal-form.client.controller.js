(function () {
  'use strict';

  angular
    .module('threefive')
    .controller('ThreefiveModalFormController', ThreefiveModalFormController);

  ThreefiveModalFormController.$inject = ['$scope', '$uibModalInstance', 'threefiveData', 'method', '$timeout', '$window', 'baseCodeService', 'appService'];
  function ThreefiveModalFormController($scope, $uibModalInstance, threefiveData, method, $timeout, $window, baseCodeService, appService) {
    var vm = this;
    var role = appService.user.JCDJ_User_roleID;
    var branch = appService.user.branch;
    var rolelist = baseCodeService.getItems('dj_JCDJ_UserRole');
    var branchlist = baseCodeService.getItems('dj_PartyBranch');
    var commid;
    vm.threefiveData = threefiveData;
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.grid = baseCodeService.getItems('grid');
    vm.community = baseCodeService.getItems('community');
    $scope.street = [];
    $scope.grid = [];
    $scope.community = [];
    angular.forEach(vm.street_info, function (v, k) {
      if (v.streetID > 0 && v.streetID < 10) {
        $scope.street.push(v);
      }
      if (vm.method !== '增加') {
        if (v.streetName === vm.threefiveData.streetid) {
          vm.threefiveData.streetid = v.streetID;
        }
      }
    });
    if (role > 31 && role < 41) {
      angular.forEach(rolelist, function (v, k) {
        if (v.UserRoleID === role) {
          vm.threefiveData.streetid = v.streetID;
        }
      });
    }
    if (role === 68 || role === 73) {
      angular.forEach(branchlist, function (v, k) {
        if (v.OrganizationId === branch) {
          vm.threefiveData.streetid = v.streetID;
          commid = v.communityId;
        }
      });
    }
    angular.forEach(vm.community, function (v, k) {
      if (v.streetID === vm.threefiveData.streetid) {
        $scope.community.push(v);
      }
      if (vm.method !== '增加') {
        if (v.communityName === vm.threefiveData.communityid) {
          vm.threefiveData.communityid = v.communityId;
        }
      }
    });
    if (role === 68 || role === 73) {
      vm.threefiveData.communityid = commid;
    }
    angular.forEach(vm.grid, function (v, k) {
      if (v.streetID === vm.threefiveData.streetid && v.departmentId === vm.threefiveData.communityid) {
        $scope.grid.push(v);
      }
      if (vm.method !== '增加') {
        if (v.gridName === vm.threefiveData.gridId) {
          vm.threefiveData.gridId = v.gridId;
        }
      }
    });
    vm.strchang = function (num) {
      $scope.community = [];
      angular.forEach(vm.community, function (v, k) {
        if (v.streetID === num) {
          $scope.community.push(v);
        }
      });
    };
    vm.commchange = function (street, comm) {
      $scope.grid = [];
      angular.forEach(vm.grid, function (v, k) {
        if (v.streetID === street && v.departmentId === comm) {
          $scope.grid.push(v);
        }
      });
    };
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.threefiveForm');
        return;
      }
      $uibModalInstance.close(vm.threefiveData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    function map(a) {
      var map = new $window.BMap.Map('allmap');
      map.centerAndZoom(new $window.BMap.Point(108.95346, 34.265725), a);
      map.enableScrollWheelZoom(true);
      map.addEventListener('click', function (e) {
        var poi = e.point;
        var lng = poi.lng;
        var lat = poi.lat;
        $timeout(function () {
          vm.threefiveData.lat = lng;
          vm.threefiveData.lon = lat;
          map.clearOverlays();//清除定位图标
          var point = new $window.BMap.Point(lng, lat);
          addMarker('/modules/page/client/img/dw.png', point, '');
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

    $timeout(function () {
      map(15);
    }, 500);
  }
}());
