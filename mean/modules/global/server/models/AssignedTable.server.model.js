'use strict';

module.exports = function (sequelize, DataTypes) {

  var AssignedTable = sequelize.define('AssignedTable',
    {
      AssignedId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      AssignedTitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      AssignedContent: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      PT_type: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      StreetID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      gridId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      imagePath1: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      imagePath2: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      imagePath3: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      Reply: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      },
      createUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: '',
        comment: ''
      },
      modifyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      modifyDate: {
        type: DataTypes.DATE,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'AssignedTable table'//,
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
  return AssignedTable;
};
