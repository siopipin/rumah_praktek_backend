var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",

	//Tambah port ketika menggunakan mac
	port: "3306",
	user: "root",
	password: "root",
	database: "db_rumahpraktek",
	dateStrings: 'date'
});

module.exports = connection;
