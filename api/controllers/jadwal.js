const db = require("./db");
const helper = require("../../helper");

//List jadwal
exports.jadwal = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM tbl_jadwal ORDER BY date ASC");
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "jadwal not found",
        data: {},
      });
    } else {
      let dataJadwal = [];
      for (let item of rows) {
        let resutlFilled = await db.query(
          `SELECT COUNT(id) as filled FROM tbl_antrian WHERE jadwalId =  ${item.id}`
        );
        dataJadwal.push({ ...item, filled: resutlFilled[0].filled });
      }

      console.log("finish");
      return res.status(200).json({
        status: 200,
        message: "all jadwal",
        data: dataJadwal,
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

  console.log(`${year}-${month}-${day}`);

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
      const resutlTTL = await db.query(
        `SELECT COUNT(id) as filled FROM tbl_antrian WHERE jadwalId =  ${rows[0].id}`
      );
      rows[0]["filled"] = resutlTTL[0].filled;
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

  try {
    //cek jika ada tanggal yang sama.
    const resultTgl = await db.query(
      `SELECT date FROM tbl_jadwal WHERE date = "${data.date}" `
    );
    console.log("result ttl: " + resultTgl.length);
    if (resultTgl.length === 0) {
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
    } else {
      res.status(404).json({
        status: false,
        message: "Schedule date has already been taken",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while add schedules`, error.message);
    next(error);
  }
};

//Edit jadwal
exports.jadwalEdit = async (req, res, next) => {
  const id = req.params.scheduleId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_jadwal set isActive = ${data.isActive}, date = "${data.date}", open = "${data.time.open}", close = "${data.time.close}", quota = ${data.quota}, message = "${data.message}" WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "schedules updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "schedules not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update schedules`, error.message);
    next(error);
  }
};

//Delete users
exports.jadwalDelete = async (req, res, next) => {
  const id = req.params.scheduleId;
  try {
    const rows = await db.query(`delete from tbl_jadwal where id = ${id}`);
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "jadwal deleted",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "jadwal not deleted",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while delete jadwal`, error.message);
    next(error);
  }
};
