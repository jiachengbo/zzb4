(function () {
  'use strict';

  angular
    .module('muser')
    .controller('MUserEditController', MUserEditController);

  MUserEditController.$inject = ['$scope', 'Notification', '$log', '$window', '$state', '$stateParams',
    'treeService', 'WorkPositionService', 'baseCodeService', '$timeout', 'jcdjuserService', 'appService'];
  function MUserEditController($scope, Notification, $log, $window, $state, $stateParams,
                               treeService, WorkPositionService, baseCodeService, $timeout, jcdjuserService, appService) {
    var vm = this;
    //当前行数据
    var dj_PartyBranchsss = baseCodeService.getItems('dj_PartyBranch');
    var branchs = appService.user.branch;
    var grades = appService.user.user_grade;
    var supersss;
    angular.forEach(dj_PartyBranchsss, function (v, k) {
      if (branchs === v.OrganizationId) {
        if (grades > 3 && grades < 11) {
          supersss = v.super;
        }
      }
    });
    vm.jobss = [
      {name: '超级管理员', value: 1},
      {name: '管理员', value: 0}
    ];
    vm.isupdate = $window.parseInt($stateParams.isupdate);
    vm.muser_row = $stateParams.muser_row;
    //部门、岗位表所有数据
    vm.department_rows = $stateParams.department_rows;
    vm.workposition_rows = $stateParams.workposition_rows;
    vm.select_workpostion = $stateParams.value.value;
    //所选树结构数据
    if ($stateParams.value.value.parentId) {
      vm.workpositionname = $stateParams.value.value;
      vm.workposition_data = $stateParams.value.value;
    } else {
      if ($stateParams.value.parent) {
        vm.workpositionname = $stateParams.value.parent.value;
        vm.workposition_data = $stateParams.value.parent.value;
      } else {
        vm.workpositionname = $stateParams.value.value;
        vm.workposition_data = $stateParams.value.value;
      }
    }
    //设置用户的部门名称
    // var objs = {id: 6, name: "qnlparty", displayName: "青年路街道党工委", descText: "青年路街道党工委", parentId: 5};
    //进行的操作
    vm.muser_rowop = $stateParams.muser_rowop;
    //不能修改
    vm.disabled = vm.muser_rowop.disabled;
    if (vm.workpositionname) {
      if (vm.isupdate === 0 && !vm.disabled) {
        var bumenname = vm.workpositionname.descText;
        vm.muser_row.firstName = bumenname;
        vm.muser_row.roles = 'user,admin';
      }
    }
    vm.changedjobrole = function (role) {
      if (role === 1) {
        vm.muser_row.roles = 'user,admin';
      } else {
        vm.muser_row.roles = 'user';
      }
    };
    //设置cvm，用于回传本控制
    vm.muser_rowop.cvm = vm;

    vm.treeOptions = {
      dirSelectable: true,
      allowDeselect: false,
      //是否是文件,显示不同图标
      isLeaf: function (node) {
        return vm.isWorkPositionNode(node);
      }
    };

    vm.treeData = {};
    vm.expanded = [];
    vm.selected = null;

    vm.isWorkPositionNode = function (node) {
      return node.value instanceof WorkPositionService;
    };

    //列表显示的内容
    vm.treeTitle = function (node) {
      return node.value.displayName ? node.value.displayName : node.value.name;
    };

    //显示选择行
    vm.showSelected = function (sel) {
      if (sel) {
        //展开父
        if (vm.expanded.indexOf(sel.parent) === -1) {
          if (sel.parent) {
            vm.expanded.push(sel.parent);
          } else {
            vm.expanded.push(sel);
          }
        }
        vm.selected = sel;
      }
    };

    vm.changed = function (node) {
      var workposition = {id: node.value.id};
      //删除当前数据保存的指定workposition.id的记录
      for (var index = 0; index < vm.muser_row.wps.length; index++) {
        if (vm.muser_row.wps[index].id === workposition.id) {
          vm.muser_row.wps.splice(index, 1);
          break;
        }
      }

      if (node.value.selected) {
        vm.muser_row.wps.push(workposition);
      }
    };

    var workpositions = vm.workposition_rows.map(function (ele) {
      ele.selected = vm.muser_row.wps.some(function (workposition) {
        return ele.id === workposition.id;
      });
      return ele;
    });
    vm.serviceTree = treeService.getTreeData(vm.department_rows, 'id', 'parentId', 'children',
      vm.workposition_rows, 'department_id');
    vm.treeData = vm.serviceTree.getNodes();
    vm.showSelected(vm.treeData[0]);
    vm.show = false;
    function get(obj) {
      if (obj.value.parentId !== 44 && obj.value.parentId !== 5) {
        obj = obj.parent;
        get(obj);
      } else {
        vm.workposition_data = obj.value;
        vm.shuzuiii = obj.value.parentId;
      }
    }

    $scope.partyList11 = baseCodeService.getItems('dj_JCDJ_UserRole');
    if (vm.workposition_data) {
      vm.partyList11 = [];
      if (vm.workposition_data.parentId === 0 || vm.workposition_data.parentId) {
        var parentIds = vm.workposition_data.parentId;
        var descText;
        if ($stateParams.value.value.descText) {
          descText = vm.workposition_data.descText;
        } else {
          descText = $stateParams.value.value.firstName;
        }
        var namedagn = descText.slice(-3);
        if (!descText.match('党支部')) {
          vm.zhisname = descText.slice(-2);
        }
        var zhibuparent;
        if (namedagn === '党支部' || namedagn === '总支部' || vm.zhisname === '支部') {
          if (parentIds !== 0 && parentIds !== 1) {
            get($stateParams.value);
          }
          zhibuparent = vm.shuzuiii;
          namedagn = '党支部';
        } else if (namedagn === '党总支') {
          if (parentIds !== 0 && parentIds !== 1) {
            get($stateParams.value);
          }
          zhibuparent = vm.shuzuiii;
        }
        //console.log(namedagn);
        angular.forEach($scope.partyList11, function (v, k) {
          if (v.UserGradeID === 1 && parentIds === 0) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 2 && parentIds === 1 && descText === '党委') {
            console.log(v.UserGradeID, parentIds);
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 3 && parentIds === 1 && descText === '党工委') {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 4 && v.UserRoleName.match(descText) && parentIds === 44) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 5 && v.UserRoleName.match(descText) && parentIds === 5) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 6 && v.UserRoleName.match(namedagn) && zhibuparent === 44) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 7 && v.UserRoleName.match(namedagn) && zhibuparent === 5) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 9 && v.UserRoleName.match(namedagn) && zhibuparent === 44) {
            vm.partyList11.push(v);
          } else if (v.UserGradeID === 10 && v.UserRoleName.match(namedagn) && zhibuparent === 5) {
            vm.partyList11.push(v);
          }
        });
      }
    }
    vm.partyList12 = baseCodeService.getItems('dj_PartyOrganization');
    vm.dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    vm.dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    vm.partyzhibu = [];
    vm.disableds = false;
    vm.userjobs = false;
    vm.changedrole = function (num) {
      num = JSON.parse(num);
      vm.nums = num;
      if (num.UserGradeID === 1) {
        vm.userjobs = true;
      } else {
        vm.userjobs = false;
      }
      vm.partyzhibu = [];
      vm.partybranch = [];
      if (num.UserGradeID === 4 || num.UserGradeID === 5) {
        vm.show = false;
        vm.jiedao = false;
        angular.forEach(vm.dj_PartyBranch, function (value, key) {
          if (value.super === num.departy) {
            this.push(value);
          }
        }, vm.partybranch);
      } else {
        vm.show = true;
        vm.jiedao = true;
      }
      if (num.UserGradeID === 3 || num.UserGradeID === 2 || num.UserGradeID === 6 || num.UserGradeID === 7 || num.UserGradeID === 9 || num.UserGradeID === 10) {
        vm.partybranch = [];
        vm.disableds = true;
        if (num.UserGradeID === 6 || num.UserGradeID === 2 || num.UserGradeID === 9) {
          vm.muser_row.party = '1';

        } else {
          vm.muser_row.party = '2';
        }
        var descTexts = vm.workposition_data.descText;

        var namedagns;
        if (vm.muser_row.party === '2') {
          namedagns = descTexts.slice(0, -3);
        } else {
          namedagns = descTexts.slice(0, -2);
        }
        if (num.UserGradeID === 9 || num.UserGradeID === 10) {
          descTexts = vm.workpositionname.descText;
          namedagns = descTexts.slice(0, -3);
        }
        if (num.UserGradeID !== 9 && num.UserGradeID !== 10) {
          vm.jiedao = true;
          vm.zongzhi = false;
          /*console.log(namedagns);
           console.log(vm.muser_row);*/
          angular.forEach(vm.partyList12, function (value, key) {
            if (value.comType === $window.parseInt(vm.muser_row.party) && value.typeName.match(namedagns)) {
              this.push(value);
            }
          }, vm.partyzhibu);
        } else {
          vm.jiedao = false;
          vm.zongzhi = true;
          console.log(vm.muser_row, namedagns);
          angular.forEach(vm.dj_PartyGeneralBranch, function (value, key) {
            if (value.mold === $window.parseInt(vm.muser_row.party) && value.simpleName.match(namedagns)) {
              this.push(value);
            }
          }, vm.partyzhibu);
        }
      } else {
        vm.disableds = false;
        vm.muser_row.party = '';
      }
    };
    vm.changedparty = function (num) {
      num = JSON.parse(num);
      vm.partyzhibu = [];
      vm.partybranch = [];
      angular.forEach(vm.partyList12, function (value, key) {
        if (value.comType === num) {
          this.push(value);
        }
      }, vm.partyzhibu);
    };
    vm.changedstreet = function (num) {
      if (num) {
        console.log(num);
        num = JSON.parse(num);
        vm.partybranch = [];
        if (angular.isObject(num)) {
          console.log(num);
          angular.forEach(vm.dj_PartyBranch, function (value, key) {
            if (value.generalbranch === num.branchID && value.super === num.superior) {
              this.push(value);
            }
          }, vm.partybranch);
        } else {
          console.log(num, $stateParams.value.value);
          if ($stateParams.value.value.parentId === 0 || $stateParams.value.value.parentId === 1 || $stateParams.value.value.JCDJ_User_roleID === 25) {
            console.log(num);
            angular.forEach(vm.dj_PartyBranch, function (value, key) {
              if (value.super === num) {
                this.push(value);
              }
            }, vm.partybranch);
          }
          if ($stateParams.value.parent) {
            if ($stateParams.value.parent.value.parentId === 5 || $stateParams.value.parent.value.parentId === 44) {
              angular.forEach(vm.dj_PartyBranch, function (value, key) {
                if (value.super === num) {
                  this.push(value);
                }
              }, vm.partybranch);
            } else {
              angular.forEach(vm.dj_PartyBranch, function (value, key) {
                if (vm.select_workpostion.descText && vm.select_workpostion.user_grade > 4 || vm.select_workpostion.descText && !vm.select_workpostion.user_grade) {
                  var nums;
                  if (vm.zhisname) {
                    nums = 2;
                  } else {
                    nums = 3;
                  }
                  console.log(nums);
                  if (value.simpleName.match(vm.select_workpostion.descText.slice(0, -nums))) {
                    if (supersss) {
                      if (supersss === value.super) {
                        this.push(value);
                      }
                    } else {
                      this.push(value);
                    }
                  }
                } else if (vm.select_workpostion.branch && vm.select_workpostion.user_grade > 4) {
                  if (value.OrganizationId === vm.select_workpostion.branch) {
                    this.push(value);
                  }
                } else if (vm.select_workpostion.user_grade < 4) {
                  if (value.super === num) {
                    this.push(value);
                  }
                }
              }, vm.partybranch);
            }
          }

        }
      }
    };
    vm.idcard = function (num) {
      if (num && vm.isupdate === 0) {
        jcdjuserService.query({IDNumber: num}).$promise.then(function (data) {
          if (data.length > 0) {
            vm.muser_rowop.cvm.yanzhen = true;
            vm.idcar = true;
          } else {
            vm.muser_rowop.cvm.yanzhen = false;
            vm.idcar = false;
          }
        });
      }
    };
  }
}());
