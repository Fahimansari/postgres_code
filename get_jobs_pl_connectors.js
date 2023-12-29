console.log(`Cashflowy Connectors Log`);
const { Sequelize, DataTypes } = require("sequelize");
const moment = require('moment')
const {JobsPlLogConnectorsModel} = require('./models/model')


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
        website: rows[i][1],
        official_api_docs: rows[i][2],
        type: rows[i][3],
        create_connector: rows[i][4],
        docs: rows[i][5],
        is_created: rows[i][6],
        created_on: rows[i][7],
        explore_apis: rows[i][8],
        document_apis: rows[i][9],
        api_docs: rows[i][10],
        apis_count: rows[i][11],
        examples_count  : rows[i][12],


      }; 
      entries.push(entry);
      }

    return entries;
};
async.auto(
  {
    getData: async function () {
      var sheet_id = "10mglOtBwYoZ0NhI-q_7lm2zvxOSyKP1P0Fx4l8ynpVU";
      var range = `Connectors!A:Z`;
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

        const JobsPlLoggingConnectors = sequelize.define("jobs_pl_logging_connectors", JobsPlLogConnectorsModel.attributes, {
            tableName: JobsPlLogConnectorsModel.table_name
        });

        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
          var entries = transform(results.getData);
            
          await JobsPlLoggingConnectors.sync();
          // await JobsPlLoggingConnectors.destroy({truncate:true});
          await JobsPlLoggingConnectors.bulkCreate(entries);
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
