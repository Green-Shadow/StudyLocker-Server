var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://umgxytivfnezso:7e577ba4f5dc3880da3e18e27caede075daa90e6cbf4689330c59f5517c92a34@ec2-79-125-2-71.eu-west-1.compute.amazonaws.com:5432/d1uun4rvd4q1ue';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/topics',function (req,res,next) {
	var promise = require('bluebird');
	var options = {
  // Initialization Options
  	promiseLib: promise,
  	ssl:true
	};

	var pgp = require('pg-promise')(options);
	var db = pgp(connectionString);
	 db.any('select topics.id,syllabus_name,subject_name,topics.name from syllabi join subjects on subjects.syllabus_id = syllabi.id join topics on topics.subject_id = subjects.id;')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL puppies'
        });
    })
    .catch(function (err) {
      res.json({err});
    });
});

module.exports = router;
