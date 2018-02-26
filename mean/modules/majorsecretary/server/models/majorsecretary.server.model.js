'use strict';

module.exports = function (sequelize, DataTypes) {

  var Majorsecretary = sequelize.define('Majorsecretary',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '姓名'
      },
      sex: {
        type: DataTypes.STRING(10),
        defaultValue: '',
        comment: '性别'
      },
      duty: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '职务'
      },
      deeds: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: '模范事迹'
      },
      time: {
        type: DataTypes.DATE,
        comment: '时间'
      },
      photo: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '照片'
      },
      video_file: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '视屏'
      },
      remarks: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: '备注'
      },
      createuserid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '创建人ID'
      },
      createdate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '层级ID'
      },
      objId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '对象ID'
      }
    },
    {
      comment: 'majorsecretary table'
    }
  );

  return Majorsecretary;
};
