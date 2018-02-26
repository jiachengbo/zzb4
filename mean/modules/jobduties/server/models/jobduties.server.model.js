'use strict';

module.exports = function (sequelize, DataTypes) {

  var Jobduties = sequelize.define('Jobduties',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      dutycontent: {
        type: DataTypes.STRING,
        comment: 'content'
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
      comment: 'jobduties table'
    }
  );

  return Jobduties;
};
