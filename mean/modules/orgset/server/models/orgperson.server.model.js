'use strict';

module.exports = function (sequelize, DataTypes) {
  // 领导机构人员表
  var OrgPerson = sequelize.define('OrgPerson',
    {
      personId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      personName: {
        type: DataTypes.STRING,
        comment: '领导机构人员名称'
      },
      duty: {
        type: DataTypes.STRING,
        comment: '人员分类'
      },
      personduty: {
        type: DataTypes.STRING,
        comment: '人员职务'
      },
      personPhoto: {
        type: DataTypes.STRING,
        comment: '人员照片'
      },
      orgId: {
        type: DataTypes.INTEGER,
        comment: '所属领导机构Id'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      }
    },
    {
      comment: '领导机构人员表',
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

  return OrgPerson;
};
