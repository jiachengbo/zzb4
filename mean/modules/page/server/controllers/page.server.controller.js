'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an page
 */
exports.create = function (req, res) {
  var User = sequelize.model('User');
  var Page = sequelize.model('Page');
  var page = Page.build(req.body);

  page.user_id = req.user.id;
  page.save().then(function () {
    //重新加载数据，使数据含有关联表的内容
    return page.reload({
      include: [
        {
          model: User,
          attributes: ['displayName']
        }
      ]
    })
      .then(function () {
        res.json(page);
      });
  }).catch(function (err) {
    logger.error('page create error:', err);
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current page
 */
exports.read = function (req, res) {
  var page = req.model ? req.model.toJSON() : {};

  //page.isCurrentUserOwner = !!(req.user && page.user && page.user._id.toString() === req.user._id.toString());
  page.isCurrentUserOwner = !!(req.user && page.user && page.user.id.toString() === req.user.id.toString());

  res.json(page);
};

/**
 * Update an page
 */
exports.update = function (req, res) {
  var page = req.model;

  page.title = req.body.title;
  page.content = req.body.content;

  page.save().then(function () {
    res.json(page);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an page
 */
exports.delete = function (req, res) {
  var page = req.model;

  page.destroy().then(function () {
    res.json(page);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Page
 */
exports.list = function (req, res) {
  var Page = sequelize.model('Page');
  var User = sequelize.model('User');

  Page.findAll({
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],
    order: 'id ASC'
  }).then(function (page) {
    return res.jsonp(page);
  }).catch(function (err) {
    logger.error('page list error:', err);
    return res.status(422).send(err);
  });
};

/**
 * Page middleware
 */
exports.pageByID = function (req, res, next, id) {
  var Page = sequelize.model('Page');
  var User = sequelize.model('User');

  Page.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (page) {
    if (!page) {
      logger.error('No page with that identifier has been found');
      return res.status(404).send({
        message: 'No page with that identifier has been found'
      });
    }

    req.model = page;
    next();
  }).catch(function (err) {
    //return next(err);
    logger.error('page ByID error:', err);
    res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/*
 * 城市基层党建查询
 * */
//共驻共建
exports.citybasiclist = function (req, res) {
  var BuildbuildPerson = sequelize.model('BuildbuildPerson');
  var Buildbuild = sequelize.model('Buildbuild');
  var roleid = req.query.roleId;
  var grade = req.query.grade;
  var user = req.user;
  var branch = req.query.branch;
  var communityId = req.query.comm;
  var streetID = req.query.street;
  var where;
  if (roleid) {
    where = {
      ishow: 1,
      roleId: roleid,
      gradeId: grade
    };
  } else if (communityId && streetID || branch) {
    if (branch) {
      where = {
        ishow: 1,
        branchId: branch,
        /*communityId: communityId,
         streetID: streetID,*/
        gradeId: grade
      };
    } else {
      where = {
        ishow: 1,
        communityId: communityId,
        streetID: streetID,
        gradeId: [7, 10]
      };
    }
  } else {
    where = {
      ishow: 1,
      gradeId: grade
    };
  }
  BuildbuildPerson.findAll({
    where: where,
    order: 'id desc'
  }).then(function (BuildbuildPerson) {
    var arr = [];
    BuildbuildPerson.forEach(function (v, k) {
      if (arr.indexOf(v.dataValues.hdId) === -1) {
        arr.push(v.dataValues.hdId);
      }
    });
    get(arr);
  }).catch(function (err) {
    logger.error('buildbuild list error:', err);
    return res.status(422).send(err);
  });
  function get(aa) {
    Buildbuild.findAll({
      where: {
        id: aa
      },
      limit: 10,
      offset: 0,
      order: 'id ASC'
    }).then(function (Buildbuild) {
      return res.jsonp(Buildbuild);
    }).catch(function (err) {
      logger.error('buildbuild list error:', err);
      return res.status(422).send(err);
    });
  }
};
//党员分类
exports.memberlist = function (req, res) {
  var sql;
  var sql0;
  var sql1;
  var type = req.query.type;
  var time = new Date();
  var year = time.getFullYear();
  var years = [];
  for (var a = 0; a < 9; a++) {
    year = year - 10;
    if (a !== 0) {
      years.push(year);
    }
  }
  sql0 = `SELECT * FROM 
(select ${type} as WorkPlace from dj_PartyMember group by ${type})C
LEFT JOIN 
(select ${type} as nan, COUNT(*) as man from dj_PartyMember where PartySex = '男' group by ${type})B
ON (C.WorkPlace = B.nan)
LEFT JOIN 
(select ${type} as nv, COUNT(*) as woman from dj_PartyMember where PartySex = '女' group by ${type})A
ON (C.WorkPlace = A.nv)
  `;
  sql1 = `
  select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[0]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
 select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[1]}' and PartyBirth < '${years[0]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[2]}' and PartyBirth < '${years[1]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[3]}' and PartyBirth < '${years[2]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[4]}' and PartyBirth < '${years[3]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[5]}' and PartyBirth < '${years[4]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[6]}' and PartyBirth < '${years[5]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where PartyBirth > '${years[7]}' and PartyBirth < '${years[6]}')S group by S.PartySex)f on (f.sex = d.PartySex)
UNION ALL
select * from (select PartySex, count(*) as sums from dj_PartyMember group by PartySex) d 
left join
(select S.PartySex  as sex, count(*) as num from 
(select * from dj_PartyMember where  PartyBirth < '${years[7]}')S group by S.PartySex)f on (f.sex = d.PartySex)
 `;
  if (type === 'PartyBirth') {
    sql = sql1;
  } else {
    sql = sql0;
  }
  sequelize.query(sql).spread(function (results, metadata) {
    // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
    return res.jsonp(results);
  });
};
//组织设置
exports.cityorgsetlist = function (req, res) {
  var OrgSet = sequelize.model('OrgSet');
  var OrgPerson = sequelize.model('OrgPerson');
  var OrgTable = sequelize.model('OrgTable');
  var workzhize = sequelize.model('workzhize');
  var CommitteeTable = sequelize.model('CommitteeTable');
  var orgId = req.query.orgId;
  var community = req.query.community;
  var Street = req.query.Street;
  var where;
  if (community) {
    if (community === '0') {
      where = {
        include: [
          {
            model: OrgTable,
            attributes: ['duty']
          }
        ],
        where: {
          Street: orgId - 3,
          community: community
        },
        limit: 8,
        offset: 0,
        order: 'id desc'
      };
      OrgSet.findAll(where).then(function (OrgSet) {
        if (orgId > 3) {
          get1(OrgSet);
        } else {
          get(OrgSet, orgId);
        }
      }).catch(function (err) {
        logger.error('buildbuild list error:', err);
        return res.status(422).send(err);
      });
    } else {
      var sql = `
      SELECT TOP 8 [OrgSet].[id], [OrgSet].[orgId], [OrgSet].[duty], [OrgSet].[createTime], [OrgSet].[street], [OrgSet].[community], [OrgSet].[quest], [OrgSet].[meetingPhoto], [OrgSet].[meetingPhoto2], [OrgSet].[file_path], [OrgTable].[Street] 
AS [OrgTable.Street], [OrgTable].[duty] AS [OrgTable.duty] FROM [OrgSet] AS [OrgSet] LEFT OUTER JOIN [workzhize] AS 
[OrgTable] ON [OrgSet].[street] = [OrgTable].[street] and [OrgSet].[community] = [OrgTable].[community] WHERE [OrgSet].[street] = ${orgId - 3} and [OrgSet].[community] = '${community}' ORDER BY id desc;
      `;
      sequelize.query(sql).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        if (orgId > 3) {
          get1(results, community);
        } else {
          get(results, orgId);
        }
      });
    }
  } else {
    where = {
      include: [
        {
          model: OrgTable,
          attributes: ['duty']
        }
      ],
      where: {orgId: orgId},
      limit: 8,
      offset: 0,
      order: 'id desc'
    };
    OrgSet.findAll(where).then(function (OrgSet) {
      if (orgId > 3) {
        get1(OrgSet);
      } else {
        get(OrgSet, orgId);
      }
    }).catch(function (err) {
      logger.error('buildbuild list error:', err);
      return res.status(422).send(err);
    });
  }
  function get1(OrgSet, community) {
    var arr = [];
    var obj = {};
    var where1 = {};
    var where2 = {};
    obj.OrgSet = OrgSet;
    if (community) {
      where1 = {
        Street: orgId - 3,
        community: community,
        CommitteeType: '社区委员'
      };
      where2 = {
        Street: orgId - 3,
        community: community,
        CommitteeType: '社区兼职委员'
      };
    } else {
      where1 = {
        Street: orgId - 3,
        CommitteeType: '街道委员'
      };
      where2 = {
        Street: orgId - 3,
        CommitteeType: '街道兼职委员'
      };
    }
    CommitteeTable.findAll({
      where: where1,
      order: 'CommitteeId asc'
    }).then(function (OrgPerson) {
      obj.zz = OrgPerson;
    }).then(function () {
      CommitteeTable.findAll({
        where: where2,
        order: 'CommitteeId asc'
      }).then(function (OrgPerson) {
        obj.fzz = OrgPerson;
        arr.push(obj);
        return res.jsonp(arr);
      });
    }).catch(function (err) {
      logger.error('buildbuild list error:', err);
      return res.status(422).send(err);
    });
  }

  function get(OrgSet, orgId) {
    var arr = [];
    var obj = {};
    var duty;
    var duty1;
    if (orgId === '2') {
      duty = '召集人';
      duty1 = '副召集人';
    } else if (orgId === '1') {
      duty = '组长';
      duty1 = '副组长';
    } else if (orgId === '3') {
      duty = '负责人';
      duty1 = '成员';
    }
    obj.OrgSet = OrgSet;
    OrgPerson.findAll({
      where: {
        orgId: orgId,
        duty: duty
      },
      order: 'personId desc'
    }).then(function (OrgPerson) {
      obj.zz = OrgPerson;
    }).then(function () {
      OrgPerson.findAll({
        where: {
          orgId: orgId,
          duty: duty1
        },
        order: 'personId desc'
      }).then(function (OrgPerson) {
        obj.fzz = OrgPerson;
      });
    }).then(function () {
      OrgPerson.findAll({
        where: {
          orgId: orgId,
          duty: '成员'
        },
        order: 'personId desc'
      }).then(function (OrgPerson) {
        obj.cy = OrgPerson;
        arr.push(obj);
        return res.jsonp(arr);
      });
    }).catch(function (err) {
      logger.error('buildbuild list error:', err);
      return res.status(422).send(err);
    });
  }
};
//问题墙
exports.prowalltlist = function (req, res) {
  var ProblemWall = sequelize.model('ProblemWall');
  var ProblemWallRec = sequelize.model('ProblemWallRec');
  var grade = req.query.grade;
  var streetID = req.query.streetID;
  var communityId = req.query.communityId;
  var branchId = req.query.branchId;
  var gridId = req.query.gridId;
  var offset = req.query.offset;
  var genersuper = req.query.genersuper;
  var count = req.query.count;
  var roleId = req.query.roleID;
  var generalBranch = req.query.generalBranch;
  var branchId2 = req.query.branchId2;
  var where;
  var arr = [];
  if (grade === '1') {
    where = {
      gradeId: grade
    };
  } else if (grade === '3') {
    where = {
      gradeId: grade
    };
  } else if (grade === '5') {
    if (streetID !== '0') {
      where = {
        gradeId: grade,
        streetID: streetID
      };
    } else {
      where = {
        gradeId: grade,
        roleId: roleId
      };
    }
  } else if (grade === '4') {
    where = {
      gradeId: grade,
      roleId: roleId
    };
  } else if (grade === '9') {

    where = {
      gradeId: grade,
      generalBranch: generalBranch
    };
  } else if (grade === '6') {
    where = {
      gradeId: grade,
      branchId: branchId
    };
  } else if (grade === '7' || grade === '10') {
    if (branchId) {
      if (grade === '10') {
        where = {
          gradeId: 10,
          generalBranch: genersuper
        };
      } else {
        where = {
          gradeId: grade,
          branchId: branchId
        };
      }
    } else if (generalBranch) {
      where = {
        gradeId: grade,
        generalBranch: generalBranch
      };
    } else if (branchId2) {
      where = {
        gradeId: grade,
        branchId: branchId2
      };
    } else {
      where = {
        gradeId: [7, 10],
        streetID: streetID,
        communityId: communityId
      };
    }
  } else if (gridId) {
    where = {
      streetID: streetID,
      communityId: communityId,
      belongGrid: gridId
    };
  }
  //function getrec() {
  ProblemWallRec.findAll({
    where: where
  }).then(function (OrgSet) {
    OrgSet.forEach(function (v, k) {
      if (arr.indexOf(v.dataValues.wtId) === -1) {
        arr.push(v.dataValues.wtId);
      }
    });
    getwall(arr);
  }).catch(function (err) {
    logger.error('ProblemWall list error:', err);
    return res.status(422).send(err);
  });
//  }
  function getwall(arr) {
    if (count) {
      /*ProblemWall.findAll({
       where: {
       id: arr
       },
       attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'shuliang']]
       }).then(function (Progr) {
       console.log(Progr);

       }).catch(function (err) {
       logger.error('ProblemWall list error:', err);
       return res.status(422).send(err);
       });*/
      var arrnum = [
        {shuliang: arr.length}
      ];
      res.jsonp(arrnum);
    } else {
      ProblemWall.findAll({
        where: {
          id: arr
        },
        limit: 8,
        offset: offset ? (offset - 1) * 8 : 0,
        order: 'id desc'
      }).then(function (OrgSet) {
        return res.jsonp(OrgSet);
      }).catch(function (err) {
        logger.error('ProblemWall list error:', err);
        return res.status(422).send(err);
      });
    }
  }


};
//微心愿
exports.litterxinlist = function (req, res) {
  var LittleWishTable = sequelize.model('LittleWishTable');
  var gradeIds = req.query.gradeId;
  var roleId = req.query.roleId;
  var branch = req.query.branch;
  var offset = req.query.offset;
  var count = req.query.count;
  var littleStatus = req.query.littleStatus;
  var streetID = req.query.streetID;
  var communityId = req.query.communityId;
  var where;
  var obj = {};
  if (gradeIds === '1' || gradeIds === '3') {
    where = {
      littleStatus: '已完成'
    };
  } else if (gradeIds === '5') {
    where = {
      $or: [
        {
          gradeId: gradeIds,
          roleId: roleId,
          littleStatus: '已完成'
        },
        {
          gradeId: gradeIds,
          streetID: streetID,
          littleStatus: '已完成'
        }
      ]
    };
  } else if (gradeIds === '7' || gradeIds === '10') {
    if (branch) {
      if (gradeIds === '10') {
        where = {
          gradeId: [7, 10],
          PartyBranchID: branch,
          littleStatus: '已完成'
        };
      } else {
        where = {
          gradeId: gradeIds,
          PartyBranchID: branch,
          littleStatus: '已完成'
        };
      }

    } else {
      where = {
        gradeId: [7, 10],
        streetID: streetID,
        communityId: communityId,
        littleStatus: '已完成'
      };
    }
  } else if (gradeIds === '0') {
    if (!branch) {
      where = {
        roleId: roleId,
        littleStatus: '已完成'
      };
    } else {
      where = {
        roleId: roleId,
        PartyBranchID: branch,
        littleStatus: '已完成'
      };
    }
  }
  if (count) {
    obj = {
      where: {
        littleStatus: littleStatus
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'shuliang']]
    };
  } else {
    obj = {
      where: offset ? {littleStatus: littleStatus} : where,
      limit: offset ? 8 : 4,
      offset: offset ? (offset - 1) * 8 : 0,
      order: 'id desc'
    };
  }
  LittleWishTable.findAll(obj).then(function (OrgSet) {
    return res.jsonp(OrgSet);
  }).catch(function (err) {
    logger.error('ProblemWall list error:', err);
    return res.status(422).send(err);
  });
  /*function get1(aa) {
   CommitteeTable.findAll({
   where: {
   Street: orgId - 3
   },
   limit: 8,
   offset: 0
   }).then(function (OrgPerson) {
   var obj = {};
   obj.OrgSet = aa;
   obj.OrgPerson = OrgPerson;
   var arr = [];
   arr.push(obj);
   return res.jsonp(arr);
   }).catch(function (err) {
   logger.error('buildbuild list error:', err);
   return res.status(422).send(err);
   });
   }
   function get(aa) {
   OrgPerson.findAll({
   where: {
   orgId: orgId
   },
   limit: 8,
   offset: 0,
   order: 'personId desc'
   }).then(function (OrgPerson) {
   var obj = {};
   obj.OrgSet = aa;
   obj.OrgPerson = OrgPerson;
   var arr = [];
   arr.push(obj);
   return res.jsonp(arr);
   }).catch(function (err) {
   logger.error('buildbuild list error:', err);
   return res.status(422).send(err);
   });
   }*/
};
//党建项目
exports.projectprosslist = function (req, res) {
  var ProgressTable = sequelize.model('ProgressTable');
  var ProjectId = req.query.ProjectId;
  var limit = req.query.limit;
  var offset = req.query.offset;
  var count = req.query.count;
  if (count) {
    ProgressTable.findAll({
      where: {
        ProjectId: ProjectId
      },
      attributes: [[sequelize.fn('COUNT', sequelize.col('ProgressId')), 'shuliang']]
    }).then(function (Progr) {
      return res.jsonp(Progr);
    }).catch(function (err) {
      logger.error('ProblemWall list error:', err);
      return res.status(422).send(err);
    });
  } else {
    ProgressTable.findAll({
      where: {
        ProjectId: ProjectId
      },
      limit: 4,
      offset: (offset - 1) * 4
    }).then(function (Progr) {
      return res.jsonp(Progr);
    }).catch(function (err) {
      logger.error('ProblemWall list error:', err);
      return res.status(422).send(err);
    });
  }
};

exports.getPartyBuildingsb = function (req, res) {
  var Appealsb = sequelize.model('appealsb');
  var gradeId = req.query.gradeId;
  var roleId = req.query.roleId;
  var PartyBranchID = req.query.PartyBranchID;
  var where;
  if (gradeId > 5) {
    where = {
      ishow: 1,
      gradeId: gradeId,
      roleId: roleId,
      PartyBranchID: PartyBranchID
    };
  } else {
    where = {
      ishow: 1,
      gradeId: gradeId,
      roleId: roleId
    };
  }
  Appealsb.findAll({
    where: where,
    attributes: ['appealId', 'sbtime', 'PartyBranchID'],
    order: 'sbtime desc'
  }).then(function (data) {
    return res.jsonp(data);
  }).catch(function (err) {
    console.log('出错了。。。');
  });
};
exports.PartyMemberAnalyze = function (req, res) {
  var dj_PartyMember = sequelize.model('dj_PartyMember');
  var branchs1 = req.query.branchs1;
  var branchs2 = req.query.branchs2;
  var age = req.query.age;
  var jointime = req.query.jointime;
  var orgnum = req.query.orgnum;
  var num = req.query.num;
  var sex = req.query.sex;
  var orgpersonnum = req.query.orgpersonnum;
  var unitclass = req.query.unitclass;
  var orgclass = req.query.orgclass;
  var isDWnum = req.query.isDWnum;
  var isDWsex = req.query.isDWsex;
  var isDWage = req.query.isDWage;
  var isDWjointime = req.query.isDWjointime;
  var isDWorgnum = req.query.isDWorgnum;
  var isDWunitclass = req.query.isDWunitclass;
  var isDWorgpersonnum = req.query.isDWorgpersonnum;
  var isDWorgclass = req.query.isDWorgclass;
  var isDGWnum = req.query.isDGWnum;
  var isDGWsex = req.query.isDGWsex;
  var isDGWage = req.query.isDGWage;
  var isDGWjointime = req.query.isDGWjointime;
  var isDGWorgnum = req.query.isDGWorgnum;
  var isDGWunitclass = req.query.isDGWunitclass;
  var isDGWorgpersonnum = req.query.isDGWorgpersonnum;
  var isDGWorgclass = req.query.isDGWorgclass;
  var objId = req.query.objId;
  var type = req.query.type;
  var nation = req.query.nation;
  var PartyPlace = req.query.PartyPlace;
  var Category = req.query.Category;
  var education = req.query.education;
  var personcategory = req.query.personcategory;
  var street = req.query.street;
  var streetorg = req.query.streetorg;
  var Relations = req.query.Relations;
  var OrganizationNum = req.query.OrganizationNum;
  var nowTime = new Date().getFullYear();
  var ageArr = [nowTime - 30, nowTime - 40, nowTime - 50, nowTime - 60];
  var sql;
  var sqlb;
  // 区委账号男女
  var sql1 = `select sum(case when PartySex='男' then 1 else 0 end ) 男,sum(case when PartySex='女' then 1 else 0 end ) 女
  from dbo.dj_PartyMember`;
  // 党委账号男女
  var sql9 = `select sum(case when PartySex='男' then 1 else 0 end ) 男,sum(case when PartySex='女' then 1 else 0 end ) 女
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID > 12 and  a.super = b.typeId and c.branch = a.OrganizationId `;
  // 党工委账号男女
  var sql18 = `select sum(case when PartySex='男' then 1 else 0 end ) 男,sum(case when PartySex='女' then 1 else 0 end ) 女
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID < 13 and  a.super = b.typeId and c.branch = a.OrganizationId `;
  // 区委账号人数
  var sql2 = `select sum(case when branch in ${branchs1} then 1 else 0 end ) 党工委,sum(case when branch in ${branchs2} then 1 else 0 end ) 党委 from dbo.dj_PartyMember `;
  // 党委人数
  var sql8 = 'select count(*) as co,b.typeName from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c where  b.typeID > 12 and a.super = b.typeId and c.branch = a.OrganizationId group by b.typeName';
  // 党工委人数
  var sql15 = 'select count(*) as co,b.typeName from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c where  b.typeID < 13 and  a.super = b.typeId and c.branch = a.OrganizationId group by  b.typeName';
  // 区委账号年龄
  var sql3 = `select sum(case when PartyBirth > '${ageArr[0]}' then 1 else 0 end ) '30岁以下',
  sum(case when PartyBirth < '${ageArr[0]}' and PartyBirth > '${ageArr[1]}' then 1 else 0 end ) '30-40岁',
  sum(case when PartyBirth < '${ageArr[1]}' and PartyBirth > '${ageArr[2]}' then 1 else 0 end ) '40-50岁',
  sum(case when PartyBirth < '${ageArr[2]}' and PartyBirth > '${ageArr[3]}' then 1 else 0 end ) '50-60岁',
  sum(case when PartyBirth < '${ageArr[3]}' then 1 else 0 end ) '60岁以上'
  from dbo.dj_PartyMember `;
  // 党委账号年龄
  var sql10 = `select sum(case when PartyBirth > '${ageArr[0]}' then 1 else 0 end ) '30岁以下',
  sum(case when PartyBirth < '${ageArr[0]}' and PartyBirth > '${ageArr[1]}' then 1 else 0 end ) '30-40岁',
  sum(case when PartyBirth < '${ageArr[1]}' and PartyBirth > '${ageArr[2]}' then 1 else 0 end ) '40-50岁',
  sum(case when PartyBirth < '${ageArr[2]}' and PartyBirth > '${ageArr[3]}' then 1 else 0 end ) '50-60岁',
  sum(case when PartyBirth < '${ageArr[3]}' then 1 else 0 end ) '60岁以上'
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID > 12 and  a.super = b.typeId and c.branch = a.OrganizationId  `;
  // 党工委账号年龄
  var sql16 = `select sum(case when PartyBirth > '${ageArr[0]}' then 1 else 0 end ) '30岁以下',
  sum(case when PartyBirth < '${ageArr[0]}' and PartyBirth > '${ageArr[1]}' then 1 else 0 end ) '30-40岁',
  sum(case when PartyBirth < '${ageArr[1]}' and PartyBirth > '${ageArr[2]}' then 1 else 0 end ) '40-50岁',
  sum(case when PartyBirth < '${ageArr[2]}' and PartyBirth > '${ageArr[3]}' then 1 else 0 end ) '50-60岁',
  sum(case when PartyBirth < '${ageArr[3]}' then 1 else 0 end ) '60岁以上'
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID < 13 and  a.super = b.typeId and c.branch = a.OrganizationId  `;
  // 区委账号入党时间
  var sql4 = `select sum(case when JoinTime > '2010' then 1 else 0 end ) '2010年以后入党',
  sum(case when JoinTime < '2010' and JoinTime > '2000' then 1 else 0 end ) '2000年-2010年入党',
  sum(case when JoinTime < '2000' and JoinTime > '1980' then 1 else 0 end ) '1980年-2000年入党',
  sum(case when JoinTime < '1980' and JoinTime > '19491001' then 1 else 0 end ) '1949年10月1日-1980年入党',
  sum(case when JoinTime < '19491001' then 1 else 0 end ) '1949年10月1日前入党'
  from dbo.dj_PartyMember `;
  // 党委账号入党时间
  var sql11 = `select sum(case when JoinTime > '2010' then 1 else 0 end ) '2010年以后入党',
  sum(case when JoinTime < '2010' and JoinTime > '2000' then 1 else 0 end ) '2000年-2010年入党',
  sum(case when JoinTime < '2000' and JoinTime > '1980' then 1 else 0 end ) '1980年-2000年入党',
  sum(case when JoinTime < '1980' and JoinTime > '19491001' then 1 else 0 end ) '1949年10月1日-1980年入党',
  sum(case when JoinTime < '19491001' then 1 else 0 end ) '1949年10月1日前入党'
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID > 12 and  a.super = b.typeId and c.branch = a.OrganizationId  `;
  // 党工委账号入党时间
  var sql17 = `select sum(case when JoinTime > '2010' then 1 else 0 end ) '2010年以后入党',
  sum(case when JoinTime < '2010' and JoinTime > '2000' then 1 else 0 end ) '2000年-2010年入党',
  sum(case when JoinTime < '2000' and JoinTime > '1980' then 1 else 0 end ) '1980年-2000年入党',
  sum(case when JoinTime < '1980' and JoinTime > '19491001' then 1 else 0 end ) '1949年10月1日-1980年入党',
  sum(case when JoinTime < '19491001' then 1 else 0 end ) '1949年10月1日前入党'
  from dj_PartyBranch as a,dbo.dj_PartyOrganization as b, dbo.dj_PartyMember as c  where b.typeID < 13 and  a.super = b.typeId and c.branch = a.OrganizationId  `;
// 区委账号党组织个数
  var sql5 = `select sum(case when OrganizationId in ${branchs1} then 1 else 0 end ) '党工委',sum(case when OrganizationId in ${branchs2} then 1 else 0 end ) '党委' from dbo.dj_PartyBranch `;
  // 党委账号党组织个数
  var sql12 = 'select count(*) as co,b.typeName from dj_PartyBranch as a,dbo.dj_PartyOrganization as b where  b.typeID > 12 and  a.super = b.typeId group by  b.typeName';
  // 党工委账号党组织个数
  var sql19 = 'select count(*) as co,b.typeName from dj_PartyBranch as a,dbo.dj_PartyOrganization as b where  b.typeID < 13 and  a.super = b.typeId group by  b.typeName';
  // 区委账号组织类别
  var sql6 = 'select count(*)as co,a.OrganizationCategory from dj_PartyBranch as a  group by OrganizationCategory';
  // 党委账号组织类别
  var sql14 = 'select count(*)as co,a.Category from dj_PartyBranch as a ,dbo.dj_PartyOrganization as b where  b.typeID > 12 and  a.super = b.typeId group by Category';
  // 党委账号组织类别
  var sql21 = 'select count(*)as co,a.Category from dj_PartyBranch as a ,dbo.dj_PartyOrganization as b where  b.typeID < 13 and  a.super = b.typeId group by Category';
  // 区委账号单位类别
  var sql7 = 'select count(*)as co, Category from dj_PartyBranch group by Category';
  // 党委账号单位类别
  var sql13 = `select count(*)as co,b.class_Name from dj_PartyBranch as a, dj_org_class as b ,dbo.dj_PartyOrganization as c where 
  a.mold = b.org_class_ID and c.typeID > 12 and a.super = c.typeId
  group by class_Name order by co desc`;
  // 党工委账号单位类别
  var sql20 = `select count(*)as co,b.class_Name from dj_PartyBranch as a, dj_org_class as b ,dbo.dj_PartyOrganization as c where 
  a.mold = b.org_class_ID and c.typeID < 13 and a.super = c.typeId
  group by class_Name order by co desc`;
  // 民族分类
  var sql22 = 'select count(*)as co,PartyNation from dbo.dj_PartyMember  group by PartyNation';
// 籍贯
  var sql23 = 'select count(*)as co,PartyPlace from dbo.dj_PartyMember  group by PartyPlace';
  // 党员类型
  var sql24 = 'select count(*)as co,Category from dbo.dj_PartyMember  group by Category';
  // 学历类型
  var sql25 = 'select count(*)as co,education2 from dbo.dj_PartyMember  group by education2';
  // 人员类别
  var sql26 = 'select count(*)as co,preson_category from dbo.dj_PartyMember  group by preson_category';
// 街道分类
  var sql27 = 'select count(*)as co, b.streetName from dbo.dj_PartyMember as a,dbo.street_info as b where a.streetID = b.streetID  group by b.streetName';
  // 街道分类-组织
  var sql28 = 'select count(*)as co, b.streetName from dbo.dj_PartyBranch as a,dbo.street_info as b where a.streetID = b.streetID  group by b.streetName';
  // 隶属关系
  var sql29 = 'select count(*) as co,Relations from dbo.dj_PartyBranch  group by Relations';
  // 党组织人数
  var sql30 = `select sum (case when OrganizationNum < 10 then 1 else 0 end)'10人以下',
  sum (case when 10 <= OrganizationNum and OrganizationNum < 20 then 1 else 0 end)'10~20人',
    sum (case when 20 <= OrganizationNum and OrganizationNum < 30 then 1 else 0 end)'20~30人',
    sum (case when 30 <= OrganizationNum and OrganizationNum < 40 then 1 else 0 end)'30~40人',
    sum (case when OrganizationNum > 40 then 1 else 0 end)'40人以上'
  from dbo.dj_PartyBranch`;


  if (num) {
    sql = sql2;
  } else if (age) {
    sql = sql3;
  } else if (jointime) {
    sql = sql4;
  } else if (orgnum) {
    sql = sql5;
  } else if (sex) {
    sql = sql1;
  } else if (orgpersonnum) { // 组织人数
    sql = sql2;
  } else if (unitclass) { // 单位类别
    sql = sql7;
  } else if (orgclass) { // 组织类别
    sql = sql6;
  } else if (isDWnum) { //
    sql = sql8;
  } else if (isDWsex) { //
    sql = sql9;
  } else if (isDWage) { //
    sql = sql10;
  } else if (isDWjointime) { //
    sql = sql11;
  } else if (isDWorgnum) { //
    sql = sql12;
  } else if (isDWunitclass) {
    sql = sql13;
  } else if (isDWorgpersonnum) {
    sql = sql8;
  } else if (isDWorgclass) {
    sql = sql14;
  } else if (isDGWnum) {
    sql = sql15;
  } else if (isDGWage) { //
    sql = sql16;
  } else if (isDGWjointime) { //
    sql = sql17;
  } else if (isDGWsex) { //
    sql = sql18;
  } else if (isDGWorgnum) { //
    sql = sql19;
  } else if (isDGWunitclass) {
    sql = sql20;
  } else if (isDGWorgpersonnum) {
    sql = sql15;
  } else if (isDGWorgclass) {
    sql = sql21;
  } else if (objId) {
    if (type === 'num') {
      sql = `select count(*) as co,b.OrganizationName
      from dbo.dj_PartyMember as a,dbo.dj_PartyBranch as b
      where a.branch = b.OrganizationId and b.super = ${objId} group by b.OrganizationName`;
    } else if (type === 'sex') {
      sql = `select count(*) as co,a.PartySex
  from dbo.dj_PartyMember as a where a.workbranch = ${objId} group by a.PartySex`;
    } else if (type === 'age') {
      sql = `select sum(case when PartyBirth >= '${ageArr[0]}' then 1 else 0 end ) '30岁以下',
  sum(case when PartyBirth < '${ageArr[0]}' and PartyBirth >= '${ageArr[1]}' then 1 else 0 end ) '30-40岁',
  sum(case when PartyBirth < '${ageArr[1]}' and PartyBirth >= '${ageArr[2]}' then 1 else 0 end ) '40-50岁',
  sum(case when PartyBirth < '${ageArr[2]}' and PartyBirth >= '${ageArr[3]}' then 1 else 0 end ) '50-60岁',
  sum(case when PartyBirth < '${ageArr[3]}' then 1 else 0 end ) '60岁以上'
  from dbo.dj_PartyMember as a where a.workbranch = ${objId}`;
    } else if (type === 'jointime') {
      sql = `select sum(case when JoinTime >= '2010' then 1 else 0 end ) '2010年以后入党',
  sum(case when JoinTime < '2010' and JoinTime >= '2000' then 1 else 0 end ) '2000年-2010年入党',
  sum(case when JoinTime < '2000' and JoinTime >= '1980' then 1 else 0 end ) '1980年-2000年入党',
  sum(case when JoinTime < '1980' and JoinTime >= '19491001' then 1 else 0 end ) '1949年10月1日-1980年入党',
  sum(case when JoinTime < '19491001' then 1 else 0 end ) '1949年10月1日前入党'
   from dbo.dj_PartyMember as a where a.workbranch = ${objId}`;
    } else if (type === 'orgnum') {
      sql = `select count(*) as co 
  from dbo.dj_PartyBranch
  where super = ${objId}`;
    } else if (type === 'unitclass') {
      sql = `select count(*)as co,b.class_Name from dj_PartyBranch as a, dj_org_class as b where 
  a.mold = b.org_class_ID and a.super = ${objId}
  group by class_Name order by co desc`;
    } else if (type === 'orgpersonnum') {
      sql = `select count(*) as co,b.OrganizationName
      from dbo.dj_PartyMember as a,dbo.dj_PartyBranch as b
      where a.branch = b.OrganizationId and b.super = ${objId} group by b.OrganizationName`;
    } else if (type === 'orgclass') {
      sql = `select count(*) as co,OrganizationCategory from dj_PartyBranch  where  super = ${objId} group by OrganizationCategory`;
    } else if (type === 'nation') {
      sql = `select count(*) as co,a.PartyNation from dbo.dj_PartyMember as a where a.workbranch = ${objId} and a.PartyNation like '%族%' group by a.PartyNation`;
    } else if (type === 'PartyPlace') {
      sql = `select count(*) as co,a.PartyPlace from dbo.dj_PartyMember as a where a.workbranch = ${objId} and a.PartyPlace is not null group by a.PartyPlace`;
    } else if (type === 'Category') {
      sql = `select count(*) as co,a.Category from dbo.dj_PartyMember as a where a.workbranch = ${objId} and a.Category is not null and a.Category <> '' group by a.Category`;
    } else if (type === 'education') {
      sql = `select count(*) as co,a.education2 from dbo.dj_PartyMember as a where a.workbranch = ${objId} and a.education2 is not null and a.education2 <> '' group by a.education2`;
    } else if (type === 'personcategory') {
      sql = `select count(*) as co,a.preson_category from dbo.dj_PartyMember as a where a.workbranch = ${objId} and  a.preson_category is not null and a.preson_category <> '' group by a.preson_category`;
    } else if (type === 'comm') {
      sql = `select count(*) as co ,d.communityName from dbo.dj_PartyMember as a,dbo.community as d where a.workbranch = ${objId} and a.communityId = d.communityId and a.streetID = d.streetID group by a.communityId,a.streetID,d.communityName`;
    } else if (type === 'commorg') {
      sql = `select count(*)as co,d.communityName from dbo.dj_PartyBranch as b ,dbo.community as d
where  b.super = ${objId} and b.communityId = d.communityId group by d.communityName`;
    } else if (type === 'Relations') {
      sql = `select count(*) as co,Relations from dbo.dj_PartyMember as a,dbo.dj_PartyBranch as b where a.branch = b.OrganizationId and b.super = ${objId} group by Relations`;
    } else if (type === 'OrganizationNum') {
      sql = `select sum (case when OrganizationNum < 10 then 1 else 0 end)'10人以下',
        sum (case when 10 <= OrganizationNum and OrganizationNum < 20 then 1 else 0 end)'10~20人',
        sum (case when 20 <= OrganizationNum and OrganizationNum < 30 then 1 else 0 end)'20~30人',
        sum (case when 30 <= OrganizationNum and OrganizationNum < 40 then 1 else 0 end)'30~40人',
        sum (case when OrganizationNum > 40 then 1 else 0 end)'40人以上'
      from dbo.dj_PartyMember as a,dbo.dj_PartyBranch as b where a.branch = b.OrganizationId and b.super = ${objId}`;
    }
  } else if (nation) {
    sql = sql22;
  } else if (PartyPlace) {
    sql = sql23;
  } else if (Category) {
    sql = sql24;
  } else if (education) {
    sql = sql25;
  } else if (personcategory) {
    sql = sql26;
  } else if (street) {
    sql = sql27;
  } else if (streetorg) {
    sql = sql28;
  } else if (Relations) {
    sql = sql29;
  } else if (OrganizationNum) {
    sql = sql30;
  }
  if (sql !== sqlb) {
    sequelize.query(sql).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      return res.jsonp(results);
    });
  }

};
exports.getPartyMember = function (req, res) {
  var dj_PartyMember = sequelize.model('dj_PartyMember');
  var branch = req.query.branch;
  var count = req.query.count;
  var pageNum = req.query.pageNum;
  var key = req.query.key;

  var f = true;
  var kf = true;
  if (branch) {
    f = false;
  }
  if (key) {
    kf = false;
  }
  if (branch) {
    if (count && kf) {
      dj_PartyMember.findAll({
        where: {
          branch: branch
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'co']]
      }).then(function (data) {
        res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。。。');
      });
    } else if (key && count) {
      dj_PartyMember.findAll({
        where: {
          branch: branch,
          PartyName: {
            $like: '%' + key + '%'
          }
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'co']]
      }).then(function (data) {
        res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。。。');
      });
    } else if (pageNum && key) {
      dj_PartyMember.findAll({
        where: {
          branch: branch,
          PartyName: {
            $like: '%' + key + '%'
          }
        },
        limit: 10,
        offset: (pageNum - 1) * 10
      }).then(function (data) {
        res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。。。');
      });

    } else if (pageNum) {
      dj_PartyMember.findAll({
        where: {
          branch: branch
        },
        limit: 10,
        offset: (pageNum - 1) * 10
      }).then(function (data) {
        res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。。。');
      });
    } else {
      dj_PartyMember.findAll({
        where: {
          branch: branch
        }
      }).then(function (data) {
        res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。。。');
      });
    }
  } else if (pageNum && f) {
    dj_PartyMember.findAll({
      limit: 10,
      offset: (pageNum - 1) * 10
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  } else if (count && f) {
    dj_PartyMember.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'co']]
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  } else {
    dj_PartyMember.findAll({
      limit: 20,
      offset: 0
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  }
};
exports.getPartyOrg = function (req, res) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var branch = req.query.branch;
  var count = req.query.count;
  var pageNum = req.query.pageNum;
  if (branch) {
    dj_PartyBranch.findAll({
      where: {
        branch: branch
      }
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  } else if (pageNum) {
    dj_PartyBranch.findAll({
      limit: 10,
      offset: (pageNum - 1) * 10
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  } else if (count) {
    dj_PartyBranch.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('OrganizationId')), 'co']]
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  } else {
    dj_PartyBranch.findAll({
      limit: 20,
      offset: 0
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  }
};
exports.Search = function (req, res) {
  var dj_PartyBranch = sequelize.model('dj_PartyBranch');
  var dj_PartyMember = sequelize.model('dj_PartyMember');
  var partymember = req.query.partymember;
  var partyorg = req.query.partyorg;
  var key = req.query.key;
  var pageNum = req.query.pageNum;
  var count = req.query.count;
  var workbranch = req.query.workbranch;
  var key2 = req.query.key2;
  if (workbranch) {
    dj_PartyMember.findAll({
      where: {
        workbranch: workbranch,
        PartyName: {
          $like: '%' + key2 + '%'
        }
      }
    }).then(function (data) {
      res.jsonp(data);
    }).catch(function (err) {
      console.log('出错了。。。。。');
    });
  }
  if (partymember) {
    if (count) {
      dj_PartyMember.findAll({
        where: {
          PartyName: {
            $like: '%' + key + '%'
          }
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('PartyId')), 'co']]
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。');
      });
    } else {
      dj_PartyMember.findAll({
        where: {
          PartyName: {
            $like: '%' + key + '%'
          }
        },
        limit: 10,
        offset: (pageNum - 1) * 10
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。');
      });
    }
  } else if (partyorg) {
    if (count) {
      dj_PartyBranch.findAll({
        where: {
          OrganizationName: {
            $like: '%' + key + '%'
          }
        },
        attributes: [[sequelize.fn('COUNT', sequelize.col('OrganizationId')), 'co']]
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。');
      });
    } else {
      dj_PartyBranch.findAll({
        where: {
          OrganizationName: {
            $like: '%' + key + '%'
          }
        },
        limit: 10,
        offset: (pageNum - 1) * 10
      }).then(function (data) {
        return res.jsonp(data);
      }).catch(function (err) {
        console.log('出错了。。。');
      });
    }
  }
};
exports.commPartyList = function (req, res) {
  var userReport = sequelize.model('userReport');
  var streetid = req.query.streetid;
  var communityid = req.query.communityid;
  var gridId = req.query.gridId;
  userReport.findAll({
    where: {
      streetid: streetid,
      communityid: communityid,
      gridId: gridId
    },
    limit: 1,
    offset: 0,
    order: 'userReportId desc'
  }).then(function (data) {
    res.jsonp(data);
  }).catch(function (err) {
    console.log('出错了。。。。。');
  });
};
exports.commjobList = function (req, res) {
  var Jobduties = sequelize.model('Jobduties');
  var streetid = req.query.streetid;
  var communityid = req.query.communityid;
  var gridId = req.query.gridId;
  Jobduties.findAll({
    where: {
      streetid: streetid,
      communityid: communityid,
      gridId: gridId
    },
    limit: 1,
    offset: 0,
    order: 'id desc'
  }).then(function (data) {
    res.jsonp(data);
  }).catch(function (err) {
    console.log('出错了。。。。。');
  });
};
exports.commthreefiveList = function (req, res) {
  var Threefive = sequelize.model('Threefive');
  var streetid = req.query.streetid;
  var communityid = req.query.communityid;
  var gridId = req.query.gridId;
  Threefive.findAll({
    where: {
      streetid: streetid,
      communityid: communityid,
      gridId: gridId
    },
    limit: 1,
    offset: 0,
    order: 'id desc'
  }).then(function (data) {
    res.jsonp(data);
  }).catch(function (err) {
    console.log('出错了。。。。。');
  });
};


exports.jcdjuser = function (req, res) {
  var num = req.query.IDNumber + '';
  var sql = 'select * from userinfo  where IDNumber = \'' + num + '\'';
  sequelize.query(sql).spread(function (results, metadata) {
    // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
    return res.jsonp(results);
  });
};
exports.lists = function (req, res) {
  var arr = [];
  var sql1;
  var sql12;
  var sql;
  if (req.query.streed === '-1') {
    sql1 = 'select * from PartyOrganizationTable';
    sequelize.query(sql1).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      results.push(1);
      arr.push(results);
      sql = 'select * from grid_curve  order by gridId,street_id,grid_curve_index';
      sequelize.query(sql).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        arr.push(results);
        return res.jsonp(arr);
      });
    });
  } else if (req.query.streed !== '-1') {
    sql1 = 'select * from PartyOrganizationTable where streetID = ' + req.query.streed;
    sequelize.query(sql1).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      results.push(1);
      arr.push(results);
      sql = 'select * from grid_curve where street_id = ' + req.query.streed + '  order by gridId,street_id,grid_curve_index';
      sequelize.query(sql).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        arr.push(results);
        return res.jsonp(arr);
      });
    });
  }
};
exports.getNoticeFile = function (req, res) {
  var TopVoiceTable = sequelize.model('TopVoiceTable');
  TopVoiceTable.findAll({
    limit: 10,
    offset: 0,
    order: 'sbtime desc'
  }).then(function (data) {
    res.jsonp(data);
  }).catch(function () {
    console.log('出错了！');
  });
};
exports.getPartyBuilding = function (req, res) {
  var Appeal = sequelize.model('appeal');
  var appealIds = req.query.appealIds;
  Appeal.findAll({
    where: {
      appealId: appealIds
    },
    limit: 10,
    offset: 0,
    order: 'sbtime desc'
  }).then(function (data) {
    res.jsonp(data);
  }).catch(function (err) {
    console.log(err);
  });
};
