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

//创建项目Logo对象
var uploadImage = new multer('projectLogofileimg',
  20 * 1024 * 1024,
  /image/, '.jpg');
//创建目录
uploadImage.mkPaths();
var ProjectRenList = sequelize.model('ProjectRenList');
function creat(obj) {
  ProjectRenList.create(obj).then(function (ProjectRenList) {
    //console.log(ProjectRenList);
  });
}
function deletes(obj) {
  ProjectRenList.destroy({
    where: obj
  }).then(function (ProjectRenList) {
    //console.log(ProjectRenList);
  });
}
function renlit(proID, obj, arrlist) {
  var newarr = [];
  var oldarr = [];
  if (arrlist) {
    obj.forEach(function (va, ke) {
      newarr.push(JSON.stringify(va));
    });
    arrlist.forEach(function (va, ke) {
      oldarr.push(JSON.stringify(va));
    });
    newarr.forEach(function (v, k) {
      if (oldarr.indexOf(v) === -1) {
        obj[k].proID = proID;
        creat(obj[k]);
      }
    });
    oldarr.forEach(function (v, k) {
      if (newarr.indexOf(v) === -1) {
        arrlist[k].proID = proID;
        deletes(arrlist[k]);
      }
    });
  } else {
    obj.forEach(function (v, k) {
      v.proID = proID;
      creat(v);
    });
  }
}
exports.create = function (req, res) {
  var projectTable = sequelize.model('ProjectTable');
  var ProjectTable = projectTable.build(req.body);
  var newingImageUrl;
  var ProjectId;
  if (ProjectTable) {
    ProjectId = uuid.v4().replace(/-/g, '');
    uploadImage.recv(req, res, [{name: 'ProjectLogo'}])
      .then(updateUserInfo)
      .then(function () {
        res.json(ProjectTable);
      })
      .catch(function (err) {
        logger.error('上传照片失败:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'ProjectTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (ProjectTable) {
        if (files && files.ProjectLogo && files.ProjectLogo.length === 1) {
          ProjectTable.ProjectLogo = path.join(uploadImage.mountDir, files.ProjectLogo[0].filename).replace(/\\/g, '/');
          newingImageUrl = ProjectTable.ProjectLogo;
        }
        ProjectTable.ProjectId = ProjectId;
        ProjectTable.ProjectName = req.body.ProjectName;
        ProjectTable.ProjectSummary = req.body.ProjectSummary;
        ProjectTable.Measure = req.body.Measure;
        ProjectTable.ProjectType = req.body.ProjectType;
        ProjectTable.State = req.body.State;
        ProjectTable.Source = req.body.Source;
        ProjectTable.Report = req.body.Report;
        ProjectTable.createDate = req.body.SbTime;
        ProjectTable.SbTime = req.body.SbTime;
        ProjectTable.FinishTime = req.body.FinishTime;
        ProjectTable.Head = req.body.Head;
        ProjectTable.People = req.body.People;
        ProjectTable.streetID = req.body.streetID;
        ProjectTable.company = req.body.company;
        ProjectTable.PartyBranchID = req.body.PartyBranchID;
        ProjectTable.gradeId = req.body.gradeId;
        ProjectTable.communityid = req.body.communityid;
        ProjectTable.super = req.body.super;
        ProjectTable.roleid = req.body.roleid;
        ProjectTable.arrlist = req.body.arrlist;
        //图片
        ProjectTable.save().then(function () {
          // resolve();
          renlit(ProjectTable.dataValues.id, JSON.parse(ProjectTable.dataValues.arrlist));
        }).then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no ProjectLogo img upload'));
      }
    });
  }
};

/**
 * Show the current ProjectTable
 */
exports.read = function (req, res) {
  var ProjectTable = req.model ? req.model.toJSON() : {};
  ProjectTable.isCurrentUserOwner = !!(req.user && ProjectTable.user && ProjectTable.user.id.toString() === req.user.id.toString());
  res.json(ProjectTable);
};

/**
 * Update an ProjectTable
 */
exports.update = function (req, res) {
  var ProjectTable = req.model;
  var existingImageUrl;
  var newingImageUrl;
  var arrlist;
  if (ProjectTable) {
    existingImageUrl = ProjectTable.ProjectLogo;
    arrlist = JSON.parse(ProjectTable.arrlist);
    uploadImage.recv(req, res, [{name: 'ProjectLogo'}])
      .then(updateUserInfo)
      .then(deleteOldImage)
      .then(function () {
        res.json(ProjectTable);
      })
      .catch(function (err) {
        logger.error('recv upload ProjectTable picture err:', err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'ProjectTable is not exist'
    });
  }

  function updateUserInfo(files) {
    return new Promise(function (resolve, reject) {
      if (ProjectTable) {
        if (files && files.ProjectLogo && files.ProjectLogo.length === 1) {
          ProjectTable.ProjectLogo = path.join(uploadImage.mountDir, files.ProjectLogo[0].filename).replace(/\\/g, '/');
          newingImageUrl = ProjectTable.ProjectLogo;
        }
        ProjectTable.ProjectName = req.body.ProjectName;
        ProjectTable.ProjectSummary = req.body.ProjectSummary;
        ProjectTable.Measure = req.body.Measure;
        ProjectTable.ProjectType = req.body.ProjectType;
        ProjectTable.State = req.body.State;
        ProjectTable.Source = req.body.Source;
        ProjectTable.Report = req.body.Report;
        ProjectTable.SbTime = req.body.SbTime;
        ProjectTable.FinishTime = req.body.FinishTime;
        ProjectTable.Head = req.body.Head;
        ProjectTable.People = req.body.People;
        ProjectTable.streetID = req.body.streetID;
        ProjectTable.PartyBranchID = req.body.PartyBranchID;
        ProjectTable.company = req.body.company;
        ProjectTable.gradeId = req.body.gradeId;
        ProjectTable.super = req.body.super;
        ProjectTable.communityid = req.body.communityid;
        ProjectTable.roleid = req.body.roleid;
        ProjectTable.arrlist = req.body.arrlist;
        //图片
        ProjectTable.save().then(function () {
          //resolve();
          renlit(ProjectTable.dataValues.id, JSON.parse(ProjectTable.dataValues.arrlist), arrlist);
        }).then(function () {
          resolve();
        }).catch(function (err) {
          reject(err);
        });
      } else {
        reject(new Error('no projectlogo img upload'));
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
 * Delete an ProjectTable
 */
exports.delete = function (req, res) {
  var ProjectTable = req.model;

  ProjectTable.destroy().then(function () {
    res.json(ProjectTable);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of ProjectTable
 */
exports.list = function (req, res) {
  /**/
  var prodata;
  var procount;
  var ProjectTable = sequelize.model('ProjectTable');
  var ProjectRenList = sequelize.model('ProjectRenList');
  var grade1 = req.user.user_grade;
  var grade = parseInt(req.query.gradeId, 0);
  grade = grade || grade1;
  console.log(req.query.gradeId, grade);
  // var grade = grade1 ? grade1 : parseInt(req.query.gradeId);
  var branch = (grade === 9 || grade === 10) ? req.query.branch : req.user.branch;
  var generalBranch = req.query.generalBranch;
  var role = req.query.role;
  var supers = req.query.super;
  var qita = req.query.qita;
  var streetID = req.query.streetID;
  var communityid = req.query.communityId;
  var pageNum = req.query.pageNum;
  var count = req.query.count;
  var leibie = req.query.leibie;
  var where;
  var whereren;
  var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
  var offset = parseInt(req.query.offset, 0);//20 每页总数
  var branch1 = (grade === 9 || grade === 10) ? req.query.branch : req.user.branch;
  var cont = req.query.cont;
  var sum = req.query.sum;
  //console.log(branch);
  if (branch) {
    if (typeof branch === 'string') {
      branch = JSON.parse(branch);
    }
  }
  if (grade === 1) {
    whereren = {
      gradeId: grade
    };
  } else if (grade === 4 || grade === 5) {
    whereren = {
      gradeId: grade,
      roleId: role
    };
  } else if (grade === 9 || grade === 10) {
    whereren = {
      gradeId: grade,
      generalBranch: generalBranch
    };
  } else if (grade === 6 || grade === 7) {
    if (grade === 7 && streetID && communityid) {
      whereren = {
        gradeId: grade,
        streetID: streetID,
        communityId: communityid
      };
    } else {
      whereren = {
        gradeId: grade,
        branchId: branch
      };
    }
  }
  if (qita) {
    if (grade === 2) {
      where = {
        where: {
          gradeId: [2, 4, 6, 9]
        },
        limit: pageNum ? 8 : 8,
        offset: pageNum ? (pageNum - 1) * 8 : 0,
        order: 'id desc'
      };
    } else if (grade === 4 || grade === 5) {
      where = {
        where: {
          roleid: role
        },
        limit: 8,
        offset: pageNum ? (pageNum - 1) * 8 : 0,
        order: 'id desc'
      };
    } else if (grade === 6 || grade === 9 || grade === 7 || grade === 10) {
      where = {
        where: {
          gradeId: grade,
          PartyBranchID: branch
        },
        limit: 8,
        offset: pageNum ? (pageNum - 1) * 8 : 0,
        order: 'id desc'
      };
    }
  } else {
    if (grade === 3) {
      where = {
        where: {
          gradeId: grade
        },
        limit: pageNum ? 8 : 4,
        offset: pageNum ? (pageNum - 1) * 8 : 0,
        order: 'id desc'
      };
    } else if (grade === 5) {
      where = {
        where: {
          gradeId: grade,
          streetID: streetID
        },
        limit: pageNum ? 8 : 6,
        offset: pageNum ? (pageNum - 1) * 8 : 0,
        order: 'id desc'
      };
    } else if (grade === 7 || grade === 10) {
      if (branch) {
        if (grade === 10) {
          where = {
            where: {
              gradeId: [7, 10],
              PartyBranchID: branch
            },
            limit: pageNum ? 8 : 6,
            offset: pageNum ? (pageNum - 1) * 8 : 0,
            order: 'id desc'
          };
        } else {
          where = {
            where: {
              gradeId: grade,
              PartyBranchID: branch
            },
            limit: pageNum ? 8 : 6,
            offset: pageNum ? (pageNum - 1) * 8 : 0,
            order: 'id desc'
          };
        }
      } else {
        where = {
          where: {
            gradeId: [7, 10],
            streetID: streetID,
            communityid: communityid
          },
          limit: pageNum ? 8 : 6,
          offset: pageNum ? (pageNum - 1) * 8 : 0,
          order: 'id desc'
        };
      }
    } else {
      // 区委党建项目列表
      where = {
        where: {
          streetID: 10
        },
        limit: 8,
        offset: (pageNum - 1) * 8,
        order: 'id desc'
      };
    }
  }
  function chuangjian(leibie) {
    if (count) {
      ProjectTable.findAll({
        where: where.where,
        attributes: [[sequelize.fn('COUNT', sequelize.col('ProjectId')), 'co']]
      }).then(function (ProjectTable) {
        if (leibie) {
          return res.jsonp(ProjectTable);
        } else {
          if (grade === 1) {
            return res.jsonp(ProjectTable);
          } else {
            procount = ProjectTable;
            getshuju(procount, -1);
          }
        }
      }).catch(function (err) {
        logger.error('ProjectTable list error:', err);
        return res.status(422).send(err);
      });
    } else {
      ProjectTable.findAll(where).then(function (ProjectTable) {
        if (leibie) {
          return res.jsonp(ProjectTable);
        } else {
          if (grade === 1) {
            return res.jsonp(ProjectTable);
          } else {
            prodata = ProjectTable;
            getshuju(-1, prodata);
          }
        }
      }).catch(function (err) {
        logger.error('ProjectTable list error:', err);
        return res.status(422).send(err);
      });
    }
  }

  function getshuju(procount, prodata) {
    if (count) {
      ProjectRenList.findAll({
        where: whereren,
        attributes: [[sequelize.fn('COUNT', sequelize.col('proID')), 'co']]
      }).then(function (ProjectRenList) {
        if (procount && prodata) {
          if (procount !== -1) {
            procount[0].dataValues.co = ProjectRenList[0].dataValues.co + procount[0].dataValues.co;
            return res.jsonp(procount);
          }
        } else {
          return res.jsonp(ProjectRenList);
        }
      }).catch(function (err) {
        logger.error('ProjectRenList list error:', err);
        return res.status(422).send(err);
      });
    } else {
      ProjectRenList.findAll(
        {
          where: whereren,
          include: [
            {
              model: ProjectTable,
              attributes: ['ProjectId', 'super', 'roleid', 'ProjectName', 'ProjectType', 'ProjectLogo', 'ProjectRank', 'Source', 'Measure', 'ProjectSummary', 'State', 'Studies', 'Report', 'SbTime', 'YearTime', 'FinishTime', 'People', 'Head', 'company', 'approvedDepartment', 'ApprovedTime', 'ispast', 'isfinish', 'refuse', 'communityid', 'streetID', 'gradeId', 'arrlist', 'PartyBranchID']
            }
          ],
          limit: 8,
          offset: pageNum ? (pageNum - 1) * 8 : 0
        }
      ).then(function (ProjectRenList) {
        if (procount && prodata) {
          if (prodata !== -1) {
            ProjectRenList.forEach(function (v, k) {
              prodata.push(v);
            });
          }
          return res.jsonp(prodata);
        } else {
          return res.jsonp(ProjectRenList);
        }

      }).catch(function (err) {
        logger.error('ProjectTable list error:', err);
        return res.status(422).send(err);
      });
    }
  }

  if (sum) {
    listByPage(req, res, limit, offset, grade1, role, supers, branch1, whereren, leibie);
  } else if (cont) {
    listCount(req, res, grade1, role, supers, branch1, whereren, leibie);
  } else {
    if (leibie) {
      if (leibie === '创建') {
        chuangjian(leibie);
      } else {
        getshuju();
      }
    } else {
      chuangjian();
    }
  }

};

/**
 * ProjectTable middleware
 */
exports.projectByID = function (req, res, next, id) {
  var ProjectTable = sequelize.model('ProjectTable');
  /*var limit = parseInt(req.query.limit, 0);//(pageNum-1)*20
   var offset = parseInt(req.query.offset, 0);//20 每页总数
   var grade = req.user.user_grade;
   var branch = (grade === 9 || grade === 10) ? req.query.branch : req.user.branch;
   var role = req.query.role;
   var generalBranch = req.query.generalBranch;
   var supers = req.query.super;
   var leibie = req.query.leibie;
   var whereren;
   if (grade === 1) {
   whereren = {
   gradeId: grade
   };
   } else if (grade === 4 || grade === 5) {
   whereren = {
   gradeId: grade,
   roleId: role
   };
   } else if (grade === 9 || grade === 10) {
   whereren = {
   gradeId: grade,
   generalBranch: generalBranch
   };
   } else if (grade === 6 || grade === 7) {
   whereren = {
   gradeId: grade,
   branchId: branch
   };
   }
   if (offset !== 0 && id === '0') {
   listByPage(req, res, limit, offset, grade, role, supers, branch, whereren, leibie);
   } else if (limit === 0 && offset === 0 && id === '0') {
   listCount(req, res, grade, role, supers, branch, whereren, leibie);
   } else if (id !== '0') {*/
  ProjectTable.findOne({
    where: {ProjectId: id}
  }).then(function (ProjectTable) {
    if (!ProjectTable) {
      logger.error('No ProjectTable with that identifier has been found');
      return res.status(404).send({
        message: 'No ProjectTable with that identifier has been found'
      });
    }
    req.model = ProjectTable;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('ProjectTable ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
//  }
};

//----分页
function listByPage(req, res, limit, offset, grade, role, supers, branch, whereren, leibie) {
  var ProjectRenList = sequelize.model('ProjectRenList');
  var ProjectTable = sequelize.model('ProjectTable');
  var where;
  console.log(leibie);
  if (grade === 2) {
    where = {
      where: {
        gradeId: [2, 4, 6, 9]
      },
      limit: 20,
      offset: limit,
      order: 'id desc'
    };

  } else if (grade === 4 || grade === 5) {
    where = {
      where: {
        $or: [
          {
            roleid: role
          },
          {
            super: supers
          }
        ]
      },
      limit: 20,
      offset: limit,
      order: 'id desc'
    };
  } else if (grade === 3) {
    where = {
      where: {
        gradeId: [3, 5, 7, 10]
      },
      limit: 20,
      offset: limit,
      order: 'id desc'
    };
  } else if (grade === 6 || grade === 7 || grade === 9 || grade === 10) {
    if (grade > 7) {
      if (grade === 9) {
        where = {
          where: {
            gradeId: [9, 6],
            PartyBranchID: branch
          },
          limit: 20,
          offset: limit,
          order: 'id desc'
        };
      } else {
        where = {
          where: {
            gradeId: [7, 10],
            PartyBranchID: branch
          },
          limit: 20,
          offset: limit,
          order: 'id desc'
        };
      }
    } else {
      where = {
        where: {
          gradeId: grade,
          PartyBranchID: branch
        },
        limit: 20,
        offset: limit,
        order: 'id desc'
      };
    }
  } else {
    where = {
      limit: 20,
      offset: limit,
      order: 'id desc'
    };
  }
  console.log(whereren);
  /*var sql = 'select * from ( select p.*, rownum rnum from ' +
   '(select row_number() over(' +
   'order by cast(substring(createDate,1,19) as datetime) desc) as rownum, ' +
   '* from [StreetOffice_Q].[dbo].[ProjectTable] where  streetID = 9 ) p ' +
   ' where rownum <= ' + offset + ') z where rnum > ' + limit;
   sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
   res.jsonp(infos);
   }).catch(function (err) {
   logger.error('ProjectTable list error:', err);
   return res.status(422).send(err);
   });*/
  function chuangjian() {
    ProjectTable.findAll(where).then(function (ProjectTable) {
      //if (grade === 1) {
      return res.jsonp(ProjectTable);
      // } else {
      //   getren(ProjectTable);
      // }
    }).catch(function (err) {
      logger.error('littleWishTable list error:', err);
      return res.status(422).send(err);
    });
  }

  function canyu() {
    ProjectRenList.findAll(
      {
        where: whereren,
        include: [
          {
            model: ProjectTable,
            attributes: ['ProjectId', 'super', 'roleid', 'ProjectName', 'ProjectType', 'ProjectLogo', 'ProjectRank', 'Source', 'Measure', 'ProjectSummary', 'State', 'Studies', 'Report', 'SbTime', 'YearTime', 'FinishTime', 'People', 'Head', 'company', 'approvedDepartment', 'ApprovedTime', 'ispast', 'isfinish', 'refuse', 'communityid', 'streetID', 'gradeId', 'arrlist', 'PartyBranchID']
          }
        ],
        limit: 20,
        offset: limit
      }
    ).then(function (ProjectRenList) {
      // ProjectRenList.forEach(function (v, k) {
      //   prodata.push(v);
      // });
      //console.log(prodata);
      return res.jsonp(ProjectRenList);
    }).catch(function (err) {
      logger.error('ProjectTable list error:', err);
      return res.status(422).send(err);
    });
  }

  if (leibie === '创建') {
    chuangjian();
  } else {
    canyu();
  }
}
//---------总数
function listCount(req, res, grade, role, supers, branch, whereren, leibie) {
  /*var sql = 'select count(*) sum from ProjectTable ';
   sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then(function (infos) {
   res.jsonp(infos);
   }).catch(function (err) {
   logger.error('listCount error:', err);
   return res.status(422).send(err);
   });*/
  var ProjectRenList = sequelize.model('ProjectRenList');
  var ProjectTable = sequelize.model('ProjectTable');
  var where;
  console.log(leibie);
  if (grade === 2) {
    where = {
      where: {
        gradeId: [2, 4, 6, 9]
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
    };

  } else if (grade === 4 || grade === 5) {
    where = {
      where: {
        $or: [
          {
            roleid: role
          },
          {
            super: supers
          }
        ]
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
    };
  } else if (grade === 3) {
    where = {
      where: {
        gradeId: [3, 5, 7, 10]
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
    };
  } else if (grade === 6 || grade === 7 || grade === 9 || grade === 10) {
    if (grade > 7) {
      if (grade === 9) {
        where = {
          where: {
            gradeId: [9, 6],
            PartyBranchID: branch
          },
          attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
        };
      } else {
        where = {
          where: {
            gradeId: [7, 10],
            PartyBranchID: branch
          },
          attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
        };
      }
    } else {
      where = {
        where: {
          gradeId: grade,
          PartyBranchID: branch
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
      };
    }
  } else {
    where = {
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'sum']]
    };
  }
  function chuangjian() {
    ProjectTable.findAll(where).then(function (Progr) {
      // if (grade === 1) {
      return res.jsonp(Progr);
      // } else {
      //   getren(Progr);
      // }
    }).catch(function (err) {
      logger.error('ProblemWall list error:', err);
      return res.status(422).send(err);
    });
  }

  function canyu() {
    ProjectRenList.findAll({
      where: whereren,
      attributes: [[sequelize.fn('COUNT', sequelize.col('proID')), 'sum']]
    }).then(function (ProjectRenList) {
      // procount[0].dataValues.sum = ProjectRenList[0].dataValues.sum + procount[0].dataValues.sum;
      //console.log(procount);
      return res.jsonp(ProjectRenList);
    }).catch(function (err) {
      logger.error('ProjectRenList list error:', err);
      return res.status(422).send(err);
    });
  }

  if (leibie === '创建') {
    chuangjian();
  } else {
    canyu();
  }
}
