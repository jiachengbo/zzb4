'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  config = require(path.resolve('./config/config')),
  util = require('util'),
  child_process = require('child_process'),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);
//创建项目进展对象
var saveDir = 'TopVoicePicfileimg';
/*var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
 var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
 //目标文件类型
 var distType = 'html';
 //不同类型参数
 var typeParam = {
 //html 字符集utf-8
 html: ':XHTML Writer File:UTF8'
 };*/
var uploadImage = new multer(saveDir,
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an TopVoiceTable
 */
// exports.create = function (req, res) {
//   var topVoiceTable = sequelize.model('TopVoiceTable');
//   var TopVoiceTable = topVoiceTable.build(req.body);
//   var newingImageUrl;
//   if (TopVoiceTable) {
//     uploadImage.recv(req, res, [
//       {name: 'photos'}
//     ])
//       .then(updateUserInfo)
//       .then(function () {
//         res.json(TopVoiceTable);
//       })
//       .catch(function (err) {
//         logger.error('上传照片失败:', err);
//         res.status(422).send(err);
//       });
//   } else {
//     res.status(401).send({
//       message: 'TopVoiceTable is not exist'
//     });
//   }
//
//   function updateUserInfo(files) {
//     return new Promise(function (resolve, reject) {
//       if (TopVoiceTable) {
//         if (files && files.photos && files.photos.length === 1) {
//           TopVoiceTable.photos = path.join(uploadImage.mountDir, files.photos[0].filename).replace(/\\/g, '/');
//           newingImageUrl = TopVoiceTable.photos;
//         }
//         TopVoiceTable.title = req.body.title;
//         TopVoiceTable.content = req.body.content;
//         TopVoiceTable.time = req.body.time;
//         TopVoiceTable.createdate = new Date();
//         //图片
//         TopVoiceTable.save().then(function () {
//           //重新加载数据，使数据含有关联表的内容
//           return TopVoiceTable.reload()
//             .then(function () {
//               resolve();
//             });
//         }).catch(function (err) {
//           reject(err);
//         });
//       } else {
//         reject(new Error('no TopVoiceTable img upload'));
//       }
//     });
//   }
// };

/**
 * Show the current TopVoiceTable
 */
exports.read = function (req, res) {
  var TopVoiceTable = req.model ? req.model.toJSON() : {};

  //TopVoiceTable.isCurrentUserOwner = !!(req.user && TopVoiceTable.user && TopVoiceTable.user._id.toString() === req.user._id.toString());
  TopVoiceTable.isCurrentUserOwner = !!(req.user && TopVoiceTable.user && TopVoiceTable.user.id.toString() === req.user.id.toString());

  res.json(TopVoiceTable);
};

/**
 * Update an TopVoiceTable
 */
exports.update = function (req, res) {
  var TopVoiceTable;
  var topVoiceTable;
  var existingImageUrl;
  var existingFileUrl;
  var existingImagejpg;
  var newingFileUrl;
  var newingImageUrl;
  if (req.model) {
    TopVoiceTable = req.model;
  } else {
    topVoiceTable = sequelize.model('TopVoiceTable');
    TopVoiceTable = topVoiceTable.build(req.body);
    TopVoiceTable.createdate = new Date();
  }
  if (TopVoiceTable) {
    existingImageUrl = TopVoiceTable.photos;
    existingFileUrl = TopVoiceTable.file_path;
    uploadImage.recv(req, res, [
      {name: 'photos'}, {name: 'file_path'}
    ])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(TopVoiceTable);
      })
      .catch(function (err) {
        logger.error('recv upload TopVoiceTable picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'TopVoiceTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (TopVoiceTable) {
        if (files && files.photos && files.photos.length === 1) {
          TopVoiceTable.photos = path.join(uploadImage.mountDir, files.photos[0].filename).replace(/\\/g, '/');
          newingImageUrl = TopVoiceTable.photos;
        }
        if (files && files.file_path && files.file_path.length === 1) {
          TopVoiceTable.file_path = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file_path[0].filename).replace(/\\/g, '/');
          newingFileUrl = TopVoiceTable.file_path;
          socketsCtrl.get(files.file_path[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        TopVoiceTable.title = req.body.title;
        TopVoiceTable.content = req.body.content;
        TopVoiceTable.sbtime = req.body.sbtime;
        TopVoiceTable.type = req.body.type;
        // 图片
        /*if (files && files.file_path && files.file_path.length === 1) {
         existingImagejpg = path.join(mountDir1, files.file_path[0].filename).replace(/\\/g, '/');
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
         // aaa = distFileName.replace(/\\/g, '/');
         fs.exists(distFileName, function (exists) {
         if (!exists) {
         return res.status(404).send('转换后的文件不存在:' + distFileName);
         }
         var options = {};
         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
         newingFileUrl = distFileName1;
         TopVoiceTable.file_path = distFileName1;
         TopVoiceTable.save().then(function () {
         return TopVoiceTable.reload()
         .then(function () {
         resolve();
         });
         }).catch(function (err) {
         reject(err);
         });
         });
         });
         });
         }*/
        //if (!(files && files.file_path && files.file_path.length === 1)) {
        TopVoiceTable.save().then(function () {
          return TopVoiceTable.reload()
            .then(function () {
              resolve();
            });
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no TopVoiceTable img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      /*if (existingImagejpg) {
       var oldjpg = existingImagejpg.replace(uploadImage.mountDir, uploadImage.diskDir);
       fs.unlink(oldjpg, function (unlinkError) {
       if (unlinkError) {
       reject({message: 'jpg文件删除错误'});
       }
       });
       }*/
      if (existingImageUrl && newingImageUrl) {
        var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
        fs.unlink(oldfilename, function (unlinkError) {
          if (unlinkError) {
            // resolve();
            /**/
            reject({
              message: '图片删除错误'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
      /*if (existingFileUrl && newingFileUrl) {
       var oldfile = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
       fs.unlink(oldfile, function (unlinkError) {
       if (unlinkError) {
       reject({message: '删除文件错误'});
       } else {
       resolve();
       }
       });
       } else {
       resolve();
       }*/
      /* if (existingImageUrl && newingImageUrl && existingFileUrl && newingFileUrl) {
       var oldfile1 = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
       fs.unlink(oldfile1, function (unlinkError) {
       if (unlinkError) {
       reject({message: '删除文件错误'});
       }
       });
       var oldfilename1 = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
       fs.unlink(oldfilename1, function (unlinkError) {
       if (unlinkError) {
       reject({message: '图片删除错误'});
       } else {
       resolve();
       }
       });
       } else {
       resolve();
       }*/
    });
  }
};

/**
 * Delete an TopVoiceTable
 */
exports.delete = function (req, res) {
  var TopVoiceTable = req.model;

  TopVoiceTable.destroy().then(function () {
    res.json(TopVoiceTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of TopVoiceTable
 */
exports.list = function (req, res) {
  var TopVoiceTable = sequelize.model('TopVoiceTable');
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var type = req.query.type;
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (cont) {
    listCount(req, res, type);
  } else if (sum) {
    listByPage(req, res, limit, offset, type);
  } else {
    TopVoiceTable.findAll({
      where: {
        type: type
      },
      order: 'sbtime asc'
    }).then(function (TopVoiceTable) {
      return res.jsonp(TopVoiceTable);
    }).catch(function (err) {
      logger.error('TopVoiceTable list error:', err);
      return res.status(422).send(err);
    });
  }
};

/**
 * TopVoiceTable middleware
 */
exports.topvoiceinfoByID = function (req, res, next, id) {
  var TopVoiceTable = sequelize.model('TopVoiceTable');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   var type = req.query.type;
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, type);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, type);
   } else if (id !== '0') {*/
  TopVoiceTable.findOne({
    where: {id: id}
  }).then(function (TopVoiceTable) {
    if (!TopVoiceTable) {
      logger.error('No TopVoiceTable with that identifier has been found');
      return res.status(404).send({
        message: 'No TopVoiceTable with that identifier has been found'
      });
    }

    req.model = TopVoiceTable;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('TopVoiceTable ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
  // }
};
//----分页
function listByPage(req, res, limit, offset, type) {
  var TopVoiceTable = sequelize.model('TopVoiceTable');
  TopVoiceTable.findAll({
    where: {
      type: type
    },
    limit: offset,
    offset: limit,
    order: 'createdate DESC'
  }).then(function (YLC_activitiesTypeTable) {
    return res.jsonp(YLC_activitiesTypeTable);
  }).catch(function (err) {
    logger.error('YLC_activitiesTypeTable list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, type) {
  var sql = 'select count(*) sum from TopVoiceTable where type = ' + type;
  sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
    res.jsonp(infos);
  }).catch(function (err) {
    logger.error('listCount error:', err);
    return res.status(422).send(err);
  });
}
