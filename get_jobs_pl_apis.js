console.log(`Cashflowy APIs Log`);
const { Sequelize, DataTypes } = require("sequelize");
const moment = require('moment')
const {JobsPlLogAPIsModel} = require('./models/model')


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
        app_name: rows[i][0],
        postman_folder_path: rows[i][1],
        api: rows[i][2],
        has_data: rows[i][3],
        is_useful: rows[i][4],
        write_script: rows[i][5],
        postman_link: rows[i][6],


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
      var range = `APIs!A:Z`;
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

        const JobsPlLoggingAPIs = sequelize.define("jobs_pl_logging_apis", JobsPlLogAPIsModel.attributes, {
            tableName: JobsPlLogAPIsModel.table_name
        });

        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
          var entries = transform(results.getData);
            
          await JobsPlLoggingAPIs.sync();
        //   await JobsPlLoggingAPIs.destroy({truncate:true});
          await JobsPlLoggingAPIs.bulkCreate(entries);
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
