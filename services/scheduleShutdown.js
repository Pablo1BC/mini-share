const { exec } = require('child_process');

module.exports = (app) => {
  // Exemplo: POST /shutdown com { minutes: 1 }
  app.post('/shutdown', (req, res) => {
    const { minutes } = req.body;

    if (!minutes || isNaN(minutes)) {
      return res.status(400).send('Informe o tempo em minutos');
    }

    const seconds = minutes * 60;

    let command;
    if (process.platform === 'win32') {
      // Windows
      command = `shutdown -s -t ${seconds}`;
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
      // Linux ou macOS
      command = `shutdown -h +${minutes}`;
    } else {
      return res.status(500).send('Sistema operacional não suportado');
    }

    exec(command, (err) => {
      if (err) {
        console.error('Erro ao agendar desligamento:', err);
        return res.status(500).send('Erro ao agendar desligamento');
      }
      console.log(`PC será desligado em ${minutes} minuto(s).`);
      res.send(`PC será desligado em ${minutes} minuto(s).`);
    });
  });

  // Rota para cancelar desligamento
  app.post('/shutdown/cancel', (req, res) => {
    let command;
    if (process.platform === 'win32') {
      command = 'shutdown -a';
    } else if (process.platform === 'linux' || process.platform === 'darwin') {
      command = 'shutdown -c';
    }

    exec(command, (err) => {
      if (err) {
        console.error('Erro ao cancelar desligamento:', err);
        return res.status(500).send('Erro ao cancelar desligamento');
      }
      console.log('Desligamento cancelado.');
      res.send('Desligamento cancelado.');
    });
  });
};
