var mysql = require("mysql");
var connection = mysql.createConnection({
	host: "localhost",

	//Tambah port ketika menggunakan mac
	port: "3306",
	user: "admin_root",
	password: "Rakadev12345@",
	database: "admin_rumahpraktek",
	dateStrings: "date",
});

module.exports = connection;
