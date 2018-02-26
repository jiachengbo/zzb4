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
        defaultValue: '',
        comment: ''
      },
      NexusContext: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: '',
        comment: ''
      },
      streetID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      PT_type: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'AssignedNexus table'//,
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

  return AssignedNexus;
};
