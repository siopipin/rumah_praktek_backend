const db = require("./db");
const helper = require("../../helper");

//List Users
exports.users = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, role, name, phoneNumber, email FROM tbl_users"
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "user not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "all users",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list user`, error.message);
    next(error);
  }
};

//Users Detail
exports.usersDetail = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const result = await db.query(
      `SELECT id, role, name, phoneNumber, email, isActivated, birth, husbandName, address FROM tbl_users WHERE id = ${id}`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "user not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "users detail",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get list user`, error.message);
    next(error);
  }
};

//Users Detail
exports.userEdit = async (req, res, next) => {
  const id = req.params.userId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_users set name = "${data.name}", role = ${data.role}, phoneNumber = ${data.phoneNumber}, email = "${data.email}", birth = "${data.birth}", husbandName= "${data.husbandName}", address= "${data.address}"
      WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "users updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "user not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update user`, error.message);
    next(error);
  }
};

//Users Detail
exports.usersHistory = async (req, res, next) => {
  const id = req.params.userId;
  try {
    const result = await db.query(
      `SELECT tbl_history_medis.id, tbl_history_medis.date, tbl_service.name, tbl_history_medis.description FROM tbl_history_medis JOIN tbl_service ON tbl_service.id = tbl_history_medis.serviceId  WHERE userId = ${id}`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "history not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "history user",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list history user`, error.message);
    next(error);
  }
};

//Add jadwal
exports.usersHistoryAdd = async (req, res, next) => {
  var data = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tbl_jadwal (date, open, close, quota) VALUES ("${data.date}", "${data.time.open}", "${data.time.close}", ${data.quota})`
    );
    if (result.affectedRows) {
      res.status(201).json({
        status: 201,
        message: "schedules created",
        data: {},
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: "add schedules failed", data: {} });
    }
  } catch (error) {
    console.error(`Error while add schedules`, error.message);
    next(error);
  }
};
