const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const { version: localVersion } = require("../package.json");

const REMOTE_UPDATE_URL = "https://raw.githubusercontent.com/Pablo1BC/mini-share/main/update.json";

// Função simples para comparar versões
function compareVersions(v1, v2) {
  const a = v1.split(".").map(Number);
  const b = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

router.get("/", async (req, res) => {
  try {
    const response = await fetch(REMOTE_UPDATE_URL);
    if (!response.ok) throw new Error("Falha ao buscar update.json");
    const remoteData = await response.json();
    const remoteVersion = remoteData.version;

    const cmp = compareVersions(localVersion, remoteVersion);

    if (cmp < 0) {
      console.log("Atualização disponível! Executando update.bat...");
      exec("update.bat"); // chama o bat para atualizar
    }

    res.json({
      localVersion,
      remoteVersion,
      updateAvailable: cmp < 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
