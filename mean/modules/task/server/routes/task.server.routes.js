'use strict';

/**
 * Module dependencies
 */
var taskPolicy = require('../policies/task.server.policy'),
  task = require('../controllers/task.server.controller');

module.exports = function (app) {
  // Task collection routes
  app.route('/api/task').all(taskPolicy.isAllowed)
    .get(task.list)
    .post(task.create);
  // Single task routes
  app.route('/api/task/:taskId').all(taskPolicy.isAllowed)
    .get(task.read)
    .put(task.update)
    .delete(task.delete);
  app.route('/api/reply').all(taskPolicy.isAllowed)
    .get(task.getReply);
  app.route('/api/addtask1')
    .post(task.addTask);
  app.route('/api/str').all(taskPolicy.isAllowed)
    .get(task.getStr);
  app.route('/api/bm').all(taskPolicy.isAllowed)
    .get(task.getBm);
  app.route('/api/addRelation').all(taskPolicy.isAllowed)
    .get(task.addRelation);
  app.route('/api/count').all(taskPolicy.isAllowed)
    .get(task.getCount);
  app.route('/api/payoutbm').all(taskPolicy.isAllowed)
    .get(task.getPayputBm);
  app.route('/api/addtaskprogress').all(taskPolicy.isAllowed)
    .post(task.uploadTaskProgress);
  app.route('/api/gettaskprogress').all(taskPolicy.isAllowed)
    .get(task.getTaskProgress);
  // Finish by binding the task middleware
  app.param('taskId', task.taskByID);
};
