'use strict';

module.exports = function (sequelize, DataTypes) {

  var Survey = sequelize.define('Survey',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        comment: '内容'
      },
      textfile: {
        type: DataTypes.STRING,
        comment: '文件上传'
      },
      creatdate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      imgFile: {
        type: DataTypes.STRING,
        comment: '图片路径'
      },
      grade: {
        type: DataTypes.INTEGER,
        comment: '等级id'
      },
      objid: {
        type: DataTypes.INTEGER,
        comment: '对象id'
      },
      user_id: {
        type: DataTypes.INTEGER,
        comment: '用户id'
      }
    },
    {
      comment: 'survey table'
      /*indexes: [
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

  return Survey;
};
