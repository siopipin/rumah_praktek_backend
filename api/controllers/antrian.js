const db = require("./db");
const helper = require("../../helper");

//List antrian
exports.antrian = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT tbl_antrian.id, tbl_antrian.code, tbl_users.name, tbl_users.phoneNumber, tbl_users.email, tbl_service.name, tbl_antrian.status, tbl_jadwal.date, tbl_jadwal.isActive FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId"
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

//Add antrian
exports.antrianAdd = async (req, res, next) => {
  var data = req.body;
  try {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();

    const resultSetting = await db.query(`select queuePrefix from tbl_setting`);

    var kode = `${resultSetting[0].queuePrefix}${month}${day}_ID${data.userId}`;
    console.log(kode);

    const result = await db.query(
      `INSERT INTO tbl_antrian (serviceId, userId, jadwalId, name, phoneNumber, email, husbandName, address, birth, code) VALUES (${data.serviceId}, ${data.userId}, ${data.scheduleId}, "${data.name}", ${data.phoneNumber}, "${data.email}", "${data.husbandName}", "${data.address}", "${data.birth}", "${kode}")`
    );
    if (result.affectedRows) {
      const resultAntrian = await db.query(
        `SELECT tbl_antrian.code, tbl_antrian.estimasi, tbl_jadwal.date, tbl_service.name FROM tbl_antrian JOIN tbl_jadwal ON tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_service ON tbl_service.id = tbl_antrian.serviceId WHERE tbl_antrian.code = "${kode}"`
      );

      res.status(200).json({
        status: 200,
        message: "antrian created",
        data: resultAntrian[0],
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: "add antrian failed", data: {} });
    }
  } catch (error) {
    console.error(`Error while add antrian`, error.message);
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

//Users Detail
exports.serviceDetail = async (req, res, next) => {
  const id = req.params.serviceId;
  try {
    const result = await db.query(
      `SELECT id, name, description, isActive FROM tbl_service WHERE id = ${id}`
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "service not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "service detail",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get service detail`, error.message);
    next(error);
  }
};

//Edit Service
exports.servicesDelete = async (req, res, next) => {
  const id = req.params.serviceId;
  try {
    const rows = await db.query(`delete from tbl_service where id = ${id}`);
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "Service deleted",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "service not deleted",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while delete service`, error.message);
    next(error);
  }
};
