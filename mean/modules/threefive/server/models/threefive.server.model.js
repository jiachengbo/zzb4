'use strict';

module.exports = function (sequelize, DataTypes) {

  var Threefive = sequelize.define('Threefive',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      communityid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属社区'
      },
      streetid: {
        type: DataTypes.INTEGER,
        comment: '所属街道'
      },
      gridId: {
        type: DataTypes.STRING,
        comment: '所属网格'
      },
      gridGleader: {
        type: DataTypes.STRING,
        comment: '网格党建小组组长'
      },
      GleaderPhone: {
        type: DataTypes.STRING,
        comment: '网格组长电话'
      },
      PInstructor: {
        type: DataTypes.STRING,
        comment: '党建指导员'
      },
      InstructorPhone: {
        type: DataTypes.STRING,
        comment: '党建指导员电话'
      },
      peerAdvisor: {
        type: DataTypes.STRING,
        comment: '楼栋长'
      },
      gridZhang: {
        type: DataTypes.STRING,
        comment: '网格长'
      },
      centerLeader: {
        type: DataTypes.STRING,
        comment: '中心户长'
      },
      partyBuild: {
        type: DataTypes.STRING,
        comment: '党建工作专员'
      },
      EconomicZY: {
        type: DataTypes.STRING,
        comment: '经济发展专员'
      },
      publicZY: {
        type: DataTypes.STRING,
        comment: '公共服务专员'
      },
      socialStabilitycZY: {
        type: DataTypes.STRING,
        comment: '社会稳定专员'
      },
      cityZY: {
        type: DataTypes.STRING,
        comment: '城市管理专员'
      },
      lat: {
        type: DataTypes.STRING,
        comment: '经度'
      },
      lon: {
        type: DataTypes.STRING,
        comment: '维度'
      },
      remark: {
        type: DataTypes.STRING,
        comment: '备注'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '等级'
      },
      branch: {
        type: DataTypes.INTEGER,
        comment: '党支部'
      },
      roleId: {
        type: DataTypes.INTEGER,
        comment: '角色'
      }

    },
    {
      comment: 'threefive table',
      indexes: [
        {
          //在外键上建立索引
          fields: ['communityid', 'streetid', 'gridId']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.community,
            {foreignKey: 'communityId'});
        }
      }
    }
  );

  return Threefive;
};
