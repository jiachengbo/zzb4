'use strict';

module.exports = function (sequelize, DataTypes) {

  var AssignedNexus = sequelize.define('AssignedNexus',
    {
      Nexusid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      AssignedId: {
        type: DataTypes.INTEGER,
        comment: 'title'
      },
      NexusContext: {
        type: DataTypes.TEXT,
        comment: 'content'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      streetID: {
        type: DataTypes.STRING,
        comment: '街道'
      },
      communityId: {
        type: DataTypes.STRING,
        comment: '社区'
      },
      PT_type: {
        type: DataTypes.INTEGER,
        comment: '回复平台'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      },
      HF_name: {
        type: DataTypes.INTEGER,
        comment: '名字'
      },
      fromPersonId: {
        type: DataTypes.STRING,
        comment: ''
      },
      toPersonId: {
        type: DataTypes.STRING,
        comment: ''
      }
    },
    {
      comment: 'AssignedNexus table'
    }
  );
  return AssignedNexus;
};
