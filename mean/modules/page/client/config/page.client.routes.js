(function () {
  'use strict';

  angular
    .module('page.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('page', {
        abstract: true,
        url: '/page',
        template: '<ui-view/>'
      })
      .state('page.curd', {
        url: '/curd',
        templateUrl: '/modules/page/client/views/page-curdtable.client.view.html',
        controller: 'PageCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Page CURD Table'
        }
      })
      .state('page.basicmsg', {
        url: '/basicmsg',
        templateUrl: '/modules/page/client/views/basicmsg.client.view.html',
        controller: 'PageBasicMsgController',
        controllerAs: 'vm',
        data: {
          pageTitle: '基础信息管理'
        }
      })
      .state('page.basicmsg-dangwei', {
        url: '/basicmsg-dangwei',
        templateUrl: '/modules/page/client/views/basicmsg-dangwei.client.view.html',
        controller: 'PageBasicMsgDwController',
        controllerAs: 'vm',
        data: {
          pageTitle: '基础信息管理(党委)'
        }
      })
      .state('page.basicmsg-danggongwei', {
        url: '/basicmsg-danggongwei',
        templateUrl: '/modules/page/client/views/basicmsg-danggongwei.client.view.html',
        controller: 'PageBasicMsgDgwController',
        controllerAs: 'vm',
        data: {
          pageTitle: '基础信息管理(党工委)'
        }
      })
      .state('page.basicmsg-org', {
        url: '/basicmsg-org',
        templateUrl: '/modules/page/client/views/basicmsg-org.client.view.html',
        controller: 'PageBasicMsgOrgController',
        controllerAs: 'vm',
        params: {
          id: 0
        },
        data: {
          pageTitle: '党（工）委点进去'
        }
      })
      .state('page.basicmsg-branch', {
        url: '/basicmsg-branch',
        templateUrl: '/modules/page/client/views/basicmsg-branch.client.view.html',
        controller: 'PageBasicMsgBranchController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党支部点进去'
        }
      })
      .state('page.basicmsg-branch2', {
        url: '/basicmsg-branch2',
        templateUrl: '/modules/page/client/views/basicmsg-branch2.client.view.html',
        controller: 'PageBasicMsgBranch2Controller',
        controllerAs: 'vm',
        data: {
          pageTitle: '党总支里面的党支部点进去'
        }
      })
      .state('partydynamic', {
        url: '/partydynamic',
        templateUrl: '/modules/page/client/views/partydynamic.client.view.html',
        controller: 'partydynamicController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党建动态详情页'
        },
        params: {
          data: 0
        }
      })
      .state('threehuik', {
        url: '/threehuik',
        templateUrl: '/modules/page/client/views/threehuiyika.client.view.html',
        controller: 'threeHYKController',
        controllerAs: 'vm',
        data: {
          pageTitle: '三会一课详情页'
        },
        params: {
          data: 0
        }
      })
      .state('firstsj', {
        url: '/firstsj',
        templateUrl: '/modules/page/client/views/firstshuju.client.view.html',
        controller: 'firstSJController',
        controllerAs: 'vm',
        data: {
          pageTitle: '第一书记详情页'
        },
        params: {
          data: 0
        }
      })
      .state('page.citybasicparty', {
        url: '/citybasicparty',
        templateUrl: '/modules/page/client/views/citybasicparty.client.view.html',
        controller: 'PageCityBasicPartyController',
        controllerAs: 'vm',
        data: {
          pageTitle: '城市基层党建（区级）'
        }
      })
      .state('page.citybasicpartydgw', {
        url: '/citybasicpartydgw',
        templateUrl: '/modules/page/client/views/citybasicpartydgw.client.view.html',
        controller: 'PageCityBasicdgwController',
        controllerAs: 'vm',
        data: {
          pageTitle: '城市基层党建（党工委）'
        }
      })
      .state('dgwordw', {
        url: '/dgwordw',
        templateUrl: '/modules/page/client/views/citybasicparty-dwanddgw.client.view.html',
        controller: 'DgworDwController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党委党工委其他'
        }
      })
      .state('page.citybasicparty-str', {
        url: '/citybasicparty-str',
        templateUrl: '/modules/page/client/views/citybasicparty-str.client.view.html',
        controller: 'PageCityBasicPartyStrController',
        controllerAs: 'vm',
        data: {
          pageTitle: '城市基层党建（街道）'
        }
      })
      .state('page.citybasicparty-comm', {
        url: '/citybasicparty-comm',
        templateUrl: '/modules/page/client/views/citybasicparty-comm.client.view.html',
        controller: 'PageCityBasicPartyCommController',
        controllerAs: 'vm',
        data: {
          pageTitle: '城市基层党建（社区）'
        }
      })
      .state('page.citybasicparty-other', {
        url: '/citybasicparty-other',
        templateUrl: '/modules/page/client/views/citybasicparty-other.client.view.html',
        controller: 'PageCityBasicPartyOtherController',
        controllerAs: 'vm',
        data: {
          pageTitle: '城市基层党建（其他组织）'
        }
      })
      .state('page.edu', {
        url: '/edu',
        templateUrl: '/modules/page/client/views/edu.client.view.html',
        controller: 'EduController',
        controllerAs: 'vm',
        data: {
          pageTitle: '宣传教育'
        }
      })
      .state('weixindetail', {
        url: '/weixindetail',
        templateUrl: '/modules/page/client/views/pagedetali.client.view.html',
        controller: 'DetaliController',
        controllerAs: 'vm',
        data: {
          pageTitle: '微心愿详情页'
        },
        params: {
          data: 0
        }
      })
      .state('gongjiandetail', {
        url: '/gongjiandetail',
        templateUrl: '/modules/page/client/views/gongzhugjdetali.client.view.html',
        controller: 'GJDetaliController',
        controllerAs: 'vm',
        data: {
          pageTitle: '共驻共建详情页'
        },
        params: {
          data: 0
        }
      })
      .state('wentidetail', {
        url: '/wentidetail',
        templateUrl: '/modules/page/client/views/wentidetali.client.view.html',
        controller: 'wentiDetaliController',
        controllerAs: 'vm',
        data: {
          pageTitle: '问题墙详情页'
        },
        params: {
          data: 0
        }
      })
      .state('projectdetail', {
        url: '/projectdetail',
        templateUrl: '/modules/page/client/views/projectdetali.client.view.html',
        controller: 'projectDetaliController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党建项目详情页'
        },
        params: {
          data: 0
        }
      })
      .state('page.org-set-details', {
        url: '/org-set-details',
        templateUrl: '/modules/page/client/views/org-set-details.client.view.html',
        controller: 'OrgSetDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: '组织设置详情页'
        }
      })
      .state('page.org-set-details-details', {
        url: '/org-set-details-details',
        templateUrl: '/modules/page/client/views/org-set-details-details.client.view.html',
        controller: 'OrgSetDetailsDetailsController',
        controllerAs: 'vm',
        data: {
          pageTitle: '组织设置详情详情页'
        },
        params: {
          data: 0
        }
      })
      .state('page.gridperson', {
        url: '/gridperson',
        templateUrl: '/modules/page/client/views/gridperson.client.view.html',
        controller: 'GridPersonController',
        controllerAs: 'vm',
        data: {
          pageTitle: '网格人员'
        },
        params: {
          data: 0
        }
      })
      .state('wentixq', {
        url: '/wentixq',
        templateUrl: '/modules/page/client/views/wentiXQ.client.view.html',
        controller: 'wentiXQController',
        controllerAs: 'vm',
        data: {
          pageTitle: '问题列表'
        },
        params: {
          data: 0
        }
      })
      .state('page.moreteammembers', {
        url: '/moreteammembers',
        templateUrl: '/modules/page/client/views/moreteammembers.client.view.html',
        controller: 'MoreTeamMembersController',
        controllerAs: 'vm',
        data: {
          pageTitle: '更多班子成员'
        },
        params: {
          data: 0
        }
      })
      .state('page.partyprojectlist', {
        url: '/partyprojectlist',
        templateUrl: '/modules/page/client/views/partyprojectlist.client.view.html',
        controller: 'PartyProjectListController',
        controllerAs: 'vm',
        data: {
          pageTitle: '党建项目list'
        }
      })
      .state('content', {
        url: '/content',
        templateUrl: '/modules/page/client/views/content.html',
        controller: 'contentController',
        controllerAs: 'vm',
        data: {
          pageTitle: '内容详情页'
        },
        params: {
          data: null
        }
      })
      .state('weixinyuanlist', {
        url: '/weixinyuanlist',
        templateUrl: '/modules/page/client/views/weixinyuanlist.client.view.html',
        controller: 'weixinYLController',
        controllerAs: 'vm',
        data: {
          pageTitle: '微心愿list'
        },
        params: {
          data: 0
        }
      });
  }
}());
