'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_bm = sequelize.define('Assigned_bm',
    {
      Assigned_id: {
        type: DataTypes.INTEGER,
        comment: '任务id'
      },
      orgID: {
        type: DataTypes.INTEGER,
        comment: 'title'
      }
    },
    {
      comment: 'Assigned_bm table'
    }
  );
  return Assigned_bm;
};
