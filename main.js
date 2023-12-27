console.log("alex_cashflow_track");
const { Sequelize, DataTypes } = require("sequelize");
const moment = require('moment')


// --------------------   load environment variables  --------------------
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
// --------------------        Done        --------------------

var async = require("async");
// console.log(__dirname);
var GoogleSheetService = require("./googleSheetService");
// console.log(integration);

var transform = function (rows) {
  // if there is no header, set it to 0.
  // header row is the row number from google sheet, not the array index.
  var header_row = 2; // 2th row is the header
  var entries = [];
  var cleanNumber = function (a) {
    if (!a) return 0;
    var b = a.trim().split(",").join("");
    return parseFloat(b);
  };
  for (var i = 0; i < rows.length; i++) {
    if (i < header_row) continue;
    var entry = {
      // "date":rows[i][0],
      input: cleanNumber("2"),
      output: cleanNumber("2"),
      backlog: cleanNumber("2"),
      cycle_time: cleanNumber("2"),
      station_number: cleanNumber("2"),
      backlog_time: cleanNumber("2"),
    };
    entries.push(entry);
  }
  return entries;
};
async.auto(
  {
    getData: async function () {
      var sheet_id = "10mglOtBwYoZ0NhI-q_7lm2zvxOSyKP1P0Fx4l8ynpVU";
      var range = `Metrics!A:Z`;
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

        const JobsPlLogging = sequelize.define("jobs_pl_logging", {
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
        }, {
            tableName: 'jobs_pl_log'
        });

        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
          var entries = transform(results.getData);
          console.log(entries);
          await JobsPlLogging.sync();
          await JobsPlLogging.bulkCreate(entries);
          await sequelize.close()
        } catch (error) {
          console.error("Unable to connect to the database:", error);
        }

        // var loadModels=require('./models/loadModels');
        // var {AlexCashflow,sequelize}=loadModels();

        // var entries = transform(results.getData);
        // await AlexCashflow.destroy({truncate:true});// drops all data
        // console.time('update db');
        // await AlexCashflow.bulkCreate(entries); // adds all data
        // console.timeEnd('update db');
        // await sequelize.close();
        // console.log(DailyStandup);
      },
    ],
  },
  function (err, results) {
    if (err) throw err;
    // console.log(results);
  }
);
