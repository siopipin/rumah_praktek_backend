const db = require("./db");
const helper = require("../../helper");

//List post for users
exports.posts = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT * FROM tbl_post WHERE isActive = 1 ORDER BY createdAt DESC"
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "post not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "all post",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list posts`, error.message);
    next(error);
  }
};

//All post for admin
exports.postsAll = async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT * FROM tbl_post ORDER BY createdAt DESC"
    );
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "post not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "all post",
        data: rows,
      });
    }
  } catch (error) {
    console.error(`Error while get list posts`, error.message);
    next(error);
  }
};

//post Detail
exports.postDetail = async (req, res, next) => {
  const id = req.params.postId;
  try {
    const result = await db.query(`SELECT * FROM tbl_post WHERE id = ${id}`);
    const rows = helper.emptyOrRows(result);
    if (rows.length < 1) {
      return res.status(404).json({
        status: 404,
        message: "post not found",
        data: {},
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "post detail",
        data: rows[0],
      });
    }
  } catch (error) {
    console.error(`Error while get post detail`, error.message);
    next(error);
  }
};

//Add Service
exports.postAdd = async (req, res, next) => {
  var data = req.body;
  try {
    //Cek jika tidak ada file foto

    if (!req.file) {
      const result = await db.query(
        `INSERT INTO tbl_post (title, description) VALUES ("${data.title}", "${data.description}"`
      );
      if (result.affectedRows) {
        res.status(200).json({
          status: 200,
          message: "post created",
          data: {},
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "add post failed", data: {} });
      }
    } else {
      const result = await db.query(
        `INSERT INTO tbl_post (title, description, img) 
        VALUES ("${data.title}", "${data.description}", "${req.file.filename}")`
      );

      if (result.affectedRows) {
        res.status(200).json({
          status: 200,
          message: "post created",
          data: {},
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "add post failed", data: {} });
      }
    }
  } catch (error) {
    console.error(`Error while add post`, error.message);
    next(error);
  }
};

//Add Service
exports.postEdit = async (req, res, next) => {
  const id = req.params.postId;
  const data = req.body;
  try {
    //Cek jika tidak ada file foto
    if (!req.file) {
      const result = await db.query(
        `update tbl_post set title = "${data.title}", description = "${data.description}" WHERE id = ${id}`
      );
      if (result.affectedRows) {
        res.status(200).json({
          status: 200,
          message: "post updated",
          data: {},
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "update post failed", data: {} });
      }
    } else {
      const result = await db.query(
        `update tbl_post set title = "${data.title}", description = "${data.description}", img = "${req.file.filename}" WHERE id = ${id}`
      );
      if (result.affectedRows) {
        res.status(200).json({
          status: 200,
          message: "post updated",
          data: {},
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "updated post failed", data: {} });
      }
    }
  } catch (error) {
    console.error(`Error while update post`, error.message);
    next(error);
  }
};

//delete Service
exports.postDelete = async (req, res, next) => {
  const id = req.params.postId;
  try {
    const rows = await db.query(`delete from tbl_post where id = ${id}`);
    if (rows.affectedRows) {
      return res.status(200).json({
        status: 200,
        message: "Post deleted",
        data: {},
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "post not deleted",
        data: {},
      });
    }
  } catch (error) {
    console.error(`Error while delete post`, error.message);
    next(error);
  }
};
