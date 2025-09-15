async function stopServer() {
  try {
    const res = await fetch('/stop-server', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert('Servidor será parado.');
    } else {
      alert('Falha ao parar o servidor.');
    }
  } catch (err) {
    console.error(err);
    alert('Erro na requisição.');
  }
}