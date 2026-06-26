const mysql = require("mysql");

exports.connect = () => {
  return mysql.createPool({
    host:     process.env.DB_HOST     || "localhost",
    user:     process.env.DB_USER     || "entto",
    password: process.env.DB_PASSWORD || "EnttoMySQL",
    database: process.env.DB_NAME     || "aulas",
  });
};
