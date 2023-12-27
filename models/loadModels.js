// const Sequelize = require('sequelize');

// function loadModels() {
//   const sequelize = new Sequelize({
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     // other configuration options...
//   });

//   const AlexCashflow = sequelize.define('AlexCashflow', {
//     "id":{
//         type:DataTypes.INT,
//         allowNull:false,
//     },
//     "date":{
//         type:DataTypes.DATE,
//         allowNull:false,
//     },
//     "station_number":{
//         type:DataTypes.INT,
//         allowNull:true,
//     },
//     "input":{
//         type:DataTypes.INT,
//         allowNull:true,
//     },
//     "output":{
//         type:DataTypes.INT,
//         allowNull:true,
//     },
//     "backlog":{
//         type:DataTypes.INT,
//         allowNull:true,
//     },
//     "cycle_time":{
//         type:DataTypes.FLOAT,
//         allowNull:true,
//     },
//     "backlog_time":{
//         type:DataTypes.FLOAT,
//         allowNull:true,
//     },
//   });

//   return { AlexCashflow, sequelize };
// }

// module.exports = loadModels;