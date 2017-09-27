var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://umgxytivfnezso:7e577ba4f5dc3880da3e18e27caede075daa90e6cbf4689330c59f5517c92a34@ec2-79-125-2-71.eu-west-1.compute.amazonaws.com:5432/d1uun4rvd4q1ue?sslmode=require';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/topics',function (req,res,next) {
const client = new Client({
  connectionString: connectionString,
  ssl: true,
});
client.connect();
const query = 'select topics.id,syllabus_name,subject_name,topics.name from syllabi join subjects on subjects.syllabus_id = syllabi.id join topics on topics.subject_id = subjects.id'
client.query(query, (err, res) => {
  if (err){
  	console.log(err);
  }
  return res.rows;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
});

module.exports = router;
