(function () {
  'use strict';

  angular
    .module('page')
    .controller('MoreTeamMembersController', MoreTeamMembersController);

  MoreTeamMembersController.$inject = ['$scope', '$rootScope', '$log', '$window', 'baseCodeService', '$location', 'menuService', '$stateParams', '$timeout', 'PartyBuildingService', 'PartymapServiceCore', '$filter', 'TeammembersService', 'appService', 'UserMsg', 'PartyBuildingSbService', '$state', 'SurveyService', 'PartyMemberAnalyzeService', 'Timer', 'GetPartyOrgService', 'SearchService', 'GetPartyMemberService'];
  function MoreTeamMembersController($scope, $rootScope, $log, $window, baseCodeService, $location, menuService, $stateParams, $timeout, PartyBuildingService, PartymapServiceCore, $filter, TeammembersService, appService, UserMsg, PartyBuildingSbService, $state, SurveyService, PartyMemberAnalyzeService, Timer, GetPartyOrgService, SearchService, GetPartyMemberService) {
    var vm = this;
    $window.scrollTo(0, 0);
    vm.teammembersData = $stateParams.data;
    console.log(vm.teammembersData);
  }
}());
