const db = require("./db");
const helper = require("../../helper");

//List services
exports.services = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, isActive FROM tbl_service"
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
        message: "all services",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list services`, error.message);
    next(error);
  }
};

//Add Service
exports.servicesAdd = async (req, res, next) => {
  var data = req.body;
  try {
    const result = await db.query(
      `INSERT INTO tbl_service (name, description, isActive) VALUES ("${data.name}", "${data.description}", ${data.isActive})`
    );
    if (result.affectedRows) {
      res.status(200).json({
        status: 200,
        message: "Service created",
        data: {},
      });
    } else {
      res
        .status(404)
        .json({ status: false, message: "add service failed", data: {} });
    }
  } catch (error) {
    console.error(`Error while add service`, error.message);
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
exports.servicesEdit = async (req, res, next) => {
  const id = req.params.serviceId;
  const data = req.body;
  try {
    const rows = await db.query(
      `update tbl_service set name = "${data.name}", description = "${data.description}", isActive= ${data.isActive}
      WHERE id = ${id}`
    );
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "Service updated",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "service not updated",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while update service`, error.message);
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
