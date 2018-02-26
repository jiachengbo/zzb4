'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an dj_PartyMember
 */
exports.create = function (req, res) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var dj_partyMember = sequelize.model('dj_PartyMember');
  var dj_PartyMember = dj_partyMember.build(req.body);

  dj_PartyMember.isdelete = 0;
  dj_PartyMember.createDate = new Date();

  dj_PartyMember.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return dj_PartyMember.reload({
      include: [
        {
          model: dj_PartyBranch,
          attributes: ['simpleName']
        }
      ]
    })
      .then(function () {
        res.json(dj_PartyMember);
      });
  }).catch(function (err) {
    logger.error('dj_PartyMember create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current dj_PartyMember
 */
exports.read = function (req, res) {
  var dj_PartyMember = req.model ? req.model.toJSON() : {};

  //dj_PartyMember.isCurrentdj_PartyBranchOwner = !!(req.dj_PartyBranch && dj_PartyMember.dj_PartyBranch && dj_PartyMember.dj_PartyBranch._id.toString() === req.dj_PartyBranch._id.toString());
  dj_PartyMember.isCurrentdj_PartyBranchOwner = !!(req.dj_PartyBranch && dj_PartyMember.dj_PartyBranch && dj_PartyMember.dj_PartyBranch.id.toString() === req.dj_PartyBranch.id.toString());

  res.json(dj_PartyMember);
};

/**
 * Update an dj_PartyMember
 */
exports.update = function (req, res) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var dj_PartyMember = req.model;

  dj_PartyMember.PartyName = req.body.PartyName;//党员名称
  dj_PartyMember.PartyNation = req.body.PartyNation;//民族
  dj_PartyMember.PartySex = req.body.PartySex;//性别
  dj_PartyMember.PartyBirth = req.body.PartyBirth;//出生年月
  dj_PartyMember.PartyPlace = req.body.PartyPlace;//籍贯
  dj_PartyMember.IDNumber = req.body.IDNumber;//身份证号码
  dj_PartyMember.TelNumber = req.body.TelNumber;//联系电话
  dj_PartyMember.BelongGrid = req.body.BelongGrid;//所属网格
  dj_PartyMember.JoinTime = req.body.JoinTime;//入党时间
  dj_PartyMember.preson_category = req.body.preson_category;//人员类别
  dj_PartyMember.Category = req.body.Category;//党员类型
  dj_PartyMember.ThePartyfor = req.body.ThePartyfor;//党内表彰
  dj_PartyMember.Income = req.body.Income;//个人收入
  dj_PartyMember.education = req.body.education;//学历
  dj_PartyMember.education2 = req.body.education2;//学历
  dj_PartyMember.sections = req.body.sections;//认领单位

  dj_PartyMember.ToPay = req.body.ToPay;//缴纳比例
  dj_PartyMember.PartyMoney = req.body.PartyMoney;//每月党费
  dj_PartyMember.modifyUserId = req.body.modifyUserId;//修改人
  dj_PartyMember.modifyDate = new Date();//修改日期
  dj_PartyMember.branch = req.body.branch;//所在党支部
  dj_PartyMember.communityId = req.body.communityId;//所属社区
  dj_PartyMember.streetID = req.body.streetID;//社区街道
  dj_PartyMember.Specialty = req.body.Specialty;//个人特长
  dj_PartyMember.isJob = req.body.isJob;//是否在职
  dj_PartyMember.workbranch = req.body.workbranch;//所在党组织
  dj_PartyMember.isFlow_party = req.body.isFlow_party;//是否流动党员
  dj_PartyMember.isConcat = req.body.isConcat;//是否失联党员
  dj_PartyMember.WorkPlace = req.body.WorkPlace;//工作地址
  dj_PartyMember.save().then(function () {
    return dj_PartyMember.reload({
      include: [
        {
          model: dj_PartyBranch,
          attributes: ['simpleName']
        }
      ]
    })
      .then(function () {
        res.json(dj_PartyMember);
      });
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an dj_PartyMember
 */
exports.delete = function (req, res) {
  var dj_PartyMember = req.model;

  dj_PartyMember.destroy().then(function () {
    res.json(dj_PartyMember);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of dj_PartyMember
 */
exports.list = function (req, res) {
  var dj_PartyMember = sequelize.model('dj_PartyMember');
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var type = req.query.workbranch;
  var cont = req.query.cont;
  var sum = req.query.sum;
  var key2 = req.query.key2;
  var where;
  if (cont) {
    where = {
      where: {
        workbranch: type
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'sum']]
    };
  } else if (sum) {
    where = {
      where: {
        workbranch: type
      },
      include: [
        {
          model: dj_PartyBranch,
          attributes: ['simpleName']
        }
      ],
      limit: limit,
      offset: offset,
      order: 'createDate DESC'
    };
  } else {
    if (key2) {
      where = {
        where: {
          workbranch: type,
          $or: [
            {PartyName: {
              $like: '%' + key2 + '%'
            }},
            {IDNumber: {
              $like: '%' + key2 + '%'
            }}
          ]
        },
        include: [
          {
            model: dj_PartyBranch,
            attributes: ['simpleName']
          }
        ]
      };
    } else {
      where = {
        include: [
          {
            model: dj_PartyBranch,
            attributes: ['simpleName']
          }
        ],
        order: 'createDate DESC'
      };
    }
  }
  dj_PartyMember.findAll(where).then(function (dj_PartyMember) {
    return res.jsonp(dj_PartyMember);
  }).catch(function (err) {
    logger.error('dj_PartyMember list error:', err);
    return res.status(422).send(err);
  });
  /*if(offset && limit){
   if (offset !== -1) {
   dj_PartyMember.findAll({
   where: {
   workbranch: type,
   },
   include: [
   {
   model: dj_PartyBranch,
   attributes: ['simpleName']
   }
   ],
   limit: 20,
   offset: limit,
   order: 'createDate DESC'
   }).then(function (dj_PartyMember) {
   return res.jsonp(dj_PartyMember);
   }).catch(function (err) {
   logger.error('dj_PartyMember list error:', err);
   return res.status(422).send(err);
   });
   }
   else if (limit === -1 && offset === -1) {
   dj_PartyMember.findAll({
   where: {
   workbranch: type,
   },
   attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'sum']]
   }).then(function (dj_PartyMember) {
   return res.jsonp(dj_PartyMember);
   }).catch(function (err) {
   logger.error('dj_PartyMember list error:', err);
   return res.status(422).send(err);
   });
   }
   }
   else {
   if (type && key2) {
   dj_PartyMember.findAll({
   where: {
   workbranch: type,
   PartyName: {
   $like: '%' + key2 + '%'
   }
   },
   include: [
   {
   model: dj_PartyBranch,
   attributes: ['simpleName']
   }
   ]
   }).then(function (data) {
   res.jsonp(data);
   }).catch(function (err) {
   console.log('出错了。。。。。');
   });
   } else {
   dj_PartyMember.findAll({
   include: [
   {
   model: dj_PartyBranch,
   attributes: ['simpleName']
   }
   ],
   order: 'createDate DESC'
   }).then(function (dj_PartyMember) {
   return res.jsonp(dj_PartyMember);
   }).catch(function (err) {
   logger.error('dj_PartyMember list error:', err);
   return res.status(422).send(err);
   });
   }
   }*/

};

/**
 * dj_PartyMember middleware
 */
exports.dj_PartyMemberByID = function (req, res, next, id) {
  var dj_PartyMember = sequelize.model('dj_PartyMember');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   // var type = req.query.type;//所属党支部ID
   var type = req.query.workbranch;
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, type);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, type);
   } else if (id !== '0') {*/
  dj_PartyMember.findOne({
    where: {PartyId: id}
  }).then(function (dj_PartyMember) {
    if (!dj_PartyMember) {
      logger.error('No dj_PartyMember with that identifier has been found');
      return res.status(404).send({
        message: 'No dj_PartyMember with that identifier has been found'
      });
    }
    req.model = dj_PartyMember;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('dj_PartyMember ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  // }
};
//----分页
function listByPage(req, res, limit, offset, type) {
  type = type + '';
  var sql = ' select z.*,b.simpleName from ( select p.*, rownum rnum from ' +
    ' (select row_number() over(order by createDate desc) as rownum, ' +
    ' * from dj_PartyMember where workbranch = ' + type + ') as p where rownum <= ' + offset + ') as z' +
    ' left join dj_PartyBranch as b on (z.branch = b.OrganizationId) ' +
    ' where rnum > ' + limit;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('dj_PartyMember list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, type) {
  var sql = 'select count(*) sum from dj_PartyMember where workbranch = ' + type + '';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
