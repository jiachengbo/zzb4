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
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建组织人员照片
var uploadImage = new multer('orgpersonimg',
  2 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();

/**
 * Create an orgperson
 */
exports.create = function (req, res) {
  var OrgPerson = sequelize.model('OrgPerson');
  var orgPerson = OrgPerson.build(req.body);
  var personPhoto;
  if (orgPerson) {
    uploadImage.recv(req, res, [{name: 'personPhoto'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(orgPerson);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (orgPerson) {
        //照片
        if (files && files.personPhoto && files.personPhoto.length === 1) {
          orgPerson.personPhoto = path.join(uploadImage.mountDir, files.personPhoto[0].filename).replace(/\\/g, '/');
          personPhoto = orgPerson.personPhoto;
        }
        orgPerson.orgId = req.body.orgId;
        orgPerson.duty = req.body.duty;
        orgPerson.personduty = req.body.personduty;
        orgPerson.personName = req.body.personName;

        orgPerson.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no personPhoto img upload'));
      }
    });
  }
};

/**
 * Show the current orgperson
 */
exports.read = function (req, res) {
  var orgset = req.model ? req.model.toJSON() : {};

  //orgset.isCurrentUserOwner = !!(req.user && orgset.user && orgset.user._id.toString() === req.user._id.toString());
  orgset.isCurrentUserOwner = !!(req.user && orgset.user && orgset.user.id.toString() === req.user.id.toString());

  res.json(orgset);
};

/**
 * Update an orgperson
 */
exports.update = function (req, res) {
  var orgPerson = req.model;
  var OrgTable = sequelize.model('OrgTable');
  var existingImageUrl;
  var newingImageUrl;
  if (orgPerson) {
    existingImageUrl = orgPerson.personPhoto;
    uploadImage.recv(req, res, [{name: 'personPhoto'}])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(orgPerson);
      })
      .catch(function (err) {
        logger.error('recv upload orgperson picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'orgperson is not exist'
    });
  }
  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (orgPerson) {
        //照片
        if (files && files.personPhoto && files.personPhoto.length === 1) {
          orgPerson.personPhoto = path.join(uploadImage.mountDir, files.personPhoto[0].filename).replace(/\\/g, '/');
          newingImageUrl = orgPerson.personPhoto;
        }
        orgPerson.orgId = req.body.orgId;
        orgPerson.duty = req.body.duty;
        orgPerson.personduty = req.body.personduty;
        orgPerson.personName = req.body.personName;

        orgPerson.save().then(function () {
          return orgPerson.reload({
            include: [
              {
                model: OrgTable,
                attributes: ['duty']
              }
            ]
          })
            .then(function () {
              res.json(orgPerson);
            });
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no personPhoto img upload'));
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
 * Delete an orgset
 */
exports.delete = function (req, res) {
  logger.info('-------------------------------------------------delete');
  var orgperson = req.model;

  orgperson.destroy().then(function () {
    res.json(orgperson);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Orgset
 */
exports.list = function (req, res) {
  var OrgPerson = sequelize.model('OrgPerson');
  var OrgTable = sequelize.model('OrgTable');
  var orgId = req.query.orgId;
  OrgPerson.findAll({
    include: [
      {
        model: OrgTable,
        attributes: ['duty']
      }
    ],
    where: {
      orgId: orgId
    },
    order: 'personId asc'
  }).then(function (orgperson) {
    return res.jsonp(orgperson);
  }).catch(function (err) {
    logger.error('OrgPerson list error:', err);
    return res.status(422).send(err);
  });
};

//---------mysql-分页------------
function listByPage(req, res, limit, offset, orgId) {
  /*var sql = 'select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY personId desc) AS rowNum, ' +
   'personId, personName, duty, personPhoto,orgId FROM OrgPerson where orgId = ' + orgId + ') p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ';
   sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
   res.jsonp(infos);
   }).catch(function (err) {
   logger.error('OrgSet list error:', err);
   return res.status(422).send(err);
   });*/
  var OrgPerson = sequelize.model('OrgPerson');
  var OrgTable = sequelize.model('OrgTable');
  OrgPerson.findAll({
    include: [
      {
        model: OrgTable,
        attributes: ['duty']
      }
    ],
    where: {
      orgId: orgId
    },
    limit: 10,
    offset: limit,
    order: 'personId asc'
  }).then(function (orgperson) {
    return res.jsonp(orgperson);
  }).catch(function (err) {
    logger.error('OrgPerson list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数------------[StreetOffice_zzb].[dbo].[OrgPerson]
function listCount(req, res, orgId) {
  var sql = 'select count(*) sum from OrgPerson where orgId = ' + orgId;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}

/**
 * OrgPerson middleware
 */
exports.orgpersonByID = function (req, res, next, id) {
  var OrgPerson = sequelize.model('OrgPerson');

  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var orgId = parseInt(req.query.orgId, 0);

  if (offset !== 0 && id === '0') {
    listByPage(req, res, limit, offset, orgId);
  } else if (limit === 0 && offset === 0 && id === '0') {
    listCount(req, res, orgId);
  } else if (id !== '0') {
    OrgPerson.findOne({
      where: {personId: id}
    }).then(function (orgperson) {
      if (!orgperson) {
        logger.error('No orgperson with that identifier has been found');
        return res.status(404).send({
          message: 'No orgperson with that identifier has been found'
        });
      }

      req.model = orgperson;
      next();
    }).catch(function (err) {
      logger.error('orgperson ByID error:', err);
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }
};

/*

 exports.orgsetByID = function (req, res, next, id) {
 var Orgset = sequelize.model('OrgSet');
 Orgset.findOne({
 where: {id: id}
 }).then(function (orgset) {
 if (!orgset) {
 logger.error('No orgset with that identifier has been found');
 return res.status(404).send({
 message: 'No orgset with that identifier has been found'
 });
 }

 req.model = orgset;
 next();
 }).catch(function (err) {
 //return next(err);
 logger.error('orgset ByID error:', err);
 res.status(422).send({
 message: errorHandler.getErrorMessage(err)
 });
 });
 };
 */
