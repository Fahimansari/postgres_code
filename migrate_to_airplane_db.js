const { Sequelize } = require("sequelize");
const moment = require("moment");
const { JobsPlLogJobsModel } = require("./models/model");
const async = require("async");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const transformData = (data) => {
    let transformed = []
    data.map(e => {
        console.log(e.dataValues);
        const entry = {
            log_date: e.dataValues.log_date,
            job_name: e.dataValues.job_name,
            app_name: e.dataValues.app_name,
            sheet_name: e.dataValues.sheet_name,
            write_script: e.dataValues.write_script,
            document_job: e.dataValues.document_job,
            deploy_job: e.dataValues.deploy_job,
            job_docs: e.dataValues.job_docs,
            filter_check: e.dataValues.filter_check,
            data_layout_check: e.dataValues.data_layout_check,
            documentation_check: e.dataValues.documentation_check,
            product_test: e.dataValues.product_test,
            job_id: e.dataValues.job_id,
            path: e.dataValues.path,
            postman_link: e.dataValues.postman_link,
            review_comments: e.dataValues.review_comments,





            
        }

        transformed.push(entry)
    })

    return transformed
}

async.auto({
  getData: async function () {},
  updatePostgres: [
    "getData",
    async function (results) {
      const sequelize_prod = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          dialect: "postgres",
        }
      );

      const sequelize_airplane = new Sequelize(
        process.env.AIRPLANE_DB_NAME,
        process.env.AIRPLANE_DB_USER,
        process.env.AIRPLANE_DB_PASSWORD,
        {
          host: process.env.AIRPLANE_DB_HOST,
          dialect: "postgres",
          ssl: true,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        }
      );

      const DataFromProd = sequelize_prod.define(
        "jobs_pl_jobs",
        JobsPlLogJobsModel.attributes,
        { tableName: JobsPlLogJobsModel.table_name }
      );

      const DataToAirplane = sequelize_airplane.define(
        "jobs_pl_jobs_airplane",
        JobsPlLogJobsModel.attributes,
        { tableName: JobsPlLogJobsModel.table_name }
      );

      try {
        await sequelize_prod.authenticate();
        await sequelize_airplane.authenticate();
        console.log(`Connection to ${process.env.DB_NAME} has been established successfully.`);
        console.log(`Connection to ${process.env.AIRPLANE_DB_NAME} has been established successfully.`);
        await DataFromProd.sync();
        await DataToAirplane.sync();

        await DataFromProd.findAll().then((data) => {
            const entries = transformData(data)
            // console.log(data);
            return DataToAirplane.bulkCreate(entries)
        }).then(() => {
            console.log('Data has been migrated to airplane db')
        }).catch((error) => {
            console.log(error)
        })

      } catch (error) {
        console.log(error);
      }
    },
  ],
});
