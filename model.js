const { DataTypes } = require('sequelize');
module.exports={
	name:'AlexCashflow',
	config:{
		// Specify the table name explicitly
		tableName: 'gsheet_alex_cashflow',
		// timestamps: false
	},
	attributes:{
		"id":{
		    type:DataTypes.INT,
		    allowNull:false,
		},
		"date":{
			type:DataTypes.DATE,
			allowNull:false,
		},
		"station_number":{
			type:DataTypes.INT,
			allowNull:true,
		},
		"input":{
			type:DataTypes.INT,
			allowNull:true,
		},
		"output":{
			type:DataTypes.INT,
			allowNull:true,
		},
		"backlog":{
			type:DataTypes.INT,
			allowNull:true,
		},
		"cycle_time":{
			type:DataTypes.FLOAT,
			allowNull:true,
		},
		"backlog_time":{
			type:DataTypes.FLOAT,
			allowNull:true,
		},
		
	},
}

