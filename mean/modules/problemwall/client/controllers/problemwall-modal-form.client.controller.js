(function () {
  'use strict';

  angular
    .module('problemWall')
    .controller('ProblemWallModalFormController', ProblemWallModalFormController);

  ProblemWallModalFormController.$inject = ['$scope', '$uibModalInstance', 'problemWallData', 'method', 'appService', 'baseCodeService', '$window'];
  function ProblemWallModalFormController($scope, $uibModalInstance, problemWallData, method, appService, baseCodeService, $window) {
    var vm = this;
    vm.problemWallData = problemWallData;
    vm.isCreateUser = problemWallData.isCreateUser;
    if (method === '修改' || method === '查看') {
      vm.problemWall = problemWallData.ProblemWall;
      vm.problemWallData.wtTitle = problemWallData.ProblemWall.wtTitle;
      vm.problemWallData.wtContent = problemWallData.ProblemWall.wtContent;
      vm.problemWallData.hfContent = problemWallData.ProblemWall.hfContent;
      vm.problemWallData.photoPath1 = problemWallData.ProblemWall.photoPath1;
    }

    vm.method = method;
    vm.disabled = (method === '查看');
    vm.yourselfs = [];
    vm.sbs = [];
    vm.xfs = [];
    $scope.sb = [];
    $scope.xf = [];
    // 所选择的要 上报下发 问题的 对象
    vm.sbsChecked = [];
    vm.xfsChecked = [];
    var i;
    var j;
    var k;
    var departy; // super 1-30
    var jd;
    // 要删除的 记录数据
    var delRec = [];
    // var delSbRec = [];
    // var delXfRec = [];
    // vm.sbs.push({name: vm.cvsList[b].name, id: vm.cvsList[b].id});
    var displayName = appService.user.displayName;
    var user_grade = appService.user.user_grade;
    var userRoleID = appService.user.JCDJ_User_roleID;
    var userBranch = appService.user.branch;
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    vm.dj_JCDJ_UserRole = baseCodeService.getItems('dj_JCDJ_UserRole');
    // 设置上报人员数据
    if (user_grade === 1) {
      // 关系表 写自己的记录
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: userRoleID,
        gradeId: 1,
        isCreateUser: '是'
      });

      vm.sbs = [];
      vm.xfs = [];
      //  30个党委党工委
      for (i = 0; i < vm.dj_JCDJ_UserRole.length; i++) {
        if (vm.dj_JCDJ_UserRole[i].UserGradeID === 5 || vm.dj_JCDJ_UserRole[i].UserGradeID === 4) {
          var itemJdDgw = vm.dj_JCDJ_UserRole[i];
          vm.xfs.push({
            xfUserName: itemJdDgw.UserRoleName,
            createUserName: displayName,
            roleId: itemJdDgw.UserRoleID,
            gradeId: vm.dj_JCDJ_UserRole[i].UserGradeID,
            streetID: itemJdDgw.streetID,
            isCreateUser: '否'
          });
        }
      }
    }
    // 各部门党委
    if (user_grade === 4) {
      //  街道党工委
      //  上报 选择列表
      for (i = 0; i < vm.dj_JCDJ_UserRole.length; i++) {
        // console.log(vm.dj_JCDJ_UserRole[i]);
        if (vm.dj_JCDJ_UserRole[i].UserGradeID === 1) {
          vm.item = vm.dj_JCDJ_UserRole[i];
          vm.sbs.push({
            sbUserName: '区委',
            // sbUserName: item.UserRoleName,
            createUserName: displayName,
            roleId: vm.item.UserRoleID,
            gradeId: vm.item.UserGradeID,
            isCreateUser: '否'
          });
        }
        //获取departy 1-30 super
        if (vm.dj_JCDJ_UserRole[i].UserRoleID === userRoleID) {
          departy = vm.dj_JCDJ_UserRole[i].departy;
          //  获取街道id
          jd = vm.dj_JCDJ_UserRole[i].streetID;
        }
      }
      // 关系表 写自己的记录,街道党工委 必须写 streetID
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: userRoleID,
        gradeId: 4,
        streetID: jd,
        isCreateUser: '是'
      });
      //  下发 选择列表- 是否存在 党总支
      for (i = 0; i < vm.dj_PartyGeneralBranch.length; i++) {
        if (vm.dj_PartyGeneralBranch[i].superior === departy) {
          vm.itemGeneralBranch = vm.dj_PartyGeneralBranch[i];
          vm._generalbranch = vm.itemGeneralBranch.branchID;
          // var vm._streetID = vm.itemPartyBranch.streetID;
          vm.xfs.push({
            xfUserName: vm.itemGeneralBranch.simpleName,
            createUserName: displayName,
            roleId: 71,
            gradeId: 9,
            generalBranch: vm._generalbranch,
            streetID: jd,
            isCreateUser: '否'
          });
        }
      }
      //  下发 选择列表- 党支部
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (vm.dj_PartyBranch[i].super === departy) {
          vm.itemPartyBranch = vm.dj_PartyBranch[i];
          vm._generalbranch1 = vm.itemPartyBranch.generalbranch;
          vm._branchId = vm.itemPartyBranch.OrganizationId;
          vm._streetID = vm.itemPartyBranch.streetID;
          vm._communityId = vm.itemPartyBranch.communityId;
          vm._belongGrid = vm.itemPartyBranch.belongGrid;
          if (vm._generalbranch1 === null) {
            //  不是党总支 下的党支部，放入集合
            vm.xfs.push(
              {
                xfUserName: vm.itemPartyBranch.simpleName,
                createUserName: displayName,
                roleId: 67, gradeId: 6, branchId: vm._branchId,
                streetID: vm._streetID, communityId: vm._communityId,
                belongGrid: vm._belongGrid, isCreateUser: '否'
              });
          }
        }
      }

    }
    if (user_grade === 5) {
      //  街道党工委
      //  上报 选择列表
      for (i = 0; i < vm.dj_JCDJ_UserRole.length; i++) {
        if (vm.dj_JCDJ_UserRole[i].UserGradeID === 1) {
          var item = vm.dj_JCDJ_UserRole[i];
          vm.sbs.push({
            sbUserName: '区委',
            // sbUserName: item.UserRoleName,
            createUserName: displayName,
            roleId: item.UserRoleID,
            gradeId: item.UserGradeID,
            isCreateUser: '否'
          });
        }
        //获取departy 1-30 super
        if (vm.dj_JCDJ_UserRole[i].UserRoleID === userRoleID) {
          departy = vm.dj_JCDJ_UserRole[i].departy;
          //  获取街道id
          jd = vm.dj_JCDJ_UserRole[i].streetID;
        }
      }
      // 关系表 写自己的记录,街道党工委 必须写 streetID
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: userRoleID,
        gradeId: 5,
        streetID: jd,
        isCreateUser: '是'
      });
      //  下发 选择列表- 是否存在 党总支
      for (i = 0; i < vm.dj_PartyGeneralBranch.length; i++) {
        if (vm.dj_PartyGeneralBranch[i].superior === departy) {
          var itemGeneralBranch = vm.dj_PartyGeneralBranch[i];
          var _generalbranch = itemGeneralBranch.branchID;
          // var _streetID = itemPartyBranch.streetID;
          vm.xfs.push({
            xfUserName: itemGeneralBranch.simpleName,
            createUserName: displayName,
            roleId: 73,
            gradeId: 10,
            generalBranch: _generalbranch,
            streetID: jd,
            isCreateUser: '否'
          });
        }
      }
      //  下发 选择列表- 党支部
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (vm.dj_PartyBranch[i].super === departy) {
          var itemPartyBranch = vm.dj_PartyBranch[i];
          var _generalbranch1 = itemPartyBranch.generalbranch;
          var _branchId = itemPartyBranch.OrganizationId;
          var _streetID = itemPartyBranch.streetID;
          var _communityId = itemPartyBranch.communityId;
          var _belongGrid = itemPartyBranch.belongGrid;
          if (_generalbranch1 === null) {
            //  不是党总支 下的党支部，放入集合
            vm.xfs.push(
              {
                xfUserName: itemPartyBranch.simpleName,
                createUserName: displayName,
                roleId: 68, gradeId: 7, branchId: _branchId,
                streetID: _streetID, communityId: _communityId,
                belongGrid: _belongGrid, isCreateUser: '否'
              });
          }
        }
      }

    }
    // 党总支 登录，上报-党委 下发-党总支下属党支部
    if (user_grade === 9) {
      vm.sbs = [];
      vm.xfs = [];
      // var vm._jd;
      // var vm._dzz2Id;
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (userBranch === vm.dj_PartyBranch[i].OrganizationId) {
          vm.itemBranch = vm.dj_PartyBranch[i];
          vm._dzz2Id = vm.itemBranch.generalbranch;
          vm._super2 = vm.itemBranch.super; // 1-12
          vm._jd = vm.itemBranch.streetID; // 党总支所在街道id
          // 获取上报列表
          //  上级 是党工委
          for (j = 0; j < vm.dj_JCDJ_UserRole.length; j++) {
            vm.itemDgw2 = vm.dj_JCDJ_UserRole[j];
            if (vm.itemDgw2.departy === vm._super2) {
              vm.sbs.push({
                sbUserName: vm.itemDgw2.UserRoleName,
                createUserName: displayName,
                roleId: vm.itemDgw2.UserRoleID,
                gradeId: 4,
                streetID: vm._jd,
                isCreateUser: '否'
              });
            }
          }
          // 获取党支部列表
          for (k = 0; k < vm.dj_PartyBranch.length; k++) {
            vm._dzb2 = vm.dj_PartyBranch[k];
            vm._dzb2generBranch = vm._dzb2.generalbranch;
            vm._dzb2branchId = vm._dzb2.OrganizationId;
            vm._dzb2streetID = vm._dzb2.streetID;
            vm._dzb2communityId = vm._dzb2.communityId;
            vm._dzb2belongGrid = vm._dzb2.belongGrid;
            if (vm._dzz2Id === vm._dzb2generBranch) {
              //  党总支下党支部，放入集合
              vm.xfs.push(
                {
                  xfUserName: vm._dzb2.simpleName,
                  createUserName: displayName,
                  roleId: 67, gradeId: 6, branchId: vm._dzb2branchId,
                  streetID: vm._dzb2streetID, communityId: vm._dzb2communityId,
                  belongGrid: vm._dzb2belongGrid, isCreateUser: '否'
                });
            }
          }
        }
      }
      // 关系表 写自己的记录,街道党工委 必须写 streetID，
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: 71,
        gradeId: 9,
        streetID: vm._jd,
        generalBranch: vm._dzz2Id,
        isCreateUser: '是'
      });
    }
    // 党总支 登录，上报-党工委 下发-党总支下属党支部
    if (user_grade === 10) {
      vm.sbs = [];
      vm.xfs = [];
      var _jd;
      var _dzz2Id;
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (userBranch === vm.dj_PartyBranch[i].OrganizationId) {
          //
          var itemBranch = vm.dj_PartyBranch[i];
          _dzz2Id = itemBranch.generalbranch;
          var _super2 = itemBranch.super; // 1-12
          _jd = itemBranch.streetID; // 党总支所在街道id
          // 获取上报列表
          //  上级 是党工委
          for (j = 0; j < vm.dj_JCDJ_UserRole.length; j++) {
            var itemDgw2 = vm.dj_JCDJ_UserRole[j];
            if (itemDgw2.departy === _super2) {
              vm.sbs.push({
                sbUserName: itemDgw2.UserRoleName,
                createUserName: displayName,
                roleId: itemDgw2.UserRoleID,
                gradeId: 5,
                streetID: _jd,
                isCreateUser: '否'
              });
            }
          }
          // 获取党支部列表
          for (k = 0; k < vm.dj_PartyBranch.length; k++) {
            var _dzb2 = vm.dj_PartyBranch[k];
            var _dzb2generBranch = _dzb2.generalbranch;
            var _dzb2branchId = _dzb2.OrganizationId;
            var _dzb2streetID = _dzb2.streetID;
            var _dzb2communityId = _dzb2.communityId;
            var _dzb2belongGrid = _dzb2.belongGrid;
            if (_dzz2Id === _dzb2generBranch) {
              //  党总支下党支部，放入集合
              vm.xfs.push(
                {
                  xfUserName: _dzb2.simpleName,
                  createUserName: displayName,
                  roleId: 68, gradeId: 7, branchId: _dzb2branchId,
                  streetID: _dzb2streetID, communityId: _dzb2communityId,
                  belongGrid: _dzb2belongGrid, isCreateUser: '否'
                });
            }
          }
        }
      }
      // 关系表 写自己的记录,街道党工委 必须写 streetID，
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: 73,
        gradeId: 10,
        streetID: _jd,
        generalBranch: _dzz2Id,
        isCreateUser: '是'
      });
    }
    // 党支部 登录，判断有无 党总支，有：上报-党总支 无：上报-党委
    // console.log(user_grade);
    if (user_grade === 6) {
      vm.sbs = [];
      // var vm._jd7;
      // var vm._dzz;
      // var vm._sq7;
      // var vm._wg7;
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (userBranch === vm.dj_PartyBranch[i].OrganizationId) {
          vm.dzb = vm.dj_PartyBranch[i];
          if (!vm.dzb.streetID || !vm.dzb.communityId || !vm.dzb.BelongGrid) {
            $window.alert('请先完善党支部表中街道、社区、网格相关信息, 否则新增失败！');
          }
          vm._dzz = vm.dzb.generalbranch;
          vm._jd7 = vm.dzb.streetID; //党总支所在 街道id
          vm._sq7 = vm.dzb.communityId; //党总支所在 社区id
          vm._wg7 = vm.dzb.BelongGrid; //党总支所在 网格id
          vm._super = vm.dzb.super; // 1-12
          if (vm._dzz !== null) {

            //  存在上级党总支
            for (j = 0; j < vm.dj_PartyGeneralBranch.length; j++) {
              vm._dzzItem = vm.dj_PartyGeneralBranch[j];
              if (vm._dzzItem.branchID === vm._dzz) {
                vm.sbs.push({
                  sbUserName: vm._dzzItem.simpleName,
                  createUserName: displayName,
                  roleId: 71,
                  gradeId: 9,
                  generalBranch: vm._dzz,
                  streetID: vm._jd7,
                  isCreateUser: '否'
                });
              }
            }
          } else {
            //  上级 是党工委

            for (j = 0; j < vm.dj_JCDJ_UserRole.length; j++) {
              vm.itemDgw = vm.dj_JCDJ_UserRole[j];
              if (vm.itemDgw.departy === vm._super) {
                vm.sbs.push({
                  sbUserName: vm.itemDgw.UserRoleName,
                  createUserName: displayName,
                  roleId: vm.itemDgw.UserRoleID,
                  gradeId: 4,
                  streetID: vm._jd7,
                  isCreateUser: '否'
                });
              }
            }
          }
        }
      }
      // 关系表 写自己的记录,部门党委 必须写 streetID，
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: 67,
        gradeId: 6,
        branchId: userBranch,
        streetID: vm._jd7,
        communityId: vm._sq7,
        belongGrid: vm._wg7,
        isCreateUser: '是'
      });
    }
    // 党支部 登录，判断有无 党总支，有：上报-党总支 无：上报-党工委
    if (user_grade === 7) {
      vm.sbs = [];
      var _jd7;
      var _dzz;
      var _sq7;
      var _wg7;
      for (i = 0; i < vm.dj_PartyBranch.length; i++) {
        if (userBranch === vm.dj_PartyBranch[i].OrganizationId) {
          var dzb = vm.dj_PartyBranch[i];
          if (!dzb.streetID || !dzb.communityId || !dzb.BelongGrid) {
            $window.alert('请先完善党支部表中街道、社区、网格相关信息, 否则新增失败！');
          }
          _dzz = dzb.generalbranch;
          _jd7 = dzb.streetID; //党总支所在 街道id
          _sq7 = dzb.communityId; //党总支所在 社区id
          _wg7 = dzb.BelongGrid; //党总支所在 网格id
          var _super = dzb.super; // 1-12
          if (_dzz !== null) {
            //  存在上级党总支
            for (j = 0; j < vm.dj_PartyGeneralBranch.length; j++) {
              var _dzzItem = vm.dj_PartyGeneralBranch[j];
              if (_dzzItem.branchID === _dzz) {
                vm.sbs.push({
                  sbUserName: _dzzItem.simpleName,
                  createUserName: displayName,
                  roleId: 73,
                  gradeId: 10,
                  generalBranch: _dzz,
                  streetID: _jd7,
                  isCreateUser: '否'
                });
              }
            }
          } else {
            //  上级 是党工委

            for (j = 0; j < vm.dj_JCDJ_UserRole.length; j++) {
              var itemDgw = vm.dj_JCDJ_UserRole[j];
              if (itemDgw.departy === _super) {
                vm.sbs.push({
                  sbUserName: itemDgw.UserRoleName,
                  createUserName: displayName,
                  roleId: itemDgw.UserRoleID,
                  gradeId: 5,
                  streetID: _jd7,
                  isCreateUser: '否'
                });
              }
            }
          }
        }
      }
      // 关系表 写自己的记录,街道党工委 必须写 streetID，
      vm.yourselfs.push({
        createUserName: displayName,
        roleId: 68,
        gradeId: 7,
        branchId: userBranch,
        streetID: _jd7,
        communityId: _sq7,
        belongGrid: _wg7,
        isCreateUser: '是'
      });
    }

    // 根据是否上报反显
    for (var m = 0; m < vm.sbs.length; m++) {
      $scope.sb.push(false);
    }
    for (var n = 0; n < vm.xfs.length; n++) {
      $scope.xf.push(false);
    }
    //
    var sbstr = vm.problemWallData.sbs;
    var xfstr = vm.problemWallData.xfs;
    var sbsArr = [];
    var xfsArr = [];
    if (sbstr !== '' && sbstr !== undefined && sbstr !== null) {
      sbstr = sbstr.substring(0, sbstr.length - 1);
      sbsArr = sbstr.split(',');
      angular.forEach(sbsArr, function (v, k) {
        $scope.sb[v] = true;
      });
    } else {
      vm.problemWallData.sbs = '';
    }
    if (xfstr !== '' && xfstr !== undefined && xfstr !== null) {
      xfstr = xfstr.substring(0, xfstr.length - 1);
      xfsArr = xfstr.split(',');
      angular.forEach(xfsArr, function (v, k) {
        $scope.xf[v] = true;
      });
    } else {
      vm.problemWallData.xfs = '';
    }
    // 原有所选择的对象  [index]
    // console.info('old sbsArr', sbsArr);
    // console.info('old xfsArr', xfsArr);
    // 根据层级关系，显示回复 权限，可输入操作回复-问题上级组织 是自己的；自己只能查看 回复内容
    function canEditShow(ifcan) {
      vm.editTitle = ifcan;
      vm.editContent = ifcan;
      vm.picPhoto1 = ifcan;
      vm.picPhoto2 = ifcan;
    }

    vm.showissb = false;
