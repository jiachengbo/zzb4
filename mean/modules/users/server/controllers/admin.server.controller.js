'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  dbtools = require(path.resolve('./config/private/dbtools')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

var User = sequelize.model('User');
var Department = sequelize.model('Department');
var Role = sequelize.model('Role');
var WorkPosition = sequelize.model('WorkPosition');

/**
 * Create an workposition
 */
exports.create = function (req, res) {
  var role = req.body.JCDJ_User_roleID;
  role = JSON.parse(role);
  var branch = req.body.branch;
  branch = JSON.parse(branch);
  req.body.displayName = User.genDisplayName(req.body.firstName, req.body.lastName);
  //用户名称全部小写
  req.body.username = req.body.username.toLowerCase();
  req.body.JCDJ_User_roleID = role.UserRoleID;
  req.body.branchSimpleName = branch.simpleName;
  req.body.branch = branch.OrganizationId;
  req.body.user_grade = role.UserGradeID;
  var user = User.build(req.body);
  user.save()
    .then(function () {
      //保存workposition关联
      if (req.body.wps && Array.isArray(req.body.wps)) {
        //增加返回workpositions字段
        console.log(req.body.wps);
        user.set('wps', req.body.wps, {raw: true});
        var workpositions = req.body.wps.map(function (workposition) {
          return WorkPosition.build(workposition);
        });
        return user.setWps(workpositions);
      }
    })
    .then(function () {
      res.json(user);
    })
    .catch(function (err) {
      logger.error('admin user create error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  /*var role = req.body.JCDJ_User_roleID;
   role = JSON.parse(role);
   var branch = req.body.branch;
   branch = JSON.parse(branch);
   req.body.displayName = req.body.firstName + ' ' + req.body.lastName;
   //用户名称全部小写
   req.body.username = req.body.username.toLowerCase();
   req.body.JCDJ_User_roleID = role.UserRoleID;
   req.body.branchSimpleName = branch.simpleName;
   req.body.branch = branch.OrganizationId;
   req.body.user_grade = role.UserGradeID;
   var id = req.body.id;
   var user = req.model;*/

  /*
   // For security purposes only merge these parameters
   user.firstName = req.body.firstName;
   user.lastName = req.body.lastName;
   user.displayName = user.firstName + ' ' + user.lastName;
   */
  /*User.findOne({
   where: {id: id}
   }).then(function (user) {
   if (user.dataValues.department_id === req.body.department_id) {
   getupdata();
   } else if (user.dataValues.department_id !== req.body.department_id) {
   user.dataValues.department_id = req.body.department_id;
   req.body = user.dataValues;
   getupdata();
   }
   });*/
  /*
   // For security purposes only merge these parameters
   user.firstName = req.body.firstName;
   user.lastName = req.body.lastName;
   user.displayName = user.firstName + ' ' + user.lastName;
   */
  // req.body.displayName = req.body.firstName + ' ' + req.body.lastName;
  // model.build 不会将非表字段加入实例，而instance.update会将所有参数加入实例
  // 如果使用了update(req.body),没有使用save,就不需要再调用user.set('wps', req.body.wps, {raw: true})设置新关联内容了
  /*function getupdata() {
   User.update(
   req.body,
   {
   where: {'id': id}
   }
   ).then(function () {
   if (req.body.wps && Array.isArray(req.body.wps)) {
   console.log(req.body.wps);
   var workpositions = req.body.wps.map(function (workposition) {
   return WorkPosition.build(workposition);
   });
   return user.setWps(workpositions);
   }
   }).then(function () {
   res.json(user);
   }).catch(function (err) {
   logger.error('admin user update error:', err);
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });
   }*/
  var role = req.body.JCDJ_User_roleID;
  role = JSON.parse(role);
  var branch = req.body.branch;
  branch = JSON.parse(branch);
  req.body.JCDJ_User_roleID = role.UserRoleID;
  req.body.branchSimpleName = branch.simpleName;
  req.body.branch = branch.OrganizationId;
  req.body.user_grade = role.UserGradeID;
  req.body.displayName = User.genDisplayName(req.body.firstName, req.body.lastName);
  var user = req.model;
//  var id = req.body.id;

  /*User.findOne({
   where: {id: id}
   }).then(function (user) {
   if (user.dataValues.department_id === req.body.department_id) {
   getupdata();
   } else if (user.dataValues.department_id !== req.body.department_id) {
   user.dataValues.department_id = req.body.department_id;
   req.body = user.dataValues;
   getupdata();
   }
   });*/
  //model.build 不会将非表字段加入实例，而instance.update会将所有参数加入实例
  //如果使用了update(req.body),没有使用save,就不需要再调用user.set('wps', req.body.wps, {raw: true})设置新关联内容了
  /// function getupdata(){
  console.time('计时器1');
  console.log(req.body);
  user.update(req.body).then(function () {
    if (req.body.wps && Array.isArray(req.body.wps)) {
      var workpositions = req.body.wps.map(function (workposition) {
        return WorkPosition.build(workposition);
      });
      return user.setWps(workpositions);
    }
  }).then(function () {
    console.timeEnd('计时器1');
    res.json(user);
  }).catch(function (err) {
    logger.error('admin user update error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  // }
//  getupdata();
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.destroy().then(function () {
    //清除和workposition的关联
    return user.setWps([]);
  }).then(function () {
    res.json(user);
  }).catch(function (err) {
    logger.error('admin user delete error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  console.time('计时器');
  var grade = req.user.user_grade;
  var supers = req.user.dj_PartyBranch.super;
  var generalbranch = req.user.dj_PartyBranch.generalbranch;
  var branch = req.user.branch;
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var where = {};
  var where1 = {};
  if (grade === 4) {
    where = {
      user_grade: [4, 6, 9]
    };
    where1 = {
      super: supers
    };
  } else if (grade === 5) {
    where = {
      user_grade: [5, 7, 10]
    };
    where1 = {
      super: supers
    };
  } else if (grade === 6 || grade === 7) {
    where = {
      user_grade: grade
    };
    where1 = {
      OrganizationId: branch
    };
  } else if (grade === 1) {
    where = {};
    where1 = {};
  } else if (grade === 9) {
    where = {
      user_grade: [9, 6]
    };
    where1 = {
      super: supers,
      generalbranch: generalbranch
    };
  } else if (grade === 10) {
    where = {
      user_grade: [10, 7]
    };
    where1 = {
      super: supers,
      generalbranch: generalbranch
    };
  }
  console.log(where1);
  User.findAll({
    where: where,
    attributes: {
      exclude: ['password', 'salt', 'providerData',
        'additionalProvidersData', 'resetPasswordToken', 'resetPasswordExpires']
    },
    include: [
      {
        model: WorkPosition,
        as: 'wps',  //此处别名必须和定义中相同
        through: {
          as: 'wpu', //定义中间表别名
          attributes: []
        },
        attributes: ['id', 'name']
      },
      {
        where: where1,
        model: dj_PartyBranch,
        attributes: ['super', 'generalbranch']
      }
    ],
    order: 'createdAt DESC'
  }).then(function (users) {
    console.timeEnd('计时器');
    res.json(users);
  }).catch(function (err) {
    logger.error('admin user list error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({
    where: {id: id},
    include: [
      {
        model: WorkPosition,
        as: 'wps',
        through: {
          as: 'wpu',
          attributes: []
        },
        attributes: ['id', 'name']
      }
    ],
    attributes: {exclude: ['salt', 'password', 'providerData']}
  }).then(function (user) {
    if (!user) {
      logger.error('admin user userbyid find null error id=', id);
      return next(new Error('Failed to load user ' + id));
    }
    req.model = user;
    next();
  }).catch(function (err) {
    logger.error('admin user userbyid error:', err);
    return next(err);
  });
};
