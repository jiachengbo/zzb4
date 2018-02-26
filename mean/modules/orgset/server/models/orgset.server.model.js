'use strict';

module.exports = function (sequelize, DataTypes) {
  // 组织设置表
  var OrgSet = sequelize.define('OrgSet',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      orgId: {
        type: DataTypes.INTEGER,
        comment: '领导机构Id'
      },
      duty: {
        type: DataTypes.STRING,
        comment: '工作职责'
      },
      createTime: {
        type: DataTypes.DATE,
        comment: '会议召开时间'
      },
      street: {
        type: DataTypes.INTEGER,
        comment: '街道id'
      },
      community: {
        type: DataTypes.STRING,
        comment: '社区id'
      },
      quest: {
        type: DataTypes.STRING,
        comment: '研究解决问题'
      },
      meetingPhoto: {
        type: DataTypes.STRING,
        comment: '会议图片1'
      },
      meetingPhoto2: {
        type: DataTypes.STRING,
        comment: '会议图片2'
      },
      file_path: {
        type: DataTypes.STRING,
        comment: '文件路径'
      }
    },
    {
      comment: '组织设置表',
      indexes: [
        {
          //在外键上建立索引
          fields: ['orgId']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.OrgTable,
            {foreignKey: 'orgId'});
        }
      }
    }
  );

  return OrgSet;
};
