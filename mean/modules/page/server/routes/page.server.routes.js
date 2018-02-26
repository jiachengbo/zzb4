'use strict';

/**
 * Module dependencies
 */
var pagePolicy = require('../policies/page.server.policy'),
  page = require('../controllers/page.server.controller');

module.exports = function (app) {
  // Page collection routes
  app.route('/api/page').all(pagePolicy.isAllowed)
    .get(page.list)
    .post(page.create);
  // Single page routes
  app.route('/api/citybasic').get(page.citybasiclist);
  app.route('/api/cityorgset').get(page.cityorgsetlist);
  app.route('/api/memberNum').get(page.memberlist);
  app.route('/api/litterxin').get(page.litterxinlist);
  app.route('/api/partybuildingsb').get(page.getPartyBuildingsb);
  app.route('/api/prowall').get(page.prowalltlist);
  app.route('/api/commparty').get(page.commPartyList);
  app.route('/api/commjob').get(page.commjobList);
  app.route('/api/commthreefive').get(page.commthreefiveList);
  app.route('/api/projectpross').get(page.projectprosslist);
  app.route('/api/partymemberanalyze').get(page.PartyMemberAnalyze);
  app.route('/api/getpartymember').get(page.getPartyMember);
  app.route('/api/getpartyorg').get(page.getPartyOrg);
  app.route('/api/search').get(page.Search);
  app.route('/api/partymapcore').get(page.lists);
  app.route('/api/noticefile').get(page.getNoticeFile);
  app.route('/api/partybuilding').get(page.getPartyBuilding);
  app.route('/api/jcdjuser').get(page.jcdjuser);
  app.route('/api/page/:pageId').all(pagePolicy.isAllowed)
    .get(page.read)
    .put(page.update)
    .delete(page.delete);

  // Finish by binding the page middleware
  app.param('pageId', page.pageByID);
};
