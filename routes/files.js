const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const serveIndex = require("serve-index");

const router = express.Router();

const FOLDER = "arquivos";

// garante que a pasta exista
if (!fs.existsSync(FOLDER)) fs.mkdirSync(FOLDER);

// configuração do multer (upload para a pasta)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FOLDER),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// rota de upload
router.post("/upload", upload.single("file"), (req, res) => {
  res.send("Arquivo enviado com sucesso!");
});

// rota de exclusão
router.delete("/delete", (req, res) => {
  const filename = req.query.file;
  if (!filename) return res.status(400).send("Arquivo não especificado");

  const filepath = path.join(FOLDER, filename);
  if (!fs.existsSync(filepath)) return res.status(404).send("Arquivo não encontrado");

  fs.unlinkSync(filepath);
  res.send("Arquivo deletado com sucesso!");
});

// rota para listar e servir arquivos
router.use("/", express.static(FOLDER));
router.use("/", serveIndex(FOLDER, { icons: true }));

module.exports = router;
