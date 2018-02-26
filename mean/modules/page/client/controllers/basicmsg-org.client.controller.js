(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageBasicMsgOrgController', PageBasicMsgOrgController);

  PageBasicMsgOrgController.$inject = ['$scope', '$uibModal', '$log', '$window', 'baseCodeService', '$location', 'menuService', '$stateParams', '$timeout', 'PartyBuildingService', 'PartymapServiceCore', '$filter', 'TeammembersService', 'appService', 'UserMsg', 'PartyBuildingSbService', '$state', 'SurveyService', 'PartyMemberAnalyzeService', 'Timer', 'GetPartyOrgService', 'SearchService', 'GetPartyMemberService'];
  function PageBasicMsgOrgController($scope, $uibModal, $log, $window, baseCodeService, $location, menuService, $stateParams, $timeout, PartyBuildingService, PartymapServiceCore, $filter, TeammembersService, appService, UserMsg, PartyBuildingSbService, $state, SurveyService, PartyMemberAnalyzeService, Timer, GetPartyOrgService, SearchService, GetPartyMemberService) {
    var vm = this;
    UserMsg.func();
    $window.scrollTo(0, 0);
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.street_info = baseCodeService.getItems('street_info');
    menuService.leftMenusCollapsed = true;
    vm.id = $location.search().id; // 字符串类型
    if (vm.id - 0 <= 12) {
      vm.queryGradeId = 5;
      vm.queryObjId = vm.id;
      vm.gradeId = 5;
      vm.roleId = vm.dj_PartyOrganization[(vm.id - 1)].roleID;
    } else if (vm.id - 0 > 12) {
      vm.queryGradeId = 4;
      vm.queryObjId = vm.id;
      vm.gradeId = 5;
      vm.roleId = vm.dj_PartyOrganization[(vm.id - 1)].roleID;
    } else {
      vm.queryGradeId = UserMsg.gradeId;
      vm.queryObjId = UserMsg.objId;
      vm.gradeId = appService.user.user_grade;
      vm.roleId = appService.user.JCDJ_User_roleID;
    }
    vm.bgs = {
      'background': 'url(/modules/page/client/img/biaotitu/' + vm.queryObjId + '.png) no-repeat',
      'background-size': '100% 100%'
    };
    if (!vm.id) {
      console.log(UserMsg.objId);
      vm.id = UserMsg.objId.toString();
    }
    // 班子成员
    TeammembersService.query({gradeId: vm.queryGradeId, objId: vm.queryObjId}).$promise.then(function (data) {
      vm.teammembersData = data;
    });
    vm.toMore = function () {
      $state.go('page.moreteammembers', {data: vm.teammembersData});
    };
    // 党建动态
    var appealIds = [];
    PartyBuildingSbService.query({gradeId: vm.gradeId, roleId: vm.roleId}).$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        this.push(value.appealId);
      }, appealIds);
      PartyBuildingService.query({appealIds: appealIds}).$promise.then(function (data) {
        angular.forEach(data, function (value, k) {
          value.createDate = Timer.format(value.createDate, 'day');
          value.sbtime = Timer.format(value.sbtime, 'day');
        });
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
    for (var f = 0; f < vm.dj_PartyOrganization.length; f++) {
      if (vm.dj_PartyOrganization[f].typeID + '' === vm.id) {
        vm.typeName = vm.dj_PartyOrganization[f].typeName;
      }
    }

    // 所属全部党支部；
    vm.son = [];
    vm.branchs = [];
    vm.partyorgdatacount = [];
    for (var h = 0; h < vm.dj_PartyBranch.length; h++) {
      if (vm.dj_PartyBranch[h].super + '' === vm.id && vm.dj_PartyBranch[h].generalbranch === null) {
        vm.son.push(vm.dj_PartyBranch[h]);
      }
      if (vm.dj_PartyBranch[h].super + '' === vm.id) {
        vm.branchs.push(vm.dj_PartyBranch[h].OrganizationId);
        vm.dj_PartyBranch[h].OrganizationTime = Timer.format(vm.dj_PartyBranch[h].OrganizationTime, 'day');
        vm.partyorgdatacount.push(vm.dj_PartyBranch[h]);
      }
      for (var hh = 0; hh < vm.street_info.length; hh++) {
        if (vm.street_info[hh].streetID === vm.dj_PartyBranch[h].streetID) {
          vm.dj_PartyBranch[h].streetName = vm.street_info[hh].streetName;
        }
      }
    }
    // 所属全部党总支；
    vm.DZZ = [];
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    for (var t = 0; t < vm.dj_PartyGeneralBranch.length; t++) {
      if (vm.dj_PartyGeneralBranch[t].superior + '' === vm.id) {
        vm.DZZ.push(vm.dj_PartyGeneralBranch[t]);
      }
    }
    // 地图
    // var map = new $window.BMap.Map('basicmsg-orgmap', {enableMapClick: false});
    // map.centerAndZoom(new $window.BMap.Point(108.9470280000, 34.2857270000), 14);
    // map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
    // map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
    // var ctrl_nav = new $window.BMap.NavigationControl({
    //   anchor: $window.BMAP_ANCHOR_TOP_LEFT,
    //   type: $window.BMAP_NAVIGATION_CONTROL_LARGE
    // });
    // map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)
    // //  贾承博地图刷新
    vm.map = function () {
      var map;
      if (vm.fullpagemapF) {
        map = new $window.BMap.Map('homemap2', {enableMapClick: false});
      } else {
        map = new $window.BMap.Map('basicmsg-orgmap', {enableMapClick: false});
      }
      // console.log(vm.son[0].longitude, vm.son[0].latitude)
      if (vm.son.length > 0 && vm.son[0].longitude !== null && vm.son[0].longitude < 180 && vm.son[0].latitude !== null && vm.son[0].latitude < 90) {
        // console.log(vm.son[0].longitude, )
        map.centerAndZoom(new $window.BMap.Point(vm.son[0].longitude, vm.son[0].latitude), 13);
      } else {
        map.centerAndZoom(new $window.BMap.Point(108.9470280000, 34.2857270000), 14);
      }

      // map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
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
                <div class="icon" style="width: 36px;height: 36px;"></div>
                <span class="font" style="font-size: 16px;line-height: 36px;">成立时间:${OrganizationTime}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 36px;height: 36px;"></div>
                <span class="font" style="font-size: 16px;line-height: 36px;">书记:${Secretary}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 36px;height: 36px;"></div>
                <span class="font" style="font-size: 16px;line-height: 36px;">党务专干:${Head}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 36px;height: 36px;"></div>
                <span class="font" style="font-size: 16px;line-height: 36px;">党员人数:${OrganizationNum}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 36px;height: 36px;"></div>
                <span class="font" style="font-size: 16px;line-height: 36px;">联系电话:${TelNumber}</span>
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

      for (var i = 0; i < vm.son.length; i++) {
        if (vm.son[i].longitude) {
          showPoint_DZB(vm.son[i].longitude, vm.son[i].latitude, vm.son[i].OrganizationName, vm.son[i].OrganizationTime, vm.son[i].Secretary, vm.son[i].Head, vm.son[i].OrganizationNum, vm.son[i].TelNumber, '/modules/core/client/img/header/i1.jpg', vm.son[i].OrganizationId);
        }
      }
    };
    vm.fullpagemapF = false;
    $timeout(function () {
      vm.map();
    }, 200);

    vm.fullpagemap = function () {
      vm.fullpagemapF = true;
      $timeout(function () {
        vm.map();
      }, 200);
    };
    vm.exitFullPageMap = function () {
      vm.fullpagemapF = false;
    };
    vm.partydynamic = function (num) {
      $state.go('partydynamic', {data: vm.partyBuildingData[num]});
    };
    var surerobj = {};
    if (appService.user) {
      if (appService.user.user_grade === 4 || appService.user.user_grade === 5) {
        surerobj.id = appService.user.id;
      } else {
        surerobj.grade = vm.queryGradeId;
        surerobj.objid = vm.queryObjId;
      }
    }
    SurveyService.query(surerobj).$promise.then(function (data) {
      vm.surver = data[0];
    });

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
      vm.analyze('commorg');
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
      vm.analyze('comm');
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
      // vm.partyorgdatacount = [];
      // for (var h = 0; h < vm.dj_PartyBranch.length; h++) {
      //   if (vm.dj_PartyBranch[h].super + '' === vm.id) {
      //     vm.partyorgdatacount.push(vm.dj_PartyBranch[h]);
      //   }
      // }
      vm.pagecount = Math.ceil((vm.partyorgdatacount.length / 10));
      // GetPartyOrgService.query({count: true}).$promise.then(function (data) {
      //   vm.pagecount = Math.ceil(data[0].co/10);
      // });
      // vm.getPageDate(vm.pageNum);
      vm.searchorgcount = vm.partyorgdatacount.length;
      vm.partyorgdata = vm.partyorgdatacount.slice((vm.pageNum - 1) * 10, 10);
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
      GetPartyMemberService.query({branch: vm.branchs, count: true}).$promise.then(function (data) {
        vm.searchmembercount = data[0].co;
        vm.pagecount = Math.ceil(data[0].co / 10);
        GetPartyMemberService.query({branch: vm.branchs, pageNum: 1}).$promise.then(function (data) {
          vm.partymemberdata = data;
        });
      });
      // vm.getPageDate(vm.pageNum);
    };
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'num'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.OrganizationName + value.co);
            xAxisdata.push(value.OrganizationName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.OrganizationName + value.co,
              value: value.co
            });
          });
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'sex'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.PartySex + '(' + value.co + '人)');
            xAxisdata.push(value.PartySex);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.PartySex + '(' + value.co + '人)',
              value: value.co
            });
          });
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'age'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          for (var key in data[0]) {
            if (key.match(/[\u4e00-\u9fa5]/g)) {
              data[0][key] = data[0][key] ? data[0][key] : 0;
              total += data[0][key];
              legenddata.push(key + '(共' + data[0][key] + '人)');
              xAxisdata.push(key);
              seriesdata2.push(data[0][key]);
              seriesdata.push({
                name: key + '(共' + data[0][key] + '人)',
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'jointime'}).$promise.then(function (data) {
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
              text: '党员入党时间统计（共' + total + '人）',
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'orgnum'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          legenddata.push('总数' + data[0].co);
          xAxisdata.push(data[0].co);
          seriesdata2.push(data[0].co);
          seriesdata.push({
            name: '总数' + data[0].co,
            value: data[0].co
          });

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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'unitclass'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.class_Name + '(' + value.co + '个)');
            xAxisdata.push(value.class_Name);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.class_Name + '(' + value.co + '个)',
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
          myChartee.hideLoading();
          myChartee.setOption(option1);
        });
      } else if (type === 'orgpersonnum') {
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'orgpersonnum'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.OrganizationName + value.co);
            xAxisdata.push(value.OrganizationName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.OrganizationName + value.co,
              value: value.co
            });
          });
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'orgclass'}).$promise.then(function (data) {
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'nation'}).$promise.then(function (data) {
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'PartyPlace'}).$promise.then(function (reldata) {
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'Category'}).$promise.then(function (data) {
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'education'}).$promise.then(function (data) {
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'personcategory'}).$promise.then(function (data) {
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
      } else if (type === 'comm') {
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'comm'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.communityName + '(' + value.co + '人)');
            xAxisdata.push(value.communityName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.communityName + '(' + value.co + '人)',
              value: value.co
            });
          });
          var option = {
            title: {
              text: '社区人员统计分析（共' + total + '人）',
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
              text: '社区人员统计分析',
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
      } else if (type === 'commorg') {
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'commorg'}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          var total = 0;
          angular.forEach(data, function (value, k) {
            total += value.co;
            legenddata.push(value.communityName + value.co);
            xAxisdata.push(value.communityName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.communityName + value.co,
              value: value.co
            });
          });
          var option = {
            title: {
              text: '所属社区统计分析（共' + total + '个）',
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
              text: '所属社区统计分析',
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'Relations'}).$promise.then(function (data) {
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
              text: '隶属关系统计分析（共' + total + '个）',
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
        PartyMemberAnalyzeService.query({objId: vm.queryObjId, type: 'OrganizationNum'}).$promise.then(function (data) {
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
    vm.analyze('comm');
    vm.nextPage = function () {
      vm.pageNum += 1;
      if (vm.pageNum >= vm.pagecount) {
        vm.pageNum = vm.pagecount;
      }
      if (vm.PartysearchF) {
        if (vm.searchF) {
          vm.searchturnpage();
        } else {
          GetPartyMemberService.query({branch: vm.branchs, pageNum: vm.pageNum}).$promise.then(function (data) {
            vm.partymemberdata = data;
          });
        }
      }
      if (vm.orgsearchF) {
        if (vm.searchF) {
          vm.searchturnpage();
        } else {
          vm.partyorgdata = vm.partyorgdatacount.slice((vm.pageNum - 1) * 10, ((vm.pageNum - 1) * 10) + 10);
        }
      }
    };
    vm.prevPage = function () {
      vm.pageNum -= 1;
      if (vm.pageNum <= 1) {
        vm.pageNum = 1;
      }
      if (vm.PartysearchF) {
        if (vm.searchF) {
          vm.searchturnpage();
        } else {
          GetPartyMemberService.query({branch: vm.branchs, pageNum: vm.pageNum}).$promise.then(function (data) {
            vm.partymemberdata = data;
          });
        }
      }
      if (vm.orgsearchF) {
        if (vm.searchF) {
          vm.searchturnpage();
        } else {
          vm.partyorgdata = vm.partyorgdatacount.slice((vm.pageNum - 1) * 10, ((vm.pageNum - 1) * 10) + 10);
        }
      }
    };
    vm.searchpage = 1;
    vm.search = function () {
      vm.searchF = true;
      vm.pageNum = 1;
      if (vm.PartysearchF) {
        GetPartyMemberService.query({branch: vm.branchs, count: true, key: vm.key}).$promise.then(function (data) {
          vm.pagecount = Math.ceil(data[0].co / 10);
          console.log(vm.pagecount);
          GetPartyMemberService.query({branch: vm.branchs, pageNum: 1, key: vm.key}).$promise.then(function (data) {
            vm.partymemberdata = data;
          });
        });
      }
      if (vm.orgsearchF) {
        vm.searchData = [];
        angular.forEach(vm.partyorgdatacount, function (value, k) {
          if (value.OrganizationName.match(vm.key)) {
            vm.searchData.push(value);
          }
        });
        vm.pagecount = Math.ceil((vm.searchData.length / 10));
        if (vm.searchData.length >= 10) {
          vm.partyorgdata = vm.searchData.slice(0, 10);
        } else {
          vm.partyorgdata = vm.searchData.slice(0, vm.searchData.length);
        }

      }
    };
    vm.searchturnpage = function () {
      if (vm.PartysearchF) {
        GetPartyMemberService.query({
          branch: vm.branchs,
          pageNum: vm.pageNum,
          key: vm.key
        }).$promise.then(function (data) {
          vm.partymemberdata = data;
        });
      }
      if (vm.orgsearchF) {
        if (vm.pageNum === vm.pagecount) {
          vm.partyorgdata = vm.searchData.slice((vm.pageNum - 1) * 10, vm.searchData.length);
        } else {
          vm.partyorgdata = vm.searchData.slice((vm.pageNum - 1) * 10, ((vm.pageNum - 1) * 10) + 10);
        }
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
  }
}());
