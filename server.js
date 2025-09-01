const app = require('./app');


const { exec } = require('child_process');


// Porta
const PORT = process.env.PORT || 3000;

const getLocalIP = require('./services/getLocalIP');
const ip = getLocalIP();

// Iniciar servidor
const server = app.listen(PORT, () => {
  const url = `http://${ip}:${PORT}`;
  console.log(`Servidor rodando em ${url}`);

  // Abre navegador automaticamente
  if (process.platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (process.platform === 'linux') {
    exec(`xdg-open "${url}"`);
  } else if (process.platform === 'darwin') {
    exec(`open "${url}"`);
  }
});

module.exports = server;
