const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../../helper");
const db = require("./db");

//User Customer Login
exports.login = async (req, res, next) => {
  try {
    const result = await db.query(
      `select * from tbl_users where phoneNumber = ${req.body.phoneNumber} `
    );
    const rows = helper.emptyOrRows(result);

    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "user not found",
        data: {},
      });
    } else {
      const user = rows[0];
      bcrypt.compare(req.body.password, user.password, (error, result) => {
        if (error)
          return res.status(404).json({
            status: 404,
            message: "user not found",
            data: {},
          });
        if (result) {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              kode: user.kode,
              isActivated: user.isActivated,
            },
            process.env.JWT_KEY,
            {}
          );
          return res.status(200).json({
            status: 200,
            message: "Login success",
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              role: user.role,
              kode: user.kode,
              isActivated: user.isActivated,
              token: token,
            },
          });
        } else {
          return res.status(404).json({
            status: 404,
            message: "user not found",
            data: {},
          });
        }
      });
    }
  } catch (error) {
    console.error(`Error while get user`, error.message);
    next(error);
  }
};

exports.registration = async (req, res, next) => {
  var data = req.body;
  try {
    bcrypt.hash(data.password, 11, async (error, hash) => {
      if (error) {
        res.status(500).json({ status: 500, message: error, data: {} });
      } else {
        data.password = hash;
        const result = await db.query(
          `INSERT INTO tbl_users (name, phoneNumber, password) VALUES ("${data.name}", "${data.phoneNumber}", "${data.password}")`
        );
        if (result.affectedRows) {
          res.status(200).json({
            status: 200,
            message: "register success",
            data: {},
          });
        } else {
          res
            .status(404)
            .json({ status: false, message: "register failed", data: {} });
        }
      }
    });
  } catch (error) {
    console.error(`Error while register user`, error.message);
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, role, name, phoneNumber, email, isActivated, birth, husbandName, address, medicalRecordsNumber, img FROM tbl_users WHERE id = ${req.userData.id}`
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

//Cek HP untuk lupa kata sandi.
//Jika ada nomor hp generate kode
exports.reset = async (req, res, next) => {
  var data = req.body;

  try {
    const result = await db.query(
      `select * from tbl_users where phoneNumber = ${data.phoneNumber} `
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "No Hp belum terdaftar atau salah, coba lagi",
        data: {},
      });
    } else {
      bcrypt.hash(data.password, 11, async (error, hash) => {
        if (error) {
          res.status(500).json({ status: 500, message: error, data: {} });
        } else {
          data.password = hash;
          console.log("hp " + data.phoneNumber);
          console.log("pswd " + data.password);

          const resultUpdate = await db.query(
            "update tbl_users set password = ? WHERE phoneNumber = ?",
            [data.password, data.phoneNumber]
          );
          console.log(resultUpdate.affectedRows);
          if (resultUpdate.affectedRows) {
            res.status(200).json({
              status: 200,
              message: "Kata sandi berhasil diganti, silahkan login ulang.",
              data: {},
            });
          } else {
            res.status(400).json({
              status: 400,
              message: "Reset kata sandi gagal, coba lagi!",
              data: {},
            });
          }
        }
      });
    }
  } catch (error) {
    console.error(`Error while get user`, error.message);
    next(error);
  }
};
