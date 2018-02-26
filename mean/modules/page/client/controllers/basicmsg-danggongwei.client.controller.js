(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageBasicMsgDgwController', PageBasicMsgDgwController);

  PageBasicMsgDgwController.$inject = ['$scope', 'PartymapServiceCore', 'PartyBuildingService', '$window',
    'baseCodeService', '$state', 'menuService', 'NoticeFileService', 'appService', '$timeout', '$filter', 'PartyBuildingSbService', 'memberNumService', 'PartyMemberAnalyzeService'];
  function PageBasicMsgDgwController($scope, PartymapServiceCore, PartyBuildingService, $window,
                                     baseCodeService, $state, menuService, NoticeFileService, appService, $timeout, $filter, PartyBuildingSbService, memberNumService, PartyMemberAnalyzeService) {
    var vm = this;
    vm.imgName = $state.$current.data.pageTitle;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.street_info = baseCodeService.getItems('street_info');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    if (appService.user) {
      menuService.leftMenusCollapsed = true;
    }
    if (appService.user2) {
      menuService.leftMenusCollapsed = false;
    }
    //  通知文件
    NoticeFileService.query().$promise.then(function (data) {
      vm.noticeData = data;
    }).catch(function (err) {
      console.log(err);
    });
    // 党建动态
    vm.gradeId = 3;
    vm.roleId = 30;
    vm.branchId = 1;
    var appealIds = [];
    PartyBuildingSbService.query({gradeId: vm.gradeId, roleId: vm.roleId}).$promise.then(function (data) {
      angular.forEach(data, function (value, k) {
        this.push(value.appealId);
      }, appealIds);
      PartyBuildingService.query({appealIds: appealIds}).$promise.then(function (data) {
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

    /*var map = new $window.BMap.Map('homemap', {enableMapClick: false, minZoom: 14});
     map.centerAndZoom(new $window.BMap.Point(108.9470280000, 34.2857270000), 14);
     map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
     map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
     var ctrl_nav = new $window.BMap.NavigationControl({
     anchor: $window.BMAP_ANCHOR_TOP_LEFT,
     type: $window.BMAP_NAVIGATION_CONTROL_LARGE
     });
     map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)*/
    //  贾承博地图刷新
    vm.map = function (a, arr_community_point, data2, data3, biaoji) {
      var color = 'red';
      var my_strokeWeight = 3;//线粗,
      var my_Opacity = 0.8; //地图覆盖物透明度
      var map = new $window.BMap.Map('homemap', {enableMapClick: false, minZoom: 14});
      map.centerAndZoom(new $window.BMap.Point(108.902950, 34.27250), 14);
      map.addControl(new $window.BMap.MapTypeControl());   //添加地图类型控件
      map.enableScrollWheelZoom(); //启用地图滚轮放大缩小
      var ctrl_nav = new $window.BMap.NavigationControl({
        anchor: $window.BMAP_ANCHOR_TOP_LEFT,
        type: $window.BMAP_NAVIGATION_CONTROL_LARGE
      });
      map.addControl(ctrl_nav); //添加标准地图控件(左上角的放大缩小左右拖拽控件)
      map.addEventListener('click', function (e) {
        $window.alert(e.point.lng + ',' + e.point.lat);
      });
      function clearOverlays() {
        map.clearOverlays();
      }

      var v_personid;

      // 显示指定经纬度标记
      function showPoint_LHSY(lon, lat, Name, tel, photo_path, road, river, toilet, estate, type_png_path, personid) {
        // 引入 Table  zxf
        v_personid = personid;
        var sContent = '<div>'
          + '<img style=\'float:left;margin:4px\' id=\'imgDemo\' src=\'' + photo_path + '\' width=\'180\' height=\'200\'/>'
          + '<div style=\'width:295px; height:200px;overflow-y:scroll;\'>'
          + '<table  border=\'1\'><tr><td width=\'100\'> 姓名：</td><td width=\'200\'> ' + Name + '</td></tr>'
          + '<tr><td width=\'100\'> 电话</td><td width=\'200\'> ' + tel + '</td></tr>'
          + '<tr><td width=\'100\'> 包管道路</td><td width=\'200\'> ' + road + '</td></tr>'
          + '<tr><td width=\'100\'> 河道名称</td><td width=\'200\'> ' + river + '</td></tr>'
          + '<tr><td width=\'100\'> 厕所名称</td><td width=\'200\'> ' + toilet + '</td></tr>'
          + '<tr><td width=\'100\'> 小区名称</td><td width=\'200\'> ' + estate + '</td></tr>'
          + '<tr><td width=\'100\'><input type=\'button\' value=\'查看案件\' onclick=\'say(&quot;' + personid + '&quot;)\'> </td></tr>'
          + '</table>'
          + '</div>'
          + '</div>';

        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        //alert(type_png_path);
        var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
        var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        //设置 marker 点击 弹框 大小 by xf
        var opts = {
          width: 500, // 信息窗口宽度
          height: 200, // 信息窗口高度
          title: '' // 信息窗口标题
        };

        var infoWindow = new $window.BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象 zxf
        map.addOverlay(marker);
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
          //图片加载完毕重绘infowindow
          document.getElementById('imgDemo').onload = function () {
            infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          };
        });
        map.enableScrollWheelZoom(true);
        //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
      }

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
                <div class="icon" style="width: 50px;height: 50px;"></div>
                <span class="font" style="font-size: 20px;line-height: 50px;">成立时间:${OrganizationTime}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 50px;height: 50px;"></div>
                <span class="font" style="font-size: 20px;line-height: 50px;">书记:${Secretary}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 50px;height: 50px;"></div>
                <span class="font" style="font-size: 20px;line-height: 50px;">党务专干:${Head}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 50px;height: 50px;"></div>
                <span class="font" style="font-size: 20px;line-height: 50px;">党员人数:${OrganizationNum}</span>
              </li>
              <li class="msg">
                <div class="icon" style="width: 50px;height: 50px;"></div>
                <span class="font" style="font-size: 20px;line-height: 50px;">联系电话:${TelNumber}</span>
              </li>
            </ul>
          </div>
        </div>`;
        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        //alert(type_png_path);
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
        map.addOverlay(marker);
        marker.addEventListener('click', function () {
          this.openInfoWindow(infoWindow);
          //图片加载完毕重绘infowindow
          //document.getElementById('imgDemo').onload = function () {
          //     infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          // }
        });
        map.enableScrollWheelZoom(true);
        //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
      }

      // 显示网格人员单个表格
      function showPoint_WGRY(lon, lat, grid_number, gridPerson_name, person_Telnumber, party_instructor, party_Telnumber, party_manage, manage_Telnumber, type_png_path, gridid) {
        // 引入 Table  zxf
        v_personid = gridid;
        var sContent = '<div>'
          //+ "<img style='float:left;margin:4px' id='imgDemo' src='" + photo_path + "' width='180' height='200'/>"  onclick='say(&quot;"+personid+"&quot;)'
          + '<div style=\'width:295px; height:260px;overflow-y:scroll;\'>'
          + '<table  border=\'1\'><tr><td width=\'100\'> 网格编码：</td><td width=\'200\'> ' + grid_number + '</td></tr>'
          + '<tr><td width=\'150\'> 网格党小组组长</td><td width=\'200\'> ' + gridPerson_name + '</td></tr>'
          + '<tr><td width=\'150\'> 联系电话</td><td width=\'200\'> ' + person_Telnumber + '</td></tr>'
          + '<tr><td width=\'150\'> 党建指导员</td><td width=\'200\'> ' + party_instructor + '</td></tr>'
          + '<tr><td width=\'150\'> 联系电话</td><td width=\'200\'> ' + party_Telnumber + '</td></tr>'


          //+ "<tr><td width='150'> 社区党组织负责人</td><td width='200'> " + party_manage + "</td></tr>"
          // + "<tr><td width='150'> 联系电话</td><td width='200'> " + manage_Telnumber + "</td></tr>"
          + '<tr><td width=\'100\'><input type=\'button\' value=\'党建活动\' > </td></tr>'
          + '</table>'
          + ' </div>'
          + ' </div>';

        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        //alert(type_png_path);
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

          //map.addEventListener("click", function(e){


          //图片加载完毕重绘infowindow
          //document.getElementById('imgDemo').onload = function () {
          //     infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          // }
        });
        map.enableScrollWheelZoom(true);
        //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
      }

      function say(str) {
        var tnum = window.external.say(str);//getDebugPath()为c#方法
      }

      function look(id) {
        //  alert(id);
        var tnum = window.external.look(id); // getDebugPath()为c#方法
      }

      // }, 200);
      if (data3 || data2) {
        // $timeout(function () {
        for (var i = 0; i < data2.length - 1; i++) {
          showPoint_DZB(data2[i].longitude, data2[i].latitude, data2[i].OrganizationName, data2[i].OrganizationTime, data2[i].Secretary, data2[i].Head, data2[i].OrganizationNum, data2[i].TelNumber, '/modules/core/client/img/header/i1.jpg', data2[i].OrganizationId);
        }
        // }, 2000);
        $timeout(function () {
          for (var i = 0; i < data3.length - 1; i++) {
            showPoint_WGRY(data3[i].log, data3[i].lat, data3[i].grid_number, data3[i].gridPerson_name, data3[i].person_Telnumber, data3[i].party_instructor, data3[i].party_Telnumber, data3[i].party_manage, data3[i].manage_Telnumber, '/modules/core/client/img/header/i2.jpg', data3[i].gridid);
          }
        }, 100);
      }
    };
    //取后台Partymap表所有数据
    vm.getdata = function (prama) {
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
    };
    /*
     * 第一次调用地图*/
    vm.searchObj = {
      party: 1,
      grid: 3,
      streed: 1
    };
    vm.getdata(vm.searchObj);
    vm.search = function ($event) {
      var id = $event.target.id;
      angular.element(document.querySelectorAll('.strMapSearch')).css({'background': 'transparent', 'color': 'black'});
      $event.target.style.background = 'red';
      $event.target.style.color = 'white';
      var searchObj;
      if (id === '0') {
        searchObj = {
          party: 1,
          grid: 3,
          streed: -1
        };
      } else {
        searchObj = {
          party: 1,
          grid: 3,
          streed: id
        };
      }
      vm.getdata(searchObj);
      /*$timeout(function () {
       vm.map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg);
       }, 1000);*/
    };
    vm.partydynamic = function (num) {
      $state.go('partydynamic', {data: vm.partyBuildingData[num]});
    };
    angular.element(document.querySelectorAll('.analyza')).eq(1).css({'color': 'red'});
    vm.PartyOrganizationF = false;
    vm.PartyOrganization = function () {
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(0).css({'color': 'red'});
      vm.PartyOrganizationF = true;
    };
    vm.PartyMember = function () {
      vm.PartyOrganizationF = false;
      angular.element(document.querySelectorAll('.analyza')).css({'color': 'black'});
      angular.element(document.querySelectorAll('.analyza')).eq(1).css({'color': 'red'});
    };
    // 统计分析要用的
    var myChart = $window.echarts.init(document.getElementById('main'));
    myChart.showLoading();
    var myChart1 = $window.echarts.init(document.getElementById('main1'));
    myChart1.showLoading();
    // 获取统计分析的数据
    // 性别

    vm.analyze = function (type) {
      if (type === 'num') {
        PartyMemberAnalyzeService.query({isDGWnum: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.typeName + value.co);
            xAxisdata.push(value.typeName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.typeName + value.co,
              value: value.co
            });
          });
          var option = {
            title: {
              text: '组织人数统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
          var option1 = {
            title: {
              text: '组织人数统计',
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
      } else if (type === 'sex') {
        PartyMemberAnalyzeService.query({isDGWsex: true}).$promise.then(function (data) {
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
              text: '党员性别统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
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
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'age') {
        PartyMemberAnalyzeService.query({isDGWage: true}).$promise.then(function (data) {
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
              text: '党员年龄统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
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
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'jointime') {
        PartyMemberAnalyzeService.query({isDGWjointime: true}).$promise.then(function (data) {
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
              text: '党员入党时间统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
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
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'orgnum') {
        PartyMemberAnalyzeService.query({isDGWorgnum: true}).$promise.then(function (data) {
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.typeName + value.co);
            xAxisdata.push(value.typeName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.typeName + value.co,
              value: value.co
            });
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
          myChart.hideLoading();
          myChart.setOption(option);
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
        PartyMemberAnalyzeService.query({isDGWunitclass: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.class_Name + value.co);
            xAxisdata.push(value.class_Name);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.class_Name + value.co,
              value: value.co
            });
          });
          var option = {
            title: {
              text: '组织类别统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
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
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      } else if (type === 'orgpersonnum') {
        PartyMemberAnalyzeService.query({isDGWorgpersonnum: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, k) {
            legenddata.push(value.typeName + value.co);
            xAxisdata.push(value.typeName);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.typeName + value.co,
              value: value.co
            });
          });
          var option = {
            title: {
              text: '组织人数统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
          var option1 = {
            title: {
              text: '组织人数统计',
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
        PartyMemberAnalyzeService.query({isDGWorgclass: true}).$promise.then(function (data) {
          console.log(data);
          var legenddata = [];
          var seriesdata = [];
          var xAxisdata = [];
          var seriesdata2 = [];
          angular.forEach(data, function (value, j) {
            if (value.Category === null) {
              value.Category = '无';
            }
          });
          angular.forEach(data, function (value, k) {
            legenddata.push(value.Category + value.co);
            xAxisdata.push(value.Category);
            seriesdata2.push(value.co);
            seriesdata.push({
              name: value.Category + value.co,
              value: value.co
            });
          });
          var option = {
            title: {
              text: '组织类别统计',
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
          myChart.hideLoading();
          myChart.setOption(option);
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
          myChart1.hideLoading();
          myChart1.setOption(option1);
        });
      }
    };
    vm.analyze('num');
  }
}());
