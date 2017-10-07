var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const url = require('url');
const connectionString = process.env.DATABASE_URL || 'postgres://umgxytivfnezso:7e577ba4f5dc3880da3e18e27caede075daa90e6cbf4689330c59f5517c92a34@ec2-79-125-2-71.eu-west-1.compute.amazonaws.com:5432/d1uun4rvd4q1ue?sslmode=require';
const query = 'select topics.id,topics.name from syllabi join subjects on subjects.syllabus_id = syllabi.id join topics on topics.subject_id = subjects.id  where topics.subject_id = '
const params = url.parse(connectionString);
const auth = params.auth.split(':');
var pool = new pg.Pool({
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    max:20,
    ssl: true
});

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/topics/get', (req, res, next) => {
  const results = [];
  subject_id = req.query.subject_id;
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query(query + subject_id,function(err, result) {
    done();	
    return res.status(200).json(result.rows);
    }) 
   });
})

router.get('/syllabi/get', (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('select * from syllabi',function(err, result) {
    done(); 
    return res.status(200).json(result.rows);
    }) 
   });
})

router.get('/subjects/get', (req, res, next) => {
  const results = [];
  syllabus_name = req.query.syllabus_name;
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query("select subjects.id,subjects.subject_name from subjects join syllabi on subjects.syllabus_id = syllabi.id where syllabi.syllabus_name='"+ syllabus_name + "'",function(err, result) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    done();
    return res.status(200).json(result.rows); 
    }) 
   });
})

router.get('/questions/get', (req, res, next) => {
  const results = [];
  count = req.query.count;
  topic_id = req.query.topic_id;
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('select * from questions where topic_id=' + topic_id +'order by random limit' + count,function(err, result) {
    done();
    return res.status(200).json(result.rows);
    }) 
   });
})

router.get('/questions/get/all', (req, res, next) => {
  const results = [];
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    client.query('select questions.id,questions.q_text,questions.img_url,options."isImage",options.text,options.is_correct from questions join options on questions.id = options.q_id',function(err, result) {
    	if(err){
    		return res.status(500).json({success: false, data: err});
    	}
    	//for(result)
    	return res.status(200).json(result.rows);
    })     
   });
})

router.post('/questions/add', (req, res, next) => {
  question = req.body;
  console.log(question);
  for(option of question.options){
  	if(option.text == question.correct_option){
  		var answer = option.text;
  	}
  }
  var insert_id = null;
  pool.connect(function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
   client.query('insert into questions(topic_id,q_text,img_url,options_count) values ($1,$2,$3,$4) RETURNING id',[question.topic,question.text,question.image,question.options.length],function(err, result) {
    	if(err){
    		return res.status(500).json({success: false, data: err});
    	}
    	insert_id = result.rows[0].id;
    	for(option of question.options){
    	console.log(option);	
   		client.query('insert into options(q_id,"isImage",img_url,text,is_correct) values ($1,$2,$3,$4,$5)',[insert_id,false,"",option.text,option.text == answer?true:false],function(err, result) {
    	if(err){
    		done();
    		return res.status(500).json({success: false, data: err});
    	}
    		done();
    		return res.status(200).json(result.json); 
    })
}	 
    })

   });

})

module.exports = router;
