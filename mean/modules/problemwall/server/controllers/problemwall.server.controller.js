'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  fs = require('fs'),
  config = require(path.resolve('./config/config')),
  multer = require(path.resolve('./config/private/multer')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

//创建会议照片
var uploadImage = new multer('ProblemWallImg',
  10 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
/**
 * Create an problemWall
 */
var ProblemWall = sequelize.model('ProblemWall');

exports.create = function (req, res) {
  var user = req.user;
  var ProblemWall = sequelize.model('ProblemWall');
  var problemWall = ProblemWall.build(req.body);
  if (problemWall) {
    uploadImage.recv(req, res, [{name: 'photoPath1'}, {name: 'photoPath2'}])
      .then(updateProblemWallInfo)
      .then(function () {
        res.json(problemWall.id);
      })
      .catch(function (err) {
        logger.error('新增异常:', err);
        res.status(422).send(err);
      });
  }

  function updateProblemWallInfo(files) {
    return new Promise(function (resolve, reject) {
      if (files && files.photoPath1 && files.photoPath1.length === 1) {
        problemWall.photoPath1 = path.join(uploadImage.mountDir, files.photoPath1[0].filename).replace(/\\/g, '/');
        problemWall.photoPath1 = 'http://113.140.83.174:3000' + problemWall.photoPath1;
      }
      // if (files && files.photoPath2 && files.photoPath2.length === 1) {
      //   problemWall.photoPath2 = path.join(uploadImage.mountDir, files.photoPath2[0].filename).replace(/\\/g, '/');
      // }
      problemWall.wtTitle = req.body.wtTitle;
      problemWall.wtContent = req.body.wtContent;
      problemWall.hfContent = req.body.hfContent;
      problemWall.super = req.body.super;
      problemWall.pt = req.body.pt;
      problemWall.createDate = new Date();
      problemWall.gradeId = parseInt(user.user_grade, 0);
      problemWall.roleId = parseInt(user.JCDJ_User_roleID, 0);
      problemWall.branchId = parseInt(user.branch, 0);
      problemWall.streetID = req.body.streetID;
      problemWall.gridId = req.body.gridId;
      problemWall.communityId = req.body.communityId;
      problemWall.gridId = req.body.gridId;
      problemWall.genersuper = req.body.genersuper;
      /*      problemWall.issb = req.body.issb;
       if (req.body.issb === '1') {
       problemWall.photoPath1 = req.body.photoPath1;
       problemWall.photoPath2 = req.body.photoPath2;
       }*/
      problemWall.save().then(function () {
        resolve();
      }).catch(function (err) {
        reject(err);
      });
    });
  }
};

/**
 * Show the current problemWall
 */
exports.read = function (req, res) {
  var problemWall = req.model ? req.model.toJSON() : {};

  //problemWall.isCurrentUserOwner = !!(req.user && problemWall.user && problemWall.user._id.toString() === req.user._id.toString());
  problemWall.isCurrentUserOwner = !!(req.user && problemWall.user && problemWall.user.id.toString() === req.user.id.toString());

  res.json(problemWall);
};

/**
 * Update an problemWall
 */
exports.update = function (req, res) {
  var reqUser = req.user;
  var problemWall = req.model;
  var newingImageUrl;
  var newingImageUrl2;
  var existingImageUrl;
  var existingImageUrl2;
  if (problemWall) {
    existingImageUrl = problemWall.photoPath1;
    existingImageUrl2 = problemWall.photoPath2;
    uploadImage.recv(req, res, [{name: 'photoPath1'}, {name: 'photoPath2'}])
      .then(updateProblemWallInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(problemWall.id);
      })
      .catch(function (err) {
        logger.error('修改异常:', err);
        res.status(422).send(err);
      });
  }
  function updateProblemWallInfo(files) {
    return new Promise(function (resolve, reject) {
      if (files && files.photoPath1 && files.photoPath1.length === 1) {
        problemWall.photoPath1 = path.join(uploadImage.mountDir, files.photoPath1[0].filename).replace(/\\/g, '/');
        newingImageUrl = problemWall.photoPath1;
        problemWall.photoPath1 = 'http://113.140.83.174:3000' + problemWall.photoPath1;
      }
      // if (files && files.photoPath2 && files.photoPath2.length === 1) {
      //   problemWall.photoPath2 = path.join(uploadImage.mountDir, files.photoPath2[0].filename).replace(/\\/g, '/');
      //   newingImageUrl2 = problemWall.photoPath2;
      // }
      var userName = reqUser.displayName;
      var hfTime = new Date().toLocaleString();
      problemWall.wtTitle = req.body.wtTitle;
      problemWall.wtContent = req.body.wtContent;
      problemWall.hfContent = req.body.hfContent;
      // problemWall.issb = req.body.issb;
      problemWall.save().then(function () {
        resolve();
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  // 删除旧照片
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
      } else {
        resolve();
      }
      if (existingImageUrl2 && newingImageUrl2) {
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
};

/**
 * Delete an problemWall
 */
exports.delete = function (req, res) {

  var problemWall = req.model;

  problemWall.destroy().then(function () {
    res.json(problemWall);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of ProblemWall
 */
exports.list = function (req, res) {
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
  var offset = parseInt(req.query.offset, 0);//10 每页总数
  var gradeId = parseInt(req.user.user_grade, 0);//gradeId
  var roleId = parseInt(req.user.JCDJ_User_roleID, 0);//roleId
  var branchId;
  var cont = req.query.cont;
  var sum = req.query.sum;
  if (gradeId === 10) {
    branchId = req.query.orgbranch;
  } else if (gradeId === 9) {
    branchId = req.query.orgbranch;
  } else {
    branchId = parseInt(req.user.branch, 0);
  }
  var _super;
  if (gradeId === 10) {
    _super = req.query.genersuper;
  } else if (gradeId === 9) {
    _super = req.query.genersuper;
  } else {
    parseInt(req.user.branch, 0);
  }
  if (sum) {
    listByPage(req, res, limit, offset, gradeId, roleId, branchId, _super);
  } else if (cont) {
    listCount(req, res, gradeId, roleId, branchId, _super);
  }
  /*  var ProblemWall = sequelize.model('ProblemWall');

   ProblemWall.findAll({
   order: 'id desc'
   }).then(function (problemWall) {
   return res.jsonp(problemWall);
   }).catch(function (err) {
   logger.error('problemWall list error:', err);
   return res.status(422).send(err);
   });*/
};


//----分页
function listByPage(req, res, limit, offset, gradeId, roleId, branchId, _super) {

  var opt;
  if (gradeId === 6) {
    opt = {
      gradeId: 6,
      branchId: branchId
    };
  } else if (gradeId === 7) {
    opt = {
      gradeId: 7,
      branchId: branchId
    };
  } else if (gradeId === 10) {
    opt = {
      gradeId: 10,
      generalBranch: _super
    };
  } else if (gradeId === 9) {
    opt = {
      gradeId: 9,
      generalBranch: _super
    };
  } else if (gradeId === 1) {
    opt = {};
  } else if (gradeId === 5) {
    opt = {
      gradeId: 5,
      roleId: roleId
    };
  } else if (gradeId === 4) {
    opt = {
      gradeId: 4,
      roleId: roleId
    };
  }
  var ProblemWallRec = sequelize.model('ProblemWallRec');
  var ProblemWall = sequelize.model('ProblemWall');

  ProblemWallRec.findAll({
    where: opt,
    limit: offset,
    offset: limit,
    include: [
      {
        model: ProblemWall,
        attributes: ['wtTitle', 'wtContent', 'pt', 'photoPath1', 'photoPath2', 'photoPath3', 'hfContent']
      }
    ],
    order: 'id desc'
  }).then(function (problemWall) {
    return res.jsonp(problemWall);
  }).catch(function (err) {
    logger.error('problemWall list error:', err);
    return res.status(422).send(err);
  });
}
//---------总数
function listCount(req, res, gradeId, roleId, branchId, _super) {

  var where;
  if (gradeId === 7) {
    where = {
      gradeId: 7,
      branchId: branchId
    };
  } else if (gradeId === 10) {
    where = {
      gradeId: 10,
      generalBranch: _super
    };
  } else {
    if (gradeId === 1) {
      where = {};
    } else {
      // 党工委 5
      where = {
        gradeId: gradeId,
        roleId: roleId
      };
    }

  }
  var ProblemWallRec = sequelize.model('ProblemWallRec');
  var ProblemWall = sequelize.model('ProblemWall');
  ProblemWallRec.findAll({
    where: where,
    attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
  }).then(function (Progr) {
    return res.jsonp(Progr);
  }).catch(function (err) {
    logger.error('ProblemWallRec list error:', err);
    return res.status(422).send(err);
  });
}

/**
 * ProblemWall middleware
 */
exports.problemWallByID = function (req, res, next, id) {
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
   var offset = parseInt(req.query.offset, 0);//10 每页总数
   var gradeId = parseInt(req.user.user_grade, 0);//gradeId
   var roleId = parseInt(req.user.JCDJ_User_roleID, 0);//roleId
   var branchId;
   if (gradeId === 10) {
   branchId = req.query.orgbranch;
   } else if (gradeId === 9) {
   branchId = req.query.orgbranch;
   } else {
   branchId = parseInt(req.user.branch, 0);
   }
   var _super;
   if (gradeId === 10) {
   _super = req.query.genersuper;
   } else if (gradeId === 9) {
   _super = req.query.genersuper;
   } else {
   parseInt(req.user.branch, 0);
   }*/
  var ProblemWall = sequelize.model('ProblemWall');
  var ProblemWallRec = sequelize.model('ProblemWallRec');
  /*if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, gradeId, roleId, branchId, _super);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, gradeId, roleId, branchId, _super);
   } else if (id !== '0') {*/
  ProblemWall.findOne({
    where: {id: id}
  }).then(function (problemWall) {
    if (!problemWall) {
      logger.error('No problemWall with that identifier has been found');
      return res.status(404).send({
        message: 'No problemWall with that identifier has been found'
      });
    }
    req.model = problemWall;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('problemWall ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
//  }
};
/*
 /!**
 * ProblemWall middleware
 *!/
 exports.problemWallByID = function (req, res, next, id) {
 var limit = parseInt(req.query.limit, 0);//(pageNum-1)*10
 var offset = parseInt(req.query.offset, 0);//10 每页总数
 var gradeId = parseInt(req.user.user_grade, 0);//gradeId
 var roleId = parseInt(req.user.JCDJ_User_roleID, 0);//roleId
 var branchId = gradeId === 10 ? req.query.orgbranch : parseInt(req.user.branch, 0);//branchId
 var _super = gradeId === 10 ? req.query.genersuper : parseInt(req.query._super, 0);//_super
 var ProblemWall = sequelize.model('ProblemWall');
 if (offset !== 0 && id === '0') {
 listByPage(req, res, limit, offset, gradeId, roleId, branchId, _super);
 } else if (limit === 0 && offset === 0 && id === '0') {
 listCount(req, res, gradeId, roleId, branchId, _super);
 } else if (id !== '0') {
 ProblemWall.findOne({
 where: {id: id}
 }).then(function (problemWall) {
 if (!problemWall) {
 logger.error('No problemWall with that identifier has been found');
 return res.status(404).send({
 message: 'No problemWall with that identifier has been found'
 });
 }
 req.model = problemWall;
 next();
 }).catch(function (err) {
 //return next(err);
 logger.error('problemWall ByID error:', err);
 res.status(422).send({
 message: errorHandler.getErrorMessage(err)
 });
 });
 }
 };
 */
