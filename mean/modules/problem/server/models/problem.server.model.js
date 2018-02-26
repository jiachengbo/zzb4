'use strict';

module.exports = function (sequelize, DataTypes) {

  var ProblemTable = sequelize.define('ProblemTable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: false,
        allowNull: false
      },
      problemId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '建议标题'
      },
      photo: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '建议图片'
      },
      wishContent: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '咨询内容'
      },
      releaseTime: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '发布时间'
      },
      releasePerson: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '发布人'
      },
      replyTime: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '回复时间'
      },
      replyContent: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '回复内容'
      },
      issend: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否回复'
      },
      istype: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '类型'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建用户'
      },
      createDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改人'
      },
      modifyDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改时间'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '街道'
      },
      communityID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '社区'
      },
      gridID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '网格'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否为手机端'
      },
      is_syn: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: ''
      }
    },
    {
      comment: 'problem table',
      indexes: [
        {
          //在外键上建立索引
          fields: ['streetID']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.street_info,
            {foreignKey: 'streetID'});
        }
      }
    }
  );

  return ProblemTable;
};
