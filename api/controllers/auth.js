const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conn = require("./db");
const request = require("request");

//User Customer Login
exports.login = (req, res, next) => {
  var hp = req.body.hp;
  var password = req.body.password;
  conn.query("select * from tbl_users where hp = ? ", hp, (err, rw) => {
    if (rw.length < 1) {
      return res.status(401).json({
        status: false,
        message: "Email & password anda tidak valid",
      });
    }
    var user = rw[0];
    bcrypt.compare(password, user.password, (error, result) => {
      if (error)
        return res.status(401).json({
          status: false,
          message: "Email & password anda tidak valid",
        });
      if (result) {
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            hp: hp,
            role: user.role,
            kode: user.kode,
            isActivated: user.isActivated,
          },
          process.env.JWT_KEY,
          {}
        );
        return res.status(200).json({
          status: true,
          message: "Login Berhasil",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            hp: hp,
            role: user.role,
            kode: user.kode,
            isActivated: user.isActivated,
            token: token,
          },
        });
      } else {
        return res.status(401).json({
          status: false,
          message: "Username & password anda tidak valid",
        });
      }
    });
  });
};

exports.registration = (req, res, next) => {
  var data = req.body;
  bcrypt.hash(data.password, 11, (error, hash) => {
    if (error) {
      res.status(500).json({ status: false, message: error });
    } else {
      data.password = hash;
      conn.query("INSERT INTO tbl_users SET ?", data, (err, result) => {
        if (err)
          res
            .status(400)
            .json({ status: false, message: "Pendaftaran gagal, coba lagi!" });
        else
          res.status(200).json({
            status: true,
            message:
              "Pendaftaran berhasil, silahkan login menggunakan No. Hp dan Kata sandi",
          });
      });
    }
  });
};

//Cek HP untuk lupa kata sandi.
//Jika ada nomor hp generate kode
exports.reset = (req, res, next) => {
  var id = req.body.id;
  var hp = req.body.hp;
  var password = req.body.password;
  console.log(`berikut password: ${password}`);

  conn.query("select * from tbl_users where hp = ? ", hp, (err, rw) => {
    if (rw.length < 1) {
      return res.status(401).json({
        status: false,
        message: "No Hp belum terdaftar atau salah, coba lagi",
      });
    } else {
      bcrypt.hash(password, 11, (error, hash) => {
        if (error) {
          res.status(500).json({ status: false, message: error });
        } else {
          password = hash;
          conn.query(
            "UPDATE tbl_users SET password= ? WHERE id = ?",
            [password, id],
            (err, result) => {
              console.log(`berikut hash: ${password}`);
              if (err)
                res.status(400).json({
                  status: false,
                  message: "Reset kata sandi gagal, coba lagi!",
                });
              else
                res.status(200).json({
                  status: true,
                  message: "Kata sandi berhasil diganti, silahkan login ulang.",
                });
            }
          );
        }
      });
    }
  });
};
