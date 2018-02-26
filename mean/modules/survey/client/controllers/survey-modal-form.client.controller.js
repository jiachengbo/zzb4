(function () {
  'use strict';

  angular
    .module('survey')
    .controller('SurveyModalFormController', SurveyModalFormController);

  SurveyModalFormController.$inject = ['$scope', '$uibModalInstance', 'surveyData', 'method', 'appService', 'baseCodeService'];
  function SurveyModalFormController($scope, $uibModalInstance, surveyData, method, appService, baseCodeService) {
    var vm = this;
    vm.surveyData = surveyData;
    vm.method = method;
    vm.disabled = (method === '查看');
    var dj_PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    var dj_PartyGeneralBranch = baseCodeService.getItems('dj_PartyGeneralBranch');
    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.surveyForm');
        return;
      }
      if (vm.picFile) {
        vm.surveyData.imgFile = vm.picFile;
      }
      if (vm.fileFile) {
        vm.surveyData.textfile = vm.fileFile;
      }
      // if (/*method === '新增'*/true) {
      if (appService.user) {
        vm.surveyData.user_id = appService.user.id;
        vm.surveyData.grade = appService.user.user_grade;
        if (appService.user.user_grade < 4) {
          vm.surveyData.objid = appService.user.user_grade;
        } else if (appService.user.user_grade === 4 || appService.user.user_grade === 5) {
          angular.forEach(dj_PartyOrganization, function (v, k) {
            if (appService.user.JCDJ_User_roleID === v.roleID) {
              vm.surveyData.objid = v.typeID;
            }
          });
        } else if (appService.user.user_grade === 6 || appService.user.user_grade === 7 || appService.user.user_grade === 8) {
          angular.forEach(dj_PartyBranch, function (v, k) {
            if (appService.user.branch === v.OrganizationId) {
              vm.surveyData.objid = v.OrganizationId;
            }
          });
        } else if (appService.user.user_grade === 9 || appService.user.user_grade === 10) {
          angular.forEach(dj_PartyBranch, function (v, k) {
            if (appService.user.branch === v.OrganizationId) {
              vm.surveyData.objid = v.generalbranch || 0;
            }
          });
        }
      }
      // }
      $uibModalInstance.close(vm.surveyData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
