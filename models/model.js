const { entries } = require('lodash');
const { DataTypes } = require('sequelize');
const moment = require('moment')

const JobsPlLogMetricsModel = {

	table_name: 'jobs_pl_log_metrics',
attributes: {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,

	  },
	  date: {
		type: DataTypes.DATEONLY,
		defaultValue: moment().format('YYYY-MM-DD') ,
		allowNull: true,
	  },
	  station_number: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	  input: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	  output: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	  backlog: {
		type: DataTypes.INTEGER,
		allowNull: true,
	  },
	  cycle_time: {
		type: DataTypes.FLOAT,
		allowNull: true,
	  },
	  backlog_time: {
		type: DataTypes.FLOAT,
		allowNull: true,
	  },
}
}
const JobsPlLogConnectorsModel = {
	
	table_name: 'jobs_pl_log_connectors',

	attributes: {
		id: {
			type : DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		log_date: {
			type: DataTypes.DATEONLY,
			defaultValue: moment().format('YYYY-MM-DD') ,
			allowNull: true,
		},
		app_name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		website:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		
		official_api_docs:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		type:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		create_connector:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		docs:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		is_created: {	
			type: DataTypes.TEXT,
			allowNull: true,
		},

		created_on: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},

		explore_apis:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		document_apis:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		api_docs:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		apis_count:{
			type: DataTypes.INTEGER,
			allowNull: true,
		},

		examples_count:{
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		}
		}

const JobsPlLogAPIsModel = {
	
	table_name: 'jobs_pl_log_apis',
	attributes:	{
		id: {
			type : DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},

		log_date: {
			type: DataTypes.DATEONLY,
			defaultValue: moment().format('YYYY-MM-DD') ,
			allowNull: true,
		},

		app_name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		postman_folder_path:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		api:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		has_data:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		is_useful:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		write_script:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		postman_link:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

	}
}

const JobsPlLogJobsModel={	
	table_name: 'jobs_pl_log_jobs',
	attributes:	{
		id: {
			type : DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},

		log_date: {
			type: DataTypes.DATEONLY,
			defaultValue: moment().format('YYYY-MM-DD') ,
			allowNull: true,
		},

		job_name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},

		app_name	:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		sheet_name: 		{	
			type: DataTypes.TEXT,
			allowNull: true,
		},

		write_script:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		document_job:{	
			type: DataTypes.TEXT,
			allowNull: true,
		},

		deploy_job:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		job_docs:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		filter_check:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		data_layout_check:{	
			type: DataTypes.TEXT,
			allowNull: true,
		},

		documentation_check:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		product_test	:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		job_id:{
			type: DataTypes.TEXT,
			allowNull: true,
		},

		path: {	
			type: DataTypes.TEXT,
			allowNull: true,
		},
		
		postman_link:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		
	
	}

}

module.exports={JobsPlLogMetricsModel, JobsPlLogConnectorsModel, JobsPlLogAPIsModel, JobsPlLogJobsModel}



