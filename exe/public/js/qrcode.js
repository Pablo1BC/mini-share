function generateQRCode() {
  const ip = location.hostname;
  const port = location.port || 3000;
  const url = `http://${ip}:${port}`;

  document.getElementById('qrText').textContent = url;
  new QRCode(document.getElementById("qrcodeCanvas"), {
    text: url,
    width: 180,
    height: 180,
    colorDark : "#0078ff",
    colorLight : "#fff",
    correctLevel : QRCode.CorrectLevel.H
  });
}

generateQRCode();
