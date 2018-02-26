(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartymemberChartController', PartymemberChartController);

  PartymemberChartController.$inject = ['$scope', '$log', 'StatisticalService', 'Notification', 'appService'];
  function PartymemberChartController($scope, $log, StatisticalService, Notification, appService) {
    var cmo = this;
    cmo.typeName = '';
    var i = 0;
    //初始化柱状图表
    function initChart() {
      cmo.options1 = {
        chart: {
          type: 'discreteBarChart',
          height: 500,
          margin: {
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
          },
          x: function (d) {
            return d.label;
          },
          y: function (d) {
            return d.value;
          },
          showValues: true,
          valueFormat: function (d) {
            //return d3.format(',.f')(d);
            return d.toFixed(0);
          },
          transitionDuration: 800,
          xAxis: {
            axisLabel: 'X ' + cmo.typeName + '',
            axisLabelDistance: 10
          },
          yAxis: {
            axisLabel: 'Y 数量(条)',
            axisLabelDistance: -10
          }
        }
      };
      //初始化饼状图表
      cmo.options2 = {
        chart: {
          type: 'pieChart',
          height: 500,
          x: function (d) {
            return d.key;
          },
          y: function (d) {
            return d.y;
          },
          showLabels: true,
          duration: 800,
          labelThreshold: 0.01,
          labelSunbeamLayout: false,
          labelsOutside: true,
          donut: true,
          legend: {
            margin: {
              top: 5,
              right: 0,
              bottom: 0,
              left: 0
            },
            maxKeyLength: 20,
            padding: 20
          }
        }
      };
    }


    //类型下拉框
    var types = [
      {'typeid': 1, 'typename': '性别'},
      {'typeid': 2, 'typename': '类别'},
      {'typeid': 3, 'typename': '年龄'}
    ];
    $scope.typeinfo = types;
    cmo.type_selected = types[0].typeid;
    //日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      $scope.dt1 = now;
      $scope.dt2 = new Date();
    };
    $scope.today();
    $scope.clear = function () {
      $scope.dt1 = null;
      $scope.dt2 = null;
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

    //初始化图表
    cmo.typeName = types[cmo.type_selected - 1].typename;
    initChart();
    var tj = getSelectWhere(i);
    getData({TJ: tj});
    //分析
    $scope.submit = function () {
      cmo.typeName = types[cmo.type_selected - 1].typename;
      initChart();
      var tj = getSelectWhere(i);
      getData({TJ: tj});
    };

    //获取筛选条件
    function getSelectWhere(i) {
      var start_time = $scope.dt1.getTime();
      var end_time = $scope.dt2.getTime();
      if (parseInt(start_time, 10) >= parseInt(end_time, 10)) {
        cmo.yzStartAndEndTime = true;
        return;
      } else {
        cmo.yzStartAndEndTime = false;
      }
      //时间转换
      cmo.startTime = $scope.dt1.getFullYear() + '-' + ($scope.dt1.getMonth() + 1) +
        '-' + $scope.dt1.getDate() + ' 00:00:00';
      cmo.stopTime = $scope.dt2.getFullYear() + '-' + ($scope.dt2.getMonth() + 1) +
        '-' + $scope.dt2.getDate() + ' 00:00:00';
      i++;
      var tj = {
        _startTime: cmo.startTime,
        _stopTime: cmo.stopTime,
        _type: cmo.type_selected,
        count: i
      };
      return tj;
    }

    //初始化图表控件数据
    function initChartData(typeid) {
      if (typeid === '1') {
        cmo.data1 = [{
          key: 'Cumulative Return',
          values: []
        }];
        return cmo.data1[0].values;
      } else {
        cmo.data2 = [];
        return cmo.data2;
      }
    }

    //给图表控件绑定数据
    function chartBindData(typeid, data, item, field) {
      if (typeid === '1') {
        data.push({'label': item, 'value': field});
      } else {
        data.push({'key': item, 'y': field});
      }
    }

    //部门分析
    function getData(SB_TJ) {
      var chartData_z = initChartData('1');
      var chartData_b = initChartData('2');
      //取后台Estimates表所有数据
      StatisticalService.query({
        type: SB_TJ.TJ._type,
        startTime: SB_TJ.TJ._startTime,
        stopTime: SB_TJ.TJ._stopTime,
        submitDep: SB_TJ.TJ.count
      }).$promise.then(function (data) {
        $log.info(data[0]);
        $log.info(data[0].men);
        if (data.length > 0) {
          var field = 0;
          if (SB_TJ.TJ._type === 1) {
            field = parseInt(data[0].men, 10);
            chartBindData('1', chartData_z, '男', parseInt(field, 10));
            chartBindData('2', chartData_b, '男', parseInt(field, 10));
            field = parseInt(data[0].women, 10);
            chartBindData('1', chartData_z, '女', parseInt(field, 10));
            chartBindData('2', chartData_b, '女', parseInt(field, 10));
          } else if (SB_TJ.TJ._type === 2) {
            field = parseInt(data[0].register, 10);
            chartBindData('1', chartData_z, '在册', parseInt(field, 10));
            chartBindData('2', chartData_b, '在册', parseInt(field, 10));
            field = parseInt(data[0].nonregister, 10);
            chartBindData('1', chartData_z, '非在册', parseInt(field, 10));
            chartBindData('2', chartData_b, '非在册', parseInt(field, 10));
          } else if (SB_TJ.TJ._type === 3) {
            field = parseInt(data[0].one, 10);
            chartBindData('1', chartData_z, '小于30岁', parseInt(field, 10));
            chartBindData('2', chartData_b, '小于30岁', parseInt(field, 10));
            field = parseInt(data[0].two, 10);
            chartBindData('1', chartData_z, '30到40岁', parseInt(field, 10));
            chartBindData('2', chartData_b, '30到40岁', parseInt(field, 10));
            field = parseInt(data[0].three, 10);
            chartBindData('1', chartData_z, '40到50岁', parseInt(field, 10));
            chartBindData('2', chartData_b, '40到50岁', parseInt(field, 10));
            field = parseInt(data[0].four, 10);
            chartBindData('1', chartData_z, '50到60岁', parseInt(field, 10));
            chartBindData('2', chartData_b, '50到60岁', parseInt(field, 10));
            field = parseInt(data[0].five, 10);
            chartBindData('1', chartData_z, '60岁以上', parseInt(field, 10));
            chartBindData('2', chartData_b, '60岁以上', parseInt(field, 10));
          }
        }
      });
    }
  }
}());
