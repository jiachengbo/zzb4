'use strict';

module.exports = function (sequelize, DataTypes) {

  var TopVoiceTable = sequelize.define('TopVoiceTable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '标题'
      },
      photos: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '照片'
      },
      file_path: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '文件'
      },
      content: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: '内容'
      },
      time: {
        type: DataTypes.DATE,
        comment: '时间'
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
      type: {
        type: DataTypes.INTEGER,
        comment: '通知类型'
      },
      createdate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      sbtime: {
        type: DataTypes.DATE,
        comment: '上报时间'
      }
    },
    {
      comment: '通知文件表'
    }
  );

  return TopVoiceTable;
};
