const db = require("./db");
const helper = require("../../helper");

//List antrian
exports.antrian = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.estimasiJam, tbl_users.id as userId, tbl_users.name, tbl_users.phoneNumber, tbl_users.email, tbl_users.medicalRecordsNumber, tbl_service.name as service, tbl_antrian.status, tbl_jadwal.date, tbl_jadwal.isActive, tbl_jadwal.message, tbl_service.id as serviceId FROM tbl_antrian LEFT JOIN tbl_jadwal on tbl_antrian.jadwalId = tbl_jadwal.id LEFT JOIN tbl_service on tbl_antrian.serviceId = tbl_service.id LEFT JOIN tbl_users on tbl_antrian.userId = tbl_users.id WHERE tbl_jadwal.isActive = 1 ORDER BY tbl_antrian.date_created DESC"
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
      "SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.estimasiJam, tbl_users.id as userId, tbl_users.name, tbl_users.medicalRecordsNumber, tbl_users.phoneNumber, tbl_users.email, tbl_service.name as service, tbl_antrian.status, tbl_antrian.estimasi, tbl_jadwal.date, tbl_jadwal.isActive, tbl_jadwal.message, tbl_service.id as serviceId FROM tbl_antrian LEFT JOIN tbl_jadwal on tbl_antrian.jadwalId = tbl_jadwal.id LEFT JOIN tbl_service on tbl_antrian.serviceId = tbl_service.id LEFT JOIN tbl_users on tbl_antrian.userId = tbl_users.id ORDER BY tbl_antrian.date_created DESC"
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

//filter antrian
exports.antrianFilter = async (req, res, next) => {
  const scheduleId = req.params.scheduleId;
  try {
    const result = await db.query(
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.estimasiJam, tbl_users.id as userId, tbl_users.name, tbl_users.phoneNumber, tbl_users.email, tbl_users.medicalRecordsNumber, tbl_service.name as service, tbl_antrian.status, tbl_jadwal.date, tbl_jadwal.isActive, tbl_jadwal.message, tbl_service.id as serviceId FROM tbl_antrian LEFT JOIN tbl_jadwal on tbl_antrian.jadwalId = tbl_jadwal.id LEFT JOIN tbl_service on tbl_antrian.serviceId = tbl_service.id LEFT JOIN tbl_users on tbl_antrian.userId = tbl_users.id WHERE tbl_jadwal.id = ${scheduleId} ORDER BY tbl_antrian.date_created DESC`
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
    console.log("Schedule ID: " + req.body.scheduleId);
    let cekAntrian = await db.query(
      `SELECT COUNT(tbl_antrian.id) as filled, (SELECT quota FROM tbl_jadwal WHERE id = ${data.scheduleId}) as quota, (SELECT open FROM tbl_jadwal WHERE id = ${data.scheduleId}) as waktuMulai, (SELECT code FROM tbl_antrian where jadwalId = ${data.scheduleId} ORDER BY id DESC LIMIT 1) as lastQueue FROM tbl_antrian WHERE jadwalId = ${data.scheduleId}`
    );

    // Jika antrian belum penuh
    if (cekAntrian[0].filled < cekAntrian[0].quota) {
      const resultSetting = await db.query(`select * from tbl_setting`);

      //Hitung
      var lastQueue;
      if (cekAntrian[0].lastQueue === null) {
        lastQueue = 0;
      } else {
        lastQueue = cekAntrian[0].lastQueue.substring(
          cekAntrian[0].lastQueue.indexOf("ID0") + 3
        );
      }

      var kode = `${resultSetting[0].queuePrefix}${data.scheduleId}_ID0${
        parseInt(lastQueue) + 1
      }`;

      //simpan nomor rekam medis jika ada
      if (data.medicalRecordsNumber) {
        await db.query(
          `update tbl_users set medicalRecordsNumber = "${data.medicalRecordsNumber}" WHERE id = ${data.userId}`
        );
      }

      //Cek apakah ada nomor antrian yang sama.
      const resultAntrianCek = await db.query(
        `SELECT code from tbl_antrian WHERE code = "${kode}"`
      );

      //Jika tidak ada nomor antrian yang sama.
      if (resultAntrianCek.length < 1) {
        //buat estimasi masuk
        let tempTime;
        if (cekAntrian[0].filled === 0) {
          tempTime = parseInt(00);
        } else {
          tempTime =
            parseInt(cekAntrian[0].filled) *
            parseInt(resultSetting[0].estimasi);
        }

        var inTime = `00:${tempTime}`;

        var waktuMulai = cekAntrian[0].waktuMulai;

        function toSeconds(s) {
          var p = s.split(":");
          return parseInt(p[0], 10) * 3600 + parseInt(p[1], 10) * 60;
        }

        function fill(s, digits) {
          s = s.toString();
          while (s.length < digits) s = "0" + s;
          return s;
        }

        var sec = toSeconds(inTime) + toSeconds(waktuMulai);

        var estimasiWaktu =
          fill(Math.floor(sec / 3600), 2) +
          ":" +
          fill(Math.floor(sec / 60) % 60, 2);

        console.log(estimasiWaktu);

        //Simpan antrian
        const result = await db.query(
          `INSERT INTO tbl_antrian (serviceId, userId, jadwalId, name, phoneNumber, email, husbandName, address, birth, code, estimasi, estimasiJam) VALUES (${data.serviceId}, ${data.userId}, ${data.scheduleId}, "${data.name}", "${data.phoneNumber}", "${data.email}", "${data.husbandName}", "${data.address}", "${data.birth}", "${kode}", ${resultSetting[0].estimasi}, "${estimasiWaktu}")`
        );

        if (result.affectedRows) {
          await db.query(
            `update tbl_users set name = "${data.name}",  phoneNumber = "${data.phoneNumber}", email = "${data.email}", birth = "${data.birth}", husbandName= "${data.husbandName}", address= "${data.address}"
            WHERE id = ${data.userId}`
          );

          const resultAntrian = await db.query(
            `SELECT tbl_antrian.code, tbl_antrian.estimasi, tbl_antrian.estimasiJam, tbl_jadwal.date, tbl_service.name FROM tbl_antrian LEFT JOIN tbl_jadwal ON tbl_jadwal.id = tbl_antrian.jadwalId LEFT JOIN tbl_service ON tbl_service.id = tbl_antrian.serviceId WHERE tbl_antrian.code = "${kode}"`
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
        //jika  ada nomor antrian
        res.status(402).json({
          status: 402,
          message: "Kode Antrian telah diambil, ulangi lagi",
          data: {},
        });
      }
    } else {
      // antrian penuh
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

//Edit estimasi
exports.antrianEstimasi = async (req, res, next) => {
  const id = req.params.queueId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_antrian set estimasi = ${data.estimasi} WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "estimasi queue updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "estimasi queue not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update estimasi queue`, error.message);
    next(error);
  }
};

