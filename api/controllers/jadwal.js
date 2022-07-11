const db = require("./db");
const helper = require("../../helper");

//List jadwal
exports.jadwal = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM tbl_jadwal");
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "jadwal not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "all jadwal",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list antrian`, error.message);
    next(error);
  }
};

//jadwal detail
exports.jadwalDetail = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM tbl_jadwal where id = ${req.params.scheduleId}`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "jadwal not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "detail jadwal",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get detail jadwal`, error.message);
    next(error);
  }
};

//jadwal detail
exports.jadwalHariIni = async (req, res, next) => {
  var dateObj = new Date();
  var year = dateObj.getUTCFullYear();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();

  try {
    const result = await db.query(
      `SELECT * FROM tbl_jadwal where date = "${year}-${month}-${day}"`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "jadwal not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "jadwal hari ini",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get jadwal`, error.message);
    next(error);
  }
};

//Add jadwal
exports.jadwalAdd = async (req, res, next) => {
  var data = req.body;
  console.log(data.time.start);
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

//Edit antrian
exports.antrianEdit = async (req, res, next) => {
  const id = req.params.queueId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_antrian set status = ${data.status} WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "queue updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "queue not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update queue`, error.message);
    next(error);
  }
};

//List antrian by user
exports.antrianUser = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.status, tbl_service.name, tbl_antrian.estimasi, tbl_jadwal.date FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.userId = ${req.params.userId} AND tbl_antrian.status != 4`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "antrian not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "all antrian",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list antrian`, error.message);
    next(error);
  }
};

//Antrian Detail
exports.antrianDetail = async (req, res, next) => {
  const id = req.params.queueId;
  try {
    const result = await db.query(
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.status, tbl_users.name, tbl_users.phoneNumber, tbl_service.name, tbl_antrian.status, tbl_jadwal.date, tbl_antrian.husbandName, tbl_antrian.address, tbl_antrian.estimasi, tbl_antrian.birth FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.id = ${id}`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "antrian not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "antrian detail",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get service detail`, error.message);
    next(error);
  }
};

//Edit Service
exports.antrianDelete = async (req, res, next) => {
  const id = req.params.queueId;
  try {
    const rows = await db.query(`delete from tbl_antrian where id = ${id}`);
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "queue canceled",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "antrian not deleted",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while delete antrian`, error.message);
    next(error);
  }
};
