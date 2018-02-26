'use strict';

module.exports = function (sequelize, DataTypes) {
  // 上报的 活动，包括 自己创建的，以及别人上报的活动 关联活动iD
  var Appealsb = sequelize.define('appealsb',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'id'
      },
      appealId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '动态id'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      issb: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否上报'
      },
      isxp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否下发'
      },
      ishow: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否推送展示'
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        comment: '创建时间'
      },
      sbtime: {
        type: DataTypes.DATE,
        comment: '申报时间'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '层级id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        comment: '角色Id'
      },
      PartyBranchID: {
        type: DataTypes.INTEGER,
        comment: '支部ID'
      }
    },
    {
      comment: '党建动态上报推送表'/*,
      indexes: [
        {
          fields: ['current_PT_type']
        },
        {
          fields: ['streetID']
        },
        {
          fields: ['communityId']
        },
        {
          fields: ['gridId']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.dj_current_pt_type,
            {foreignKey: 'current_PT_type'});
          this.belongsTo(models.street_info,
            {foreignKey: 'streetID'});
          this.belongsTo(models.community,
            {foreignKey: 'communityId'});
          this.belongsTo(models.grid,
            {foreignKey: 'gridId'});
        }
      }*/
    }
  );
  return Appealsb;
};
