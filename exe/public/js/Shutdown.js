let intervalId = null;

async function schedule() {
  const minutes = parseInt(document.getElementById('minutes').value);
  if (isNaN(minutes) || minutes <= 0) return alert("Digite um número válido!");

  // Chama o servidor apenas para agendar (opcional)
  await fetch('/shutdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes })
  });

  // Limpa contagem anterior
  if (intervalId) clearInterval(intervalId);

  let remaining = minutes * 60; // tempo em segundos

  // Atualiza a mensagem a cada segundo
  intervalId = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(intervalId);
      document.getElementById('msg').innerText = "Desligando agora!";
      return;
    }
    remaining--;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    document.getElementById('msg').innerText = `Desligamento em ${mins}m ${secs}s`;
  }, 1000);
}

async function cancel() {
  // Cancela no servidor
  await fetch('/shutdown/cancel', { method: 'POST' });

  // Cancela a contagem local
  if (intervalId) clearInterval(intervalId);
  document.getElementById('msg').innerText = "Contagem cancelada";
}
