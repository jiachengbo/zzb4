'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_jb = sequelize.define('Assigned_jb',
    {
      Assigned_jb_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      street_id: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'Assigned_jb table'//,
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

  return Assigned_jb;
};
