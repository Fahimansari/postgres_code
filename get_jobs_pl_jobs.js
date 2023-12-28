console.log(`Cashflowy Jobs Log`);
const { Sequelize, DataTypes } = require("sequelize");
const moment = require('moment')
const {JobsPlLogJobsModel} = require('./models/model')


// --------------------   load environment variables  --------------------
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
// --------------------        Done        --------------------

var async = require("async");
var GoogleSheetService = require("./googleSheetService");

var transform = function (rows) {
  
    let header_row = 2
  var entries = [];
  var cleanNumber = function (a) {
    if (!a) return 0;
    var b = a.trim().split(",").join("");
    return parseFloat(b);
  };



  for (let i = header_row; i < rows.length; i++) {
      let entry = {
        log_date: moment().format('YYYY-MM-DD'),
        job_name: rows[i][0],
        app_name: rows[i][1],
        sheet_name: rows[i][2],
        write_script: rows[i][3],
        document_job: rows[i][4],
        deploy_job: rows[i][5],
        job_docs: rows[i][6],
        filter_check: rows[i][7],
        data_layout_check: rows[i][8],
        documentation_check: rows[i][9],
        product_test: rows[i][10],
        job_id  : rows[i][11],
        path: rows[i][12],
        postman_link: rows[i][13],


      }; 
      entries.push(entry);
      }
      console.log(entries);

    return entries;
};
async.auto(
  {
    getData: async function () {
      var sheet_id = "10mglOtBwYoZ0NhI-q_7lm2zvxOSyKP1P0Fx4l8ynpVU";
      var range = `Jobs!A:Z`;
      return await GoogleSheetService.getDataFromOneSheet(sheet_id, range);
    },
    updatePostgres: [
      "getData",
      async function (results) {
        const sequelize = new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASSWORD,
          {
            host: process.env.DB_HOST,
            dialect: "postgres",
          }
        );

        const JobsPlLoggingJobs = sequelize.define("jobs_pl_logging_apis", JobsPlLogJobsModel.attributes, {
            tableName: JobsPlLogJobsModel.table_name
        });

        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
          var entries = transform(results.getData);
            
          await JobsPlLoggingJobs.sync();
        //   await JobsPlLoggingJobs.destroy({truncate:true});
          await JobsPlLoggingJobs.bulkCreate(entries);
          await sequelize.close()
        } catch (error) {
          console.error("Unable to connect to the database:", error);
        }

      },
    ],
  },
  function (err, results) {
    if (err) throw err;
  }
);
