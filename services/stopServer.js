// stopServer.js
module.exports = (app) => {
  app.post('/stop-server', (req, res) => {
    res.json({ success: true });
    console.log('Servidor sendo parado pelo usuário...');
    process.exit(0); // encerra o Node.js
  });
};
