var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const { Pool, Client } = require('pg');

const app = express();

// var index = require('./routes/index');
// var tasks = require('./routes/tasks');

const port = 3000;
const limit = 7;


// DB connect client
const pool = new Pool({
	user: 'ritik',
	host: 'localhost',
	database: 'diabetes_test',
	password: 'admin',
	port: 5432,
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', index);
// app.use('/api', tasks);

app.get('/patientlist', function(req, res, next){

	client.connect();

	client.query('SELECT * FROM patient_diabetes_data', (err, result) => {
		if (err) {
			console.log(err);
		} else {
			// res.render('index', {recepies: result.rows});
			res.json({diabetes_data: result.rows})
			// console.log(result);
		}
		client.end();
	});
});

app.get('/diabetesList', function(req, res, next){

	pool.on('error', (err, client) => {
	  console.error('Unexpected error on idle client', err);
	  process.exit(-1);
	});

	const countQuery = 'SELECT count(*) FROM patient_diabetes_data';
	// const countQuery = 'SELECT NOW() as now';
	var rowCount = 0;

	pool.query(countQuery)
	  .then(res => {
	    rowCount = res.rows[0]['count'];
	  })
	  .catch(e => console.error(e.stack))

	
	var page = req.query.page || 1;	
	const query = 'SELECT * FROM patient_diabetes_data OFFSET $1 LIMIT $2';
	var offset = (page - 1) * limit;

	

	pool.connect((err, client, done) => {
		if (err) {
			throw err;
		} 

	  	client.query(query, [offset, limit], (err, result) => {
	    	done();

	    	if (err) {
	      		console.log(err.stack)
	    	} else {
	   //    		res.json({
				// 	title: 'Diabetes App',
				// 	diabetes_data: result.rows,
				// 	current_page: page,
				// 	page_count: Math.ceil(rowCount / limit)
				// })
		    	res.render('index', {
					title: 'Diabetes App',
					diabetes_data: result.rows,
					current_page: page,
					page_count: Math.ceil(rowCount / limit)
				});
	    	}
	  	});
	});

	// constclient.connect();

	
	// pool.query(query, [offset, limit], (err, result) => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		// res.render('index', {recepies: result.rows});
	// 		res.json({diabetes_data: result.rows})
	// 		// console.log(result);
	// 	}
	// 	// pool.end();
		
	// })
	// ;
});





app.listen(port, function(){
	console.log('Server started on port ' + port + '.....');
});

module.exports = app;