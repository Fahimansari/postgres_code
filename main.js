console.log('alex_cashflow_track');

// --------------------   load environment variables  --------------------
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });
// --------------------        Done        --------------------


var async = require('async');
// console.log(__dirname);
var GoogleSheetService = require('./googleSheetService');
// console.log(integration);

var transform = function(rows){
	// if there is no header, set it to 0.
	// header row is the row number from google sheet, not the array index.
	var header_row=2 // 2th row is the header
	var entries = [];
	var cleanNumber=function(a){
		if(!a)
			return 0;
		var b = a.trim().split(',').join('');
		return parseFloat(b);

	}
	for(var i=0;i<rows.length;i++){
		if(i<header_row)
			continue;
		var entry = {
			"date":rows[i][0],
			"icici_651":cleanNumber(rows[i][1]),
			"icici_451":cleanNumber(rows[i][2]),
			"icici_452":cleanNumber(rows[i][3]),
			"icici_131":cleanNumber(rows[i][4]),
			"icici_cc_3000":cleanNumber(rows[i][5]),
			"icici_cc_9028":cleanNumber(rows[i][6]),
			"hdfc_1680":cleanNumber(rows[i][7]),
			"hdfc_2719":cleanNumber(rows[i][8]),
			"hdfc_cc_8145":cleanNumber(rows[i][9]),
			"cash_in_bank":cleanNumber(rows[i][10]),
			"credit_card_debt":cleanNumber(rows[i][11]),
			"net_cash":cleanNumber(rows[i][12]),
			"gain_or_loss":cleanNumber(rows[i][13]),
			"comments":rows[i][14],
		}
		entries.push(entry);
	}
	return entries;
}
async.auto({
	getData:async function(){
		var sheet_id='10mglOtBwYoZ0NhI-q_7lm2zvxOSyKP1P0Fx4l8ynpVU';
		var range=`Metrics!A:Z`;
		return await GoogleSheetService.getDataFromOneSheet(sheet_id,range);
	},
	// updatePostgres:['getData',async function(results){
	// 	var loadModels=require('./models/loadModels');
	// 	var {AlexCashflow,sequelize}=loadModels();
	// 	await AlexCashflow.sync();

	// 	var entries = transform(results.getData);
	// 	await AlexCashflow.destroy({truncate:true});// drops all data
	// 	console.time('update db');
	// 	await AlexCashflow.bulkCreate(entries); // adds all data
	// 	console.timeEnd('update db');
	// 	await sequelize.close();
	// 	// console.log(DailyStandup);
	// }]
},function(err,results){
	if(err)
		throw err;
	// console.log(results);
})