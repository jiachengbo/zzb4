'use strict';

module.exports = function (sequelize, DataTypes) {

  var Buildbuild = sequelize.define('Buildbuild',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        comment: '活动标题'
      },
      details: {
        type: DataTypes.STRING,
        comment: '活动内容'
      },
      photo: {
        type: DataTypes.STRING,
        comment: '活动图片'
      },
      docFile: {
        type: DataTypes.STRING,
        comment: '活动文件'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '创建人等级Id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '创建人角色Id'
      },
      branchId: {
        type: DataTypes.INTEGER,
        comment: '创建人所在党支部Id'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      sbtime: {
        type: DataTypes.DATE,
        comment: '上报时间'
      }
    },
    {
      comment: '共驻共建表'/*,
      indexes: [
        {
          //在外键上建立索引
          fields: ['user_id']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.User,
            {foreignKey: 'user_id'});
        }
      }*/
    }
  );

  return Buildbuild;
};
