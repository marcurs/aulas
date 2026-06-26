const mysql = require("mysql");

exports.connect = () => {
  /* return mysql.createPool({
		host: '10.33.9.177',
		user: 'entto',
		password: 'EnttoMySQL2024',
		database: 'aulas',
	}); */
  return mysql.createPool({
    host: "localhost",
    user: "entto",
    password: "EnttoMySQL",
    database: "aulas",
  });
};
