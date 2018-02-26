(function () {
  'use strict';

  angular
    .module('page')
    .controller('PageCityBasicPartyController', PageCityBasicPartyController);

  PageCityBasicPartyController.$inject = ['$scope', 'Notification', '$log', '$window',
    'baseCodeService', 'ProjectService', 'menuService', 'appService', 'citybasicpartyService', 'memberNumService', 'prowallService', 'litterxinService', '$state', 'Timer', '$interval'];
  function PageCityBasicPartyController($scope, Notification, $log, $window,
                                        baseCodeService, ProjectService, menuService, appService, citybasicpartyService, memberNumService, prowallService, litterxinService, $state, Timer, $interval) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    //JCDJ_User_roleID branch  user_grade
    // console.log(appService.user);
    var user_grade = appService.user.user_grade;
    citybasicpartyService.query({
      grade: user_grade
    }).$promise.then(function (data) {
      vm.gongzhu = data;
      vm.imgshuju = [];
      angular.forEach(data, function (v, k) {
        var obj = {};
        obj.id = k;
        obj.image = v.photo;
        obj.text = v.title;
        this.push(obj);
        v.sbtime = Timer.format(v.sbtime, 'day');
      }, vm.imgshuju);
      lunbo(vm.imgshuju);
    });
    ProjectService.query({pageNum: 1, gradeId: user_grade}).$promise.then(function (data) {
      vm.project = [];
      vm.project1 = [];
      angular.forEach(data, function (v, k) {
        if (k < 4) {
          vm.project.push(v);
        } else if (k >= 4 && k < 8) {
          vm.project1.push(v);
        }
      });
    });
    $scope.user_grade = user_grade;
    prowallService.query({grade: user_grade}).$promise.then(function (data) {
      angular.forEach(data, function (v, k) {
        if (v.super === 32) {
          v.superName = '区委';
        } else if (v.super === 31) {
          v.superName = '党工委';
        } else if (v.super < 31) {
          angular.forEach(dj_PartyOrganization, function (value, key) {
            if (value.typeID === v.super) {
              v.superName = value.typeName;
            }
          });
        }
      });
      vm.prowall = data;
      if (data.length < 8) {
        $interval.cancel($scope.tableguns);
      }
    });
    litterxinService.query({gradeId: user_grade}).$promise.then(function (data) {
      console.log(data);
      vm.litterxin = data;
    });
    var myChart = $window.echarts.init(document.getElementById('main'));
    myChart.showLoading();
    var myChart1 = $window.echarts.init(document.getElementById('main1'));
    myChart1.showLoading();
    function getservice(str) {
      var max;
      var interval;
      var name;
      var text;
      if (str === 'WorkPlace') {
        max = 360;
        interval = 40;
        name = '职业';
        text = '职业数据统计';
      } else if (str === 'preson_category') {
        max = 1200;
        interval = 100;
        name = '党员类型';
        text = '党员类型统计';
      } else if (str === 'education') {
        max = 360;
        interval = 40;
        name = '学历';
        text = '学历数据统计';
      }
      memberNumService.query({type: str}).$promise.then(function (data) {
        var arrtiaojian = [];
        var work = [];
        var arrsum = [];
        var arrsums = [];
        var arrman = [];
        var arrwoman = [];
        angular.forEach(data, function (v, k) {
          var sum = 0;
          var obj = {};
          v.WorkPlace = v.WorkPlace || '无';
          work.push(v.WorkPlace);
          v.man = Number(v.man);
          arrman.push(v.man);
          v.woman = Number(v.woman);
          arrwoman.push(v.woman);
          sum = v.man + v.woman;
          v.WorkPlace = v.WorkPlace + `(${sum}人)`;
          arrtiaojian.push(v.WorkPlace);
          arrsums.push(sum);
          obj.value = sum;
          obj.name = v.WorkPlace;
          arrsum.push(obj);
        });
        var option = {
          title: {
            text: text,
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
            data: arrtiaojian
          },
          series: [
            {
              name: name,
              type: 'pie',
              radius: '55%',
              center: ['50%', '55%'],
              /*label: {
               normal: {
               formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
               backgroundColor: '#eee',
               borderColor: '#aaa',
               borderWidth: 1,
               borderRadius: 4,
               // shadowBlur:3,
               // shadowOffsetX: 2,
               // shadowOffsetY: 2,
               // shadowColor: '#999',
               // padding: [0, 7],
               rich: {
               a: {
               color: '#999',
               lineHeight: 22,
               align: 'center'
               },
               // abg: {
               //     backgroundColor: '#333',
               //     width: '100%',
               //     align: 'right',
               //     height: 22,
               //     borderRadius: [4, 4, 0, 0]
               // },
               hr: {
               borderColor: '#aaa',
               width: '100%',
               borderWidth: 0.5,
               height: 0
               },
               b: {
               fontSize: 16,
               lineHeight: 33
               },
               per: {
               color: '#eee',
               backgroundColor: '#334455',
               padding: [2, 4],
               borderRadius: 2
               }
               }
               }
               },*/
              data: arrsum,
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              //显示右上角的文件列表readOnly 是否可编辑数据
              dataView: {show: true, readOnly: false},
              //以折线 柱状图显示
              magicType: {show: true, type: ['line', 'bar']},
              //刷新数据
              restore: {show: true},
              //下载统计图图片
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['男', '女', '总人数']
          },
          xAxis: [
            {
              type: 'category',
              data: work,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '人数',
              min: 0,
              max: max,
              interval: interval,
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [
            {
              name: '男',
              type: 'bar',
              data: arrman
            },
            {
              name: '女',
              type: 'bar',
              data: arrwoman
            },
            {
              name: '总人数',
              type: 'line',
              data: arrsum
            }
          ]
        };
        myChart1.hideLoading();
        myChart1.setOption(option1);
      });
    }

    function ageservice(str) {
      memberNumService.query({type: str}).$promise.then(function (data) {
        console.log(data);
        var arrman = [];
        var arrwoman = [];
        var arrsum = [];
        var arrleng = ['20岁以下', '20-30岁', '30-40岁', '40-50岁', '50-60岁', '60-70岁', '70-80岁', '80-90岁', '90岁以上'];
        var arrlengs = [];
        var addd = [];
        angular.forEach(data, function (v, k) {
          v.num = Number(v.num);
          if (v.PartySex === '男') {
            arrman.push(v.num);
          } else {
            arrwoman.push(v.num);
          }
        });
        angular.forEach(arrleng, function (v, k) {
          var sum = 0;
          var obj = {};
          var strs;
          sum = arrman[k] + arrwoman[k];
          arrsum.push(sum);
          strs = arrleng[k] + `(${sum})`;
          arrlengs.push(strs);
          obj.value = sum;
          obj.name = strs;
          addd.push(obj);
        });
        var option = {
          title: {
            text: '年龄统计',
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
            data: arrlengs
          },
          series: [
            {
              name: '年龄',
              type: 'pie',
              radius: '55%',
              center: ['50%', '55%'],
              /*label: {
               normal: {
               formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
               backgroundColor: '#eee',
               borderColor: '#aaa',
               borderWidth: 1,
               borderRadius: 4,
               // shadowBlur:3,
               // shadowOffsetX: 2,
               // shadowOffsetY: 2,
               // shadowColor: '#999',
               // padding: [0, 7],
               rich: {
               a: {
               color: '#999',
               lineHeight: 22,
               align: 'center'
               },
               // abg: {
               //     backgroundColor: '#333',
               //     width: '100%',
               //     align: 'right',
               //     height: 22,
               //     borderRadius: [4, 4, 0, 0]
               // },
               hr: {
               borderColor: '#aaa',
               width: '100%',
               borderWidth: 0.5,
               height: 0
               },
               b: {
               fontSize: 16,
               lineHeight: 33
               },
               per: {
               color: '#eee',
               backgroundColor: '#334455',
               padding: [2, 4],
               borderRadius: 2
               }
               }
               }
               },*/
              data: addd,
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
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              //显示右上角的文件列表readOnly 是否可编辑数据
              dataView: {show: true, readOnly: false},
              //以折线 柱状图显示
              magicType: {show: true, type: ['line', 'bar']},
              //刷新数据
              restore: {show: true},
              //下载统计图图片
              saveAsImage: {show: true}
            }
          },
          legend: {
            data: ['男', '女', '总人数']
          },
          xAxis: [
            {
              type: 'category',
              data: arrleng,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '人数',
              min: 0,
              max: 600,
              interval: 40,
              axisLabel: {
                formatter: '{value} 个'
              }
            }
          ],
          series: [
            {
              name: '男',
              type: 'bar',
              data: arrman
            },
            {
              name: '女',
              type: 'bar',
              data: arrwoman
            },
            {
              name: '总人数',
              type: 'line',
              data: arrsum
            }
          ]
        };
        myChart1.hideLoading();
        myChart1.setOption(option1);
      });
    }

    getservice('WorkPlace');
    vm.getchart = function (str) {
      if (str === 'PartyBirth') {
        ageservice(str);
      } else {
        getservice(str);
      }

    };
    // 共驻共建
    function lunbo(num) {
      vm.imgdata = num;
      vm.myslides = vm.imgdata;
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.active = 0;

      var slides = $scope.slides = [];
      var currIndex = 0;
      $scope.addSlide = function (i) {
        slides.push({
          image: vm.myslides[i].image,
          text: vm.myslides[i].text,
          id: currIndex++
        });
      };
      for (var i = 0; i < vm.myslides.length; i++) {
        $scope.addSlide(i);
      }
    }

    vm.street_info = baseCodeService.getItems('street_info');
    vm.arr = [];
    angular.forEach(vm.street_info, function (v, k) {
      if (v.streetID !== 0 && v.streetID !== 10) {
        this.push(v);
      }
    }, vm.arr);
    vm.sidebarbtn = false;
    var switchs = true;
    $scope.sidebtn = function () {
      if (switchs) {
        vm.sidebarbtn = true;
        switchs = false;
      } else {
        vm.sidebarbtn = false;
        switchs = true;
      }
    };
    $scope.tableguns = $interval(function () {
      angular.element(document.querySelector('.prowalllnbo')).css({'top': '0px'});
      $('.prowalllnbo').animate({
        top: '-45px'
      }, 1000);
      // angular.element(document.querySelector('.tableboxinner')).ani({'top':  '-40px'});
      angular.element(document.querySelector('.prowalllnbo')).append(angular.element(document.querySelector('.prowalllnbo>tr:nth-child(1)')).remove()[0]);
    }, 2000);
    $scope.$on('$destroy', function () {
      $interval.cancel($scope.tableguns);
    });
    vm.weixingyuan = function (num) {
      $state.go('weixindetail', {data: vm.litterxin[num]});
    };
    vm.gongj = function (num) {
      $state.go('gongjiandetail', {data: vm.gongzhu[num]});
    };
    vm.proll = function ($event) {
      var num;
      if ($event.target.tagName === 'P') {
        num = angular.element($event.target).parent().parent().parent().attr('id');
      } else if ($event.target.tagName === 'TD') {
        num = angular.element($event.target).parent().attr('id');
      } else if ($event.target.tagName === 'A') {
        num = angular.element($event.target).parent().parent().attr('id');
      }
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
    vm.projects = function (num) {
      $state.go('projectdetail', {data: vm.project[num]});
    };
    vm.projects1 = function (num) {
      $state.go('projectdetail', {data: vm.project1[num]});
    };
  }
}());
