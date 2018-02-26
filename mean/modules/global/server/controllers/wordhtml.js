var path = require('path'),
  fs = require('fs'),
  multer = require(path.resolve('./config/private/multer')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  config = require(path.resolve('./config/config')),
  child_process = require('child_process'),
  util = require('util'),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);
//目标文件类型
var distType = 'html';
//不同类型参数
var typeParam = {
  //html 字符集utf-8
  html: ':XHTML Writer File:UTF8'
};
var arr = [];
var obj;
function wordhtml(a, b, c) {
  console.log('开始进入');
  var diskFileName = path.join(b.diskDir, a);
  fs.exists(diskFileName, function (exists) {
    if (!exists) {
      logger.warn('conv docfile %s not exists', diskFileName);
     // return res.status(404).send('参数文件不存在:' + diskFileName);
    }
    var type = distType + (typeParam[distType] || '');
    var cmdLine = util.format('"%s" --headless --convert-to "%s"  --outdir "%s" "%s"',
      config.sofficePathName, type, b.diskDir, diskFileName);
    console.log(cmdLine);
    child_process.exec(cmdLine, function (error, stdout, stderr) {
      if (error) {
        logger.warn('conv docfile %s to pdf error:', diskFileName, error.message);
        //return res.status(404).send('文件转换错误:' + diskFileName);
      }
      var distFile = path.basename(a, path.extname(a)) + '.' + distType;
      var distFileName = path.join(b.diskDir, distFile);
      fs.exists(distFileName, function (exists) {
        if (!exists) {
          console.log('转换后的文件不存在:' + distFileName);
         // return res.status(404).send('转换后的文件不存在:' + distFileName);
        } else {
          console.log('转换完成');
          deleteOldImage(b.mountDir, b.diskDir, c);
          arr.shift();
          if (arr.length > 0) {
            wordhtml(arr[0].filename, arr[0].uploadImage, arr[0]);
          }
        }
      });
    });
  });
  // }
}
function get(a, b, d, e, f) {
  obj = {};
  obj.filename = a;
  obj.uploadImage = b;
  obj.jpg = d;
  obj.oldfile = e;
  obj.newfile = f;
  arr.push(obj);
  if (arr.length === 1) {
    wordhtml(arr[0].filename, arr[0].uploadImage, arr[0]);
  }
}
function deleteOldImage(c, d, f) {
  console.log('开始删除');
  return new Promise(function (resolve, reject) {
    if (f.jpg) {
      var oldImageName = f.jpg.replace(c, d);
      fs.unlink(oldImageName, function (unlinkError) {
        console.log('开始删除jpg');
      });
    }
    if (f.oldfile && f.newfile) {
      var oldfile = f.oldfile.replace(c, d);
      fs.unlink(oldfile, function (unlinkError) {
        console.log('开始删除file');
      });
    }
  });
}
exports.get = get;
exports.wordhtml = wordhtml;
exports.shuzuzhi = arr;
