    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("fileInput");
    const fileListEl = document.getElementById("fileList");

    // Upload de arquivo
    async function uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/upload", { method: "POST", body: formData });
      loadFiles();
    }

    // Drag & drop
    dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.classList.add("hover"); });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("hover"));
    dropzone.addEventListener("drop", e => {
      e.preventDefault();
      dropzone.classList.remove("hover");
      const files = Array.from(e.dataTransfer.files);
      files.forEach(uploadFile);
    });

    // Clique abre seletor de arquivo
    dropzone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const files = Array.from(fileInput.files);
      files.forEach(uploadFile);
    });

    // Função para carregar a lista de arquivos
   async function loadFiles() {
  const res = await fetch("/files"); // pega a listagem da pasta
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // pega apenas arquivos (ignora diretórios, ".." e "files")
  const links = Array.from(doc.querySelectorAll("a")).filter(a => {
    const filename = decodeURIComponent(a.getAttribute("href").split("/").pop());
    return filename && filename !== ".." && filename !== "files" && !filename.endsWith("/");
  });

  fileListEl.innerHTML = "";
  links.forEach(link => {
    const li = document.createElement("li");

    const icon = document.createElement("i");
    icon.textContent = "📄";
    li.appendChild(icon);

    const filename = decodeURIComponent(link.getAttribute("href").split("/").pop());

    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = filename;
    a.target = "_blank";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Deletar";
    delBtn.onclick = async () => {
      if (confirm(`Deletar ${filename}?`)) {
        await fetch(`/delete?file=${encodeURIComponent(filename)}`, { method: "DELETE" });
        loadFiles();
      }
    };

    li.appendChild(a);
    li.appendChild(delBtn);
    fileListEl.appendChild(li);
  });
}


    // Carrega a lista ao abrir a página
    loadFiles();