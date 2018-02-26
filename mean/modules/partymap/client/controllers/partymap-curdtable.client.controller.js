(function () {
  'use strict';

  angular
    .module('partymap')
    .controller('PartymapCURDTableController', PartymapCURDTableController);

  PartymapCURDTableController.$inject = ['$scope', 'Notification', '$log', '$window',
    'uiGridConstants', 'PartymapService',
    '$uibModal', '$timeout', 'baseCodeService'];
  function PartymapCURDTableController($scope, Notification, $log, $window,
                                       uiGridConstants, PartymapService, $uibModal, $timeout, baseCodeService) {
    var vm = this;
    //表数据
    vm.tableData = [];
    //ui-grid 当前选择的行
    vm.selectedRow = null;
    var label_LH = [];//莲湖区字标注
    var arr_marker = [];
    var arr_lable = [];
    var ply = [];//莲湖区区域坐标覆盖物。
    var arr_polygon = [];//网格覆盖物
    var streets = baseCodeService.getItems('street_info');
    vm.streets = [];
    for (var i = 0; i < 10; i++) {
      if (i > 0) {
        vm.streets.push(streets[i]);
      }
    }
    //  贾承博地图刷新
    function map(a, arr_community_point, data2, data3, biaoji) {
      var color = 'red';
      console.log(biaoji);
      switch (biaoji) {
        case '1':
          vm.streetid = 6;
          break;
        case '2':
          vm.streetid = 3;
          break;
        case '3':
          vm.streetid = 7;
          break;
        case '4':
          vm.streetid = 8;
          break;
        case '5':
          vm.streetid = 5;
          break;
        case '6':
          vm.streetid = 9;
          break;
        case '7':
          vm.streetid = 2;
          break;
        case '8':
          vm.streetid = 1;
          break;
        case '9':
          vm.streetid = 4;
          break;
        case '0':
          vm.streetid = 0;
          break;
        default:
          break;
      }
      var my_strokeWeight = 3;//线粗,
      var my_Opacity = 0.8; //地图覆盖物透明度
      var map = new $window.BMap.Map('container', {enableMapClick: false});
      map.centerAndZoom(new $window.BMap.Point(108.90664, 34.267352), 14);
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
        var sContent = '<div>'
          //+ '<img style='float:left;margin:4px' id='imgDemo' src='' + photo_path + '' width='180' height='200'/>'
          + '<div style=\'width:295px; height:200px;overflow-y:scroll;\'>'
          + '<table  border=\'1\' height=\'190px\'><tr><td width=\'100\'> 党组织名称：</td><td width=\'200\'> ' + OrganizationName + '</td></tr>'
          + '<tr><td height==\'30\' width=\'100\'> 成立时间</td><td width=\'200\'> ' + OrganizationTime + '</td></tr>'
          + '<tr><td height==\'30\' width=\'100\'> 书记</td><td width=\'200\'> ' + Secretary + '</td></tr>'
          + '<tr><td height==\'30\' width=\'100\'> 党务专干</td><td width=\'200\'> ' + Head + '</td></tr>'
          + '<tr><td height==\'30\' width=\'100\'> 党员人数</td><td width=\'200\'> ' + OrganizationNum + '</td></tr>'
          + '<tr><td height==\'30\' width=\'100\'> 联系电话</td><td width=\'200\'> ' + TelNumber + '</td></tr>'
          + '<tr><td width=\'100\'><input type=\'button\' value=\'党建活动\' > </td></tr>'
          + '</table>'
          + ' </div>'
          + ' </div>';

        //创建小狐狸
        var pt = new $window.BMap.Point(lon, lat);
        //alert(type_png_path);
        var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
        var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
        marker.disableMassClear();
        map.addOverlay(marker);              // 将标注添加到地图中

        //设置 marker 点击 弹框 大小 by xf
        var opts = {
          width: 320, // 信息窗口宽度
          height: 200, // 信息窗口高度
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
          //+ '<img style='float:left;margin:4px' id='imgDemo' src='' + photo_path + '' width='180' height='200'/>'  onclick='say(&quot;'+personid+'&quot;)'
          + '<div style=\'width:295px; height:260px;overflow-y:scroll;\'>'
          + '<table  border=\'1\' height=\'190px\'><tr><td width=\'100\'> 网格编码：</td><td width=\'200\'> ' + grid_number + '</td></tr>'
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
        //alert(type_png_path);
        var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
        var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
        marker.disableMassClear();
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

          //map.addEventListener('click', function(e){


          //图片加载完毕重绘infowindow
          //document.getElementById('imgDemo').onload = function () {
          //     infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
          // }
        });
        map.enableScrollWheelZoom(true);
        //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
      }

      /* function say(str) {
       var tnum = window.external.say(str);//getDebugPath()为c#方法
       }*/

      function ShowMapAreat() {
        var MapAreat = baseCodeService.getItems('MapAreat');
        for (var a = 0; a < MapAreat.length; a++) {
          var arrStr = MapAreat[a].MapAreat_jingwei.split('#');
          var strLon = '';
          var strLat = '';
          var arrPoint;
          for (var s = 0; s < arrStr.length; s++) {
            arrPoint = arrStr[s].split(',');
            strLon += arrPoint[0] + ',';
            strLat += arrPoint[1] + ',';
          }
          strLon = strLon.substring(0, strLon.length - 1);//去掉最后的，
          strLat = strLat.substring(0, strLat.length - 1);//去掉最后的，
          var lonlat = strLon + '#' + strLat + '*' + MapAreat[a].length;

          var strTemp1 = '';
          var strTemp2 = '';
          var str2 = lonlat.split('*');


          var strCount = str2[1];
          var str = str2[0].split('#');
          // var i = 0;

          for (var b = 0; b < str.length; b++) {
            if (b === 0) {
              strTemp1 = str[b];
            } else {
              strTemp2 = str[b];
            }
          }
          strTemp1 = strTemp1.substring(0, strTemp1.length - 1);
          strTemp2 = strTemp2.substring(0, strTemp2.length - 1);

          getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapAreat[a].MapAreat_name, '#0000FF', '0.3');
        }
      }

      function ShowMapcommunity() {
        var Mapcommunity = baseCodeService.getItems('Mapcommunity');
        for (var a = 0; a < Mapcommunity.length; a++) {
          var arrStr = Mapcommunity[a].Mapcommunity_jingwei.split('#');
          var strLon = '';
          var strLat = '';
          var arrPoint;
          for (var d = 0; d < arrStr.length; d++) {
            arrPoint = arrStr[d].split(',');
            strLon += arrPoint[0] + ',';
            strLat += arrPoint[1] + ',';
          }
          strLon = strLon.substring(0, strLon.length - 1);//去掉最后的，
          strLat = strLat.substring(0, strLat.length - 1);//去掉最后的，
          var lonlat = strLon + '#' + strLat + '*' + Mapcommunity[a].length;

          var strTemp1 = '';
          var strTemp2 = '';
          var str2 = lonlat.split('*');


          var strCount = str2[1];
          var str = str2[0].split('#');
          //var i = 0;

          for (var b = 0; b < str.length; b++) {
            if (b === 0) {
              strTemp1 = str[b];
            } else {
              strTemp2 = str[b];
            }
          }
          strTemp1 = strTemp1.substring(0, strTemp1.length - 1);
          strTemp2 = strTemp2.substring(0, strTemp2.length - 1);

          getBoundaryNew(arrStr.length, strTemp1, strTemp2, Mapcommunity[a].Mapcommunity_name, '#0000FF', '0.3');
        }
      }

      function ShowMapGrid() {
        var MapGrid = baseCodeService.getItems('MapGrid');
        for (var a = 0; a < MapGrid.length; a++) {
          var arrStr = MapGrid[a].MapGrid_jingwei.split('#');
          var strLon = '';
          var strLat = '';
          var arrPoint;
          for (var f = 0; f < arrStr.length; f++) {
            arrPoint = arrStr[f].split(',');
            strLon += arrPoint[0] + ',';
            strLat += arrPoint[1] + ',';
          }
          strLon = strLon.substring(0, strLon.length - 1);//去掉最后的，
          strLat = strLat.substring(0, strLat.length - 1);//去掉最后的，
          var lonlat = strLon + '#' + strLat + '*' + MapGrid[a].length;

          var strTemp1 = '';
          var strTemp2 = '';
          var str2 = lonlat.split('*');


          var strCount = str2[1];
          var str = str2[0].split('#');
          //var i = 0;

          for (var b = 0; b < str.length; b++) {
            if (b === 0) {
              strTemp1 = str[b];
            } else {
              strTemp2 = str[b];
            }
          }
          strTemp1 = strTemp1.substring(0, strTemp1.length - 1);
          strTemp2 = strTemp2.substring(0, strTemp2.length - 1);

          getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapGrid[a].MapGrid_name, '#0000FF', '0.3');
        }
      }

      function ShowMapStreet() {

        var MapStreet = baseCodeService.getItems('MapStreet');
        var lengths;
        var num;
        if (vm.streetid !== 0 && vm.streetid) {
          lengths = vm.streetid;
          num = vm.streetid - 1;
        } else {
          lengths = MapStreet.length;
          num = 0;
        }
        for (var a = num; a < lengths; a++) {
          var arrStr = MapStreet[a].MapStreet_jingwei.split('#');
          var strLon = '';
          var strLat = '';
          var arrPoint;
          for (var g = 0; g < arrStr.length; g++) {
            arrPoint = arrStr[g].split(',');
            strLon += arrPoint[0] + ',';
            strLat += arrPoint[1] + ',';
          }
          strLon = strLon.substring(0, strLon.length - 1);//去掉最后的，
          strLat = strLat.substring(0, strLat.length - 1);//去掉最后的，
          var lonlat = strLon + '#' + strLat + '*' + MapStreet[a].length;

          var strTemp1 = '';
          var strTemp2 = '';
          var str2 = lonlat.split('*');


          var strCount = str2[1];
          var str = str2[0].split('#');
          // var i = 0;

          for (var b = 0; b < str.length; b++) {
            if (b === 0) {
              strTemp1 = str[b];
            } else {
              strTemp2 = str[b];
            }
          }
          strTemp1 = strTemp1.substring(0, strTemp1.length - 1);
          strTemp2 = strTemp2.substring(0, strTemp2.length - 1);


          if (a === 0) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#0000FF', '0.3');
          }
          if (a === 1) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#009966', '0.3');
          }
          if (a === 2) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#00FFCC', '0.3');
          }
          if (a === 3) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#6600CC', '0.3');
          }
          if (a === 4) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#66CC33', '0.3');
          }
          if (a === 5) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#996699', '0.3');
          }
          if (a === 6) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#99FF66', '0.3');
          }
          if (a === 7) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#CC6699', '0.3');
          }
          if (a === 8) {
            getBoundaryNew(arrStr.length, strTemp1, strTemp2, MapStreet[a].MapStreet_name, '#CCFF66', '0.3');
          }
        }
      }

      var GPS = {
        PI: 3.14159265358979324,
        x_pi: 3.14159265358979324 * 3000.0 / 180.0,
        delta: function (lat, lon) {

          // Krasovsky 1940
          //
          // a = 6378245.0, 1/f = 298.3
          // b = a * (1 - f)
          // ee = (a^2 - b^2) / a^2;
          var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
          var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
          var dLat = this.transformLat(lon - 105.0, lat - 35.0);
          var dLon = this.transformLon(lon - 105.0, lat - 35.0);
          var radLat = lat / 180.0 * this.PI;
          var magic = Math.sin(radLat);
          magic = 1 - ee * magic * magic;
          var sqrtMagic = Math.sqrt(magic);
          dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
          dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
          return {'lat': dLat, 'lon': dLon};
        },

        //WGS-84 to GCJ-02
        gcj_encrypt: function (wgsLat, wgsLon) {
          if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

          var d = this.delta(wgsLat, wgsLon);
          return {'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon};
        },

        //GCJ-02 to WGS-84
        gcj_decrypt: function (gcjLat, gcjLon) {
          if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};

          var d = this.delta(gcjLat, gcjLon);
          return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
        },
        //GCJ-02 to WGS-84 exactly
        gcj_decrypt_exact: function (gcjLat, gcjLon) {
          var initDelta = 0.01;
          var threshold = 0.000000001;
          var dLat = initDelta;
          var dLon = initDelta;
          var mLat = gcjLat - dLat;
          var mLon = gcjLon - dLon;
          var pLat = gcjLat + dLat;
          var pLon = gcjLon + dLon;
          var wgsLat;
          var wgsLon;
          var l = 0;
          // while (1) {
          //   wgsLat = (mLat + pLat) / 2;
          //   wgsLon = (mLon + pLon) / 2;
          //   var tmp = this.gcj_encrypt(wgsLat, wgsLon);
          //   dLat = tmp.lat - gcjLat;
          //   dLon = tmp.lon - gcjLon;
          //   if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
          //     break;
          //   if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
          //   if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;
          //   if (++l > 10000) break;
          // }
          return {'lat': wgsLat, 'lon': wgsLon};
        },
        //GCJ-02 to BD-09
        bd_encrypt: function (gcjLat, gcjLon) {
          var x = gcjLon;
          var y = gcjLat;
          var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
          var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
          var bdLon = z * Math.cos(theta) + 0.0065;
          var bdLat = z * Math.sin(theta) + 0.006;
          return {'lat': bdLat, 'lon': bdLon};
        },
        //BD-09 to GCJ-02
        bd_decrypt: function (bdLat, bdLon) {
          var x = bdLon - 0.0065;
          var y = bdLat - 0.006;
          var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
          var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
          var gcjLon = z * Math.cos(theta);
          var gcjLat = z * Math.sin(theta);
          return {'lat': gcjLat, 'lon': gcjLon};
        },
        //WGS-84 to Web mercator
        //mercatorLat -> y mercatorLon -> x
        mercator_encrypt: function (wgsLat, wgsLon) {
          var x = wgsLon * 20037508.34 / 180.0;
          var y = Math.log(Math.tan((90.0 + wgsLat) * this.PI / 360.0)) / (this.PI / 180.0);
          y = y * 20037508.34 / 180.0;
          return {'lat': y, 'lon': x};

        },
        // Web mercator to WGS-84
        // mercatorLat -> y mercatorLon -> x
        mercator_decrypt: function (mercatorLat, mercatorLon) {
          var x = mercatorLon / 20037508.34 * 180.0;
          var y = mercatorLat / 20037508.34 * 180.0;
          y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.0)) - this.PI / 2);
          return {'lat': y, 'lon': x};
        },
        // two point's distance
        distance: function (latA, lonA, latB, lonB) {
          var earthR = 6371000.0;
          var x = Math.cos(latA * this.PI / 180.0) * Math.cos(latB * this.PI / 180.0) * Math.cos((lonA - lonB) * this.PI / 180);
          var y = Math.sin(latA * this.PI / 180.0) * Math.sin(latB * this.PI / 180.0);
          var s = x + y;
          if (s > 1) s = 1;
          if (s < -1) s = -1;
          var alpha = Math.acos(s);
          var distance = alpha * earthR;
          return distance;
        },
        outOfChina: function (lat, lon) {
          if (lon < 72.004 || lon > 137.8347)
            return true;
          if (lat < 0.8293 || lat > 55.8271)
            return true;
          return false;
        },
        transformLat: function (x, y) {
          var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
          ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
          ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
          ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
          return ret;
        },
        transformLon: function (x, y) {
          var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
          ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
          ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
          ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
          return ret;
        }
      };

      function getBoundaryNew(count, lon, lat, name, strFillColor, strFillOpacity) {
        //解析lonlat字符串 lonlat之间用,间隔
        var arrLon = [];
        var arrLat = [];
        var arrTemp = [];
        var arrValue = [];
        arrLon = lon.split(',');
        arrLat = lat.split(',');


        //创建多边形数组
        var points;
        var arr_community_point = new Array();
        for (var h = 0; h < count; h++) {

          var obj = GPS.gcj_encrypt(parseFloat(arrLat[h]), parseFloat(arrLon[h]));

          var obj2 = GPS.bd_encrypt(parseFloat(obj.lat), parseFloat(obj.lon));

          arr_community_point[h] = new $window.BMap.Point(obj2.lon, obj2.lat);
        }

        var polygon = new $window.BMap.Polygon(arr_community_point, {
          strokeColor: color,
          strokeWeight: 4,
          strokeOpacity: 0,
          fillOpacity: strFillOpacity,
          fillColor: strFillColor
        });//Overlay myOverlay;
        map.addOverlay(polygon);           //增加多边形
        arr_polygon.push(polygon);
        ////map.setViewport(arr_community_point);    //调整视野
        var obj3;
        var obj4;
        if (name === '枣园街道办') {
          obj3 = '108.8658280000';
          obj4 = '34.2812900000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '土门街道办') {
          obj3 = '108.8813500000';
          obj4 = '34.2669120000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '桃园路街道办') {
          obj3 = '108.8921300000';
          obj4 = '34.2785460000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '红庙坡街道办') {
          obj3 = '108.9122520000';
          obj4 = '34.2905370000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '北关街道办') {
          obj3 = '108.9479690000';
          obj4 = '34.2950700000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '环城西路街道办') {
          obj3 = '108.9187920000';
          obj4 = '34.2753840000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '青年路街道办') {
          obj3 = '108.9373330000';
          obj4 = '34.2778300000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '北院门街道办') {
          obj3 = '108.9365420000';
          obj4 = '34.2672700000';
          setCommunityName(name, obj3, obj4);
        } else if (name === '西关街道办') {
          obj3 = '108.9092340000';
          obj4 = '34.2580210000';
          setCommunityName(name, obj3, obj4);
        } else {
          //getCenterPoint
          var point = getCenterPoint(arr_community_point);
          setCommunityName(name, point.lng, point.lat);
        }
        map.enableScrollWheelZoom(true);
      }

      function setCommunityName(str_CommunityName, lon, lat) {
        var point = new $window.BMap.Point(lon, lat);
        var opts = {
          position: point,    // 指定文本标注所在的地理位置
          offset: new $window.BMap.Size(-1, 2)    //设置文本偏移量
        };
//        opts.position = map.getBounds().getCenter();
        var label = new $window.BMap.Label(str_CommunityName, opts);  // 创建文本标注对象
        label.setStyle({
          color: 'white',
          backgroundColor: 'transparent', //文本背景色
          borderColor: 'transparent', //文本框边框色
          fontSize: '20px',
          height: '30px',
          lineHeight: '30px',
          fontFamily: '微软雅黑'
        });
        map.addOverlay(label);
        arr_lable.push(label);
      }

      function getCenterPoint(path) {
        //var path = e.;//Array<Point> 返回多边型的点数组
        //var ret=parseFloat(num1)+parseFloat(num2);
        var x = 0.0;
        var y = 0.0;


        for (var j = 0; j < path.length; j++) {

          x = x + parseFloat(path[j].lng);
          y = y + parseFloat(path[j].lat);
        }
        x = x / path.length;
        y = y / path.length;

        //return new BMap.Point(path[0].lng,path[0].lat);
        return new $window.BMap.Point(x, y);
        //return path[0];
      }

      var mapzoom = 0;
      map.addEventListener('tilesloaded', function () {
        var bs;   //获取可视区域
        var bssw;   //可视区域左下角
        var bsne;   //可视区域右上角
        var topLat;
        var bottomLat;
        var leftLng;
        var rightLng;
        if (mapzoom !== this.getZoom() || mapzoom === 0) {
          mapzoom = this.getZoom();

          if (this.getZoom() === 14) {
            map.clearOverlays();

            ShowMapStreet();

            clearLable();

            var point = new $window.BMap.Point(108.8692531847, 34.2843160965);
            var opts = {
              position: point,    // 指定文本标注所在的地理位置
              offset: new $window.BMap.Size(80, -30)    //设置文本偏移量
            };
            label_LH = new $window.BMap.Label('', opts);  // 创建文本标注对象
            label_LH.setStyle({
              color: '#76EE00',
              fontSize: '150px',
              height: '170px',
              lineHeight: '170px',
              fontFamily: '微软雅黑',
              //strokeOpacity: 0.6,
              backgroundColor: '0.01',
              border: '0',
              fontWeight: 'bold',
              strokeOpacity: 0.1
              //opacity: 30

            });
            //label_LH.disableMassClear();
            map.addOverlay(label_LH);
          } else if (this.getZoom() === 15) {
            map.clearOverlays();
            // 获取经纬度范围参数
            // bs = map.getBounds();   //获取可视区域
            // bssw = bs.getSouthWest();   //可视区域左下角
            // bsne = bs.getNorthEast();   //可视区域右上角
            // topLat = bsne.lat;
            // bottomLat = bssw.lat;
            // leftLng = bssw.lng;
            // rightLng = bsne.lng;
            ShowMapStreet();

            //map.setViewport(pointArray);    //调整视野
          } else if (this.getZoom() === 16) {
            map.clearOverlays();
            // 获取经纬度范围参数
            // bs = map.getBounds();   //获取可视区域
            // bssw = bs.getSouthWest();   //可视区域左下角
            // bsne = bs.getNorthEast();   //可视区域右上角s
            // topLat = bsne.lat;
            // bottomLat = bssw.lat;
            // leftLng = bssw.lng;
            // rightLng = bsne.lng;
            ShowMapAreat();
          } else if (this.getZoom() === 17) {
            map.clearOverlays();
            // 获取经纬度范围参数
            // bs = map.getBounds();   //获取可视区域
            // bssw = bs.getSouthWest();   //可视区域左下角
            // bsne = bs.getNorthEast();   //可视区域右上角s
            // topLat = bsne.lat;
            // bottomLat = bssw.lat;
            // leftLng = bssw.lng;
            // rightLng = bsne.lng;
            ShowMapcommunity();
          } else if (this.getZoom() === 18) {
            map.clearOverlays();
            // 获取经纬度范围参数
            bs = map.getBounds();   //获取可视区域
            bssw = bs.getSouthWest();   //可视区域左下角
            bsne = bs.getNorthEast();   //可视区域右上角s
            topLat = bsne.lat;
            bottomLat = bssw.lat;
            leftLng = bssw.lng;
            rightLng = bsne.lng;
            ShowMapGrid(topLat, bottomLat, leftLng, rightLng);
          } else {
            map.clearOverlays();
          }
        }
        if (mapzoom === 0) {
          mapzoom = this.getZoom();
        }
      });


      function clearLable() {
        for (var w = 0; w < arr_lable.length; w++) {
          arr_lable[w].enableMassClear();
          map.removeOverlay(arr_lable[w]);
        }
        arr_lable = [];
      }

      //用来显示党组织的小图标。
      /* function showPoint_dzb_png(lon, lat, type_png_path, id) {


       //创建小狐狸
       var pt = new $window.BMap.Point(lon, lat);
       //alert(type_png_path);
       var myIcon = new $window.BMap.Icon(type_png_path, new $window.BMap.Size(32, 32));
       var marker = new $window.BMap.Marker(pt, {icon: myIcon});  // 创建标注
       marker.disableMassClear();
       map.addOverlay(marker);              // 将标注添加到地图中

       map.addOverlay(marker);
       marker.addEventListener('click', function () {
       $window.look(id);
       });

       map.enableScrollWheelZoom(true);
       //map.panTo(new_point);         <input  type='button' value='查看案件' onclick='say('asfasf')'>       //转到该点位置
       }

       function clear() {
       map.clearOverlays();
       map.enableScrollWheelZoom(true);
       }*/

      /*function getBoundary_0(arr) {
       // //创建多边形数组
       // var arr_community_point = new Array();
       // var color1;
       // if (arr.length > 0) {
       //   for (var s = 0; s < arr.length; s++) {
       //     if (s > 1) {
       //       arr_community_point[s - 2] = new $window.BMap.Point(arr[s].lon, arr[s].lat);
       //     }
       //   }
       // }
       // switch (arr[0]) {
       //   case 1:
       //     color1 = '#FFF974';
       //     break;
       //   case 2:
       //     color1 = '#B8DC7C';
       //     break;
       //   case 3:
       //     color1 = '#F6C5B4';
       //     break;
       //   case 4:
       //     color1 = '#D7BCCF';
       //     break;
       //   case 5:
       //     color1 = '#B8DC7C';
       //     break;
       //   case 6:
       //     color1 = '#B6DDC8';
       //     break;
       //   case 7:
       //     color1 = '#FFF974';
       //     break;
       //   case 8:
       //     color1 = '#F6C5B4';
       //     break;
       //   case 9:
       //     color1 = '#D7BCCF';
       //     break;
       // }
       // var polygon = new $window.BMap.Polygon(arr_community_point, {
       //   strokeColor: color1,
       //   strokeWeight: my_strokeWeight,
       //   strokeOpacity: my_strokeWeight,
       //   fillOpacity: 0.3,
       //   fillColor: color1
       // });  //创建多边形
       // map.addOverlay(polygon);           //增加多边形
       // polygon.addEventListener('click', function (e) {
       //   var point = new $window.BMap.Point(e.point.lng, e.point.lat);
       //
       //   var opts = {
       //     width: 50,     // 信息窗口宽度
       //     height: 20,     // 信息窗口高度
       //     title: '', // 信息窗口标题
       //     //  enableMessage:true,//设置允许信息窗发送短息
       //     message: ''
       //   };
       //   var infoWindow = new $window.BMap.InfoWindow(arr[1] + '', opts);  // 创建信息窗口对象
       //   map.openInfoWindow(infoWindow, point); //开启信息窗口
       // });
       //
       // map.setViewport(arr_community_point);    //调整视野
       // // setCommunityName(str_CommunityName, lon_1, lat_1);
       // map.enableScrollWheelZoom(true);
       }

       // $timeout(function () {
       if (arr_community_point) {
       for (var j = 0; j < 50; j++) {
       getBoundary_0(arr_community_point[j]);
       }
       }*/

      if (data3 || data2) {

        // $timeout(function () {
        for (var i = 0; i < data2.length - 1; i++) {
          showPoint_DZB(data2[i].longitude, data2[i].latitude, data2[i].OrganizationName, data2[i].OrganizationTime, data2[i].Secretary, data2[i].Head, data2[i].OrganizationNum, data2[i].TelNumber, '/modules/core/client/img/header/i1.jpg', data2[i].OrganizationId);
        }
        // }, 2000);
        $timeout(function () {
          for (var i = 0; i < data3.length - 1; i++) {
            showPoint_WGRY(data3[i].log, data3[i].lat, data3[i].grid_number, data3[i].gridPerson_name, data3[i].person_Telnumber, data3[i].party_instructor, data3[i].party_Telnumber, data3[i].party_manage, data3[i].manage_Telnumber, '/modules/partymap/client/img/WGRY.png', data3[i].gridid);
          }
        }, 1000);
      }
    }

    //取后台Partymap表所有数据
    function getdata(prama) {
      PartymapService.query(prama).$promise.then(function (data) {
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
      });
    }

    var prama = {
      party: 1,
      grid: 1,
      streed: -1
    };
    vm.partylist = '0';
    vm.streetlist = '0';
    getdata(prama);
    $timeout(function () {
      map(15);
    }, 200);
    $timeout(function () {
      map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg);
    }, 1000);
    vm.chaxun = function () {
      var prama1;
      if (vm.partylist === '0' && vm.streetlist === '0') {
        prama1 = {
          party: 1,
          grid: 1,
          streed: -1
        };
      } else if (vm.partylist !== '0' && vm.streetlist === '0') {
        if (vm.partylist === '2') {
          prama1 = {
            party: vm.partylist,
            grid: 1,
            streed: -1
          };
        } else if (vm.partylist === '3') {
          prama1 = {
            party: 1,
            grid: vm.partylist,
            streed: -1
          };
        }
      } else if (vm.partylist !== '0' && vm.streetlist !== '0') {
        if (vm.partylist === '2') {
          prama1 = {
            party: vm.partylist,
            grid: 1,
            streed: vm.streetlist
          };
        } else if (vm.partylist === '3') {
          prama1 = {
            party: 1,
            grid: vm.partylist,
            streed: vm.streetlist
          };
        }
      } else if (vm.partylist === '0' && vm.streetlist !== '0') {
        prama1 = {
          party: 1,
          grid: 1,
          streed: vm.streetlist
        };
      }
      getdata(prama1);
      $timeout(function () {
        map(15, vm.arr_community_point, vm.partyoRg, vm.gridorg, vm.streetlist);
      }, 1000);
    };

  }
}());
