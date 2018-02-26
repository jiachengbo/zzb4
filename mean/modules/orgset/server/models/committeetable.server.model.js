'use strict';

module.exports = function (sequelize, DataTypes) {

  var CommitteeTable = sequelize.define('CommitteeTable',
    {
      CommitteeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      CommitteeName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '名字'
      },
      CommitteeWork: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '单位'
      },
      CommitteePostion: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '职务'
      },
      CommitteePhotoPath: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '照片'
      },
      CommitteeType: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '类型'
      },
      Street: {
        type: DataTypes.INTEGER,
        comment: '街办'
      },
      community: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '社区'
      },
      GridID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '网格'
      },
      Remark: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '备注'
      },
      Isdelete: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '是否删除'
      },
      createUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建人id'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      modifyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改人id'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: '修改时间'
      }
    },
    {
      comment: '委员',
      indexes: [
        {
          //在外键上建立索引
          fields: ['Street']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.OrgTable,
            {foreignKey: 'Street'});
        }
      }
    }
  );
  return CommitteeTable;
};
