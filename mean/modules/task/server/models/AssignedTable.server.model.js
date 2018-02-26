'use strict';

module.exports = function (sequelize, DataTypes) {

  var AssignedTable = sequelize.define('AssignedTable',
    {
      AssignedId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      AssignedTitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'title'
      },
      AssignedContent: {
        type: DataTypes.TEXT,
        comment: 'content'
      },
      StreetID: {
        type: DataTypes.STRING,
        comment: '街道'
      },
      communityId: {
        type: DataTypes.STRING,
        comment: '社区'
      },
      orgID: {
        type: DataTypes.INTEGER,
        comment: '部门'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      },
      PT_type: {
        type: DataTypes.STRING,
        comment: '回复平台'
      },
      Reply: {
        type: DataTypes.STRING,
        comment: '回复内容'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      img1: {
        type: DataTypes.STRING,
        comment: 'img1'
      },
      img2: {
        type: DataTypes.STRING,
        comment: 'img2'
      },
      img3: {
        type: DataTypes.STRING,
        comment: 'img3'
      },
      file: {
        type: DataTypes.STRING,
        comment: 'file'
      },
      payout: {
        type: DataTypes.STRING,
        comment: '派发部门'
      },
      starttime: {
        type: DataTypes.DATE,
        comment: '开始时间'
      },
      endtime: {
        type: DataTypes.DATE,
        comment: '结束时间'
      },
      tasktype: {
        type: DataTypes.STRING,
        comment: '任务类型'
      },
      payoutName: {
        type: DataTypes.STRING,
        comment: '创建人名称'
      },
      createUser: {
        type: DataTypes.STRING,
        comment: '创建人id'
      }
    },
    {
      comment: 'AssignedTable table'
    }
  );
  return AssignedTable;
};
