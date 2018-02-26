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
  uuid = require('uuid'),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);
//创建项目进展对象
var uploadImage = new multer('progressPicfileimg',
  20 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an ProgressTable
 */
exports.create = function (req, res) {
  var progressTable = sequelize.model('ProgressTable');
  var ProgressTable = progressTable.build(req.body);
  var newingImageUrl;
  var ProgressId;
  if (ProgressTable) {
    ProgressId = uuid.v4().replace(/-/g, '');
    uploadImage.recv(req, res, [{name: 'ProgressPhoto'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(ProgressTable);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'ProgressTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (ProgressTable) {
        if (files && files.ProgressPhoto && files.ProgressPhoto.length === 1) {
          ProgressTable.ProgressPhoto = path.join(uploadImage.mountDir, files.ProgressPhoto[0].filename).replace(/\\/g, '/');
          newingImageUrl = ProgressTable.ProgressPhoto;
        }

        ProgressTable.ProgressTime = req.body.ProgressTime;
        ProgressTable.ProgressContent = req.body.ProgressContent;
        ProgressTable.ProjectId = req.body.ProjectId;
        ProgressTable.ProgressId = ProgressId;
        //图片
        ProgressTable.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no progressphoto img upload'));
      }
    });
  }
};

/**
 * Show the current ProgressTable
 */
exports.read = function (req, res) {
  var ProgressTable = req.model ? req.model.toJSON() : {};
  ProgressTable.isCurrentUserOwner = !!(req.user && ProgressTable.user && ProgressTable.user.id.toString() === req.user.id.toString());
  res.json(ProgressTable);
};

/**
 * Update an ProgressTable
 */
exports.update = function (req, res) {
  var ProgressTable = req.model;
  var existingImageUrl;
  var newingImageUrl;
  if (ProgressTable) {
    existingImageUrl = ProgressTable.ProgressPhoto;
    uploadImage.recv(req, res, [{name: 'ProgressPhoto'}])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(ProgressTable);
      })
      .catch(function (err) {
        logger.error('recv upload ProgressTable picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'ProgressTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (ProgressTable) {
        if (files && files.ProgressPhoto && files.ProgressPhoto.length === 1) {
          ProgressTable.ProgressPhoto = path.join(uploadImage.mountDir, files.ProgressPhoto[0].filename).replace(/\\/g, '/');
          newingImageUrl = ProgressTable.ProgressPhoto;
        }
        ProgressTable.ProgressTime = req.body.ProgressTime;
        ProgressTable.ProgressContent = req.body.ProgressContent;
        ProgressTable.ProjectId = req.body.ProjectId;
        //图片
        ProgressTable.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no ProgressPhoto img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl && newingImageUrl) {
        var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename, function (unlinkError) {
          if (unlinkError) {
            resolve();
            /* reject({
             message: 'Error while deleting old picture'
             });*/
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
};

/**
 * Delete an ProgressTable
 */
exports.delete = function (req, res) {
  var ProgressTable = req.model;

  ProgressTable.destroy().then(function () {
    res.json(ProgressTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of ProgressTable
 */
exports.list = function (req, res) {
  var ProgressTable = sequelize.model('ProgressTable');
  var id = req.query.ProjectId;
  ProgressTable.findAll({
    where: {
      ProjectId: id
    },
    order: 'createDate ASC'
  }).then(function (ProgressTable) {
    return res.jsonp(ProgressTable);
  }).catch(function (err) {
    logger.error('ProgressTable list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * ProgressTable middleware
 */
exports.progressByID = function (req, res, next, id) {
  var ProgressTable = sequelize.model('ProgressTable');
  var projrct_id = req.query.ProjectId;
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  if (offset !== 0 && id === '0') {
    listByPage(req, res, limit, offset, projrct_id);
  } else if (limit === 0 && offset === 0 && id === '0') {
    listCount(req, res, projrct_id);
  } else if (id !== '0') {
    ProgressTable.findOne({
      where: {ProgressId: id}
    }).then(function (ProgressTable) {
      logger.info('oooooooooooooooooooooooooooooooo');
      logger.info(id);
      logger.info(ProgressTable);
      if (!ProgressTable) {
        logger.error('No ProgressTable with that identifier has been found');
        return res.status(404).send({
          message: 'No ProgressTable with that identifier has been found'
        });
      }
      req.model = ProgressTable;
      next();
    }).catch(function (err) {
      //return next(err);
      logger.error('ProgressTable ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};

//----分页
function listByPage(req, res, limit, offset, id) {
  // var ProgressTable = sequelize.model('ProgressTable');
  /*ProgressTable.findAll({
    where: {
      projectid: id
    },
    limit: [limit, offset],
    order: 'id desc'
  }).then(function (ProgressTable) {
    return res.jsonp(ProgressTable);
  })*/
  var sql = 'select * from ( select p.*, rownum rnum from ' +
    '(select row_number() over(order by id desc) as rownum, ' +
    '* from ProgressTable where ProjectId = \'' + id + '\') p ' +
    ' where rownum <= ' + offset + ') z where rnum > ' + limit;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    return res.jsonp(infos);
  }).catch(function (err) {
    logger.error('ProgressTable list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, id) {
  var sql = 'select count(*) sum from ProgressTable where ProjectId = \'' + id + '\'';
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
