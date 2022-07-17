const db = require("./db");
const helper = require("../../helper");

//List antrian
exports.antrian = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT tbl_antrian.id, tbl_antrian.code, tbl_users.id as userId, tbl_users.name, tbl_users.phoneNumber, tbl_users.email, tbl_service.name, tbl_antrian.status, tbl_jadwal.date, tbl_jadwal.isActive, tbl_jadwal.message, tbl_service.id as serviceId FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_jadwal.isActive = 1 ORDER BY tbl_antrian.date_created DESC"
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

exports.antrianAll = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT tbl_antrian.id, tbl_antrian.code, tbl_users.id as userId, tbl_users.name, tbl_users.phoneNumber, tbl_users.email, tbl_service.name, tbl_antrian.status, tbl_jadwal.date, tbl_jadwal.isActive, tbl_jadwal.message, tbl_service.id as serviceId FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId ORDER BY tbl_antrian.date_created DESC"
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
    //Jika filled antrian < quota harian.

    const cekAntrian = await db.query(
      `SELECT COUNT(tbl_antrian.id) as filled, tbl_jadwal.quota FROM tbl_antrian JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId WHERE jadwalId = ${req.body.scheduleId}`
    );

    console.log(cekAntrian[0]);
    if (cekAntrian[0].filled < cekAntrian[0].quota) {
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1;
      var day = dateObj.getUTCDate();

      const resultSetting = await db.query(
        `select queuePrefix from tbl_setting`
      );

      let rnd = Math.floor(Math.random() * 99) + 1;

      var kode = `${resultSetting[0].queuePrefix}${month}${day}_ID${data.userId}${rnd}`;
      console.log(kode);

      const result = await db.query(
        `INSERT INTO tbl_antrian (serviceId, userId, jadwalId, name, phoneNumber, email, husbandName, address, birth, code) VALUES (${data.serviceId}, ${data.userId}, ${data.scheduleId}, "${data.name}", ${data.phoneNumber}, "${data.email}", "${data.husbandName}", "${data.address}", "${data.birth}", "${kode}")`
      );
      if (result.affectedRows) {
        const resultAntrian = await db.query(
          `SELECT tbl_antrian.code, tbl_antrian.estimasi, tbl_jadwal.date, tbl_service.name FROM tbl_antrian JOIN tbl_jadwal ON tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_service ON tbl_service.id = tbl_antrian.serviceId WHERE tbl_antrian.code = "${kode}"`
        );

        res.status(201).json({
          status: 201,
          message: "antrian created",
          data: resultAntrian[0],
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "add antrian failed", data: {} });
      }
    } else {
      //penuh
      res.status(400).json({ status: 400, message: "Antrian Penuh", data: {} });
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

//List antrian by user
exports.antrianUser = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.status, tbl_service.name, tbl_antrian.estimasi, tbl_jadwal.date, tbl_jadwal.message, tbl_jadwal.isActive FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.userId = ${req.params.userId} AND tbl_antrian.status != 4`
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
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.status, tbl_users.name, tbl_users.phoneNumber, tbl_service.name as services, tbl_antrian.status, tbl_jadwal.date, tbl_antrian.husbandName, tbl_antrian.address, tbl_antrian.estimasi, tbl_antrian.birth FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.id = ${id}`
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
