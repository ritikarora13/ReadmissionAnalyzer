var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const { Pool, Client } = require('pg');

const app = express();

// var index = require('./routes/index');
// var tasks = require('./routes/tasks');

const port = 3000;
const limit = 7;
const strDate = '';


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

	
	const selectParams = 'encounter_id, patient_nbr ,patient_name, admission_date, ' +
	'discharge_date, gender, age_category, race, admission_source, admission_type, ' +
	'insulin, diabetesmed, discharge_disposition, medical_specialty, payer_code, ' +
	'readmission_result, lace_result, risk_of_readmission';
	const query = 'SELECT '+ selectParams +' FROM patient_diabetes_data where admission_date >= $1 and admission_date <= $2';

	var start_date = req.query.start_date || '1990';
	var start_date = start_date + '-01-01';
	var end_date = req.query.end_date || '2010';
	var end_date = end_date + '-12-31';
	var params = [start_date,end_date];
	
	pool.query(query, params)
	  .then(result => {
	    res.json({diabetes_data: result.rows})
	  })
	  .catch(e => console.error(e.stack))

	
});

app.get('/diabetesList', function(req, res, next){

	pool.on('error', (err, client) => {
	  console.error('Unexpected error on idle client', err);
	  process.exit(-1);
	});

	const countQuery = 'SELECT count(*) FROM patient_diabetes_data';
	var rowCount = 0;

	var page = req.query.page || 1;	
	var offset = (page - 1) * limit;

	var start_date = req.query.start_date || '1990';
	var start_date = start_date + '-01-01';
	var end_date = req.query.end_date || '2010';
	var end_date = end_date + '-12-31';
	var params = [start_date,end_date];
	
	const selectParams = 'encounter_id, patient_nbr ,patient_name, admission_date, ' +
	'discharge_date, gender, age_category, race, admission_source, admission_type, ' +
	'insulin, diabetesmed, discharge_disposition, medical_specialty, payer_code, ' +
	'readmission_result, lace_result, risk_of_readmission';
	const dataQuery = 'SELECT '+ selectParams +' FROM patient_diabetes_data ' +
	' where admission_date >= $1 and admission_date <= $2 OFFSET $3 LIMIT $4';
		

	// To get the total count of records
	pool.query(countQuery)
	  .then(countRes => {
	    rowCount = countRes.rows[0]['count'];

	    // To get the data based on offset and limit
	    pool.query(dataQuery, [start_date, end_date, offset,limit])
	    	.then(result => {
	    		res.render('patient_list', {
					title: 'Diabetes App',
					diabetes_data: result.rows,
					current_page: page,
					page_count: Math.ceil(rowCount / limit)
				});
	    	})
	    	.catch(e => console.error(e.stack))
	  })
	  .catch(e => console.error(e.stack))

});





app.listen(port, function(){
	console.log('Server started on port ' + port + '.....');
});

module.exports = app;