(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartyMemberModalFormController', PartyMemberModalFormController);

  PartyMemberModalFormController.$inject = ['$scope', '$log', '$uibModalInstance', 'PartyMemberData', 'method', 'baseCodeService', 'UserIDNumberService', 'branchData', 'orgData', '$timeout'];
  function PartyMemberModalFormController($scope, $log, $uibModalInstance, PartyMemberData, method, baseCodeService, UserIDNumberService, branchData, orgData, $timeout) {
    var vm = this;
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.PartyMemberData = PartyMemberData;
    console.log(PartyMemberData);
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
    //是否在职下拉框
    var isjobs = [
      {'name': '在职'},
      {'name': '未在职'}
    ];
    $scope.jobInfo = isjobs;
    //学历下拉框
    // var educations = [
    //   {'name': '小学'},
    //   {'name': '初中'},
    //   {'name': '高中'},
    //   {'name': '中专'},
    //   {'name': '大专'},
    //   {'name': '本科'},
    //   {'name': '研究生'},
    //   {'name': '硕士'},
    //   {'name': '博士'},
    //   {'name': '博士后'}
    // ];
    var educations = [
      {'name': '初中及以下'},
      {'name': '高中、中专、技校'},
      {'name': '大学专科、大学本科'},
      {'name': '研究生及以上'}
    ];
    $scope.educationInfo = educations;
    //人员类别下拉框
    var persons = [
      {'name': '预备党员'},
      {'name': '正式党员'}
    ];
    $scope.presonInfo = persons;
    //读取本地存储的街道常量表
    var streetList = baseCodeService.getItems('street_info');
    $scope.streetInfo = streetList;
    vm.changeStreet = function () {
      vm.PartyMemberData.communityId = '-1';//所属社区
      vm.PartyMemberData.BelongGrid = '-1';//所属网格
      vm.PartyMemberData.gridNum = '-1';
      vm.requiredStreetInfoFlag = false;
    };
    //读取本地存储的社区常量表
    var commList = baseCodeService.getItems('community');
    $scope.communityInfo = commList;
    vm.changeCommunity = function () {
      vm.PartyMemberData.BelongGrid = '-1';//所属网格
      vm.PartyMemberData.gridNum = '-1';
      vm.requiredCommunityInfoFlag = false;
    };
    //读取本地存储的网格常量表
    var gridList = baseCodeService.getItems('grid');
    $scope.gridInfo = gridList;
    vm.changeNetGrid = function () {
      vm.PartyMemberData.gridNum = '-1';
      vm.requiredNetGridFlag = false;
    };
    $scope.gridNumInfo = gridList;
    vm.changeNetGridNum = function () {
      vm.requiredNetGridNumFlag = false;
    };
    //党员类型下拉框
    var categorys = [
      {'name': '在册'},
      {'name': '非在册'}
    ];
    $scope.categoryInfo = categorys;
    //是否在职党员下拉框
    var flowInfos = [
      {'id': 1, 'name': '是'},
      {'id': 2, 'name': '否'}
    ];
    $scope.flowInfo = flowInfos;
    //是否失联党员下拉框
    var concatInfos = [
      {'id': 1, 'name': '是'},
      {'id': 2, 'name': '否'}
    ];
    $scope.concatInfo = concatInfos;
    $scope.workbranchInfo = orgData;
    $scope.branchInfo = branchData;
    $log.info('组织信息');
    $log.info(orgData);
    if (method === '新增') {
      vm.PartyMemberData.PartySex = sexs[0].name;
      vm.PartyMemberData.PartyNation = nationList[0].name;
      vm.PartyMemberData.PartyPlace = nationplaceList[0].name;
      vm.PartyMemberData.isJob = isjobs[0].name;
      vm.PartyMemberData.education = educations[0].name;
      vm.PartyMemberData.preson_category = persons[0].name;
      vm.PartyMemberData.streetID = '-1';
      vm.PartyMemberData.communityId = '-1';
      vm.PartyMemberData.BelongGrid = '-1';
      vm.PartyMemberData.gridNum = '-1';
      vm.PartyMemberData.Category = categorys[0].name;
      vm.PartyMemberData.isFlow_party = flowInfos[0].id;
      vm.PartyMemberData.isConcat = concatInfos[0].id;
      vm.PartyMemberData.workbranch = orgData[0].orgid;
      vm.PartyMemberData.branch = branchData[0].branchid;
    } else if (method === '修改' || method === '查看') {
      vm.PartyMemberData.PartyBirth = new Date(PartyMemberData.PartyBirth);
      vm.PartyMemberData.JoinTime = new Date(PartyMemberData.JoinTime);
      if (PartyMemberData.streetID) {
        vm.PartyMemberData.streetID = PartyMemberData.streetID.toString();
      }
      vm.PartyMemberData.gridNum = PartyMemberData.BelongGrid;
    }
    //日期选择器
    $scope.today = function () {
      vm.PartyMemberData.PartyBirth = new Date();
      vm.PartyMemberData.JoinTime = new Date();
    };
    $scope.clear = function () {
      vm.PartyMemberData.PartyBirth = null;
      vm.PartyMemberData.JoinTime = null;
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

    //验证身份证号是否存在
    vm.YzIdNumber = function (IDNumber) {
      if (method === '新增') {
        checkIDNumber(IDNumber);
      }
    };
    function checkIDNumber(num) {
      if (num === '' || num === undefined) {
        vm.YZIDNumberIsNo = false;
        vm.YZIDNumberIsOk = false;
        return;
      }
      UserIDNumberService.query({
        IDNumber: num
      }).$promise.then(function (data) {
        if (data.length !== 0) {
          if (data[0].counts === 0) {
            vm.YZIDNumberIsNo = false;
            vm.YZIDNumberIsOk = true;
            return;
          } else {
            vm.YZIDNumberIsNo = true;
            vm.YZIDNumberIsOk = false;
          }
        } else {
          vm.YZIDNumberIsNo = true;
          vm.YZIDNumberIsOk = false;
          return;
        }
      });
    }

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.PartyMemberForm');
        return;
      }
      if (!vm.YZIDNumberIsOk && method === '新增') {
        return;
      }
      if (vm.PartyMemberData.streetID === '-1') {
        vm.requiredStreetInfoFlag = true;
      } else {
        vm.requiredStreetInfoFlag = false;
      }
      if (vm.PartyMemberData.communityId === '-1') {
        vm.requiredCommunityInfoFlag = true;
      } else {
        vm.requiredCommunityInfoFlag = false;
      }
      if (vm.PartyMemberData.BelongGrid === '-1') {
        vm.requiredNetGridFlag = true;
      } else {
        vm.requiredNetGridFlag = false;
      }
      if (vm.PartyMemberData.gridNum === '-1') {
        vm.requiredNetGridNumFlag = true;
      } else {
        vm.requiredNetGridNumFlag = false;
      }
      if (vm.PartyMemberData.ThePartyfor === undefined || vm.PartyMemberData.ThePartyfor === '') {
        vm.yzThePartyfor = true;
        return;
      } else {
        vm.yzThePartyfor = false;
      }
      if (method === '新增') {
        $timeout(function () {
          checkIDNumber(vm.PartyMemberData.IDNumber);//验证身份证号码
          $uibModalInstance.close(vm.PartyMemberData);
          $log.info('验证身份证号码');
        }, 500);
      }
      $uibModalInstance.close(vm.PartyMemberData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    //  党费缴纳
    vm.partymoney = function () {
      var years = new Date().getFullYear();
      var age = years - vm.PartyMemberData.IDNumber.slice(6, 10);
      if (age > 60) {
        if (vm.PartyMemberData.Income <= 5000) {
          vm.PartyMemberData.ToPay = '0.5%';
          vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.005).toFixed(2);
        } else if (vm.PartyMemberData.Income > 5000) {
          vm.PartyMemberData.ToPay = '1%';
          vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.01).toFixed(2);
        }
      } else {
        if (vm.PartyMemberData.Income) {
          if (vm.PartyMemberData.Income <= 3000) {
            vm.PartyMemberData.ToPay = '0.5%';
            vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.005).toFixed(2);
          } else if (vm.PartyMemberData.Income > 3000 && vm.PartyMemberData.Income <= 5000) {
            vm.PartyMemberData.ToPay = '1%';
            vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.01).toFixed(2);
          } else if (vm.PartyMemberData.Income > 5000 && vm.PartyMemberData.Income <= 10000) {
            vm.PartyMemberData.ToPay = '1.5%';
            vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.015).toFixed(2);
          } else if (vm.PartyMemberData.Income > 10000) {
            vm.PartyMemberData.ToPay = '2%';
            vm.PartyMemberData.PartyMoney = (vm.PartyMemberData.Income * 0.02).toFixed(2);
          }
        }
      }
    };
    if (method !== '新增') {
      vm.YZIDNumberIsNo = false;
      vm.YZIDNumberIsOk = false;
    }
    if (vm.PartyMemberData.branch) {
      angular.forEach(dj_PartyBranch, function (v, k) {
        if (vm.PartyMemberData.branch === v.OrganizationId) {
          console.log(v);
          vm.PartyMemberData.streetID = v.streetID + '';
          vm.PartyMemberData.communityId = v.communityId + '';
          vm.PartyMemberData.BelongGrid = v.BelongGrid + '';
          vm.PartyMemberData.gridNum = v.BelongGrid + '';
        }
      });
    }
    vm.partybranch = function (num) {
      angular.forEach(dj_PartyBranch, function (v, k) {
        if (vm.PartyMemberData.branch === v.OrganizationId) {
          console.log(v);
          vm.PartyMemberData.streetID = v.streetID + '';
          vm.PartyMemberData.communityId = v.communityId + '';
          vm.PartyMemberData.BelongGrid = v.BelongGrid + '';
          vm.PartyMemberData.gridNum = v.BelongGrid + '';
        }
      });
    };
  }
}());
