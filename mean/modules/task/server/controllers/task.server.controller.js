'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  socketsCtrl = require(path.resolve('./modules/global/server/controllers/wordhtml.js')),
  multer = require(path.resolve('./config/private/multer')),
  util = require('util'),
  child_process = require('child_process');
//创建接收图片的对象
var saveDir = 'taskfile';
// var diskDir1 = path.resolve(config.uploads.rootDiskDir, saveDir);
// var mountDir1 = path.join(config.uploads.rootMountDir, saveDir).replace(/\\/g, '/');
// //目标文件类型
// var distType = 'html';
// //不同类型参数
// var typeParam = {
//   //html 字符集utf-8
//   html: ':XHTML Writer File:UTF8'
// };
//创建接收头像对象
var uploadImage = new multer(saveDir,
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an task
 */


exports.create = function (req, res) {

  var User = sequelize.model('User');
  var Task = sequelize.model('Task');
  var task = Task.build(req.body);
  logger.error('----task---', task);
  task.user_id = req.user.id;
  task.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return task.reload({
      include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]
    })
      .then(function () {
        res.json(task);
      });
  }).catch(function (err) {
    logger.error('task create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current task
 */
exports.read = function (req, res) {
  var task = req.model ? req.model.toJSON() : {};

  //task.isCurrentUserOwner = !!(req.user && task.user && task.user._id.toString() === req.user._id.toString());
  task.isCurrentUserOwner = !!(req.user && task.user && task.user.id.toString() === req.user.id.toString());

  res.json(task);
};

/**
 * Update an task
 */
exports.update = function (req, res) {
  var task = req.model;

  task.title = req.body.title;
  task.content = req.body.content;

  task.save().then(function () {
    res.json(task);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an task
 */
exports.delete = function (req, res) {
  var task = req.model;

  task.destroy().then(function () {
    res.json(task);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Task
 */
exports.list = function (req, res) {
  var AssignedTable = sequelize.model('AssignedTable');
  var Assigned_jb_bm = sequelize.model('Assigned_jb_bm');
  var limit = req.query.limit;
  var offset = req.query.offset;
  var GradeID = req.query.GradeID;
  var SendObjectId = req.query.SendObjectId;
  var AssignedId = req.query.AssignedId;
  var createUserId = req.query.createUserId;
  if (createUserId) {
    AssignedTable.findAll({
      where: {
        isdelete: 0,
        createUser: createUserId
      },
      limit: limit,
      offset: offset,
      order: 'AssignedId desc'
    }).then(function (task) {
      return res.jsonp(task);
    }).catch(function (err) {
      logger.error('task list error:', err);
      return res.status(422).send(err);
    });
  } else if (AssignedId) {
    AssignedTable.findAll({
      where: {
        isdelete: 0,
        AssignedId: AssignedId
      },
      limit: limit,
      offset: offset,
      order: 'AssignedId desc'
    }).then(function (task) {
      return res.jsonp(task);
    }).catch(function (err) {
      logger.error('task list error:', err);
      return res.status(422).send(err);
    });
  } else {
    Assigned_jb_bm.findAll({
      where: {
        GradeID: GradeID,
        SendObjectId: SendObjectId
      }
    }).then(function (data) {
      return res.jsonp(data);
    }).catch(function (err) {

    });
  }
};
exports.getStr = function (req, res) {
  var Assigned_jb = sequelize.model('Assigned_jb');
  var Assigned_id = req.query.Assigned_id;
  Assigned_jb.findAll({
    where: {
      Assigned_id: Assigned_id
    }
  }).then(function (data) {
    return res.jsonp(data);
  }).catch(function (err) {
    console.log(err);
  });
};
exports.getBm = function (req, res) {
  var Assigned_bm = sequelize.model('Assigned_bm');
  var Assigned_id = req.query.Assigned_id;
  Assigned_bm.findAll({
    where: {
      Assigned_id: Assigned_id
    }
  }).then(function (data) {
    return res.jsonp(data);
  }).catch(function (err) {
    console.log(err);
  });
};
/**
 * Task middleware
 */
exports.taskByID = function (req, res, next, id) {
  var Task = sequelize.model('Task');
  var User = sequelize.model('User');

  Task.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (task) {
    if (!task) {
      logger.error('No task with that identifier has been found');
      return res.status(404).send({
        message: 'No task with that identifier has been found'
      });
    }

    req.model = task;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('task ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
exports.getReply = function (req, res) {
  var AssignedNexus = sequelize.model('AssignedNexus');
  var AssignedId = req.query.Id;
  var fromPersonId = req.query.fromPersonId;
  var toPersonId = req.query.toPersonId;
  var content = req.query.content;
  var time = new Date();
  var HF_name = req.query.HF_name;
  if (content) {
    if (Array.isArray(toPersonId)) {
      for (var hh = 0; hh < toPersonId.length; hh++) {
        AssignedNexus.create({
          AssignedId: AssignedId,
          NexusContext: content,
          createDate: time,
          PT_type: 3,
          isdelete: 0,
          HF_name: HF_name,
          fromPersonId: fromPersonId,
          toPersonId: toPersonId[hh]
        }).then(function (data) {
          var d = [];
          d.push(data);
          res.jsonp(d);
        }).catch(function (err) {
          console.log('插入失败！');
        });
      }
    } else {
      AssignedNexus.create({
        AssignedId: AssignedId,
        NexusContext: content,
        createDate: time,
        PT_type: 3,
        isdelete: 0,
        HF_name: HF_name,
        fromPersonId: fromPersonId,
        toPersonId: toPersonId
      }).then(function (data) {
        var d = [];
        d.push(data);
        res.jsonp(d);
      }).catch(function (err) {
        console.log('插入失败！');
      });
    }
  } else {
    if (Array.isArray(toPersonId)) {
      toPersonId[toPersonId.length] = fromPersonId;
      AssignedNexus.findAll({
        where: {
          AssignedId: AssignedId,
          fromPersonId: toPersonId,
          toPersonId: toPersonId
        }
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      AssignedNexus.findAll({
        where: {
          AssignedId: AssignedId,
          fromPersonId: [fromPersonId, toPersonId],
          toPersonId: [fromPersonId, toPersonId]
        }
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log(err);
      });
    }

  }
};

exports.addTask = function (req, res) {
  var AssignedTable = sequelize.model('AssignedTable');
  var assignedTable = AssignedTable.build(req.body);
  var newingImageUrl;
  var existingFileUrl;
  var existingImagejpg;
  var newingFileUrl;
  var AssignedNexus = sequelize.model('AssignedNexus');
  var time = new Date();

  if (assignedTable) {
    uploadImage.recv(req, res, [{name: 'img1'}, {name: 'img2'}, {name: 'img3'}, {name: 'file'}])
      .then(updateTaskPic)
      .then(function () {
        res.json(assignedTable);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'AssignedTable is not exist'
    });
  }
  function updateTaskPic(files) {
    return new Promise(function (resolve, reject) {
      if (assignedTable) {
        // logger.info( req.body);
        if (files && files.img1 && files.img1.length === 1) {
          // console.log(files.img1[0].filename);
          assignedTable.img1 = path.join(uploadImage.mountDir, files.img1[0].filename).replace(/\\/g, '/');
          assignedTable.img1 = 'http://113.140.83.174:3000' + assignedTable.img1;
          // newingImageUrl = assignedTable.img1;
          // console.log(assignedTable.img1);
        }
        if (files && files.img2 && files.img2.length === 1) {
          assignedTable.img2 = path.join(uploadImage.mountDir, files.img2[0].filename).replace(/\\/g, '/');
          assignedTable.img2 = 'http://113.140.83.174:3000' + assignedTable.img2;
          // newingImageUrl = assignedTable.img2;
        }
        if (files && files.img3 && files.img3.length === 1) {
          assignedTable.img3 = path.join(uploadImage.mountDir, files.img3[0].filename).replace(/\\/g, '/');
          assignedTable.img3 = 'http://113.140.83.174:3000' + assignedTable.img3;
          // newingImageUrl = assignedTable.img3;
        }
        if (files && files.file && files.file.length === 1) {
          assignedTable.file = path.join(uploadImage.mountDir, files.file[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.file[0].filename).replace(/\\/g, '/');
          newingFileUrl = assignedTable.file;
          socketsCtrl.get(files.file[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        assignedTable.AssignedTitle = req.body.title;
        assignedTable.AssignedContent = req.body.content;
        assignedTable.starttime = req.body.starttime;
        assignedTable.endtime = req.body.endtime;
        assignedTable.tasktype = req.body.tasktype;
        assignedTable.createDate = time;
        assignedTable.payoutName = req.body.payoutName;
        assignedTable.createUser = req.body.createUser;
        assignedTable.isdelete = 0;
        assignedTable.PT_type = 1;
        //图片
        // if (files && files.file && files.file.length === 1) {
        //   existingImagejpg = path.join(mountDir1, files.file[0].filename).replace(/\\/g, '/');
        //   // newingFileUrl = womenInformationManagement.file;
        //   //  转HTML
        //   var diskFileName = path.join(diskDir1, files.file[0].filename);
        //   fs.exists(diskFileName, function (exists) {
        //     if (!exists) {
        //       logger.warn('conv docfile %s not exists', diskFileName);
        //       return res.status(404).send('参数文件不存在:' + diskFileName);
        //     }
        //     var type = distType + (typeParam[distType] ? typeParam[distType] : '');
        //     var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
        //       config.sofficePathName, type, diskDir1, diskFileName);
        //
        //     child_process.exec(cmdLine, function (error, stdout, stderr) {
        //       if (error) {
        //         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
        //         return res.status(404).send('文件转换错误:' + diskFileName);
        //       }
        //       var distFile = path.basename(files.file[0].filename, path.extname(files.file[0].filename)) + '.' + distType;
        //       var distFileName = path.join(diskDir1, distFile);
        //       fs.exists(distFileName, function (exists) {
        //         if (!exists) {
        //           return res.status(404).send('转换后的文件不存在:' + distFileName);
        //         }
        //         var options = {};
        //         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
        //         newingFileUrl = distFileName1;
        //         assignedTable.file = distFileName1;
        //         assignedTable.save().then(function () {
        //           assignedTable.payout = req.body.payout;
        //           assignedTable.save().then(function () {
        //             resolve();
        //             if (req.body.toNotice) {
        //               var TopVoiceTable = sequelize.model('TopVoiceTable');
        //               TopVoiceTable.create({
        //                 title: req.body.title,
        //                 photos: assignedTable.img1,
        //                 file_path: distFileName1,
        //                 content: req.body.content,
        //                 time: req.body.starttime,
        //                 sbtime: req.body.starttime
        //               }).then(function () {
        //
        //               }).catch(function (err) {
        //                 console.log('出错了。。。。。');
        //               });
        //             }
        //           }).catch(function (err) {
        //             reject(err);
        //           });
        //         }).catch(function (err) {
        //           reject(err);
        //         });
        //       });
        //     });
        //   });
        // }
        // if (!(files && files.file && files.file.length === 1)) {
        assignedTable.save().then(function () {
          assignedTable.payout = req.body.payout;
          assignedTable.save().then(function () {
            if (req.body.toNotice) {
              var TopVoiceTable = sequelize.model('TopVoiceTable');
              TopVoiceTable.create({
                title: req.body.title,
                photos: assignedTable.img1,
                file_path: assignedTable.file,
                content: req.body.content,
                time: req.body.starttime,
                sbtime: req.body.starttime,
                createdate: req.body.starttime,
                type: 1
              }).then(function () {

              }).catch(function (err) {
                console.log('出错了。。。。。');
              });
            }
            resolve();
          }).catch(function (err) {
            reject(err);
          });
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no grid person img upload'));
      }
    });
  }
};
exports.addRelation = function (req, res) {
  var Assigned_jb_bm = sequelize.model('Assigned_jb_bm');
  var Relation = JSON.parse(req.query.Relation);
  var AssignedId = req.query.AssignedId;
  // var createUserId = req.query.createUserId;
  for (var i = 0; i < Relation.length; i++) {
    if (Array.isArray(Relation[i].objId)) {
      for (var j = 0; j < Relation[i].objId.length; j++) {
        Assigned_jb_bm.create({
          AssignedId: AssignedId,
          GradeID: Relation[i].cjId,
          SendObjectId: Relation[i].objId[j],
          SendObjectName: Relation[i].objname[j],
          // createUserId: createUserId,
          TaskProgress: 1,
          isOnTime: 0
        }).then(function (data) {
          var b = [];
          b.push(data);
          return res.jsonp(b);
        }).catch(function () {

        });
      }
    } else {
      Assigned_jb_bm.create({
        AssignedId: AssignedId,
        GradeID: Relation[i].cjId,
        SendObjectId: Relation[i].objId,
        SendObjectName: Relation[i].objname,
        // createUserId: createUserId,
        TaskProgress: 1,
        isOnTime: 0
      }).then(function (ss) {
        var b = [];
        b.push(ss);
        return res.jsonp(b);
      }).catch(function () {

      });
    }
  }
};
exports.getCount = function (req, res) {
  var AssignedTable = sequelize.model('AssignedTable');
  var AssignedIds = req.query.AssignedId;
  var createUserId = req.query.createUserId;
  if (AssignedIds) {
    AssignedTable.findAll({
      where: {
        isdelete: 0,
        AssignedId: AssignedIds
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('AssignedId')), 'count']]
    }).then(function (data) {
      return res.jsonp(data);
    }).catch(function (err) {
      console.log(err);
    });
  } else {
    AssignedTable.findAll({
      where: {
        isdelete: 0,
        createUser: createUserId
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('AssignedId')), 'count']]
    }).then(function (data) {
      return res.jsonp(data);
    }).catch(function (err) {
      console.log(err);
    });
  }
};
exports.getPayputBm = function (req, res) {
  var Assigned_jb_bm = sequelize.model('Assigned_jb_bm');
  var AssignedId = req.query.AssignedId;
  var GradeID = req.query.GradeID;
  var SendObjectId = req.query.SendObjectId;
  var Id = req.query.Id;
  // 领取任务
  if (GradeID) {
    Assigned_jb_bm.update(
      {
        TaskProgress: 2
      }
      , {
        where: {
          AssignedId: AssignedId,
          GradeID: GradeID,
          SendObjectId: SendObjectId
        }
      })
      .then(function (data) {
        res.jsonp(data);
      })
      .catch(function (err) {
        res.jsonp(err);
      });
    //  任务进度详情
  } else if (Id) {
    Assigned_jb_bm.findAll({
      where: {
        Id: Id
      }
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      res.jsonp(err);
    });
    //  任务下发单位的列表
  } else {
    Assigned_jb_bm.findAll({
      where: {
        AssignedId: AssignedId
      },
      order: 'FinishedTime desc'
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      res.jsonp(err);
    });
  }
};

exports.uploadTaskProgress = function (req, res) {
  var assignedProgressTable;
  var AssignedProgressTable;
  var existingImageUrl;
  var existingImageUrl1;
  var existingImageUrl2;
  var existingFileUrl;
  var existingImagejpg;
  var newingFileUrl;
  var newingImageUrl;
  var newingImageUrl1;
  var newingImageUrl2;
  AssignedProgressTable = sequelize.model('AssignedProgressTable');
  assignedProgressTable = AssignedProgressTable.build(req.body);
  // if (req.model) {
  //   assignedProgressTable = req.model;
  // } else {
  //   AssignedProgressTable = sequelize.model('AssignedProgressTable');
  //   assignedProgressTable = AssignedProgressTable.build(req.body);
  // }
  if (assignedProgressTable) {
    existingImageUrl = assignedProgressTable.img1;
    existingImageUrl1 = assignedProgressTable.img2;
    existingImageUrl2 = assignedProgressTable.img3;
    existingFileUrl = assignedProgressTable.progressFile;
    uploadImage.recv(req, res, [
      {name: 'img1'}, {name: 'img2'}, {name: 'img3'}, {name: 'progressFile'}
    ])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(assignedProgressTable);
      })
      .catch(function (err) {
        logger.error('recv upload assignedProgressTable picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'assignedProgressTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (assignedProgressTable) {
        if (files && files.img1 && files.img1.length === 1) {
          assignedProgressTable.img1 = path.join(uploadImage.mountDir, files.img1[0].filename).replace(/\\/g, '/');
          assignedProgressTable.img1 = 'http://113.140.83.174:3000' + assignedProgressTable.img1;
          newingImageUrl = assignedProgressTable.img1;
        }
        if (files && files.img2 && files.img2.length === 1) {
          assignedProgressTable.img2 = path.join(uploadImage.mountDir, files.img2[0].filename).replace(/\\/g, '/');
          assignedProgressTable.img2 = 'http://113.140.83.174:3000' + assignedProgressTable.img2;
          newingImageUrl1 = assignedProgressTable.img2;
        }
        if (files && files.img3 && files.img3.length === 1) {
          assignedProgressTable.img3 = path.join(uploadImage.mountDir, files.img3[0].filename).replace(/\\/g, '/');
          assignedProgressTable.img3 = 'http://113.140.83.174:3000' + assignedProgressTable.img3;
          newingImageUrl2 = assignedProgressTable.img3;
        }
        if (files && files.progressFile && files.progressFile.length === 1) {
          assignedProgressTable.progressFile = path.join(uploadImage.mountDir, files.progressFile[0].filename).replace(/\\/g, '/').slice(0, -4) + '.html';
          existingImagejpg = path.join(uploadImage.mountDir, files.progressFile[0].filename).replace(/\\/g, '/');
          newingFileUrl = assignedProgressTable.progressFile;
          socketsCtrl.get(files.progressFile[0].filename, uploadImage, existingImagejpg, existingFileUrl, newingFileUrl);
        }
        assignedProgressTable.remark = req.body.remark;
        var whereObj = {};
        assignedProgressTable.assigned_jb_bm_id = req.body.assigned_jb_bm_id;
        assignedProgressTable.progressContent = req.body.progressContent;
        assignedProgressTable.isdelete = 0;
        assignedProgressTable.createUser = req.body.createUser;
        assignedProgressTable.createDate = new Date();
        assignedProgressTable.remarks = req.body.remarks;
        // 文件
        // if (files && files.progressFile && files.progressFile.length === 1) {
        //   existingImagejpg = path.join(mountDir1, files.progressFile[0].filename).replace(/\\/g, '/');
        //   var diskFileName = path.join(diskDir1, files.progressFile[0].filename);
        //   fs.exists(diskFileName, function (exists) {
        //     if (!exists) {
        //       logger.warn('conv docfile %s not exists', diskFileName);
        //       return res.status(404).send('参数文件不存在:' + diskFileName);
        //     }
        //     var type = distType + (typeParam[distType] ? typeParam[distType] : '');
        //     var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
        //       config.sofficePathName, type, diskDir1, diskFileName);
        //     child_process.exec(cmdLine, function (error, stdout, stderr) {
        //       if (error) {
        //         logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
        //         return res.status(404).send('文件转换错误:' + diskFileName);
        //       }
        //       var distFile = path.basename(files.progressFile[0].filename, path.extname(files.progressFile[0].filename)) + '.' + distType;
        //       var distFileName = path.join(diskDir1, distFile);
        //       // aaa = distFileName.replace(/\\/g, '/');
        //       fs.exists(distFileName, function (exists) {
        //         if (!exists) {
        //           return res.status(404).send('转换后的文件不存在:' + distFileName);
        //         }
        //         var options = {};
        //         var distFileName1 = path.join(uploadImage.mountDir, distFile).replace(/\\/g, '/');
        //         newingFileUrl = distFileName1;
        //         assignedProgressTable.progressFile = distFileName1;
        //         assignedProgressTable.save().then(function () {
        //           return assignedProgressTable.reload()
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
        // if (!(files && files.progressFile && files.progressFile.length === 1)) {
        assignedProgressTable.save().then(function () {
          return assignedProgressTable.reload()
            .then(function () {
              resolve();
            });
        }).catch(function (err) {
          reject(err);
        });
        // }
      } else {
        reject(new Error('no assignedProgressTable img upload'));
      }
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      // if (existingImagejpg) {
      //   var oldjpg = existingImagejpg.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldjpg, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: 'jpg文件删除错误'});
      //     }
      //   });
      // }
      // if (existingImageUrl && newingImageUrl) {
      //   var oldfilename = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfilename, function (unlinkError) {
      //     if (unlinkError) {
      //       // resolve();
      //       /**/
      //       reject({
      //         message: '图片删除错误'
      //       });
      //     } else {
      //       resolve();
      //     }
      //   });
      // } else {
      //   resolve();
      // }
      if (existingFileUrl && newingFileUrl) {
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
      }
      // if (existingImageUrl && newingImageUrl && existingFileUrl && newingFileUrl) {
      //   var oldfile1 = existingFileUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfile1, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: '删除文件错误'});
      //     }
      //   });
      //   var oldfilename1 = existingImageUrl.replace(uploadImage.mountDir, uploadImage.diskDir);
      //   fs.unlink(oldfilename1, function (unlinkError) {
      //     if (unlinkError) {
      //       reject({message: '图片删除错误'});
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
exports.getTaskProgress = function (req, res) {
  var AssignedProgressTable = sequelize.model('AssignedProgressTable');
  var Assigned_jb_bm = sequelize.model('Assigned_jb_bm');
  var assigned_jb_bm_id = req.query.assigned_jb_bm_id;
  var isend = req.query.isend;
  if (isend) {
    Assigned_jb_bm.update(
      {
        TaskProgress: 3
      },
      {
        where: {
          Id: assigned_jb_bm_id
        }
      })
      .then(function (data) {
        return res.jsonp(data);
      })
      .catch(function (data) {
        console.log('出错了');
      });
  } else {
    AssignedProgressTable.findAll({
      where: {
        assigned_jb_bm_id: assigned_jb_bm_id
      },
      order: 'id desc'
    }).then(function (data) {
      return res.jsonp(data);
    }).catch(function (data) {
      console.log('出错了');
    });
  }

};
