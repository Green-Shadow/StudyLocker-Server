var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const url = require('url');
const connectionString = process.env.DATABASE_URL || 'postgres://umgxytivfnezso:7e577ba4f5dc3880da3e18e27caede075daa90e6cbf4689330c59f5517c92a34@ec2-79-125-2-71.eu-west-1.compute.amazonaws.com:5432/d1uun4rvd4q1ue?sslmode=require';
const query = 'select topics.id,syllabus_name,subject_name,topics.name from syllabi join subjects on subjects.syllabus_id = syllabi.id join topics on topics.subject_id = subjects.id'
const params = url.parse(connectionString);
const auth = params.auth.split(':');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/topics/get', (req, res, next) => {
  const results = [];
  var pool = new pg.Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  })
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query(query,function(err, result) {
    return res.status(200).json(JSON.stringify(result.rows)) 
    }) 
   });
})  


module.exports = router;
