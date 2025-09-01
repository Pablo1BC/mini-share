const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const serveIndex = require("serve-index");

// Pastas
const FOLDER = "arquivos";
const PUBLIC = "public";
if (!fs.existsSync(FOLDER)) fs.mkdirSync(FOLDER);
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC);

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FOLDER),
  filename: (req, file, cb) => cb(null, path.basename(file.originalname))
});
const upload = multer({ storage });

// Upload
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ success: true, message: "Arquivo enviado com sucesso!" });
});

// Delete
router.delete("/delete", (req, res) => {
  const filename = req.query.file;
  if (!filename) return res.status(400).json({ error: "Arquivo não especificado" });
  const filepath = path.join(FOLDER, filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: "Arquivo não encontrado" });
  fs.unlinkSync(filepath);
  res.json({ success: true, message: "Arquivo deletado com sucesso!" });
});

// Arquivos estáticos e listagem
router.use("/files", express.static(FOLDER));
router.use("/files", serveIndex(FOLDER, { icons: true }));

// Página inicial
router.use(express.static(PUBLIC));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", PUBLIC, "index.html"));
});

module.exports = router;
