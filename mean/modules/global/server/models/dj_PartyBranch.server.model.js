'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyBranch = sequelize.define('dj_PartyBranch',
    {
      OrganizationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '党支部ID'
      },
      OrganizationName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '支部名称'
      },
      OrganizationTime: {
        type: DataTypes.DATE,
        comment: '成立时间'
      },
      Secretary: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '书记'
      },
      Head: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党务专干'
      },
      OrganizationNum: {
        type: DataTypes.STRING,
        defaultValue: '0',
        comment: '党员人数'
      },
      Category: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位类别'
      },
      Relations: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '隶属关系'
      },
      Superior: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '上级党组织'
      },
      OrganizationCategory: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '组织类别'
      },
      Address: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '联系地址'
      },
      TelNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '联系电话'
      },
      BelongGrid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属网格'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建人ID'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改人ID'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: '修改时间'
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属社区'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属街道'
      },
      longitude: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '经度'
      },
      latitude: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '维度'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否手机创建'
      },
      branchName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党支部名称'
      },
      simpleName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党支部简称'
      },
      generalbranch: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '上级党总支'
      },
      commintId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属社区int'
      },
      super: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '上级党组织(int)'
      },
      mold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '组织类别(int)'
      },
      branchType: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '支部类别'
      },
      unitsitu: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党组织所在单位情况'
      },
      unitname: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位名称'
      },
      unitorgsitu: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位建立党组织情况'
      },
      unitcode: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位代码'
      },

      GradeID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '层级ID'
      }
    },
    {
      comment: '党支部信息表',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.User,
            {foreignKey: 'branch', targetKey: 'OrganizationId'});
        }
      }
    }
  );
  dbExtend.addBaseCode('dj_PartyBranch', {
    attributes: ['OrganizationId', 'belongComm', 'GradeID', 'OrganizationName', 'simpleName', 'simpleName', 'generalbranch', 'super', 'mold', 'latitude', 'longitude', 'TelNumber', 'OrganizationNum', 'Head', 'Secretary', 'OrganizationTime', 'communityId', 'streetID', 'BelongGrid']
  });
  return dj_PartyBranch;
};
