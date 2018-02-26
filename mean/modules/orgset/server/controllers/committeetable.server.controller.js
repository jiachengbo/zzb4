'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename),
  uuid = require('uuid');
//委员图片路径
var uploadImage = new multer('committeeTableimg',
  2 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an committeeTable
 */
exports.create = function (req, res) {

  var CommitteeTable = sequelize.model('CommitteeTable');
  var committeeTable = CommitteeTable.build(req.body);
  var CommitteePhotoPath;
  //committeeTable.user_id = req.user.id;
  if (committeeTable) {

    uploadImage.recv(req, res, [{name: 'CommitteePhotoPath'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(committeeTable);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (committeeTable) {
        //图片1
        if (files && files.CommitteePhotoPath && files.CommitteePhotoPath.length === 1) {
          committeeTable.CommitteePhotoPath = path.join(uploadImage.mountDir, files.CommitteePhotoPath[0].filename).replace(/\\/g, '/');
          CommitteePhotoPath = committeeTable.CommitteePhotoPath;
          console.log(CommitteePhotoPath);
        }
        //committeeTable.appealId = uuid.v4().replace(/-/g, "");
        committeeTable.createDate = new Date().toLocaleString();
        committeeTable.CommitteeName = req.body.CommitteeName;
        committeeTable.CommitteeWork = req.body.CommitteeWork;
        committeeTable.CommitteePostion = req.body.CommitteePostion;
        committeeTable.CommitteeType = req.body.CommitteeType;
        committeeTable.community = req.body.community;
        committeeTable.GridID = req.body.GridID;
        committeeTable.Street = req.body.Street;
        committeeTable.save().then(function () {
          resolve();
        }).catch(function (err) {

          reject(err);
        });
      } else {
        reject(new Error('no projectlogo img upload'));
      }
    });
  }
};

/**
 * Show the current committeeTable
 */
exports.read = function (req, res) {
  var committeeTable = req.model ? req.model.toJSON() : {};

  committeeTable.isCurrentUserOwner = !!(req.user && committeeTable.user && committeeTable.user.id.toString() === req.user.id.toString());

  res.json(committeeTable);
};

/**
 * Update an committeeTable
 */
exports.update = function (req, res) {
  var committeeTable = req.model;
  var CommitteePhotoPath;
  if (committeeTable) {
    uploadImage.recv(req, res, [{name: 'CommitteePhotoPath'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(committeeTable);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateUserInfo(files) {

    return new Promise(function (resolve, reject) {
      if (committeeTable) {
        //图片1
        if (files && files.CommitteePhotoPath && files.CommitteePhotoPath.length === 1) {
          committeeTable.CommitteePhotoPath = path.join(uploadImage.mountDir, files.CommitteePhotoPath[0].filename).replace(/\\/g, '/');
          CommitteePhotoPath = committeeTable.CommitteePhotoPath;
          console.log(CommitteePhotoPath);
        }
        //committeeTable.appealId = uuid.v4().replace(/-/g, "");
        committeeTable.createDate = new Date().toLocaleString();
        committeeTable.CommitteeName = req.body.CommitteeName;
        committeeTable.CommitteeWork = req.body.CommitteeWork;
        committeeTable.CommitteePostion = req.body.CommitteePostion;
        committeeTable.CommitteeType = req.body.CommitteeType;
        committeeTable.community = req.body.community;
        committeeTable.GridID = req.body.GridID;
        committeeTable.Street = req.body.Street;
        committeeTable.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('没有委员照片上传'));
      }
    });
  }

};

/**
 * Delete an committeeTable
 */
exports.delete = function (req, res) {
  var committeeTable = req.model;

  committeeTable.destroy().then(function () {
    res.json(committeeTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of CommitteeTable
 */
exports.list = function (req, res) {
  var CommitteeTable = sequelize.model('CommitteeTable');
  //var User = sequelize.model('User');
  var jbid = req.params.Street;

  CommitteeTable.findAll({

    order: 'CommitteeId asc'
  }).then(function (committeeTable) {
    return res.jsonp(committeeTable);
  }).catch(function (err) {
    logger.error('committeeTable list error:', err);
    return res.status(422).send(err);
  });
};
//---------mysql-分页------------
function listByPage(req, res, limit, offset, jb, sq) {
//  var Appeal = sequelize.model('Appeal');
/*  var sql = 'select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY CommitteeId desc) AS rowNum, ' +
    ' CommitteeId, CommitteeName, CommitteeWork, CommitteePostion, CommitteePhotoPath, CommitteeType, Street, community,' +
    ' GridID, Remark, Isdelete, createUser,' +
    'createDate, modifyUser, modifyDate' +
    ' FROM CommitteeTable where Street = ' +
    jb + ' and isdelete = 0) p LEFT OUTER JOIN OrgTable AS OrgTable ON p.Street = OrgTable.Street where rownum <= ' + offset + ') z where rnum > ' + limit + ' ';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('CommitteeTable list error:', err);
    return res.status(422).send(err);
  });*/
  var sql;
  if (sq === '0') {
    sql = `
  select * from 
( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY CommitteeId desc) 
AS rowNum, 
 a.CommitteeId, a.CommitteeName, a.CommitteeWork, a.CommitteePostion, a.CommitteePhotoPath, a.CommitteeType, a.Street,a.community,a.GridID, b.duty
FROM CommitteeTable as a,OrgTable as b where a.Street = b.Street and a.Street = ${jb} and a.isdelete = 0 and a.community = '${sq}') p  where rownum <= ${offset}) z where rnum > ${limit}
  `;
  } else {
    sql = `
  select * from 
( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY CommitteeId desc) 
AS rowNum, 
 a.CommitteeId, a.CommitteeName, a.CommitteeWork, a.CommitteePostion, a.CommitteePhotoPath, a.CommitteeType, a.Street,a.community,a.GridID, b.duty
FROM CommitteeTable as a,workzhize as b where a.Street = b.Street and a.community = b.community and a.Street = ${jb} and a.isdelete = 0 and a.community = '${sq}') p  where rownum <= ${offset}) z where rnum > ${limit}
  `;
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('CommitteeTable list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数------------[StreetOffice_zzb].[dbo].[CommitteeTable]
function listCount(req, res, jb, sq) {
  var sql = 'select count(*) sum from CommitteeTable where Street = ' + jb + ' and community = \'' + sq + '\'';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}

/**
 * CommitteeTable middleware
 */
exports.committeeTableByID = function (req, res, next, id) {
  var CommitteeTable = sequelize.model('CommitteeTable');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
  var offset = parseInt(req.query.offset, 0);//10 每页总数
  var jb = parseInt(req.query.Street, 0);
  var sq = req.query.community;

  if (offset !== 0 && id === '0') {
    listByPage(req, res, limit, offset, jb, sq);
  } else if (limit === 0 && offset === 0 && id === '0') {
    listCount(req, res, jb, sq);
  } else if (id !== '0') {
    CommitteeTable.findOne({
      where: {CommitteeId: id}
    }).then(function (committeeTable) {
      if (!committeeTable) {
        logger.error('No committeeTable with that identifier has been found');
        return res.status(404).send({
          message: 'No committeeTable with that identifier has been found'
        });
      }

      req.model = committeeTable;
      next();
    }).catch(function (err) {
      //return next(err);
      logger.error('committeeTable ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};
