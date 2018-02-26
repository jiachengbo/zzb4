'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_sq = sequelize.define('Assigned_sq',
    {
      Assigned_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      communityId: {
        type: DataTypes.STRING,
        comment: 'title'
      }
    },
    {
      comment: 'Assigned_sq table'
    }
  );
  return Assigned_sq;
};
