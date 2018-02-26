(function () {
  'use strict';

  angular
    .module('page')
    .directive('ngMouseWheelDown', function () {
      return function (scope, element, attrs) {
        element.bind('DOMMouseScroll mousewheel onmousewheel', function (even) {

          // cross-browser wheel delta
          var event = window.event || even; // old IE support
          var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

          if (delta < 0) {
            scope.$apply(function () {
              scope.$eval(attrs.ngMouseWheelDown);
            });

            // for IE
            event.returnValue = false;
            // for Chrome and Firefox
            if (event.preventDefault) {
              event.preventDefault();
            }

          }
        });
      };
    });
  angular
    .module('page')
    .directive('ngMouseWheelUp', function () {
      return function (scope, element, attrs) {
        element.bind('DOMMouseScroll mousewheel onmousewheel', function (eve) {

          // cross-browser wheel delta
          var event2 = window.event || eve; // old IE support
          var delta = Math.max(-1, Math.min(1, (event2.wheelDelta || -event2.detail)));

          if (delta > 0) {
            scope.$apply(function () {
              scope.$eval(attrs.ngMouseWheelUp);
            });

            // for IE
            event2.returnValue = false;
            // for Chrome and Firefox
            if (event2.prevent2Default) {
              event2.prevent2Default();
            }

          }
        });
      };
    });
  angular
    .module('page')
    .controller('PageBasicMsgController', PageBasicMsgController);

  PageBasicMsgController.$inject = ['$scope', 'PartymapServiceCore', 'PartyBuildingService', '$window',
    'baseCodeService', '$state', 'menuService', 'NoticeFileService', 'appService', '$timeout', '$filter', 'PartyBuildingSbService', 'SurveyService', 'memberNumService', 'PartyMemberAnalyzeService', 'Timer', 'GetPartyMemberService', 'GetPartyOrgService', 'SearchService', '$uibModal'];
  function PageBasicMsgController($scope, PartymapServiceCore, PartyBuildingService, $window,
                                  baseCodeService, $state, menuService, NoticeFileService, appService, $timeout, $filter, PartyBuildingSbService, SurveyService, memberNumService, PartyMemberAnalyzeService, Timer, GetPartyMemberService, GetPartyOrgService, SearchService, $uibModal) {
    var vm = this;
    $window.scrollTo(0, 0);
    $scope.status = {
      isopen: false
    };
    $scope.status2 = {
      isopen: false
    };
    console.log(appService.user);
    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
    vm.mousewheeldown = function ($event) {
      var nowTop = $window.parseInt(angular.element(document.querySelector('.surveyp')).css('top'));
      var maxHeight = $window.parseInt(angular.element(document.querySelector('.surveyp')).css('height'));
      var ss = maxHeight - 430 + nowTop;
      if (ss >= -10) {
        angular.element(document.querySelector('.surveyp')).css({'top': (nowTop - 10) + 'px'});
        angular.element(document.querySelector('.imgg')).css({'top': (nowTop - 10) + 'px'});
      }
    };
    vm.mousewheelup = function ($event) {
      var nowTop = $window.parseInt(angular.element(document.querySelector('.surveyp')).css('top'));
      if (nowTop !== 0) {
        angular.element(document.querySelector('.surveyp')).css({'top': (nowTop + 10) + 'px'});
        angular.element(document.querySelector('.imgg')).css({'top': (nowTop + 10) + 'px'});
      }
    };
    vm.imgName = $state.$current.data.pageTitle;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var surerobj = {};
    if (appService.user) {
      vm.gradeId = appService.user.user_grade;
      vm.roleId = appService.user.JCDJ_User_roleID;
      vm.branchId = appService.user.branch;
      menuService.leftMenusCollapsed = true;
      if (appService.user.user_grade === 2) {
        vm.isDW = true;
        surerobj.grade = 2;
        surerobj.objid = 2;
      } else if (appService.user.user_grade === 3) {
        vm.isDGW = true;
        surerobj.grade = 3;
        surerobj.objid = 3;
      } else if (appService.user.user_grade === 1) {
        vm.isQW = true;
        surerobj.grade = 1;
        surerobj.objid = 1;
      }
    }
    if (appService.user2) {
      menuService.leftMenusCollapsed = false;
    }

    //  通知文件
    NoticeFileService.query().$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        // value.createdate = Timer.format(value.createdate, 'day');
        value.sbtime = Timer.format(value.sbtime, 'day');
      });
      vm.noticeData = data;
    });
    // 党建动态

    var appealIds = [];
    PartyBuildingSbService.query({gradeId: vm.gradeId, roleId: vm.roleId}).$promise.then(function (data) {
      vm.appealsbdata = data;

      angular.forEach(data, function (value, k) {
        this.push(value.appealId);
      }, appealIds);
      PartyBuildingService.query({appealIds: appealIds}).$promise.then(function (data) {
        angular.forEach(data, function (value, k) {
          value.createDate = Timer.format(value.createDate, 'day');
          value.sbtime = Timer.format(value.sbtime, 'day');
        });
        vm.partyBuildingData = data;
        lunbo(vm.partyBuildingData);
      }).catch(function (err) {
        console.log(err);
      });
    });
    //轮播函数
    function lunbo(num) {
      vm.myslides = num;
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      var slides = $scope.slides = [];
      var currIndex = 0;
      $scope.addSlide = function (i) {
        slides.push({
          image: vm.myslides[i].phoneOnePath,
          text: vm.myslides[i].appealTitle,
          id: currIndex++
        });
      };
      for (var i = 0; i < vm.myslides.length; i++) {
        $scope.addSlide(i);
      }
    }

    //  贾承博地图刷新
    vm.map = function (a, arr_community_point, data2, data3, biaoji) {
      var color = 'red';
      var my_strokeWeight = 3;//线粗,
      var my_Opacity = 0.8; //地图覆盖物透明度
      var map;
      if (vm.fullpagemapF) {
        map = new $window.BMap.Map('homemap2', {enableMapClick: false, minZoom: 14});
      } else {
        map = new $window.BMap.Map('homemap', {enableMapClick: false, minZoom: 14});
      }
      map.centerAndZoom(new $window.BMap.Point(108.902950, 34.27250), 14);  // 陕西省西安市莲湖区桃园西路32号
      // map.centerAndZoom(new $window.BMap.Point(108.95346, 34.265725), 14); // 钟楼
      map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
      // map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      var ctrl_nav = new $window.BMap.NavigationControl({
        anchor: $window.BMAP_ANCHOR_TOP_LEFT,
        type: $window.BMAP_NAVIGATION_CONTROL_LARGE
      });
      map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)
      function clearOverlays() {
        map.clearOverlays();
      }

      var v_personid;

      // 显示党支部单个表格
      function showPoint_DZB(lon, lat, OrganizationName, OrganizationTime, Secretary, Head, OrganizationNum, TelNumber, type_png_path, OrganizationId) {
        // 引入 Table  zxf
        v_personid = OrganizationId;
        OrganizationTime = $filter('date')(OrganizationTime, 'yyyy-MM-dd');
        var sContent = `<div">
          <div>
          <h3 style='text-align: center;color: red;'>${OrganizationName}</h3>
            <ul style='list-style: none;padding: 0;'>
              <li class='msg'>
                <div class='icon' style='width: 50px;height: 50px;'></div>
                <span class='font' style='font-size: 20px;line-height: 50px;'>成立时间:${OrganizationTime}</span>
              </li>
              <li class='msg'>
                <div class='icon' style='width: 50px;height: 50px;'></div>
                <span class='font' style='font-size: 20px;line-height: 50px;'>书记:${Secretary}</span>
              </li>
              <li class='msg'>
                <div class='icon' style='width: 50px;height: 50px;'></div>
                <span class='font' style='font-size: 20px;line-height: 50px;'>党务专干:${Head}</span>
              </li>
              <li class='msg'>
                <div class='icon' style='width: 50px;height: 50px;'></div>
                <span class='font' style='font-size: 20px;line-height: 50px;'>党员人数:${OrganizationNum}</span>
              </li>
              <li class='msg'>
                <div class='icon' style='width: 50px;height: 50px;'></div>
                <span class='font' style='font-size: 20px;line-height: 50px;'>联系电话:${TelNumber}</span>
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
          height: 350, // 信息窗口高度
          title: '' // 信息窗口标题
        };

        var infoWindow = new $window.BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象 zxf
        map.addOverlay(marker);
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
        });
      }

      // 显示网格人员单个表格
      function showPoint_WGRY(lon, lat, grid_number, gridPerson_name, person_Telnumber, party_instructor, party_Telnumber, party_manage, manage_Telnumber, type_png_path, gridid) {
        // 引入 Table  zxf
        v_personid = gridid;
        var sContent = '<div>'
          //+ '<img style='float:left;margin:4px' id='imgDemo' src='' + photo_path + '' width='180' height='200'/>'  onclick='say(&quot;'+personid+'&quot;)'
          + '<div style=\'width:295px; height:260px;overflow-y:scroll;\'>'
          + '<table  border=\'1\'><tr><td width=\'100\'> 网格编码：</td><td width=\'200\'> ' + grid_number + '</td></tr>'
          + '<tr><td width=\'150\'> 网格党小组组长</td><td width=\'200\'> ' + gridPerson_name + '</td></tr>'
          + '<tr><td width=\'150\'> 联系电话</td><td width=\'200\'> ' + person_Telnumber + '</td></tr>'
          + '<tr><td width=\'150\'> 党建指导员</td><td width=\'200\'> ' + party_instructor + '</td></tr>'
          + '<tr><td width=\'150\'> 联系电话</td><td width=\'200\'> ' + party_Telnumber + '</td></tr>'


          //+ '<tr><td width='150'> 社区党组织负责人</td><td width='200'> ' + party_manage + '</td></tr>'
          // + '<tr><td width='150'> 联系电话</td><td width='200'> ' + manage_Telnumber + '</td></tr>'
          + '<tr><td width=\'100\'><input type=\'button\' value=\'党建活动\' > </td></tr>'
          + '</table>'
          + ' </div>'
          + ' </div>';

        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
        var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        //设置 marker 点击 弹框 大小 by xf
        var opts = {
          width: 340, // 信息窗口宽度
          height: 200, // 信息窗口高度
          title: '' // 信息窗口标题
        };

        var infoWindow = new $window.BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象 zxf
        map.addOverlay(marker);
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
        });
      }

      if (data3 || data2) {
        for (var i = 0; i < data2.length - 1; i++) {
          showPoint_DZB(data2[i].longitude, data2[i].latitude, data2[i].OrganizationName, data2[i].OrganizationTime, data2[i].Secretary, data2[i].Head, data2[i].OrganizationNum, data2[i].TelNumber, '/modules/core/client/img/header/i1.jpg', data2[i].OrganizationId);
        }
        $timeout(function () {
          for (var i = 0; i < data3.length - 1; i++) {
            showPoint_WGRY(data3[i].log, data3[i].lat, data3[i].grid_number, data3[i].gridPerson_name, data3[i].person_Telnumber, data3[i].party_instructor, data3[i].party_Telnumber, data3[i].party_manage, data3[i].manage_Telnumber, '/modules/core/client/img/header/i2.jpg', data3[i].gridid);
          }
        }, 100);
      }
    };
    //取后台Partymap表所有数据
    vm.getdata = function (prama, type) {
      if (type === 'all') {
        if ($window.localStorage.getItem('mapdataAll')) {
          var data = JSON.parse($window.localStorage.getItem('mapdataAll'));
          var data1 = [];
          var data2 = [];
          var data3 = [];
          var datagrid;
          var dataparty;
          for (var x in data[data.length - 1]) {
            data1.push(data[data.length - 1][x]);
          }
          if (data.length === 3) {
            datagrid = data[0];//gridperson_id
            dataparty = data[1];//OrganizationId
          } else if (data.length === 2) {
            datagrid = data[0];
          }

          if (dataparty) {
            for (var c in dataparty) {
              if (dataparty[c] === 0 || dataparty[c] === 1) {
                data2.push(dataparty[c]);
                break;
              }
              data2.push(dataparty[c]);
            }
          }
          if (datagrid) {
            for (var d in datagrid) {
              if (datagrid[d] === 0 || datagrid[d] === 1) {
                data3.push(datagrid[d]);
                break;
              }
              data3.push(datagrid[d]);
            }
          }
          vm.arr_community_point = [];
          var arr_grid_point = [];
          var grid_curve_Name;
          for (var i = 0; i < data1.length; i++) {
            if (grid_curve_Name === data1[i].grid_curve_Name) {
              var obj = {};
              obj.lon = data1[i].lon;
              obj.lat = data1[i].lat;
              arr_grid_point.push(obj);
            } else {
              if (arr_grid_point.length > 0) {
                vm.arr_community_point.push(arr_grid_point);
              }
              grid_curve_Name = data1[i].grid_curve_Name;
              arr_grid_point = [];
              arr_grid_point.push(data1[i].street_id);
              arr_grid_point.push(grid_curve_Name);
              var obj1 = {};
              obj1.lon = data1[i].lon;
              obj1.lat = data1[i].lat;
              arr_grid_point.push(obj1);
            }
          }
          if (data3[data3.length - 1] === 0) {
            vm.partyoRg = data2;
            vm.gridorg = data3;
          } else {
            vm.partyoRg = data3;
            vm.gridorg = data2;
          }
          vm.map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg);
        } else {
          PartymapServiceCore.query(prama).$promise.then(function (data) {
            $window.localStorage.setItem('mapdataAll', JSON.stringify(data));
            var data1 = [];
            var data2 = [];
            var data3 = [];
            var datagrid;
            var dataparty;
            for (var x in data[data.length - 1]) {
              data1.push(data[data.length - 1][x]);
            }
            if (data.length === 3) {
              datagrid = data[0];//gridperson_id
              dataparty = data[1];//OrganizationId
            } else if (data.length === 2) {
              datagrid = data[0];
            }

            if (dataparty) {
              for (var c in dataparty) {
                if (dataparty[c] === 0 || dataparty[c] === 1) {
                  data2.push(dataparty[c]);
                  break;
                }
                data2.push(dataparty[c]);
              }
            }
            if (datagrid) {
              for (var d in datagrid) {
                if (datagrid[d] === 0 || datagrid[d] === 1) {
                  data3.push(datagrid[d]);
                  break;
                }
                data3.push(datagrid[d]);
              }
            }
            vm.arr_community_point = [];
            var arr_grid_point = [];
            var grid_curve_Name;
            for (var i = 0; i < data1.length; i++) {
              if (grid_curve_Name === data1[i].grid_curve_Name) {
                var obj = {};
                obj.lon = data1[i].lon;
                obj.lat = data1[i].lat;
                arr_grid_point.push(obj);
              } else {
                if (arr_grid_point.length > 0) {
                  vm.arr_community_point.push(arr_grid_point);
                }
                grid_curve_Name = data1[i].grid_curve_Name;
                arr_grid_point = [];
                arr_grid_point.push(data1[i].street_id);
                arr_grid_point.push(grid_curve_Name);
                var obj1 = {};
                obj1.lon = data1[i].lon;
                obj1.lat = data1[i].lat;
                arr_grid_point.push(obj1);
              }
            }
            if (data3[data3.length - 1] === 0) {
              vm.partyoRg = data2;
              vm.gridorg = data3;
            } else {
              vm.partyoRg = data3;
              vm.gridorg = data2;
            }
            vm.map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg);
          });
        }
      } else {
        PartymapServiceCore.query(prama).$promise.then(function (data) {
          var data1 = [];
          var data2 = [];
          var data3 = [];
          var datagrid;
          var dataparty;
          for (var x in data[data.length - 1]) {
            data1.push(data[data.length - 1][x]);
          }
          if (data.length === 3) {
            datagrid = data[0];//gridperson_id
            dataparty = data[1];//OrganizationId
          } else if (data.length === 2) {
            datagrid = data[0];
          }

          if (dataparty) {
            for (var c in dataparty) {
              if (dataparty[c] === 0 || dataparty[c] === 1) {
                data2.push(dataparty[c]);
                break;
              }
              data2.push(dataparty[c]);
            }
          }
          if (datagrid) {
            for (var d in datagrid) {
              if (datagrid[d] === 0 || datagrid[d] === 1) {
                data3.push(datagrid[d]);
                break;
              }
              data3.push(datagrid[d]);
            }
          }
          vm.arr_community_point = [];
          var arr_grid_point = [];
          var grid_curve_Name;
          for (var i = 0; i < data1.length; i++) {
            if (grid_curve_Name === data1[i].grid_curve_Name) {
              var obj = {};
              obj.lon = data1[i].lon;
              obj.lat = data1[i].lat;
              arr_grid_point.push(obj);
            } else {
              if (arr_grid_point.length > 0) {
                vm.arr_community_point.push(arr_grid_point);
              }
              grid_curve_Name = data1[i].grid_curve_Name;
              arr_grid_point = [];
              arr_grid_point.push(data1[i].street_id);
              arr_grid_point.push(grid_curve_Name);
              var obj1 = {};
              obj1.lon = data1[i].lon;
              obj1.lat = data1[i].lat;
              arr_grid_point.push(obj1);
            }
          }
          if (data3[data3.length - 1] === 0) {
            vm.partyoRg = data2;
            vm.gridorg = data3;
          } else {
            vm.partyoRg = data3;
            vm.gridorg = data2;
          }
          vm.map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg);
        });
      }

    };
    /*
     * 第一次调用地图*/
    vm.searchObj = {
      party: 1,
      grid: 3,
      streed: -1
    };
    vm.getdata(vm.searchObj, 'all');
    vm.search = function ($event) {
      var id = $event.target.id;
      angular.element(document.querySelectorAll('.strMapSearch')).css({
        'background': 'linear-gradient(#fafbfa, #eeefef, #e2e3e3)',
        'color': 'black'
      });
      $event.target.style.background = 'linear-gradient(#ff3636, #fd4343, #d81620)';
      $event.target.style.color = 'white';
      var searchObj;
      if (id === '0') {
        searchObj = {
          party: 1,
          grid: 3,
          streed: -1
        };
        vm.getdata(searchObj, 'all');
      } else {
        searchObj = {
          party: 1,
          grid: 3,
          streed: id
        };
        vm.getdata(searchObj);
      }

    };
    vm.fullpagemapF = false;
    vm.fullpagemap = function () {
      vm.fullpagemapF = true;
      $window.scrollTo(0, 0);
      $timeout(function () {
        vm.getdata(vm.searchObj);
      });
    };
    vm.fullesc = function () {
      vm.fullpagemapF = false;
      // vm.getdata(vm.searchObj);
    };
    vm.partydynamic = function (num) {
      $state.go('partydynamic', {data: vm.partyBuildingData[num]});
    };
    // 统计分析
    angular.element(document.querySelectorAll('.analyza')).eq(3).css({'color': 'red'});
    vm.PartyOrganizationF = false;
    vm.PartyMemberF = true;
    vm.PartysearchF = false;
    vm.orgsearchF = false;
    vm.PartyOrganization = function () {
      vm.PartyOrganizationF = true;
      vm.PartyMemberF = false;
      vm.PartysearchF = false;
      vm.orgsearchF = false;
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(2).css({'color': 'red'});
      vm.PartyOrganizationF = true;
      vm.analyze('OrganizationNum');
      vm.analyze('Relations');
      vm.analyze('streetorg');
      vm.analyze('orgclass');
      vm.analyze('unitclass');
    };
    vm.PartyMember = function () {
      vm.PartyOrganizationF = false;
      vm.PartyMemberF = true;
      vm.PartysearchF = false;
      vm.orgsearchF = false;
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(3).css({'color': 'red'});
      vm.analyze('sex');
      vm.analyze('nation');
      vm.analyze('age');
      vm.analyze('PartyPlace');
      vm.analyze('Category');
      vm.analyze('jointime');
      vm.analyze('education');
      vm.analyze('personcategory');
      vm.analyze('street');
    };
    vm.orgsearch = function () {
      vm.pageNum = 1;
      vm.key = '';
      vm.PartyOrganizationF = false;
      vm.PartyMemberF = false;
      vm.PartysearchF = false;
      vm.orgsearchF = true;
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(1).css({'color': 'red'});
      // 查询总页数党组织
      GetPartyOrgService.query({count: true}).$promise.then(function (data) {
        vm.searchorgcount = data[0].co;
        vm.pagecount = Math.ceil(data[0].co / 10);
      });
      vm.getPageDate(vm.pageNum);
    };
    vm.Partysearch = function () {
      vm.pageNum = 1;
      vm.key = '';
      vm.PartyOrganizationF = false;
      vm.PartyMemberF = false;
      vm.PartysearchF = true;
      vm.orgsearchF = false;
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(0).css({'color': 'red'});
      // 查询总页数党员
      GetPartyMemberService.query({count: true}).$promise.then(function (data) {
        vm.searchmembercount = data[0].co;
        vm.pagecount = Math.ceil(data[0].co / 10);
      });
      vm.getPageDate(vm.pageNum);
    };
    // 统计分析要用的
    vm.branchs1 = '(';
    vm.branchs2 = '(';
    angular.forEach(vm.dj_PartyBranch, function (value, k) {
      if (value.super <= 12) {
        vm.branchs1 += (value.OrganizationId + ','); // 党工委
      } else {
        vm.branchs1 += (value.OrganizationId + ','); // 党委
      }
    });
    if (vm.branchs1[vm.branchs1.length - 1] === ',') {
      vm.branchs1 = vm.branchs1.slice(0, -1);
      vm.branchs1 += ')';
    } else {
      vm.branchs1 = '(0)';
    }
    if (vm.branchs2[vm.branchs2.length - 1] === ',') {
      vm.branchs2 = vm.branchs2.slice(0, -1);
      vm.branchs2 += ')';
    } else {
      vm.branchs2 = '(0)';
    }

    var myChart1 = $window.echarts.init(document.getElementById('main1'));
    myChart1.showLoading();
    var myChart11 = $window.echarts.init(document.getElementById('main11'));
    myChart11.showLoading();
    var myChart2 = $window.echarts.init(document.getElementById('main2'));
    myChart2.showLoading();
    var myChart22 = $window.echarts.init(document.getElementById('main22'));
    myChart22.showLoading();
    var myChart3 = $window.echarts.init(document.getElementById('main3'));
    myChart3.showLoading();
    var myChart33 = $window.echarts.init(document.getElementById('main33'));
    myChart33.showLoading();
    var myChart4 = $window.echarts.init(document.getElementById('main4'));
    myChart4.showLoading();
    var myChart44 = $window.echarts.init(document.getElementById('main44'));
    myChart44.showLoading();
    var myChart5 = $window.echarts.init(document.getElementById('main5'));
    myChart5.showLoading();
    var myChart55 = $window.echarts.init(document.getElementById('main55'));
    myChart55.showLoading();
    var myChart6 = $window.echarts.init(document.getElementById('main6'));
    myChart6.showLoading();
    var myChart66 = $window.echarts.init(document.getElementById('main66'));
    myChart66.showLoading();
    var myChart7 = $window.echarts.init(document.getElementById('main7'));
    myChart7.showLoading();
    var myChart77 = $window.echarts.init(document.getElementById('main77'));
    myChart77.showLoading();
    var myChart8 = $window.echarts.init(document.getElementById('main8'));
    myChart8.showLoading();
    var myChart88 = $window.echarts.init(document.getElementById('main88'));
    myChart88.showLoading();
    var myChart9 = $window.echarts.init(document.getElementById('main9'));
    myChart9.showLoading();
    var myChart99 = $window.echarts.init(document.getElementById('main99'));
    myChart99.showLoading();

    var myCharta = $window.echarts.init(document.getElementById('maina'));
    myCharta.showLoading();
    var myChartaa = $window.echarts.init(document.getElementById('mainaa'));
    myChartaa.showLoading();
    var myChartb = $window.echarts.init(document.getElementById('mainb'));
    myChartb.showLoading();
    var myChartbb = $window.echarts.init(document.getElementById('mainbb'));
    myChartbb.showLoading();
    var myChartc = $window.echarts.init(document.getElementById('mainc'));
    myChartc.showLoading();
    var myChartcc = $window.echarts.init(document.getElementById('maincc'));
    myChartcc.showLoading();
    var myChartd = $window.echarts.init(document.getElementById('maind'));
    myChartd.showLoading();
    var myChartdd = $window.echarts.init(document.getElementById('maindd'));
    myChartdd.showLoading();
    var myCharte = $window.echarts.init(document.getElementById('maine'));
    myCharte.showLoading();
    var myChartee = $window.echarts.init(document.getElementById('mainee'));
    myChartee.showLoading();
    // 获取统计分析的数据
    // 性别

    vm.analyze = function (type) {
      if (type === 'num') {
        PartyMemberAnalyzeService.query({
          num: true,
          branchs1: vm.branchs1,
          branchs2: vm.branchs2
        }).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/)) {
              legenddata.push(key + data[0][key]);
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + data[0][key],
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党员人数统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // myChart.hideLoading();
          // myChart.setOption(option);
          var option1 = {
            title: {
              text: '党员人数统计',
              x: 'center'
            },

            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '人数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'sex') {
        PartyMemberAnalyzeService.query({sex: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/)) {
              total += Number(data[0][key]);
              legenddata.push(key + '(' + data[0][key] + '人)');
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + '(' + data[0][key] + '人)',
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党员性别统计（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart1.hideLoading();
          myChart1.setOption(option);
          var option1 = {
            title: {
              text: '党员性别统计',
              x: 'center'
            },

            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '人数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart11.hideLoading();
          myChart11.setOption(option1);
        });
      } else if (type === 'age') {
        PartyMemberAnalyzeService.query({age: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/g)) {
              total += data[0][key];
              legenddata.push(key + '(' + data[0][key] + '人)');
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + '(' + data[0][key] + '人)',
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党员年龄统计（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart3.hideLoading();
          myChart3.setOption(option);
          var option1 = {
            title: {
              text: '党员年龄统计',
              x: 'center'
            },

            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '人数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart33.hideLoading();
          myChart33.setOption(option1);
        });
      } else if (type === 'jointime') {
        PartyMemberAnalyzeService.query({jointime: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/g)) {
              total += data[0][key];
              legenddata.push(key + '(' + data[0][key] + '人)');
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + '(' + data[0][key] + '人)',
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党员入党时间统计（共' + total + '）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart6.hideLoading();
          myChart6.setOption(option);
          var option1 = {
            title: {
              text: '党员入党时间统计',
              x: 'center'
            },

            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '人数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart66.hideLoading();
          myChart66.setOption(option1);
        });
      } else if (type === 'orgnum') {
        PartyMemberAnalyzeService.query({
          orgnum: true,
          branchs1: vm.branchs1,
          branchs2: vm.branchs2
        }).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/g)) {
              legenddata.push(key + data[0][key]);
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + data[0][key],
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党组织个数统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '党组织数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // myChart.hideLoading();
          // myChart.setOption(option);
          var option1 = {
            title: {
              text: '党组织个数统计',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '党组织数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'unitclass') {
        PartyMemberAnalyzeService.query({unitclass: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            if (value.Category === null) {
              value.Category = '无';
            }
            total += value.co;
            legenddata.push(value.Category + '(' + value.co + '个)');
            xAxisdata.push(value.Category);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.Category + '(' + value.co + '个)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '单位类别统计（共' + total + '个）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myCharte.hideLoading();
          myCharte.setOption(option);
          var option1 = {
            title: {
              text: '单位类别统计',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '党组织数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChartee.hideLoading();
          myChartee.setOption(option1);
        });
      } else if (type === 'orgpersonnum') {
        PartyMemberAnalyzeService.query({
          orgpersonnum: true,
          branchs1: vm.branchs1,
          branchs2: vm.branchs2
        }).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/g)) {
              legenddata.push(key + data[0][key]);
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + data[0][key],
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党组织人数统计',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '党组织数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // myChart.hideLoading();
          // myChart.setOption(option);
          var option1 = {
            title: {
              text: '党组织人数统计',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '党组织数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'orgclass') {
        PartyMemberAnalyzeService.query({orgclass: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, j) {
            if (value.OrganizationCategory === null) {
              value.OrganizationCategory = '无';
            }
          });
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.OrganizationCategory + '(' + value.co + '个)');
            xAxisdata.push(value.OrganizationCategory);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.OrganizationCategory + '(' + value.co + '个)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '组织类别统计（共' + total + '个）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '党组织数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChartd.hideLoading();
          myChartd.setOption(option);
          var option1 = {
            title: {
              text: '组织类别统计',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '人数'
              }
            ],
            series: [
              {
                name: '党组织数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChartdd.hideLoading();
          myChartdd.setOption(option1);
        });
      } else if (type === 'nation') {
        PartyMemberAnalyzeService.query({nation: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.PartyNation + '(' + value.co + '人)');
            xAxisdata.push(value.PartyNation);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.PartyNation + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '民族统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '民族数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart2.hideLoading();
          myChart2.setOption(option);
          var option1 = {
            title: {
              text: '民族统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '民族数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart22.hideLoading();
          myChart22.setOption(option1);
        });
      } else if (type === 'PartyPlace') {
        PartyMemberAnalyzeService.query({PartyPlace: true}).$promise.then(function (reldata) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var data = [];
          var otherNum = 0;
          var total = 0;
          angular.forEach(reldata, function (v, s) {
            if (v.PartyPlace !== null && v.PartyPlace.match('陕西')) {
              data.push(v);
            } else {
              otherNum += v.co;
            }
            if (s === reldata.length - 1) {
              data.push({
                PartyPlace: '其他省份',
                co: otherNum
              });
            }
          });
          angular.forEach(data, function (value, k) {
            if (value.PartyPlace === null) {
              value.PartyPlace = '无';
            }
            total += value.co;
            legenddata.push(value.PartyPlace + '(' + value.co + '人)');
            xAxisdata.push(value.PartyPlace);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.PartyPlace + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '籍贯统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart4.hideLoading();
          myChart4.setOption(option);
          var option1 = {
            title: {
              text: '籍贯统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart44.hideLoading();
          myChart44.setOption(option1);
        });
      } else if (type === 'Category') {
        PartyMemberAnalyzeService.query({Category: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            if (value.Category === null) {
              value.Category = '无';
            }
            total += value.co;
            legenddata.push(value.Category + '(' + value.co + '人)');
            xAxisdata.push(value.Category);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.Category + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '党员类型统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart5.hideLoading();
          myChart5.setOption(option);
          var option1 = {
            title: {
              text: '党员类型统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart55.hideLoading();
          myChart55.setOption(option1);
        });
      } else if (type === 'education') {
        PartyMemberAnalyzeService.query({education: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            if (value.education2 === null) {
              value.education2 = '无';
            }
            total += value.co;
            legenddata.push(value.education2 + '(' + value.co + '人)');
            xAxisdata.push(value.education2);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.education2 + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '党员学历统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart7.hideLoading();
          myChart7.setOption(option);
          var option1 = {
            title: {
              text: '党员学历统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart77.hideLoading();
          myChart77.setOption(option1);
        });
      } else if (type === 'personcategory') {
        PartyMemberAnalyzeService.query({personcategory: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            if (value.preson_category === null) {
              value.preson_category = '无';
            }
            total += value.co;
            legenddata.push(value.preson_category + '(' + value.co + '人)');
            xAxisdata.push(value.preson_category);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.preson_category + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '人员类别统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart8.hideLoading();
          myChart8.setOption(option);
          var option1 = {
            title: {
              text: '人员类别统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart88.hideLoading();
          myChart88.setOption(option1);
        });
      } else if (type === 'street') {
        PartyMemberAnalyzeService.query({street: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.streetName + '(' + value.co + '人)');
            xAxisdata.push(value.streetName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.streetName + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '街道人员统计分析（共' + total + '人）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChart9.hideLoading();
          myChart9.setOption(option);
          var option1 = {
            title: {
              text: '街道人员统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChart99.hideLoading();
          myChart99.setOption(option1);
        });
      } else if (type === 'streetorg') {
        PartyMemberAnalyzeService.query({streetorg: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.streetName + '(' + value.co + '个)');
            xAxisdata.push(value.streetName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.streetName + '(' + value.co + '个)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '所属街道统计分析（共' + total + '个）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChartc.hideLoading();
          myChartc.setOption(option);
          var option1 = {
            title: {
              text: '所属街道统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChartcc.hideLoading();
          myChartcc.setOption(option1);
        });
      } else if (type === 'Relations') {
        PartyMemberAnalyzeService.query({Relations: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (v, f) {
            if (v.Relations === null) {
              v.Relations = '未知';
            }
          });
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.Relations + '(' + value.co + '个)');
            xAxisdata.push(value.Relations);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.Relations + '(' + value.co + '个)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '隶属关系统计分析(共' + total + '个)',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myChartb.hideLoading();
          myChartb.setOption(option);
          var option1 = {
            title: {
              text: '隶属关系统计分析',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChartbb.hideLoading();
          myChartbb.setOption(option1);
        });
      } else if (type === 'OrganizationNum') {
        PartyMemberAnalyzeService.query({OrganizationNum: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/)) {
              total += data[0][key];
              legenddata.push(key + '(' + data[0][key] + '个)');
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + '(' + data[0][key] + '个)',
                value: data[0][key]
              });
            }
          }
          var option = {
            title: {
              text: '党组织人数统计（共' + total + '个）',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 'left',
              right: 10,
              top: 20,
              bottom: 20,
              data: legenddata
            },
            series: [
              {
                name: '个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '55%'],
                data: seriesdata,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          myCharta.hideLoading();
          myCharta.setOption(option);
          var option1 = {
            title: {
              text: '党组织人数统计',
              x: 'center'
            },
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            toolbox: {
              feature: {
                //显示右上角的文件列表readOnly 是否可编辑数据
                dataView: {show: true, readOnly: false},
                //以折线 柱状图显示
                // magicType: {show: true, type: ['line', 'bar']},
                //刷新数据
                restore: {show: true},
                //下载统计图图片
                saveAsImage: {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisdata,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '个'
              }
            ],
            series: [
              {
                name: '个数',
                type: 'bar',
                barWidth: '60%',
                data: seriesdata2
              }
            ]
          };
          myChartaa.hideLoading();
          myChartaa.setOption(option1);
        });
      }
    };
    vm.analyze('sex');
    vm.analyze('nation');
    vm.analyze('age');
    vm.analyze('PartyPlace');
    vm.analyze('Category');
    vm.analyze('jointime');
    vm.analyze('education');
    vm.analyze('personcategory');
    vm.analyze('street');
    SurveyService.query(surerobj).$promise.then(function (data) {
      vm.surver = data[0];
    });

    vm.pageNum = 1;
    vm.getPageDate = function (page) {
      if (vm.orgsearchF) {
        GetPartyOrgService.query({pageNum: page}).$promise.then(function (data) {
          angular.forEach(data, function (value, k) {
            value.OrganizationTime = Timer.format(value.OrganizationTime, 'day');
            angular.forEach(vm.street_info, function (v, m) {
              if (value.streetID === v.streetID) {
                value.streetName = v.streetName;
              }
            });
          });
          vm.partyorgdata = data;
        });
      } else {
        GetPartyMemberService.query({pageNum: page}).$promise.then(function (data) {
          angular.forEach(data, function (value, k) {
            angular.forEach(vm.dj_PartyBranch, function (v, b) {
              if (value.branch === v.OrganizationId) {
                value.OrganizationName = v.OrganizationName;
              }
            });
          });
          vm.partymemberdata = data;
          console.log(vm.partymemberdata);
        });
      }
    };

    vm.nextPage = function () {
      if (vm.searchF) {
        vm.searchpage += 1;
        if (vm.searchpage >= vm.pagecount) {
          vm.searchpage = vm.pagecount;
        }
        if (vm.PartysearchF) {
          vm.searchPartyMeber(vm.searchpage, 'searchPartyMeber');
        } else if (vm.orgsearchF) {
          vm.searchPartyMeber(vm.searchpage, 'searchPartyOrg');
        }
      } else {
        vm.pageNum += 1;
        if (vm.pageNum >= vm.pagecount) {
          vm.pageNum = vm.pagecount;
        }
        vm.getPageDate(vm.pageNum);
      }
    };
    vm.prevPage = function () {
      if (vm.searchF) {
        vm.searchpage -= 1;
        if (vm.searchpage <= 1) {
          vm.searchpage = 1;
        }
        if (vm.PartysearchF) {
          vm.searchPartyMeber(vm.searchpage, 'searchPartyMeber');
        } else if (vm.orgsearchF) {
          vm.searchPartyMeber(vm.searchpage, 'searchPartyOrg');
        }
      } else {
        vm.pageNum -= 1;
        if (vm.pageNum <= 1) {
          vm.pageNum = 1;
        }
        vm.getPageDate(vm.pageNum);
      }
    };
    vm.searchpage = 1;
    vm.searchPartyMeber = function (pagenum, searchPartyMeber) {
      vm.searchF = true;
      if (vm.key !== vm.oldkey) {
        vm.oldkey = vm.key;
        vm.searchpage = 1;
      }
      if (searchPartyMeber === 'searchPartyMeber') {
        SearchService.query({partymember: true, key: vm.key, count: true}).$promise.then(function (data) {
          vm.pagecount = Math.ceil(data[0].co / 10);
          SearchService.query({partymember: true, key: vm.key, pageNum: pagenum}).$promise.then(function (data) {
            angular.forEach(data, function (value, k) {
              angular.forEach(vm.dj_PartyBranch, function (v, b) {
                if (value.branch === v.OrganizationId) {
                  value.OrganizationName = v.OrganizationName;
                }
              });
            });
            vm.partymemberdata = data;
          });
        });
      } else {
        SearchService.query({partyorg: true, key: vm.key, count: true}).$promise.then(function (data) {
          vm.pagecount = Math.ceil(data[0].co / 10);
          console.log(vm.pagecount);
          SearchService.query({partyorg: true, key: vm.key, pageNum: pagenum}).$promise.then(function (data) {
            angular.forEach(data, function (value, k) {
              value.OrganizationTime = Timer.format(value.OrganizationTime, 'day');
              angular.forEach(vm.street_info, function (v, m) {
                if (value.streetID === v.streetID) {
                  value.streetName = v.streetName;
                }
              });
            });
            vm.partyorgdata = data;
          });
        });
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
    vm.memeberone = function (index) {
      var memberoninstance = vm.openmemberon({
        data: function () {
          return vm.partymemberdata[index];
        },
        branchName: function () {
          return vm.partymemberdata[index].OrganizationName;
        }
      });
    };
    vm.openbranchone = function (resarg) {
      return $uibModal.open({
        templateUrl: '/modules/page/client/views/page-modal-branchone.client.view.html',
        controller: 'PageModalBranchOneController',
        controllerAs: 'vm',
        size: 'lg',
        backdrop: 'static',
        resolve: resarg
      });
    };
    vm.branchone = function (index) {
      var branchoneinstance = vm.openbranchone({
        data: function () {
          return vm.partyorgdata[index];
        }
      });
    };
    vm.tocontent = function (num) {
      if (num) {
        $state.go('content', {data: num});
      }
    };
  }
}());
