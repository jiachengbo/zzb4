'use strict';

module.exports = function (sequelize, DataTypes) {

  var userReport = sequelize.define('userReport',
    {
      userReportId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userReportTitle: {
        type: DataTypes.STRING,
        comment: 'userReportTitle'
      },
      userReportContext: {
        type: DataTypes.STRING,
        comment: 'userReportContext'
      },
      imagePath: {
        type: DataTypes.STRING,
        comment: 'imagePath'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: 'isdelete'
      },
      context: {
        type: DataTypes.STRING,
        comment: 'context'
      },
      createUser: {
        type: DataTypes.STRING,
        comment: 'createUser'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: 'createDate'
      },
      modifyUser: {
        type: DataTypes.STRING,
        comment: 'modifyUser'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: 'modifyDate'
      },
      communityid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属社区'
      },
      streetid: {
        type: DataTypes.INTEGER,
        comment: '所属街道'
      },
      gridId: {
        type: DataTypes.STRING,
        comment: '所属网格'
      }
    },
    {
      comment: 'userReport table'
    }
  );
  return userReport;
};
