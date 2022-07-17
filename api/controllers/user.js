const db = require("./db");
const helper = require("../../helper");

//List Users
exports.users = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, role, name, phoneNumber, email, img FROM tbl_users"
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
      `SELECT id, role, name, phoneNumber, email, isActivated, birth, husbandName, address, medicalRecordsNumber, img FROM tbl_users WHERE id = ${id}`
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
    console.error(`Error while get detail user`, error.message);
    next(error);
  }
};

//Users Detail
exports.userEdit = async (req, res, next) => {
  const id = req.params.userId;
  const data = req.body;

  tglLahir = data.birth === "" ? "2000-01-01" : data.birth;

  console.log("tgl: " + tglLahir);

  try {
    console.log("status file " + req.file);

    if (!req.file) {
      const rows = await db.query(
        `update tbl_users set name = "${data.name}", role = ${data.role}, phoneNumber = ${data.phoneNumber}, email = "${data.email}", birth = "${tglLahir}", husbandName= "${data.husbandName}", address= "${data.address}"
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
    } else {
      //Ada file
      const rows = await db.query(
        `update tbl_users set name = "${data.name}", role = ${data.role}, phoneNumber = ${data.phoneNumber}, email = "${data.email}", birth = "${tglLahir}", husbandName= "${data.husbandName}", address= "${data.address}", img = "${req.file.filename}" WHERE id = ${id}`
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
      `INSERT INTO tbl_history_medis (userId, serviceId, description) VALUES (${req.params.userId}, ${data.serviceId}, "${data.description}")`
    );
    const result1 = await db.query(
      `update tbl_antrian set duration = ${data.duration} WHERE id = ${data.id}`
    );

    if (result.affectedRows === 1 && result1.affectedRows === 1) {
      const resultGetAntrian = await db.query(
        `select * from tbl_antrian WHERE id = ${data.id}`
      );
      let rnd = Math.floor(Math.random() * 9999) + 1;
      let noRiwayat = `${resultGetAntrian[0].code}${rnd}`;

      console.log(`nilai random: ${noRiwayat}`);

      const resultUser = await db.query(
        `select * from tbl_users WHERE id = ${resultGetAntrian[0].userId}`
      );
      console.log("user id pada tbl_user: " + resultGetAntrian[0].userId);
      console.log("status Rekam Medis: " + resultUser[0].medicalRecordsNumber);

      if (resultUser[0].medicalRecordsNumber == null) {
        let resultUpdateRekamMedis = await db.query(
          `update tbl_users set rekamMedis = "${noRiwayat}" WHERE id = ${resultGetAntrian[0].userId}`
        );

        console.log(resultUpdateRekamMedis.affectedRows);
      }

      res.status(201).json({
        status: 201,
        message: "usersHistory created",
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
