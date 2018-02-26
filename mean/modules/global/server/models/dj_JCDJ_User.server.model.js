'use strict';

module.exports = function (sequelize, DataTypes) {

  var dj_JCDJ_User = sequelize.define('dj_JCDJ_User',
    {
      JCDJ_UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      JCDJ_User_roleID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '角色id'
      },
      userName: {
        type: DataTypes.STRING(300),
        comment: '登录名'
      },
      userPassword: {
        type: DataTypes.STRING(300),
        comment: '密码'
      },
      IDCARD: {
        type: DataTypes.STRING(50),
        comment: '身份证号'
      },
      phone: {
        type: DataTypes.STRING(50),
        comment: '电话'
      },
      is_syn: {
        type: DataTypes.STRING(50),
        comment: '是否同步'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道'
      },
      CreateUser: {
        type: DataTypes.STRING(50),
        comment: '创建者'
      },
      CreateDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      is_delete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      },
      communityID: {
        type: DataTypes.STRING(100),
        comment: '社区id'
      },
      imagePath: {
        type: DataTypes.STRING(100),
        comment: '图片路径'
      },
      branch: {
        type: DataTypes.INTEGER,
        comment: '党员'
      },
      comnumID: {
        type: DataTypes.INTEGER,
        comment: '社区'
      },
      user_grade: {
        type: DataTypes.INTEGER,
        comment: '等级'
      }
    },
    {
      comment: 'lianhufeigong table',
      // indexes: [
      //   {
      //     //在外键上建立索引
      //     fields: ['JCDJ_UserID']
      //   }
      // ],
      classMethods: {
        associate: function (models) {
          this.hasMany(models.User,
            {foreignKey: 'JCDJ_UserID', targetKey: 'JCDJ_UserID'});
        }
      }
    }
  );

  return dj_JCDJ_User;
};
