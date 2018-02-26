'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an dj_PartyBranch
 */
exports.create = function (req, res) {
  var dj_partyBranch = sequelize.model('dj_PartyBranch');
  var dj_PartyBranch = dj_partyBranch.build(req.body);
  dj_PartyBranch.createDate = new Date();
  dj_PartyBranch.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return dj_PartyBranch.reload()
      .then(function () {
        res.json(dj_PartyBranch);
      });
  }).catch(function (err) {
    logger.error('dj_PartyBranch create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current dj_PartyBranch
 */
exports.read = function (req, res) {
  var dj_PartyBranch = req.model ? req.model.toJSON() : {};

  //dj_PartyBranch.isCurrentUserOwner = !!(req.user && dj_PartyBranch.user && dj_PartyBranch.user._id.toString() === req.user._id.toString());
  dj_PartyBranch.isCurrentUserOwner = !!(req.user && dj_PartyBranch.user && dj_PartyBranch.user.id.toString() === req.user.id.toString());

  res.json(dj_PartyBranch);
};

/**
 * Update an dj_PartyBranch
 */
exports.update = function (req, res) {
  var dj_PartyBranch = req.model;
  dj_PartyBranch.OrganizationName = req.body.OrganizationName;//组织名称
  dj_PartyBranch.simpleName = req.body.simpleName;//组织简称
  dj_PartyBranch.Secretary = req.body.Secretary;//书记
  dj_PartyBranch.OrganizationTime = req.body.OrganizationTime;//成立时间
  dj_PartyBranch.OrganizationCategory = req.body.OrganizationCategory;//组织类别
  dj_PartyBranch.streetID = req.body.streetID;//所属街道
  dj_PartyBranch.communityId = req.body.communityId;//所属社区
  dj_PartyBranch.BelongGrid = req.body.BelongGrid;//所属网格
  dj_PartyBranch.Category = req.body.Category;//单位类别
  dj_PartyBranch.Address = req.body.Address;//联系地址
  dj_PartyBranch.super = req.body.super;//上级党组织
  dj_PartyBranch.Relations = req.body.Relations;//隶属关系
  dj_PartyBranch.Head = req.body.Head;//党务专干
  dj_PartyBranch.TelNumber = req.body.TelNumber;//联系电话
  dj_PartyBranch.unitname = req.body.unitname;//单位名称
  dj_PartyBranch.unitsitu = req.body.unitsitu;//党组织所在单位情况
  dj_PartyBranch.unitorgsitu = req.body.unitorgsitu;//单位建立党组织情况
  dj_PartyBranch.unitcode = req.body.unitcode;//党组织所在单位代码
  dj_PartyBranch.modifyUserId = req.body.modifyUserId;//修改人ID
  dj_PartyBranch.longitude = req.body.longitude;//经度
  dj_PartyBranch.latitude = req.body.latitude;//维度
  dj_PartyBranch.OrganizationNum = req.body.OrganizationNum;//党员人数
  dj_PartyBranch.generalbranch = req.body.generalbranch;//党总支
  dj_PartyBranch.modifyDate = new Date();//修改时间

  dj_PartyBranch.save().then(function () {
    res.json(dj_PartyBranch);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an dj_PartyBranch
 */
exports.delete = function (req, res) {
  var dj_PartyBranch = req.model;
  dj_PartyBranch.destroy().then(function () {
    res.json(dj_PartyBranch);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of dj_PartyBranch
 */
exports.list = function (req, res) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var type = req.query.type;//所属部门党委或街道党工委ID
  var OrganizationId = req.query.OrganizationId;
  var generalbranch = req.query.generalbranch;
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (sum) {
    listByPage(req, res, limit, offset, type, OrganizationId, generalbranch);
  } else if (cont) {
    listCount(req, res, type, OrganizationId, generalbranch);
  } else {
    dj_PartyBranch.findAll({
      order: 'createDate DESC'
    }).then(function (dj_PartyBranch) {
      return res.jsonp(dj_PartyBranch);
    }).catch(function (err) {
      logger.error('dj_PartyBranch list error:', err);
      return res.status(422).send(err);
    });
  }
};

/**
 * dj_PartyBranch middleware
 */
exports.dj_PartyBranchByID = function (req, res, next, id) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   var type = req.query.type;//所属部门党委或街道党工委ID
   var OrganizationId = req.query.OrganizationId;
   var generalbranch = req.query.generalbranch;
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, type, OrganizationId, generalbranch);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, type, OrganizationId, generalbranch);
   } else if (id !== '0') {*/
  dj_PartyBranch.findOne({
    where: {OrganizationId: id}
  }).then(function (dj_PartyBranch) {
    if (!dj_PartyBranch) {
      logger.error('No dj_PartyBranch with that identifier has been found');
      return res.status(404).send({
        message: 'No dj_PartyBranch with that identifier has been found'
      });
    }

    req.model = dj_PartyBranch;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('dj_PartyBranch ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
//  }
};
//----分页
function listByPage(req, res, limit, offset, type, OrganizationId, generalbranch) {
  var sql;
  if (OrganizationId) {
    sql = ' select z.* from ( select p.*, rownum rnum from ' +
      ' (select row_number() over(order by createDate desc) as rownum, ' +
      ' * from dj_PartyBranch where OrganizationId = ' + OrganizationId + ') as p where rownum <= ' + offset + ')as z ' +
      ' where rnum > ' + limit;
  } else if (generalbranch) {
    sql = ' select z.* from ( select p.*, rownum rnum from ' +
      ' (select row_number() over(order by createDate desc) as rownum, ' +
      ' * from dj_PartyBranch where generalbranch = ' + generalbranch + ') as p where rownum <= ' + offset + ')as z ' +
      ' where rnum > ' + limit;
  } else {
    type = type + '';
    sql = ' select z.* from ( select p.*, rownum rnum from ' +
      ' (select row_number() over(order by createDate desc) as rownum, ' +
      ' * from dj_PartyBranch where super = ' + type + ') as p where rownum <= ' + offset + ')as z ' +
      ' where rnum > ' + limit;
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('dj_PartyMember list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, type, OrganizationId, generalbranch) {
  var sql;
  if (OrganizationId) {
    sql = 'select count(*) sum from dj_PartyBranch where OrganizationId = ' + OrganizationId + '';
  } else if (generalbranch) {
    sql = 'select count(*) sum from dj_PartyBranch where generalbranch = ' + generalbranch + '';
  } else {
    sql = 'select count(*) sum from dj_PartyBranch where super = ' + type + '';
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
