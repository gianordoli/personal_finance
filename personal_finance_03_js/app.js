var connect = require('connect'),
		 fs = require('fs'),
   		csv = require('csv'),					 //csv
   	   util = require('util'),
	 	 io = require('socket.io').listen(9001), // WS port
   	   port = 9000,								 // HTTP port
	  	  $ = require('jquery');				 //jQuery

//1. create web server using connect 
connect.createServer(connect.static(__dirname + '/public')).listen(port);
util.log('the server is running on port: ' + port);

//2. init socket.io
io.set('log level', 1);

//3. Set up socket listeners
io.sockets.on('connection', function(socket) {

	//util.log is the same as console.log, but it prints the date and time along with the msg
	// util.log('Ooooooh, someone just poked me :)');
	socket.on('load', function(requestFromClient){
		console.log("Request call: " + requestFromClient);
		if(requestFromClient){
			loadCsv();
		}
	});
});

//4. Load csv
function loadCsv(){
	console.log('Called loadCsv function');
	csv()
	.from('data/transactions.tsv', { delimiter: '\t'})
	.to.array( function(rows){
		// console.log(rows);
		processData(rows);
	})
}

//5. Process data
function processData(data){
	console.log('Called processData function');
	// console.log(data);

	var transactions = [];

	for(var i = 1; i < data.length; i++) {
		var thisTransaction = new Object();

		// console.log(data[i]);
		var thisRow = data[i];

    	thisTransaction.description = thisRow[1];
    	// console.log(description);
    	thisTransaction.category = thisRow[5];    
    	// console.log(category);
    	thisTransaction.amount = parseFloat(thisRow[3]);
    	// console.log(amount);
    	var dateString = thisRow[0];
    	thisTransaction.date = parseDate(dateString);
    	// console.log(date);

    	thisTransaction.type = thisRow[4];
   		// console.log(type);
    	if(thisTransaction.type != 'credit'){
      		transactions.push(thisTransaction);
      		// console.log('hey');
    	}else{
			console.log('credit');
    	}
	}

	// console.log(transactions);
	sendData(transactions);  
}

//6. Send data to browser
function sendData(data){
	console.log('called send function');
	io.sockets.emit('write', data);;
}

function parseDate(dateString){	
	//1. Year
	var tempYear = parseInt(dateString.substr(dateString.lastIndexOf('/') + 1));
	// console.log('year string: ' + tempYear);
	tempYear = parseInt('20' + tempYear);
	// console.log('parsed year: ' + tempYear);
	
	//2. Month
	var tempMonth = dateString.substr(0, dateString.indexOf('/'));
	// console.log('month string: ' + tempMonth);
	tempMonth = parseInt(tempMonth) - 1;
	// console.log('parsed month: ' + tempMonth);

	//3. Date
	var tempDate = dateString.substr(dateString.indexOf('/') + 1);
	tempDate = tempDate.substr(0, tempDate.indexOf('/'));
	// console.log('day string: ' + tempDate);
	tempDate = parseInt(tempDate);
	// console.log('parsed date: ' + myDate.getDate());

	myDate = new Date(tempYear, tempMonth, tempDate);

	if(myDate.toString() != 'Invalid Date'){
		return myDate;
	}
}