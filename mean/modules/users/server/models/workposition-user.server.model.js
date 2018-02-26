'use strict';

/**
 * User Model
 */

module.exports = function (sequelize, DataTypes) {
  var WorkPositionUser = sequelize.define('WorkPositionUser',
    {
      workposition_id: {
        type: DataTypes.INTEGER,
        primaryKey: 'workposition_user'
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: 'workposition_user'
      }
    },
    {
      comment: 'work position user table',

      indexes: [
        {
          name: 'wuindex_workposition_id',
          fields: ['workposition_id']
        },
        {
          name: 'wuindex_user_id',
          fields: ['user_id']
        }
      ]
    }
  );
  return WorkPositionUser;
};
