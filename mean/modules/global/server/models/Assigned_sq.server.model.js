'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_sq = sequelize.define('Assigned_sq',
    {
      Assigned_sq_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'Assigned_sq table'//,
      // indexes: [
      //   {
      //     //在外键上建立索引
      //     fields: ['user_id']
      //   }
      // ],
      // classMethods: {
      //   associate: function (models) {
      //     this.belongsTo(models.User,
      //       {foreignKey: 'user_id'});
      //   }
      // }
    }
  );

  return Assigned_sq;
};
