const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Configurar Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", async (req, res) => {
  try {
    upload.any()(req, res, function (err) {
      if (!req.files) {
        res.status(400).send({
          success: false,
          message: "No files",
        });
      } else {
        let data = [];

        req.files.map((file) => {
          data.push(file.filename);
        });

        res.send({
          success: true,
          message: "Files uploaded",
          data: data,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Servidor rulando");
});