//Edit antrian
exports.rekamMedisEdit = async (req, res, next) => {
  const id = req.params.userId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_users set medicalRecordsNumber = "${data.medicalRecordsNumber}" WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "medicalRecordsNumber updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "medicalRecordsNumber not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update medicalRecordsNumber`, error.message);
    next(error);
  }
};

//List antrian by user
exports.antrianUser = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.estimasiJam, tbl_antrian.status, tbl_service.name, tbl_jadwal.id as jadwalId, tbl_jadwal.open, tbl_jadwal.close, tbl_antrian.estimasi, tbl_jadwal.date, tbl_jadwal.message, tbl_jadwal.isActive FROM tbl_antrian LEFT JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId LEFT JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId LEFT JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.userId = ${req.params.userId}`
    );

    if (result.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "antrian not found",
        data: {},
      });
    } else {
      console.log(`data row: ${result}`);
      let dataAntrian = [];
      for (let [i, item] of result.entries()) {
        let semuaAntrianDariJadwal = await db.query(
          `SELECT code, status FROM tbl_antrian WHERE jadwalId = ${item.jadwalId}`
        );
        let selesai = 0;
        let tunda = 0;
        let urutan = semuaAntrianDariJadwal.findIndex(function (item) {
          if (item.status === 4) selesai += 1;
          if (item.status === 2) tunda += 1;
          return item.code === result[i].code;
        });

        console.log(selesai);
        console.log(tunda);
        console.log(urutan);

        let tempAntrian =
          parseInt(urutan) - parseInt(selesai) - parseInt(tunda);

        console.log(`antriandidepan: ${tempAntrian}`);

        dataAntrian.push({ ...item, queueBeforeYou: tempAntrian });
      }

      return res.status(200).json({
        status: 200,
        message: "all antrian",
        data: dataAntrian,
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
      `SELECT tbl_antrian.id, tbl_antrian.code, tbl_antrian.estimasiJam, tbl_antrian.status, tbl_users.name, tbl_users.phoneNumber, tbl_service.name as services, tbl_antrian.status, tbl_jadwal.date, tbl_antrian.husbandName, tbl_antrian.address, tbl_antrian.estimasi, tbl_antrian.birth FROM tbl_antrian JOIN tbl_service on tbl_service.id = tbl_antrian.serviceId JOIN tbl_jadwal on tbl_jadwal.id = tbl_antrian.jadwalId JOIN tbl_users on tbl_users.id = tbl_antrian.userId WHERE tbl_antrian.id = ${id}`
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

//Delete antrian
exports.antrianDelete = async (req, res, next) => {
  const id = req.params.queueId;
  try {
    const rows = await db.query(`delete from tbl_antrian where id = ${id}`);
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "queue deleted",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "queue not deleted",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while delete antrian`, error.message);
    next(error);
  }
};
