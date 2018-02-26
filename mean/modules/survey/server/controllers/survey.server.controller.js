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

var saveDir = 'surveyPicfileimg';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// //目标文件类型
// var distType = 'html';
// //不同类型参数
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
 * Create an survey
 */
/*exports.create = function (req, res) {
 var User = sequelize.model('User');
 var Survey = sequelize.model('Survey');
 var survey = Survey.build(req.body);

 survey.user_id = req.user.id;
 survey.save().then(function () {
 //重新加载数据，使数据含有关联表的内容
 return survey.reload({
 include: [
 {
 model: User,
 attributes: ['displayName']
 }
 ]
 })
 .then(function() {
 res.json(survey);
 });
 }).catch(function (err) {
 logger.error('survey create error:', err);
 return res.status(422).send({
 message: errorHandler.getErrorMessage(err)
 });
 });
 };*/

/**
 * Show the current survey
 */
exports.read = function (req, res) {
  var survey = req.model ? req.model.toJSON() : {};

  //survey.isCurrentUserOwner = !!(req.user && survey.user && survey.user._id.toString() === req.user._id.toString());
  survey.isCurrentUserOwner = !!(req.user && survey.user && survey.user.id.toString() === req.user.id.toString());

  res.json(survey);
};

/**
 * Update an survey
 */
/*exports.update = function (req, res) {
 var survey = req.model;

 survey.title = req.body.title;
 survey.content = req.body.content;

 survey.save().then(function () {
 res.json(survey);
 }).catch(function (err) {
 return res.status(422).send({
 message: errorHandler.getErrorMessage(err)
 });
 });
 };*/

exports.update = function (req, res) {
  var survey;
  var existingImageUrl;
  var newingImageUrl;
  var newingFileUrl;
  var existingFileUrl;
  var existingImagejpg;
  var Survey;
  if (req.model) {
    survey = req.model;
  } else {
    Survey = sequelize.model('Survey');
    survey = Survey.build(req.body);
    survey.creatdate = new Date();
  }
  if (survey) {
    existingImageUrl = survey.imgFile;
    existingFileUrl = survey.textfile;
    uploadImage.recv(req, res, [{name: 'imgFile'}, {name: 'textfile'}])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(survey);
      })
      .catch(function (err) {
        logger.error('recv upload survey picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'survey is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (survey) {
        if (files && files.imgFile && files.imgFile.length === 1) {
          survey.imgFile = path.join(uploadImage.mountDir, files.imgFile[0].filename).replace(/\\/g, '/');
          newingImageUrl = survey.imgFile;
        }
        if (files && files.textfile && files.textfile.length === 1) {
          survey.textfile = path.join(uploadImage.mountDir, files.textfile[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.textfile[0].filename).replace(/\\/g, '/');
          newingFileUrl = survey.textfile;
          socketsCtrl.get(files.textfile[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        survey.content = req.body.content;
        survey.grade = req.body.grade;
        survey.objid = req.body.objid;
        survey.user_id = req.body.user_id;
        // //图片
        // if (files && files.textfile && files.textfile.length === 1) {
        //   existingImagejpg = path.join(mountDir1, files.textfile[0].filename).replace(/\\/g, '/');
        //   // newingFileUrl = womenInformationManagement.textfile;
        //   //  转HTML
        //   var diskFileName = path.join(diskDir1, files.textfile[0].filename);
        //   fs.exists(diskFileName, function (exists) {
        //     if (!exists) {
        //       logger.warn('conv docfile %s not exists', diskFileName);
        //       return res.status(404).send('参数文件不存在:' + diskFileName);
        //     }
        //
        //     var type = distType + (typeParam[distType] ? typeParam[distType] : '');
        //     var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
        //       config.sofficePathName, type, diskDir1, diskFileName);
        //
        //     child_process.exec(cmdLine, function (error, stdout, stderr) {
        //       if (error) {
        //         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
        //         return res.status(404).send('文件转换错误:' + diskFileName);
        //       }
        //       var distFile = path.basename(files.textfile[0].filename, path.extname(files.textfile[0].filename)) + '.' + distType;
        //       var distFileName = path.join(diskDir1, distFile);
        //       // aaa = distFileName.replace(/\\/g, '/');
        //       fs.exists(distFileName, function (exists) {
        //         if (!exists) {
        //           return res.status(404).send('转换后的文件不存在:' + distFileName);
        //         }
        //         var options = {};
        //         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
        //         newingFileUrl = distFileName1;
        //         survey.textfile = distFileName1;
        //         survey.save().then(function () {
        //           return survey.reload()
        //             .then(function () {
        //               resolve();
        //             });
        //         }).catch(function (err) {
        //           reject(err);
        //         });
        //       });
        //     });
        //   });
        // }
        // if (!(files && files.textfile && files.textfile.length === 1)) {
        survey.save().then(function () {
          return survey.reload()
            .then(function () {
              resolve();
            });
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no survey imgFile img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      // if (existingImagejpg) {
      //   var oldImageName = existingImagejpg.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldImageName, function (unlinkError) {
      //   });
      // }
      // if (existingImageUrl && newingImageUrl) {
      //   var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfilename, function (unlinkError) {
      //     if (unlinkError) {
      //       resolve();
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
      if (existingImageUrl && newingImageUrl) {
        var oldfile = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
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
      // if (existingFileUrl && newingFileUrl && existingImageUrl && newingImageUrl) {
      //   var oldfilename1 = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   // console.log(oldfilename1);
      //   var oldImageName1 = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldImageName1, function (unlinkError) {
      //   });
      //   fs.unlink(oldfilename1, function (unlinkError) {
      //     if (unlinkError) {
      //       resolve();
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
    });
  }
};

/**
 * Delete an survey
 */
exports.delete = function (req, res) {
  var survey = req.model;

  survey.destroy().then(function () {
    res.json(survey);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Survey
 */
exports.list = function (req, res) {
  var Survey = sequelize.model('Survey');
 // var User = sequelize.model('User');
  var id = req.query.id;
  var grade = req.query.grade;
  var objid = req.query.objid;
  var where;
  if (grade && objid) {
    where = {
      grade: grade,
      objid: objid
    };
  } else {
    where = {
      user_id: id
    };
  }
  Survey.findAll({
    where: where,
    limit: 1,
    offset: 0,
    order: 'id ASC'
  }).then(function (survey) {
    return res.jsonp(survey);
  }).catch(function (err) {
    logger.error('survey list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Survey middleware
 */
exports.surveyByID = function (req, res, next, id) {
  var Survey = sequelize.model('Survey');
  //var User = sequelize.model('User');

  Survey.findOne({
    where: {id: id}/*,
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]*/
  }).then(function (survey) {
    if (!survey) {
      logger.error('No survey with that identifier has been found');
      return res.status(404).send({
        message: 'No survey with that identifier has been found'
      });
    }

    req.model = survey;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('survey ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
