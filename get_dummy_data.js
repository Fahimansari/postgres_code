const { Sequelize } = require("sequelize");
const moment = require('moment')
const {DummyTable} = require('./models/model')


// --------------------   load environment variables  --------------------
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
// --------------------        Done        --------------------

var async = require("async");
var GoogleSheetService = require("./googleSheetService");

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

  let data=[]
  for (let i = 1; i < rows[0].length; i++) {
    let a = []
    for (let j = 2; j < rows.length; j++) {
      a.push(rows[j][i])   
    }
    data.push(a)   
  }

  for (let i = 0; i < data.length; i++) {
      let entry = {
        date: moment().format('YYYY-MM-DD'),
        station_number: i,
        input: cleanNumber(data[i][0]),
        output: cleanNumber(data[i][1]),
        backlog: cleanNumber(data[i][2]),
        cycle_time: cleanNumber(data[i][3]),
        backlog_time: cleanNumber(data[i][4]),
      }; 
      entries.push(entry);
      }

    return entries;
};

let createTenEntries = (entry) => {
    let entries = []
for (let i = 0; i < 2; i++) {
    entries.push(entry)
    
}
return entries
}

async.auto(
  {
    getData: async function () {
      
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

        const DummyTableUpdate = sequelize.define("dummy_data", DummyTable.attributes, {
            tableName: DummyTable.table_name
        });

        try {
          await sequelize.authenticate();
          console.log("Connection has been established successfully.");
          const entry =  {
            name: 'alex',
            log_date: moment().format('YYYY-MM-DD'),
          }

          const entries = createTenEntries(entry)
          
      
          await DummyTableUpdate.sync();
          await DummyTableUpdate.destroy({
            where: {
                log_date: moment().format('YYYY-MM-DD') ,
            }
          })
          await DummyTableUpdate.bulkCreate(entries);
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
