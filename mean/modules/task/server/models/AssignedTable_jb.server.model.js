'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_jb = sequelize.define('Assigned_jb',
    {
      Assigned_id: {
        type: DataTypes.INTEGER,
        comment: '任务id'
      },
      street_id: {
        type: DataTypes.STRING,
        comment: 'title'
      }
    },
    {
      comment: 'Assigned_jb table'
    }
  );
  return Assigned_jb;
};
