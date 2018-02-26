(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageBasicMsgBranchController', PageBasicMsgBranchController);

  PageBasicMsgBranchController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', '$location', 'menuService', '$filter', 'TeammembersService', 'ThreelessonsService', 'MajorsecretaryService', 'PartyBuildingService', 'UserMsg', '$timeout', 'appService', 'PartyBuildingSbService', '$state', 'SurveyService', 'GetPartyMemberService', '$interval', '$uibModal', 'Timer'];
  function PageBasicMsgBranchController($scope, Notification, $log, $window, baseCodeService, $location, menuService, $filter, TeammembersService, ThreelessonsService, MajorsecretaryService, PartyBuildingService, UserMsg, $timeout, appService, PartyBuildingSbService, $state, SurveyService, GetPartyMemberService, $interval, $uibModal, Timer) {
    var vm = this;
    UserMsg.func();
    $window.scrollTo(0, 0);
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    menuService.leftMenusCollapsed = true;
    if ($location.search().OrganizationId) { // 党支部
      vm.id = $location.search().OrganizationId;
      for (var n = 0; n < vm.dj_PartyBranch.length; n++) {
        if (vm.dj_PartyBranch[n].OrganizationId + '' === vm.id) {
          vm.branchName = vm.dj_PartyBranch[n].OrganizationName;
          vm.mapData = vm.dj_PartyBranch[n];
          if (vm.dj_PartyBranch[n].super <= 12) { // 党工委
            vm.queryGradeId = 7;
            vm.queryObjId = vm.dj_PartyBranch[n].OrganizationId;
            // 党建动态参数
            vm.gradeId = 7;
            vm.roleId = 68;
            vm.branchId = vm.dj_PartyBranch[n].OrganizationId;
          } else { // 党委
            vm.queryGradeId = 6;
            vm.queryObjId = vm.dj_PartyBranch[n].OrganizationId;
            // 党建动态参数
            vm.gradeId = 6;
            vm.roleId = 67;
            vm.branchId = vm.dj_PartyBranch[n].OrganizationId;
          }
        }
      }
    }
    if (!$location.search().OrganizationId) {
      vm.queryGradeId = UserMsg.gradeId;
      vm.queryObjId = UserMsg.objId;
      angular.forEach(vm.dj_PartyBranch, function (v, k) {
        if (vm.queryObjId === v.OrganizationId) {
          vm.branchName = v.OrganizationName;
          vm.mapData = v;
        }
      });
      vm.id = appService.user.branch;
      // 党建动态参数
      vm.gradeId = UserMsg.gradeId;
      vm.roleId = appService.user.JCDJ_User_roleID;
      vm.branchId = appService.user.branch;
    }
    angular.forEach(vm.dj_PartyBranch, function (v, k) {
      if (vm.queryObjId === v.OrganizationId) {
        if (v.belongComm === 1) {
          vm.belongComm = true;
        } else {
          vm.belongComm = false;
        }
      }
    });
    /*if(vm.dj_PartyBranch[n].OrganizationId + '' === vm.id){
     vm.belongComm = vm.dj_PartyBranch[n].belongComm;
     }*/
    // 党员台账
    GetPartyMemberService.query({branch: vm.id}).$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        if (value.JoinTime) {
          value.JoinTime = Timer.format(value.JoinTime, 'day');
        }
      });
      vm.partymemberdata = data;
      if (vm.partymemberdata.length && vm.partymemberdata.length >= 5) {
        vm.upF = true;
        $scope.tablegun = $interval(function () {
          angular.element(document.querySelector('.tableboxinner')).css({'top': '0px'});
          $('.tableboxinner').animate({
            top: '-40px'
          }, 500);
          angular.element(document.querySelector('.tableboxinner')).append(angular.element(document.querySelector('.tableboxinner>.row:nth-child(1)')).remove()[0]);
        }, 2000);
      } else {
        vm.upF = false;
      }
    });
    // 班子成员
    TeammembersService.query({gradeId: vm.queryGradeId, objId: vm.queryObjId}).$promise.then(function (data) {
      vm.teammembersData = data;
    });
    vm.toMore = function () {
      $state.go('page.moreteammembers', {data: vm.teammembersData});
    };
    // 三会一课
    ThreelessonsService.query({gradeId: vm.queryGradeId, objId: vm.queryObjId}).$promise.then(function (data) {
      var arr = [];
      var arr2 = [];
      angular.forEach(data, function (v, k) {
        if (k < 10) {
          arr.push(v);
        } else if (k > 9 && k < 20) {
          arr2.push(v);
        }
      });
      vm.ThreelessonsData = arr;
      vm.ThreelessonsData1 = arr2;
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      var slides1 = $scope.slides1 = [];
      var currIndex = 0;
      $scope.addSlide1 = function (i) {
        slides1.push({
          image: vm.ThreelessonsData[i].photo,
          text: vm.ThreelessonsData[i].title,
          id: currIndex++
        });
      };
      for (var i = 0; i < vm.ThreelessonsData.length; i++) {
        $scope.addSlide1(i);
      }
    });
    // 第一书记
    if (UserMsg.belongComm) {
      MajorsecretaryService.query({gradeId: vm.queryGradeId, objId: vm.queryObjId}).$promise.then(function (data) {
        console.log(data);
        vm.MajorsecretaryData = data[0];
      });
    }
    // 党建动态
    // vm.gradeId = appService.user.user_grade;
    // vm.roleId = appService.user.JCDJ_User_roleID;
    // vm.branchId = appService.user.branch;
    var appealIds = [];
    PartyBuildingSbService.query({
      gradeId: vm.gradeId,
      roleId: vm.roleId,
      PartyBranchID: vm.branchId
    }).$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        this.push(value.appealId);
      }, appealIds);
      PartyBuildingService.query({appealIds: appealIds}).$promise.then(function (data) {
        angular.forEach(data, function (value, k) {
          value.createDate = Timer.format(value.createDate, 'day');
          value.sbtime = Timer.format(value.sbtime, 'day');
        });
        console.log(data);
        vm.partyBuildingData = data;
        $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;

        var slides = $scope.slides = [];
        var currIndex = 0;
        $scope.addSlide = function (i) {
          slides.push({
            image: vm.partyBuildingData[i].phoneOnePath,
            text: vm.partyBuildingData[i].appealTitle,
            id: currIndex++
          });
        };
        for (var i = 0; i < vm.partyBuildingData.length; i++) {
          $scope.addSlide(i);
        }
      }).catch(function (err) {
        console.log(err);
      });
    });
    // 地图部分
    var map = new $window.BMap.Map('basicbranchmsgmap', {enableMapClick: false});
    map.centerAndZoom(new $window.BMap.Point(108.9470280000, 34.2857270000), 14);
    map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
    map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    var ctrl_nav = new $window.BMap.NavigationControl({
      anchor: $window.BMAP_ANCHOR_TOP_LEFT,
      type: $window.BMAP_NAVIGATION_CONTROL_LARGE
    });
    map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)


