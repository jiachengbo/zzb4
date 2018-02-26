'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  sequelize = require(path.resolve('./config/lib/sequelize')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

/**
 * Create an partymap
 */
exports.create = function (req, res) {
  /*var User = sequelize.model('User');
   var Partymap = sequelize.model('Partymap');
   var partymap = Partymap.build(req.body);

   partymap.user_id = req.user.id;
   partymap.save().then(function () {
   //重新加载数据，使数据含有关联表的内容
   return partymap.reload({
   include: [
   {
   model: User,
   attributes: ['displayName']
   }
   ]
   })
   .then(function() {
   res.json(partymap);
   });
   }).catch(function (err) {
   logger.error('partymap create error:', err);
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};

/**
 * Show the current partymap
 */
exports.read = function (req, res) {
  /*var partymap = req.model ? req.model.toJSON() : {};

   //partymap.isCurrentUserOwner = !!(req.user && partymap.user && partymap.user._id.toString() === req.user._id.toString());
   partymap.isCurrentUserOwner = !!(req.user && partymap.user && partymap.user.id.toString() === req.user.id.toString());

   res.json(partymap);*/
};

/**
 * Update an partymap
 */
exports.update = function (req, res) {
  /*var partymap = req.model;

   partymap.title = req.body.title;
   partymap.content = req.body.content;

   partymap.save().then(function () {
   res.json(partymap);
   }).catch(function (err) {
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};

/**
 * Delete an partymap
 */
exports.delete = function (req, res) {
  /*var partymap = req.model;

   partymap.destroy().then(function () {
   res.json(partymap);
   }).catch(function (err) {
   return res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};

/**
 * List of Partymap
 */
exports.list = function (req, res) {
  var arr = [];
  var sql1;
  var sql12;
  var sql;
  console.log(req.query);
  if (req.query.streed === '-1') {
    if (req.query.party === '1' && req.query.grid === '1') {

      sql1 = 'select * from PartyOrganizationTable';
      sequelize.query(sql1).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(1);
        arr.push(results);
      });
      sql12 = 'select * from grid_person';
      sequelize.query(sql12).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(0);
        arr.push(results);
      });
    } else if (req.query.party !== '1' && req.query.grid === '1') {
      console.log('-1-11');
      sql12 = 'select * from grid_person';
      sequelize.query(sql12).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(0);
        arr.push(results);
      });
    } else if (req.query.party === '1' && req.query.grid !== '1') {
      console.log('-11-1');
      sql1 = 'select * from PartyOrganizationTable';
      sequelize.query(sql1).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(1);
        arr.push(results);
      });
    }
    sql = 'select * from grid_curve  order by gridId,street_id,grid_curve_index';
    sequelize.query(sql).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      arr.push(results);
      return res.jsonp(arr);
    });

  } else if (req.query.streed !== '-1') {
    if (req.query.party === '1' && req.query.grid === '1') {
      console.log('111');
      sql1 = 'select * from PartyOrganizationTable where streetID = ' + req.query.streed;
      sequelize.query(sql1).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(1);
        arr.push(results);
      });
      sql12 = 'select * from grid_person where streetId = ' + req.query.streed;
      sequelize.query(sql12).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(0);
        arr.push(results);
      });
    } else if (req.query.party !== '1' && req.query.grid === '1') {
      console.log('1-11');
      sql12 = 'select * from grid_person where streetId = ' + req.query.streed;
      sequelize.query(sql12).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(0);
        arr.push(results);
      });
    } else if (req.query.party === '1' && req.query.grid !== '1') {
      console.log('11-1');
      sql1 = 'select * from PartyOrganizationTable where streetID = ' + req.query.streed;
      sequelize.query(sql1).spread(function (results, metadata) {
        // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
        results.push(1);
        arr.push(results);
      });
    }
    sql = 'select * from grid_curve where street_id = ' + req.query.streed + '  order by gridId,street_id,grid_curve_index';
    sequelize.query(sql).spread(function (results, metadata) {
      // Results 会是一个空数组和一个包含受影响行数的metadata 元数据对象
      arr.push(results);
      return res.jsonp(arr);
    });
  }

  /*var Partymap = sequelize.model('Partymap');
   var User = sequelize.model('User');

   Partymap.findAll({
   include: [
   {
   model: User,
   attributes: ['displayName']
   }
   ],
   order: 'id ASC'
   }).then(function (partymap) {
   return res.jsonp(partymap);
   }).catch(function (err) {
   logger.error('partymap list error:', err);
   return res.status(422).send(err);
   });*/
};

/**
 * Partymap middleware
 */
exports.partymapByID = function (req, res, next, id) {
  /*var Partymap = sequelize.model('Partymap');
   var User = sequelize.model('User');

   Partymap.findOne({
   where: {id: id},
   include: [
   {
   model: User,
   attributes: ['displayName']
   }
   ]
   }).then(function (partymap) {
   if (!partymap) {
   logger.error('No partymap with that identifier has been found');
   return res.status(404).send({
   message: 'No partymap with that identifier has been found'
   });
   }

   req.model = partymap;
   next();
   }).catch(function (err) {
   //return next(err);
   logger.error('partymap ByID error:', err);
   res.status(422).send({
   message: errorHandler.getErrorMessage(err)
   });
   });*/
};
