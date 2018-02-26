'use strict';

/**
 * Module dependencies
 * 会议图片
 */
var path = require('path'),
  fs = require('fs'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  util = require('util'),
  child_process = require('child_process'),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建会议照片
var saveDir = 'orgmeetingimg';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// var distType = 'html';
// var typeParam = {
//   //html 字符集utf-8
//   html: ':XHTML Writer File:UTF8'
// };
var uploadImage = new multer(saveDir,
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();

/**
 * Create an orgset
 */
exports.create = function (req, res) {
  // var User = sequelize.model('User');
  var Orgset = sequelize.model('OrgSet');
  var orgset = Orgset.build(req.body);
  var meetingPhoto;
  var meetingPhoto2;
  var existingFileUrl;
  var newingFileUrl;
  var existingImagejpg;
  if (orgset) {
    uploadImage.recv(req, res, [{name: 'meetingPhoto'}, {name: 'meetingPhoto2'}, {name: 'file_path'}])
      .then(updateMeetingInfo)
      .then(function () {
        res.json(orgset);
      })
      .catch(function (err) {
        logger.error('上传会议照片失败:', err);
        res.status(422).send(err);
      });
  }

  function updateMeetingInfo(files) {
    return new Promise(function (resolve, reject) {
      if (orgset) {
        //照片1
        if (files && files.meetingPhoto && files.meetingPhoto.length === 1) {
          orgset.meetingPhoto = path.join(uploadImage.mountDir, files.meetingPhoto[0].filename).replace(/\\/g, '/');
          meetingPhoto = orgset.meetingPhoto;
        }

        //照片2
        if (files && files.meetingPhoto2 && files.meetingPhoto2.length === 1) {
          orgset.meetingPhoto2 = path.join(uploadImage.mountDir, files.meetingPhoto2[0].filename).replace(/\\/g, '/');
          meetingPhoto2 = orgset.meetingPhoto2;
        }
        if (files && files.file_path && files.file_path.length === 1) {
          orgset.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
          newingFileUrl = orgset.file_path;
          socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        orgset.orgId = req.body.orgId;
        orgset.duty = req.body.duty;
        orgset.createTime = req.body.createTime;
        orgset.quest = req.body.quest;
        orgset.street = req.body.street;
        orgset.community = req.body.community;

        /*orgset.save().then(function () {
         resolve();
         }).catch(function (err) {
         reject(err);
         });*/
        /*if (files && files.file_path && files.file_path.length === 1) {
         existingFileUrl = path.join(mountDir1, files.file_path[0].filename).replace(/\\/g, '/');
         //  转HTML
         var diskFileName = path.join(diskDir1, files.file_path[0].filename);
         fs.exists(diskFileName, function (exists) {
         if (!exists) {
         logger.warn('conv docfile %s not exists', diskFileName);
         return res.status(404).send('参数文件不存在:' + diskFileName);
         }
         var type = distType + (typeParam[distType] ? typeParam[distType] : '');
         var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
         config.sofficePathName, type, diskDir1, diskFileName);

         child_process.exec(cmdLine, function (error, stdout, stderr) {
         if (error) {
         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
         return res.status(404).send('文件转换错误:' + diskFileName);
         }
         var distFile = path.basename(files.file_path[0].filename, path.extname(files.file_path[0].filename)) + '.' + distType;
         var distFileName = path.join(diskDir1, distFile);
         fs.exists(distFileName, function (exists) {
         if (!exists) {
         return res.status(404).send('转换后的文件不存在:' + distFileName);
         }
         var options = {};
         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
         newingFileUrl = distFileName1;
         orgset.file_path = distFileName1;
         orgset.save().then(function () {
         resolve();
         }).then()
         .catch(function (err) {
         reject(err);
         });
         });
         });
         });
         }*/
        //if (!(files && files.file_path && files.file_path.length === 1)) {
        orgset.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no meetingPhoto img upload'));
      }
    });
  }
};

/**
 * Show the current orgset
 */
exports.read = function (req, res) {
  var orgset = req.model ? req.model.toJSON() : {};

  orgset.isCurrentUserOwner = !!(req.user && orgset.user && orgset.user.id.toString() === req.user.id.toString());

  res.json(orgset);
};

/**
 * Update an orgset
 */
exports.update = function (req, res) {
  var orgset = req.model;
  var existingImageUrl;
  var existingImageUrl2;
  var newingImageUrl;
  var newingImageUrl2;
  var existingOldFileUrl;
  var existingFileUrl;
  var newingFileUrl;
  var existingImagejpg;
  if (orgset) {
    existingImageUrl = orgset.meetingPhoto;
    existingImageUrl2 = orgset.meetingPhoto2;
    existingFileUrl = orgset.file_path;
    uploadImage.recv(req, res, [{name: 'meetingPhoto'}, {name: 'meetingPhoto2'}, {name: 'file_path'}])
      .then(updateMeetingInfo)
      .then(deleteOldImage)
      // .then(deleteOldFile)
      .then(function () {
        res.json(orgset);
      })
      .catch(function (err) {
        logger.error('recv upload orgset picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'orgset is not exist'
    });
  }

  function updateMeetingInfo(files) {
    return new Promise(function (resolve, reject) {
      if (orgset) {
        //照片1
        if (files && files.meetingPhoto && files.meetingPhoto.length === 1) {
          orgset.meetingPhoto = path.join(uploadImage.mountDir, files.meetingPhoto[0].filename).replace(/\\/g, '/');
          newingImageUrl = orgset.meetingPhoto;
        }

        //照片2
        if (files && files.meetingPhoto2 && files.meetingPhoto2.length === 1) {
          orgset.meetingPhoto2 = path.join(uploadImage.mountDir, files.meetingPhoto2[0].filename).replace(/\\/g, '/');
          newingImageUrl2 = orgset.meetingPhoto2;
        }
        if (files && files.file_path && files.file_path.length === 1) {
          orgset.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
          newingFileUrl = orgset.file_path;
          socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        orgset.orgId = req.body.orgId;
        orgset.duty = req.body.duty;
        orgset.createTime = req.body.createTime;
        orgset.quest = req.body.quest;
        orgset.street = req.body.street;
        orgset.community = req.body.community;

        /* if (files && files.file_path && files.file_path.length === 1) {
         existingFileUrl = path.join(mountDir1, files.file_path[0].filename).replace(/\\/g, '/');
         //  转HTML
         var diskFileName = path.join(diskDir1, files.file_path[0].filename);
         fs.exists(diskFileName, function (exists) {
         if (!exists) {
         logger.warn('conv docfile %s not exists', diskFileName);
         return res.status(404).send('参数文件不存在:' + diskFileName);
         }
         var type = distType + (typeParam[distType] ? typeParam[distType] : '');
         var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
         config.sofficePathName, type, diskDir1, diskFileName);

         child_process.exec(cmdLine, function (error, stdout, stderr) {
         if (error) {
         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
         return res.status(404).send('文件转换错误:' + diskFileName);
         }
         var distFile = path.basename(files.file_path[0].filename, path.extname(files.file_path[0].filename)) + '.' + distType;
         var distFileName = path.join(diskDir1, distFile);
         fs.exists(distFileName, function (exists) {
         if (!exists) {
         return res.status(404).send('转换后的文件不存在:' + distFileName);
         }
         var options = {};
         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
         newingFileUrl = distFileName1;
         orgset.file_path = distFileName1;
         orgset.save().then(function () {
         resolve();
         }).then()
         .catch(function (err) {
         reject(err);
         });
         });
         });
         });
         }*/
        //if (!(files && files.file_path && files.file_path.length === 1)) {
        orgset.save().then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no meetingPhoto img upload'));
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
          } else {
            resolve();
          }
        });
      } else if (existingImageUrl2 && newingImageUrl2) {
        var oldfilename2 = existingImageUrl2.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename2, function (unlinkError) {
          if (unlinkError) {
            resolve();
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  function deleteOldFile() {
    return new Promise(function (resolve, reject) {
      if (existingOldFileUrl && newingFileUrl) {
        var oldfile = existingOldFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfile, function (unlinkError) {
          if (unlinkError) {
            resolve();
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
  var orgset = req.model;

  orgset.destroy().then(function () {
    res.json(orgset);
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
  var Orgset = sequelize.model('OrgSet');
  var OrgTable = sequelize.model('OrgTable');
 // var orgId = req.query.orgId;
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var street = req.query.street;
  var orgId = parseInt(req.query.orgId, 0);
  var community = req.query.community;
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (sum) {
    listByPage(req, res, limit, offset, orgId, community, street);
  } else if (cont) {
    listCount(req, res, orgId, community, street);
  } else {
    Orgset.findAll({
      include: [
        {
          model: OrgTable,
          attributes: ['orgName']
        }
      ],
      where: {
        orgId: orgId
      },
      order: 'id desc'
    }).then(function (orgset) {
      return res.jsonp(orgset);
    }).catch(function (err) {
      logger.error('orgset list error:', err);
      return res.status(422).send(err);
    });
  }
};

//---------mysql-分页------------[StreetOffice_zzb].[dbo].[OrgSet]
function listByPage(req, res, limit, offset, orgId, community, street) {
//  var OrgSet = sequelize.model('OrgSet');
  var sql;
  if (community) {
    sql = 'select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY id desc) AS rowNum, ' +
      'id, orgId, duty, createTime,quest,meetingPhoto,meetingPhoto2,file_path FROM OrgSet where street = ' + street + ' and community = \'' + community + '\') p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ';
  } else {
    sql = 'select * from ( select p.*, rownum rnum FROM (SELECT ROW_NUMBER() OVER(ORDER BY id desc) AS rowNum, ' +
      'id, orgId, duty, createTime,quest,meetingPhoto,meetingPhoto2,file_path FROM OrgSet where orgId = ' + orgId + ') p where rownum <= ' + offset + ') z where rnum > ' + limit + ' ';
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('OrgSet list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数------------
function listCount(req, res, orgId, community, street) {
  var sql;
  if (community) {
    sql = 'select count(*) sum from OrgSet where street = ' + street + ' and community = \'' + community + '\'';
  } else {
    sql = 'select count(*) sum from OrgSet where orgId = ' + orgId;
  }
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}

/**
 * Orgset middleware
 */
exports.orgsetByID = function (req, res, next, id) {
  var Orgset = sequelize.model('OrgSet');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   var street = req.query.street;
   var orgId = parseInt(req.query.orgId, 0);
   var community = req.query.community;
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, orgId, community, street);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, orgId, community, street);
   } else if (id !== '0') {*/
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
    logger.error('appeal ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
//  }
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
exports.worklists = function (req, res) {
  var workzhize = sequelize.model('workzhize');
  var Street = req.query.Street;
  var community = req.query.community;
  workzhize.findAll({
    where: {
      Street: Street,
      community: community
    },
    order: 'id desc'
  }).then(function (orgset) {
    return res.jsonp(orgset);
  }).catch(function (err) {
    logger.error('orgset list error:', err);
    return res.status(422).send(err);
  });
};
exports.worklist = function (req, res) {
  var Workzhize = sequelize.model('workzhize');
  var Street = req.body.Street;
  var community = req.body.community;
  var duty = req.body.duty;
  var workzhize = Workzhize.build(req.body);
  Workzhize.findAll({
    where: {
      Street: Street,
      community: community
    },
    order: 'id desc'
  }).then(function (orgset) {
    if (orgset.length > 0) {
      workupdate(orgset[0].dataValues.id, duty);
    } else {
      worksave();
    }
  }).catch(function (err) {
    logger.error('orgset list error:', err);
    return res.status(422).send(err);
  });
  function worksave() {
    workzhize.save().then(function () {
      //重新加载数据，使数据含有关联表的内容
      return workzhize.reload(/*{
       include: [
       {
       model: User,
       attributes: ['displayName']
       }
       ]
       }*/)
        .then(function () {
          res.json(workzhize);
        });
    }).catch(function (err) {
      logger.error('workzhize create error:', err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  }

  function workupdate(id, duty) {
    Workzhize.update(
      {'duty': duty},
      {
        where: {'id': id}
      }
    ).then(function () {
      return res.jsonp('1');
    }).catch(function (err) {
      logger.error('orgset list error:', err);
      return res.status(422).send(err);
    });
  }

};
exports.workllllist = function (req, res) {
  var OrgTable = req.model;
  res.jsonp(OrgTable);
  /*var orgId = req.query.orgId;
   OrgTable.findAll({
   where: {
   orgId: orgId
   }
   }).then(function (orgset) {
   console.log(orgset);
   return res.jsonp(orgset);
   }).catch(function (err) {
   logger.error('orgset list error:', err);
   return res.status(422).send(err);
   });*/
};
exports.updates = function (req, res) {
  var OrgTable = sequelize.model('OrgTable');
  OrgTable.update(
    {'duty': req.body.duty},
    {
      where: {'orgId': req.body.orgId}
    }
  ).then(function () {
    return res.jsonp('1');
  }).catch(function (err) {
    logger.error('orgset list error:', err);
    return res.status(422).send(err);
  });
};
exports.orgtableByID = function (req, res, next, id) {
  var OrgTable = sequelize.model('OrgTable');

  OrgTable.findAll({
    where: {
      orgId: id
    }
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
    logger.error('appeal ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