//ui-gird 基本配置参数
    vm.tableData = [{
      CommitteeId: 'CommitteeId',
      CommitteeName: 'CommitteeName',
      CommitteeType: 'CommitteeType'
    }];
    vm.gridOptions2 = {
      //表数据
      data: vm.tableData,
      columnDefs: [
        {field: 'CommitteeId', displayName: '序号'},
        {field: 'CommitteeName', displayName: '姓名'},
        {field: 'CommitteeType', displayName: '类型'}
        //{field: 'User.displayName', displayName: '类型'}
      ],
      //-------------分页1.页面操作参数---------------
      paginationPageSizes: [20, 30, 40], //每页显示个数可选项
      paginationCurrentPage: 1, //当前页码
      paginationPageSize: 20,
      //使用自定义翻页控制
      useExternalPagination: true,

      onRegisterApi: function (gridApi) {
        //保存api调用对象
        vm.gridApi = gridApi;
        //监视行改变函数
        gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
          $log.log('row selected ' + row.isSelected, row);
          vm.selectedRow = row.isSelected ? row.entity : null;
        });
      },

      //如果不需要在表格左上角菜单显示功能，以下参数可以去掉
      //允许表格左上角菜单
      enableGridMenu: true,
      //添加自定义菜单
      gridMenuCustomItems: [
        {
          //标题
          title: '增加记录',
          //点击动作
          action: vm.add,
          //是否显示,返回true显示
          shown: function () {
            return true;
          },
          //次序，从200-300
          order: 210
        },
        {
          title: '编辑选择记录',
          action: vm.update,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 220
        },
        {
          title: '删除选择记录',
          action: vm.remove,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 230
        },
        {
          title: '查看选择记录',
          action: vm.view,
          shown: function () {
            return !!vm.selectedRow;
          },
          order: 240
        }
      ]
    };

    vm.map = function () {
      var map = new $window.BMap.Map('basicbranchmsgmap', {enableMapClick: false});
      if (vm.mapData.longitude !== null && vm.mapData.longitude < 180 && vm.mapData.latitude !== null && vm.mapData.latitude < 90) {
        map.centerAndZoom(new $window.BMap.Point(vm.mapData.longitude, vm.mapData.latitude), 13);
      } else {
        map.centerAndZoom(new $window.BMap.Point(108.9470280000, 34.2857270000), 14);
      }

      map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      var ctrl_nav = new $window.BMap.NavigationControl({
        anchor: $window.BMAP_ANCHOR_TOP_LEFT,
        type: $window.BMAP_NAVIGATION_CONTROL_LARGE
      });
      map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)

      var v_personid;

      // 显示党支部单个表格
      function showPoint_DZB(lon, lat, OrganizationName, OrganizationTime, Secretary, Head, OrganizationNum, TelNumber, type_png_path, OrganizationId) {
        // 引入 Table  zxf
        v_personid = OrganizationId;
        OrganizationTime = $filter('date')(OrganizationTime, 'yyyy-MM-dd');
        var sContent = `<div>
          <div>
          <h3 style="text-align: center;color: red;">${OrganizationName}</h3>
            <ul style="list-style: none;padding: 0;">
              <!--<li>-->
                <!--<div class="icon"></div>-->
                <!--<span class="font">党组织名称</span>-->
              <!--</li>-->
              <li class="msg">
                <div class="icon" style="width: 30px;height: 30px;"></div>
                <span class="font" style="font-size: 16px;line-height: 30px;">成立时间:${OrganizationTime}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 30px;height: 30px;"></div>
                <span class="font" style="font-size: 16px;line-height: 30px;">书记:${Secretary}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 30px;height: 30px;"></div>
                <span class="font" style="font-size: 16px;line-height: 30px;">党务专干:${Head}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 30px;height: 30px;"></div>
                <span class="font" style="font-size: 16px;line-height: 30px;">党员人数:${OrganizationNum}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 30px;height: 30px;"></div>
                <span class="font" style="font-size: 16px;line-height: 30px;">联系电话:${TelNumber}</span>
              </li>
            </ul>
          </div>
        </div>`;
        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
        var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        //设置 marker 点击 弹框 大小 by xf
        var opts = {
          width: 400, // 信息窗口宽度
          height: 300, // 信息窗口高度
          title: '' // 信息窗口标题
        };

        var infoWindow = new $window.BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象 zxf
        // map.addOverlay(marker);
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
        });
        map.enableScrollWheelZoom(true);
        //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
      }

      showPoint_DZB(vm.mapData.longitude, vm.mapData.latitude, vm.mapData.OrganizationName, vm.mapData.OrganizationTime, vm.mapData.Secretary, vm.mapData.Head, vm.mapData.OrganizationNum, vm.mapData.TelNumber, '/modules/core/client/img/header/i1.jpg', vm.mapData.OrganizationId);
    };
    $timeout(function () {
      vm.map();
    }, 200);
    vm.partydynamic = function (num) {
      $state.go('partydynamic', {data: vm.partyBuildingData[num]});
    };
    var surerobj = {};
    if (appService.user) {
      if (appService.user.user_grade === 6 || appService.user.user_grade === 7) {
        surerobj.id = appService.user.id;
      } else {
        surerobj.grade = vm.queryGradeId;
        surerobj.objid = vm.queryObjId;
      }
    }
    var shangji;
    if ($location.search().super) {
      shangji = $location.search().super;
    } else {
      shangji = UserMsg.shangji;
    }
    vm.bgs = {
      'background': 'url(/modules/page/client/img/biaotitu/' + shangji + '.png) no-repeat',
      'background-size': '100% 100%'
    };
    SurveyService.query(surerobj).$promise.then(function (data) {
      vm.surver = data[0];
    });
    vm.threehui = function (num) {
      $state.go('threehuik', {data: vm.ThreelessonsData[num]});
    };
    vm.firsshuji = function () {
      $state.go('firstsj', {data: vm.MajorsecretaryData});
    };

    $scope.$on('$destroy', function () {
      $interval.cancel($scope.tablegun);
    });
    vm.mousein = function () {
      $interval.cancel($scope.tablegun);
    };
    vm.mouseout = function () {
      if (vm.upF) {
        $scope.tablegun = $interval(function () {
          angular.element(document.querySelector('.tableboxinner')).css({'top': '0px'});
          $('.tableboxinner').animate({
            top: '-40px'
          }, 500);
          angular.element(document.querySelector('.tableboxinner')).append(angular.element(document.querySelector('.tableboxinner>.row:nth-child(1)')).remove()[0]);
        }, 2000);
      }
    };
    vm.openmemberon = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/page/client/views/page-modal-memberone.client.view.html',
        controller: 'PageModalMemberOneController',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        resolve: resarg
      });
    };
    vm.memeberone = function ($event) {
      var id = angular.element($event.target).parent().attr('id');
      var memberoninstance = vm.openmemberon({
        data: function () {
          return vm.partymemberdata[id];
        },
        branchName: function () {
          return vm.branchName;
        }
      });
    };
  }
}());
