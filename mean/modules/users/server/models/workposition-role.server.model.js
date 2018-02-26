'use strict';

/**
 * User Model
 */

module.exports = function (sequelize, DataTypes) {
  var WorkPositionRole = sequelize.define('WorkPositionRole',
    {
      workposition_id: {
        type: DataTypes.INTEGER,
        primaryKey: 'workposition_role'
      },
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: 'workposition_role'
      }
    },
    {
      comment: 'work position role table',

      indexes: [
        {
          name: 'wrindex_workposition_id',
          fields: ['workposition_id']
        },
        {
          name: 'wrindex_role_id',
          fields: ['role_id']
        }
      ]
    }
  );
  return WorkPositionRole;
};
