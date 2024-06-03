require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cors = require("cors");

const app = express();
app.use(cors());

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No se han enviado archivos");
  }

  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }

    // Puedo hacer la inserción de toda la info del usuario incluyendo la URL de su imagen de perfil

    // Mostramos la info de Cloudinary
    console.log("El contenido de result es", result);
    console.log("La URL donde se ha guardado la imagen es:", result.url);

    res.send(result.url);
  });
});

app.post("/upload-multiple", upload.array("files", 10), async (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files");
  }

  const url = [];
  for (const file of req.files) {
    try {
      const result = await cloudinary.uploader.upload(file.path);
      url.push(result.url);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  console.log("Las URLs son:", url);

  // Almaceno el listado de URLs de las imágenes de la ficha producto

  res.send(url);
});

app.listen(3000, () => {
  console.log("Servidor rulando");
});
