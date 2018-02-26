(function () {
  'use strict';

  angular
    .module('task')
    .controller('addController', addController);

  addController.$inject = ['$scope', 'Notification', '$log', '$window',
    '$uibModalInstance', 'baseCodeService',
    'type', 'AddService', 'appService', 'Timer'];
  function addController($scope, Notification, $log, $window,
                         $uibModalInstance, baseCodeService, type, AddService, appService, Timer) {
    var vm = this;
    vm.dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    vm.TaskType = baseCodeService.getItems('TaskType');
    vm.tasktype = '1';
    function getTaskName(id) {
      var name;
      for (var g = 0; g < vm.TaskType.length; g++) {
        if (Number(id) === vm.TaskType[g].typeid) {
          name = vm.TaskType[g].typename;
        }
      }
      return name;
    }

    function getPartyGeneralBranchId(id) {
      var ID = [];
      for (var r = 0; r < vm.dj_PartyGeneralBranch.length; r++) {
        if (vm.dj_PartyGeneralBranch[r].superior === id) {
          ID.push(vm.dj_PartyGeneralBranch[r].branchID);
        }
      }
      return ID;
    }

    function getPartyGeneralBranchName(id) {
      var names = [];
      for (var r = 0; r < vm.dj_PartyGeneralBranch.length; r++) {
        if (vm.dj_PartyGeneralBranch[r].superior === id) {
          names.push(vm.dj_PartyGeneralBranch[r].branchName);
        }
      }
      return names;
    }

    function getPartyBranchId(id) {
      var ID = [];
      for (var m = 0; m < vm.dj_PartyBranch.length; m++) {
        if (id === vm.dj_PartyBranch[m].super && (vm.dj_PartyBranch[m].generalbranch === null || vm.dj_PartyBranch[m].generalbranch === 0)) {
          ID.push(vm.dj_PartyBranch[m].OrganizationId);
        }
      }
      return ID;
    }

    function getPartyBranchName(id) {
      var name = [];
      for (var n = 0; n < vm.dj_PartyBranch.length; n++) {
        if (id === vm.dj_PartyBranch[n].super && (vm.dj_PartyBranch[n].generalbranch === null || vm.dj_PartyBranch[n].generalbranch === 0)) {
          console.log(vm.dj_PartyBranch[n]);
          name.push(vm.dj_PartyBranch[n].OrganizationName);
        }
      }
      return name;
    }

    if (appService.user) {
      vm.grade = appService.user.user_grade;
      vm.createUser = appService.user.id;
      if (vm.grade === 1) {
        //  区委账号
        vm.quwei = true;
        vm.payoutName = '区委';
      } else if (vm.grade === 2) {
        //  党委账号
        vm.dangwei = true;
        vm.payoutName = '党委';
      } else if (vm.grade === 3) {
        //  党工委账号
        vm.danggongwei = true;
        vm.payoutName = '党工委';
      } else if (vm.grade === 4) {
        //  部门党委账号
        vm.xxDW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var n = 0; n < vm.dj_PartyOrganization.length; n++) {
          if (vm.dj_PartyOrganization[n].roleID === vm.roleID) {
            vm.bmid = vm.dj_PartyOrganization[n].typeID;
            vm.payoutName = vm.dj_PartyOrganization[n].typeName;
          }
        }
        // vm.bmid = data[0].partyorgtype;
        vm.bmDwData = getPartyBranchName(vm.bmid);
        vm.bmDwIdData = getPartyBranchId(vm.bmid);
        vm.bmDwDzzData = getPartyGeneralBranchName(vm.bmid);
        vm.bmDwDzzIdData = getPartyGeneralBranchId(vm.bmid);
      } else if (vm.grade === 5) {
        //  街道党工委账号
        vm.xxDGW = true;
        vm.roleID = appService.user.JCDJ_User_roleID;
        for (var o = 0; o < vm.dj_PartyOrganization.length; o++) {
          if (vm.dj_PartyOrganization[o].roleID === vm.roleID) {
            vm.strid = vm.dj_PartyOrganization[o].typeID;
            vm.payoutName = vm.dj_PartyOrganization[o].typeName;
          }
        }
        // vm.strid = data[0].partyorgtype;
        vm.strDzbData = getPartyBranchName(vm.strid);
        vm.strDzbIdData = getPartyBranchId(vm.strid);
        vm.strDzzData = getPartyGeneralBranchName(vm.strid);
        vm.strDzzIdData = getPartyGeneralBranchId(vm.strid);
      } else if (vm.grade === 9) {
        vm.xxDWDZZ = true;
        vm.branch1 = appService.user.branch;
        vm.xxDWDZZSon = [];
        for (var m = 0; m < vm.dj_PartyBranch.length; m++) {
          if (vm.branch1 === vm.dj_PartyBranch[m].OrganizationId) {
            vm.dzzid1 = vm.dj_PartyBranch[m].generalbranch;
          }
        }
        for (var i = 0; i < vm.dj_PartyGeneralBranch.length; i++) {
          if (vm.dj_PartyGeneralBranch[i].branchID === vm.dzzid1) {
            vm.payoutName = vm.dj_PartyGeneralBranch[i].branchName;
          }
        }
        for (var l = 0; l < vm.dj_PartyBranch.length; l++) {
          if (vm.dj_PartyBranch[l].generalbranch === vm.dzzid1) {
            vm.xxDWDZZSon.push({
              id: vm.dj_PartyBranch[l].OrganizationId,
              name: vm.dj_PartyBranch[l].OrganizationName
            });
          }
        }
      } else if (vm.grade === 10) {
        vm.xxDGWDZZ = true;
        vm.branch = appService.user.branch;
        vm.xxDGWDZZSon = [];
        for (var x = 0; x < vm.dj_PartyBranch.length; x++) {
          if (vm.branch === vm.dj_PartyBranch[x].OrganizationId) {
            vm.dzzid = vm.dj_PartyBranch[x].generalbranch;
          }
        }
        for (var t = 0; t < vm.dj_PartyGeneralBranch.length; t++) {
          if (vm.dj_PartyGeneralBranch[t].branchId === vm.dzzid) {
            vm.payoutName = vm.dj_PartyGeneralBranch[t].branchName;
          }
        }
        for (var y = 0; y < vm.dj_PartyBranch.length; y++) {
          if (vm.dj_PartyBranch[y].generalbranch === vm.dzzid) {
            vm.xxDGWDZZSon.push({
              id: vm.dj_PartyBranch[y].OrganizationId,
              name: vm.dj_PartyBranch[y].OrganizationName
            });
          }
        }
      }
    }
    vm.changeNotice = function (f) {
      if (f) {
        if (!vm.fileFile) {
          $window.alert('请先选择文件！');
          vm.toNotice = false;
        }
      }
    };
    $window.downloadFile = function (sUrl) {

      //iOS devices do not support downloading. We have to inform user about this.
      if (/(iP)/g.test(navigator.userAgent)) {
        $window.alert('Your device does not support files downloading. Please try again in desktop browser.');
        return false;
      }

      //If in Chrome or Safari - download via virtual link click
      if ($window.downloadFile.isChrome || $window.downloadFile.isSafari) {
        //Creating new link node.
        var link = document.createElement('a');
        link.href = sUrl;

        if (link.download !== undefined) {
          //Set HTML5 download attribute. This will prevent file from opening if supported.
          var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
          link.download = fileName;
        }

        //Dispatching click event.
        if (document.createEvent) {
          var e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
          return true;
        }
      }

      // Force file download (whether supported by server).
      if (sUrl.indexOf('?') === -1) {
        sUrl += '?download';
      }

      $window.open(sUrl, '_self');
      return true;
    };

    $window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    $window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    vm.download = $window.downloadFile;
    // vm.download = function (url) {
    //   $window.open(url);
    // };
    //图片文件上送
    vm.fileSelected = false;
    vm.loading = false;
    //上报文件
    vm.create_photoPicFile = null;
    vm.fileSelected3 = false;
    vm.loading3 = false;
    //上报文件
    vm.create_photoPicFile3 = null;
    vm.fileSelected2 = false;
    vm.loading2 = false;
    //上报文件
    vm.create_photoPicFile2 = null;
    vm.headTitle = '';
    if (JSON.stringify(AddService) === '{}') {
      vm.AddService = AddService;
      vm.addF = true;
      vm.headTitle = '新增任务';
    } else {
      vm.seek = true;
      vm.type = type;
      vm.seekData = AddService;
      vm.seekData.starttime = Timer.format(vm.seekData.starttime, 'day');
      vm.seekData.endtime = Timer.format(vm.seekData.endtime, 'day');
      if (vm.seekData.file) {
        vm.fileF = '点击查看文件';
      } else {
        vm.fileF = '暂无文件';
      }
      vm.headTitle = '查看任务';
    }

    // vm.strDGW = [];
    vm.strdgw = [];
    vm.bmDW = [];
    $scope.qubmdw = [];
    $scope.qustrdgw = [];
    $scope.bmdw = [];
    $scope.bmdw1 = [];
    $scope.bmdw2 = [];
    $scope.strdgw = [];
    $scope.strdgw1 = []; // 全部党工委党支部
    $scope.strdgw2 = []; // 全部党工委党总支
    $scope.dzzdisabled = []; // 党工委账号对应全部党工委党总支的
    $scope.xxstrdgwdzb = [];
    $scope.xxstrdgwdzz = [];
    $scope.xxstrdgwdzz1 = [];
    $scope.xxstrdgwdzzson = [];
    $scope.xxbmdwdzz = [];
    $scope.xxbmdwdzz1 = [];
    $scope.xxbmdwdzb = [];
    $scope.xxbmdwdzzson = [];
    $scope.xxbmdw = [];
    for (var aa = 0; aa < vm.dj_PartyOrganization.length; aa++) {
      for (var s = 0; s < vm.dj_PartyGeneralBranch.length; s++) {
        vm.dj_PartyOrganization[vm.dj_PartyGeneralBranch[s].superior - 1].dzz = true;
      }
    }
    for (var b = 0; b < vm.dj_PartyOrganization.length; b++) {
      if (vm.dj_PartyOrganization[b].comType === 2) {
        // vm.strDGW.push({name: vm.dj_PartyOrganization[b].typeName, dzz: vm.dj_PartyOrganization[b].dzz});
      } else {
        vm.bmDW.push({name: vm.dj_PartyOrganization[b].typeName, dzz: vm.dj_PartyOrganization[b].dzz});
      }
    }
    vm.strDGW = [
      {
        name: '青年路街道党工委',
        dzz: false
      },
      {
        name: '北院门街道党工委',
        dzz: true
      },
      {
        name: '环西街道党工委',
        dzz: true
      },
      {
        name: '西关街道党工委',
        dzz: true
      },
      {
        name: '土门街道党工委',
        dzz: false
      },
      {
        name: '红庙坡街道党工委',
        dzz: false
      },
      {
        name: '桃园路街道党工委',
        dzz: false
      },
      {
        name: '枣园街道党工委',
        dzz: false
      },
      {
        name: '北关街道党工委',
        dzz: false
      },
      {
        name: '桃园开发区党工委',
        dzz: true
      },
      {
        name: '西大街党工委',
        dzz: false
      },
      {
        name: '机关党工委',
        dzz: true
      }
    ];
    vm.changeDW = function (f) {
      if (!f) {
        vm.bmdw = false;
      } else {
        $scope.qubmdw = [];
      }
    };
    vm.changeDGW = function (f) {
      if (!f) {
        vm.jddgw = false;
      } else {
        $scope.qustrdgw = [];
      }
    };
    vm.seletDWDZB = true;
    vm.seletDWDZZ = true;

    vm.changBMDW = function (index) {
      if ($scope.bmdw[index]) {
        $scope.bmdw1[index] = true;
        $scope.bmdw2[index] = true;
      } else {
        $scope.bmdw1[index] = false;
        $scope.bmdw2[index] = false;
      }
    };
    vm.seletDGWDZB = true;
    vm.seletDGWDZZ = true;
    for (var mm = 0; mm < 12; mm++) {
      $scope.dzzdisabled[mm] = false;
    }
    vm.changStrDGW = function (index) {
      if ($scope.strdgw[index]) {
        $scope.strdgw2[index] = true;
        $scope.strdgw1[index] = true;
      } else {
        $scope.strdgw2[index] = false;
        $scope.strdgw1[index] = false;
      }
      // var a;
      // for (a = 0; a < 12; a++) {
      //   if ($scope.strdgw[a]) {
      //     vm.seletDGWDZB = !$scope.strdgw[a];
      //     break;
      //   }
      // }
      // for (var x = 0; x < 12; x++) {
      //   for (var t = 0; t < vm.dj_PartyGeneralBranch.length; t++) {
      //     if ($scope.strdgw[x]) {
      //       // 表示有党总支
      //       if (vm.dj_PartyGeneralBranch[t].superior === (x + 1)) {
      //         vm.seletDGWDZZ = false;
      //         $scope.dzzdisabled[t] = false;
      //       }
      //     }
      //   }
      // }
      // if (a < 12) {
      //   vm.seletDGWDZB = false;
      // } else {
      //   vm.dgwdzb = false;
      //   vm.seletDGWDZB = true;
      // }
    };
    vm.seletStrDzzAlldzb = true;
    vm.changeStrDZZ = function (index) {
      if ($scope.xxstrdgwdzz[index]) {
        $scope.xxstrdgwdzz1[index] = true;
      } else {
        $scope.xxstrdgwdzz1[index] = false;
      }
    };
    vm.seletBmDzzAlldzb = true;
    vm.changeBmDZZ = function () {
      angular.forEach($scope.xxbmdwdzz, function (value, k) {
        if (value) {
          $scope.xxbmdwdzz1[k] = true;
        } else {
          $scope.xxbmdwdzz1[k] = false;
        }
      });
    };
    vm.changealldw = function (f) {
      if (f) {
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.bmdw[k] = true;
          $scope.bmdw1[k] = false;
          $scope.bmdw2[k] = false;
        });
        vm.disAlldwson = true;
      } else {
        vm.disAlldwson = false;
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.bmdw[k] = false;
          $scope.bmdw1[k] = false;
          $scope.bmdw2[k] = false;
        });
      }
    };
    vm.changealldwson = function (f) {
      if (f) {
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.bmdw[k] = true;
          $scope.bmdw1[k] = true;
          $scope.bmdw2[k] = true;
        });
        vm.disAlldw = true;
      } else {
        vm.disAlldw = false;
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.bmdw[k] = false;
          $scope.bmdw1[k] = false;
          $scope.bmdw2[k] = false;
        });
      }
    };
    vm.changealldgw = function (f) {
      if (f) {
        angular.forEach(vm.strDGW, function (value, k) {
          $scope.strdgw[k] = true;
          $scope.strdgw1[k] = false;
          $scope.strdgw2[k] = false;
        });
        vm.disAlldgwson = true;
      } else {
        vm.disAlldgwson = false;
        angular.forEach(vm.strDGW, function (value, k) {
          $scope.strdgw[k] = false;
          $scope.strdgw1[k] = false;
          $scope.strdgw2[k] = false;
        });
      }
    };
    vm.changealldgwson = function (f) {
      if (f) {
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.strdgw[k] = true;
          $scope.strdgw1[k] = true;
          $scope.strdgw2[k] = true;
        });
        vm.disAlldgw = true;
      } else {
        vm.disAlldgw = false;
        angular.forEach(vm.bmDW, function (value, k) {
          $scope.strdgw[k] = false;
          $scope.strdgw1[k] = false;
          $scope.strdgw2[k] = false;
        });
      }
    };
    vm.changexxDGWAlldzz = function (f) {
      if (f) {
        angular.forEach(vm.strDzzData, function (value, k) {
          $scope.xxstrdgwdzz[k] = true;
          $scope.xxstrdgwdzz1[k] = true;
        });
      } else {
        angular.forEach(vm.strDzzData, function (value, k) {
          $scope.xxstrdgwdzz[k] = false;
          $scope.xxstrdgwdzz1[k] = false;
        });
      }
    };
    vm.changexxDGWAlldzb = function (f) {
      if (f) {
        angular.forEach(vm.strDzbData, function (value, k) {
          $scope.xxstrdgwdzb[k] = true;
        });
      } else {
        angular.forEach(vm.strDzbData, function (value, k) {
          $scope.xxstrdgwdzb[k] = false;
        });
      }
    };
    vm.changexxDWAlldzz = function (f) {
      if (f) {
        angular.forEach(vm.bmDwDzzData, function (value, k) {
          $scope.xxbmdwdzz[k] = true;
          $scope.xxbmdwdzz1[k] = true;
        });
      } else {
        angular.forEach(vm.bmDwDzzData, function (value, k) {
          $scope.xxbmdwdzz[k] = false;
          $scope.xxbmdwdzz1[k] = false;
        });
      }
    };
    vm.changexxDWAlldzb = function (f) {
      if (f) {
        angular.forEach(vm.bmDwData, function (value, k) {
          $scope.xxbmdw[k] = true;
        });
      } else {
        angular.forEach(vm.bmDwData, function (value, k) {
          $scope.xxbmdw[k] = false;
        });
      }
    };
    vm.changeDWdzz = function (f) {
      if (f) {
        angular.forEach(vm.xxDWDZZSon, function (value, k) {
          $scope.xxbmdwdzzson[k] = true;
        });
      } else {
        angular.forEach(vm.xxDWDZZSon, function (value, k) {
          $scope.xxbmdwdzzson[k] = false;
        });
      }
    };
    vm.changeDGWdzz = function (f) {
      if (f) {
        angular.forEach(vm.xxDGWDZZSon, function (value, k) {
          $scope.xxstrdgwdzzson[k] = true;
        });
      } else {
        angular.forEach(vm.xxDGWDZZSon, function (value, k) {
          $scope.xxstrdgwdzzson[k] = false;
        });
      }
    };
    vm.closeF = true;
    //在这里处理要进行的操作
    vm.ok = function () {
      vm.AddService.title = vm.title;
      vm.AddService.content = vm.content;
      vm.AddService.img1 = vm.create_photoPicFile;
      vm.AddService.img2 = vm.create_photoPicFile2;
      vm.AddService.img3 = vm.create_photoPicFile3;
      vm.AddService.file = vm.fileFile;
      vm.AddService.starttime = $scope.dt1;
      vm.AddService.endtime = $scope.dt2;
      vm.tasktypename = getTaskName(vm.tasktype);
      vm.AddService.tasktype = vm.tasktypename;
      vm.AddService.payout = '';
      vm.AddService.grade = [];
      vm.AddService.objId = [];
      vm.AddService.payoutName = vm.payoutName;
      vm.AddService.createUser = vm.createUser;
      vm.AddService.toNotice = vm.toNotice;
      vm.AddService.Relation = [];
      vm.selectedBMDW = [];
      vm.selectedStrDGW = [];
      if (vm.grade === 1) { // 区委
        vm.objnames = ['区教育局党委', '区卫生和计划生育局党委', '区建住局党委', '区城市管理局党委', '区法院机关党委', '区人社局党委', '区城改办党委', '区工业、交通总公司党委', '区商业总公司党委', '区农工商总公司党委', '区地税局党委', '国土莲湖分局党委', '区财政局党委', '区人民政府资产管理局党委', '西安大兴新区（西安土门地区）管委会机关党委', '区药监局党委', '前进集团党委', '区民政局党委'];
        if (vm.dw) {
          angular.forEach(vm.objnames, function (value, k) {
            vm.AddService.payout += ('，' + value);
          });
          vm.AddService.grade.push(4);
          vm.AddService.Relation.push({
            cjId: 4,
            objId: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            objname: vm.objnames
          });
        } else {
          angular.forEach($scope.qubmdw, function (value, k) {
            if (value) {
              vm.AddService.payout += '，' + vm.bmDW[k].name;
              vm.AddService.grade.push(4);
              vm.AddService.Relation.push({
                cjId: 4,
                objId: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30][k],
                objname: vm.objnames[k]
              });
            }
          });
        }
        vm.objnames2 = ['青年路街道党工委', '北院门街道党工委', '环西街道党工委', '西关街道党工委', '土门街道党工委', '红庙坡街道党工委', '桃园路街道党工委', '枣园街道党工委', '北关街道党工委', '桃园开发区党工委', '西大街党工委', '机关党工委'];
        if (vm.dgw) {
          angular.forEach(vm.objnames2, function (value, k) {
            vm.AddService.payout += ('，' + value);
          });
          vm.AddService.grade.push(5);
          vm.AddService.Relation.push({
            cjId: 5,
            objId: [1, 2, 7, 5, 6, 4, 8, 9, 3, 11, 12, 10],
            objname: vm.objnames2
          });
        } else {
          angular.forEach($scope.qustrdgw, function (value, k) {
            if (value) {
              vm.AddService.payout += ('，' + vm.strDGW[k].name);
              vm.AddService.grade.push(5);
              vm.AddService.Relation.push({
                cjId: 5,
                objId: [1, 2, 7, 5, 6, 4, 8, 9, 3, 11, 12, 10][k],
                objname: vm.objnames2[k]
              });
            }
          });
        }
      } else if (vm.grade === 2) { // 党委 + 13
        // 所选的部门
        for (var i = 0; i < $scope.bmdw.length; i++) {
          if ($scope.bmdw[i]) {
            vm.AddService.payout += '，' + vm.dj_PartyOrganization[i + 12].typeName;
            vm.selectedBMDW.push(i + 13);
            vm.AddService.Relation.push({
              cjId: 4,
              objId: i + 13,
              objname: vm.dj_PartyOrganization[i + 12].typeName
            });
          }
        }

        angular.forEach(vm.bmDW, function (value, k) {
          // 所选部门对应的党委党支部
          if ($scope.bmdw1[k]) {
            vm.names = getPartyBranchName(k + 13);
            if (vm.names.length !== 0) {
              for (var t = 0; t < vm.names.length; t++) {
                vm.AddService.payout += ',' + vm.names[t];
              }
              vm.AddService.Relation.push({
                cjId: 6,
                objId: getPartyBranchId(k + 13),  // 某部门党委对应的全部党委党支部
                objname: vm.names
              });
            }
          }
          // 所选部门对应的党委党总支
          if ($scope.bmdw2[k]) {
            vm.names2 = getPartyGeneralBranchName(k + 13);
            if (vm.names2.length !== 0) {
              for (var gg = 0; gg < vm.names2.length; gg++) {
                vm.AddService.payout += ',' + vm.names2[gg];
              }
              vm.AddService.Relation.push({
                cjId: 9,
                objId: getPartyGeneralBranchId(k + 13),  // 某部门党委对应的全部党委党总支
                objname: vm.names2
              });
            }
          }
        });
        // for (var k = 0; k < vm.selectedBMDW.length; k++) {
        //   vm.names = getPartyBranchName(vm.selectedBMDW[k]);
        //   if (vm.names.length !== 0) {
        //     for (var t = 0; t < vm.names.length; t++) {
        //       vm.AddService.payout += ',' + vm.names[t];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 6,
        //       objId: getPartyBranchId(vm.selectedBMDW[k]),  // 某部门党委对应的全部党委党支部
        //       objname: vm.names
        //     });
        //   }
        // }
        // if (vm.dwdzb) {
        //   for (var k = 0; k < vm.selectedBMDW.length; k++) {
        //     vm.names = getPartyBranchName(vm.selectedBMDW[k]);
        //     for (var t = 0; t < vm.names.length; t++) {
        //       vm.AddService.payout += ',' + vm.names[t];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 6,
        //       objId: getPartyBranchId(vm.selectedBMDW[k]),  // 某部门党委对应的全部党委党支部
        //       objname: vm.names
        //     });
        //   }
        // }
        // 所选部门对应的党总支
        // for (var c = 0; c < vm.selectedBMDW.length; c++) {
        //   vm.names2 = getPartyGeneralBranchName(vm.selectedBMDW[c]);
        //   if (vm.names2.length !== 0) {
        //     for (var gg = 0; gg < vm.names2.length; gg++) {
        //       vm.AddService.payout += ',' + vm.names2[gg];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 9,
        //       objId: getPartyGeneralBranchId(vm.selectedBMDW[c]),  // 某部门党委对应的全部党委党总支
        //       objname: vm.names2
        //     });
        //   }
        // }
        // if (vm.bmdwdzz) {
        //   for (var k = 0; k < vm.selectedBMDW.length; k++) {
        //     vm.names2 = getPartyGeneralBranchName(vm.selectedBMDW[k]);
        //     for (var t = 0; t < vm.names2.length; t++) {
        //       vm.AddService.payout += ',' + vm.names2[t];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 9,
        //       objId: getPartyGeneralBranchId(vm.selectedBMDW[k]),  // 某部门党委对应的全部党委党总支
        //       objname: vm.names2
        //     });
        //   }
        // }
      } else if (vm.grade === 3) { // 党工委 + 1
        // 所选的街道党工委
        for (var j = 0; j < $scope.strdgw.length; j++) {
          if ($scope.strdgw[j]) {
            vm.AddService.payout += '，' + vm.dj_PartyOrganization[j].typeName;
            vm.selectedStrDGW.push(j + 1);
            vm.AddService.Relation.push({
              cjId: 5,
              objId: j + 1,
              objname: vm.dj_PartyOrganization[j].typeName
            });
          }
        }
        // 所选街道党工委对应的党支部
        angular.forEach(vm.strDGW, function (value, k) {
          if ($scope.strdgw1[k]) {
            vm.names = getPartyBranchName(k + 1);
            if (vm.names.length !== 0) {
              for (var z = 0; z < vm.names.length; z++) {
                vm.AddService.payout += ',' + vm.names[z];
              }
              vm.AddService.Relation.push({
                cjId: 7,
                objId: getPartyBranchId(k + 1), // 某部门党委对应的全部党委党支部
                objname: vm.names
              });
            }
          }
          if ($scope.strdgw2[k]) {
            vm.names2 = getPartyGeneralBranchName(k + 1);
            if (vm.names2.length !== 0) {
              for (var m = 0; m < vm.names2.length; m++) {
                vm.AddService.payout += ',' + vm.names2[m];
              }
              vm.AddService.Relation.push({
                cjId: 10,
                objId: getPartyGeneralBranchId(k + 1), // 某部门党委对应的全部党委党支部
                objname: vm.names2
              });
            }
          }
        });
        // for (var p = 0; p < vm.selectedStrDGW.length; p++) {
        //   vm.names = getPartyBranchName(vm.selectedStrDGW[p]);
        //   if (vm.names.length !== 0) {
        //     for (var z = 0; z < vm.names.length; z++) {
        //       vm.AddService.payout += ',' + vm.names[z];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 7,
        //       objId: getPartyBranchId(vm.selectedStrDGW[p]), // 某部门党委对应的全部党委党支部
        //       objname: vm.names
        //     });
        //   }
        // }
        // if (vm.dgwdzb) {
        //   for (var p = 0; p < vm.selectedStrDGW.length; p++) {
        //     vm.names = getPartyBranchName(vm.selectedStrDGW[p]);
        //     for (var z = 0; z < vm.names.length; z++) {
        //       vm.AddService.payout += ',' + vm.names[z];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 7,
        //       objId: getPartyBranchId(vm.selectedStrDGW[p]), // 某部门党委对应的全部党委党支部
        //       objname: vm.names
        //     });
        //   }
        // }
        // 所选街道党工委对应的党总支
        // for (var pp = 0; pp < vm.selectedStrDGW.length; pp++) {
        //   vm.names2 = getPartyGeneralBranchName(vm.selectedStrDGW[pp]);
        //   if (vm.names2.length !== 0) {
        //     for (var m = 0; m < vm.names2.length; m++) {
        //       vm.AddService.payout += ',' + vm.names2[m];
        //     }
        //     vm.AddService.Relation.push({
        //       cjId: 10,
        //       objId: getPartyGeneralBranchId(vm.selectedStrDGW[pp]), // 某部门党委对应的全部党委党支部
        //       objname: vm.names2
        //     });
        //   }
        // }
      } else if (vm.grade === 4) { // xx部门党委账号
        vm.selectedBmDzz = [];
        // 所选择的党支部
        for (var s = 0; s < $scope.xxbmdw.length; s++) {
          if ($scope.xxbmdw[s]) {
            vm.AddService.payout += '，' + vm.bmDwData[s];
            vm.AddService.Relation.push({
              cjId: 6,
              objId: vm.bmDwIdData[s],
              objname: vm.bmDwData[s]
            });
          }
        }
        // 所选的党总支
        for (var d = 0; d < $scope.xxbmdwdzz.length; d++) {
          if ($scope.xxbmdwdzz[d]) {
            vm.AddService.payout += '，' + vm.bmDwDzzData[d];
            vm.selectedBmDzz.push(vm.bmDwDzzIdData[d]);
            vm.AddService.Relation.push({
              cjId: 9,
              objId: vm.bmDwDzzIdData[d],
              objname: vm.bmDwDzzData[d]
            });
          }
        }
        // 所选党总支下的党支部
        for (var e = 0; e < vm.selectedBmDzz.length; e++) {
          for (var kk = 0; kk < vm.dj_PartyBranch.length; kk++) {
            if (vm.selectedBmDzz[e] === vm.dj_PartyBranch[kk].generalbranch) {
              vm.AddService.payout += '，' + vm.dj_PartyBranch[kk].OrganizationName;
              vm.AddService.Relation.push({
                cjId: 6,
                objId: vm.dj_PartyBranch[kk].OrganizationId,
                objname: vm.dj_PartyBranch[kk].OrganizationName
              });
            }
          }
        }

        // if (vm.bmDzzAlldzb) {
        //   for (var e = 0; e < vm.selectedBmDzz.length; e++) {
        //     for (var c = 0; c < vm.dj_PartyBranch.length; c++) {
        //       if (vm.selectedBmDzz[e] === vm.dj_PartyBranch[c].generalbranch) {
        //         vm.AddService.payout += '，' + vm.dj_PartyBranch[c].OrganizationName;
        //         vm.AddService.Relation.push({
        //           cjId: 6,
        //           objId: vm.dj_PartyBranch[c].OrganizationId,
        //           objname: vm.dj_PartyBranch[c].OrganizationName
        //         });
        //       }
        //     }
        //   }
        // }

      } else if (vm.grade === 5) { // xx街道党工委账号
        vm.selectedStrDzz = [];
        // 所选党支部
        for (var cc = 0; cc < $scope.xxstrdgwdzb.length; cc++) {
          if ($scope.xxstrdgwdzb[cc]) {
            vm.AddService.payout += '，' + vm.strDzbData[cc];
            vm.AddService.Relation.push({
              cjId: 7,
              objId: vm.strDzbIdData[cc],
              objname: vm.strDzbData[cc]
            });
          }
        }
        // 所选党总支
        for (var f = 0; f < $scope.xxstrdgwdzz.length; f++) {
          if ($scope.xxstrdgwdzz[f]) {
            vm.AddService.payout += '，' + vm.strDzzData[f];
            vm.selectedStrDzz.push(vm.strDzzIdData[f]);
            vm.AddService.Relation.push({
              cjId: 10,
              objId: vm.strDzzIdData[f],
              objname: vm.strDzzData[f]
            });
          }
        }
        // 所选党总支下的党支部
        for (var q = 0; q < vm.selectedStrDzz.length; q++) {
          for (var w = 0; w < vm.dj_PartyBranch.length; w++) {
            if (vm.selectedStrDzz[q] === vm.dj_PartyBranch[w].generalbranch) {
              vm.AddService.payout += '，' + vm.dj_PartyBranch[w].OrganizationName;
              vm.AddService.Relation.push({
                cjId: 7,
                objId: vm.dj_PartyBranch[w].OrganizationId,
                objname: vm.dj_PartyBranch[w].OrganizationName
              });
            }
          }
        }

        // if (vm.strDzzAlldzb) {
        //   for (var e = 0; e < vm.selectedStrDzz.length; e++) {
        //     for (var c = 0; c < vm.dj_PartyBranch.length; c++) {
        //       if (vm.selectedStrDzz[e] === vm.dj_PartyBranch[c].generalbranch) {
        //         vm.AddService.payout += '，' + vm.dj_PartyBranch[c].OrganizationName;
        //         vm.AddService.Relation.push({
        //           cjId: 7,
        //           objId: vm.dj_PartyBranch[c].OrganizationId,
        //           objname: vm.dj_PartyBranch[c].OrganizationName
        //         });
        //       }
        //     }
        //   }
        // }
      } else if (vm.grade === 9) {
        for (var v = 0; v < $scope.xxbmdwdzzson.length; v++) {
          if ($scope.xxbmdwdzzson[v]) {
            vm.AddService.payout += '，' + vm.xxDWDZZSon[v].name;
            vm.AddService.Relation.push({
              cjId: 6,
              objId: vm.xxDWDZZSon[v].id,
              objname: vm.xxDWDZZSon[v].name
            });
          }
        }
      } else if (vm.grade === 10) {
        for (var tt = 0; tt < $scope.xxstrdgwdzzson.length; tt++) {
          if ($scope.xxstrdgwdzzson[tt]) {
            vm.AddService.payout += '，' + vm.xxDGWDZZSon[tt].name;
            vm.AddService.Relation.push({
              cjId: 7,
              objId: vm.xxDGWDZZSon[tt].id,
              objname: vm.xxDGWDZZSon[tt].name
            });
          }
        }
      }
      console.log(vm.AddService.Relation);
      vm.AddService.payout = vm.AddService.payout.slice(1, vm.AddService.payout.length);
      if (vm.AddService.Relation.length === 0) {
        vm.relationFlag = true;
        vm.closeF3 = false;
      } else {
        vm.relationFlag = false;
        vm.closeF3 = true;
      }
      if (vm.content === undefined || vm.content.trim() === '') {
        vm.contentR = true;
        vm.closeF1 = false;
      } else {
        vm.contentR = false;
        vm.closeF1 = true;
      }
      if (vm.title === undefined || vm.title.trim() === '') {
        vm.titleR = true;
        vm.closeF2 = false;
      } else {
        vm.titleR = false;
        vm.closeF2 = true;
      }

      vm.AddService.Relation = JSON.stringify(vm.AddService.Relation);
      if (vm.closeF1 === true &&
        vm.closeF2 === true &&
        vm.closeF3 === true) {
        vm.closeF = true;
      } else {
        vm.closeF = false;
      }
      if (vm.closeF) {
        $uibModalInstance.close(vm.AddService);
      }
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    //日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      // $scope.dt1 = now;
      $scope.dt1 = new Date(); // 开始时间
      $scope.dt2 = new Date(); // 结束时间
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
  }

  //  放大图片
  angular
    .module('task')
    .directive('enlargePic', function () { //enlargePic指令名称，写在需要用到的地方img中即可实现放大图片
      return {
        restrict: 'AE',
        link: function (scope, elem) {
          elem.bind('click', function ($event) {
            var img = $event.srcElement || $event.target;
            angular.element(document.querySelector('.mask'))[0].style.display = 'block';
            angular.element(document.querySelector('.bigPic'))[0].src = img.src;
          });
        }
      };
    })
    .directive('closePic', function () {
      return {
        restrict: 'AE',
        link: function (scope, elem) {
          elem.bind('click', function ($event) {
            angular.element(document.querySelector('.mask'))[0].style.display = 'none';
          });
        }
      };
    });
}());
