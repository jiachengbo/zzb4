'use strict';

module.exports = function (sequelize, DataTypes) {

  var Appeal = sequelize.define('appeal',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        comment: 'id'
      },
      appealId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: '动态id'
      },
      appealTitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '动态标题'
      },
      appealContext: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '动态内容'
      },
      imagePath: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '图片名'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      context: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '备注'
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
      },
      sbtime: {
        type: DataTypes.DATE,
        comment: '上报时间'
      },
      communityId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '社区'
      },
      gridId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '网格id'
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '状态'
      },
      // photoOne: {
      //   type: DataTypes.STRING,
      //   defaultValue: '',
      //   comment: '照片一'
      // },
      // photoTwo: {
      //   type: DataTypes.STRING,
      //   defaultValue: '',
      //   comment: '照片二'
      // },
      // photoThree: {
      //   type: DataTypes.STRING,
      //   defaultValue: '',
      //   comment: '照片三'
      // },
      current_PT_type: {
        type: DataTypes.INTEGER,
        comment: '当前处理平台'
      },
      SB_time: {
        type: DataTypes.DATE,
        comment: '上报时间'
      },
      HF_time: {
        type: DataTypes.DATE,
        comment: '回复时间'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街办'
      },
      HF_text: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '回复内容'
      },
      JB_HF_text: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '街办回复内容'
      },
      is_syn: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否同步'
      },
      phoneOnePath: {
        type: DataTypes.STRING,
        comment: '图片一地址'
      },
      photoTwoimagePath: {
        type: DataTypes.STRING,
        comment: '图片二地址'
      },
      photoThreeimagePath: {
        type: DataTypes.STRING,
        comment: '图片三地址'
      },
      PartyBranchID: {
        type: DataTypes.INTEGER,
        comment: '支部ID'
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '类型'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '层级id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        comment: '角色Id'
      },
      issb: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否上报'
      },
      ishow: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否推送展示'
      }
    },
    {
      comment: '党建动态表'/*,
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
  return Appeal;
};
