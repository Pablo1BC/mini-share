const express = require("express");
const serveIndex = require("serve-index");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FOLDER = "arquivos";
const PUBLIC = "public";

// garante que as pastas existam
if (!fs.existsSync(FOLDER)) fs.mkdirSync(FOLDER);
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC);

// configuração do multer (upload para a pasta)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FOLDER),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// rota de upload (POST /upload)
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("Arquivo enviado com sucesso!");
});

// rota de exclusão (DELETE /delete?file=nome.txt)
app.delete("/delete", (req, res) => {
  const filename = req.query.file;
  if (!filename) return res.status(400).send("Arquivo não especificado");
  const filepath = path.join(FOLDER, filename);
  if (!fs.existsSync(filepath)) return res.status(404).send("Arquivo não encontrado");
  fs.unlinkSync(filepath);
  res.send("Arquivo deletado com sucesso!");
});











// Serve arquivos estáticos da pasta public (index, css, js)
app.use(express.static(PUBLIC));

// Serve o index.html como página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, PUBLIC, "index.html"));
});

// Lista os arquivos da pasta
app.use("/files", express.static(FOLDER));
app.use("/files", serveIndex(FOLDER, { icons: true }));








// pega ip local
const getLocalIP = require('./services/getLocalIP');
const ip = getLocalIP();
console.log('IP local:', ip);



// importa a rota de parar servidor
require('./services/stopServer')(app);



// iniciar servidor
const { exec } = require('child_process'); // abrir navegador

app.listen(PORT, () => {
  const url = `http://${ip}:${PORT}`;
  console.log(`Servidor rodando em ${url}`);

  // Abre navegador no Windows
  if (process.platform === 'win32') {
    exec(`start "${url}"`);
  }
  // Para Linux (gnome, kde etc)
  else if (process.platform === 'linux') {
    exec(`xdg-open "${url}"`);
  }
  // Para macOS
  else if (process.platform === 'darwin') {
    exec(`open "${url}"`);
  }
});