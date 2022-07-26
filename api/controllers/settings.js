const db = require("./db");
const helper = require("../../helper");

//List services
exports.settings = async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM tbl_setting");
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "settings not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "settings",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get info settings`, error.message);
    next(error);
  }
};

//Edit Service
exports.settingsEdit = async (req, res, next) => {
  const id = 1;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_setting set title="${data.title}", estimasi="${data.estimasi}", queuePrefix = "${data.queuePrefix}", description = "${data.description}"
      WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "settings updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "setting not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update settings`, error.message);
    next(error);
  }
};