// 是否上报
    var cvs_issb = [
      {id: 0, name: '否'},
      {id: 1, name: '是'}
    ];

    $scope.cvs_issb = cvs_issb;
    if (method === '新增') {
      vm.ishowHf = false;
      if (appService.user) {
        angular.forEach(vm.dj_PartyBranch, function (v, k) {
          if (v.OrganizationId === appService.user.branch) {
            vm.problemWallData.gridId = v.BelongGrid;
          }
        });
      }
      canEditShow(false);
      // 新增不显示 ，因为 是否上报 是 问题 再次上报的
      vm.showissb = false;
    } else {
      vm.ishowHf = true;
      // 根据 问题数据级别 与 用户级别对比，决定 是否可编辑
      if (user_grade === vm.problemWallData.gradeId) {
        // 自己创建的问题，不显示 再次 上报
        vm.editHf = true;
        canEditShow(false);
        vm.showissb = false;
      } else {
        vm.editHf = false;
        canEditShow(true);
        //可输入回复内容，表示这条数据 来自下级上报
        vm.showissb = true;
      }
      //修改 显示 issb
      // vm.showissb = true;
      vm.problemWallData.issb = 0;
    }

    //在这里处理要进行的操作
    vm.ok = function (isValid) {

      vm.sbsChecked = [];
      vm.xfsChecked = [];
      vm.problemWallData.sbs = '';
      vm.problemWallData.xfs = '';
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.problemWallForm');
        return;
      }
      // 照片
      if (vm.picFile1) {
        vm.problemWallData.photoPath1 = vm.picFile1;
      }
      // 遍历 【上报】所选的角色
      angular.forEach($scope.sb, function (v, k) {
        if (v) {
          vm.problemWallData.sbs += k + ',';
          // new index vs old index
          var rindex = sbsArr.indexOf(k + '');
          if (rindex === -1) {
            vm.sbsChecked.push(vm.sbs[k]);
          }
        } else {
          //  没选择的 index 中，保存 之前选择过的index
          var _rindex = sbsArr.indexOf(k + '');
          if (_rindex !== -1) {
            // 需要删除的记录
            vm.problemWallData._sbs += k + ',';
            // delSbRec.push(vm.sbs[k]);
            delRec.push(vm.sbs[k]);
          }
        }
      });
      // 遍历 【下发】 所选的角色
      angular.forEach($scope.xf, function (v, k) {
        if (v) {
          vm.problemWallData.xfs += k + ',';
          // new index vs old index
          var rindex2 = xfsArr.indexOf(k + '');
          if (rindex2 === -1) {
            vm.xfsChecked.push(vm.xfs[k]);
          }
        } else {
          //  没选择的 index 中，保存 之前选择过的index
          var _rindex2 = xfsArr.indexOf(k + '');
          if (_rindex2 !== -1) {
            // 需要删除的记录,将删除的记录 保存[待删除上报下发条]
            vm.problemWallData._xfs += k + ',';
            //
            // delXfRec.push(vm.xfs[k]);
            delRec.push(vm.xfs[k]);

          }
        }
      });
      // 插入 的新上报下发index数据
      if (method === '修改') {
        vm.problemWallData.problemWallRecData = vm.sbsChecked.concat(vm.xfsChecked);
      } else if (method === '新增') {
        vm.problemWallData.problemWallRecData = vm.yourselfs.concat(vm.sbsChecked, vm.xfsChecked);
      }
      // 回复新增
      if (vm.problemWallData.hfContent === null || vm.problemWallData.hfContent === '' || vm.problemWallData.hfContent === undefined) {
        vm.problemWallData.hfContent = '';
      }
      if (vm.hfContent === undefined || vm.hfContent === '' || vm.hfContent === null) {
        vm.problemWallData.hfContent += '';
      } else {
        vm.problemWallData.hfContent += displayName + '\t' + new Date().toLocaleString() + '\n 回复内容：' + vm.hfContent + '\n';
      }
      vm.problemWallData.delRec = delRec;
      vm.problemWallData.sbsChecked = vm.sbsChecked;
      vm.problemWallData.xfsChecked = vm.xfsChecked;
      $uibModalInstance.close(vm.problemWallData);
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
